import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { EstadoIncripcion } from '@prisma/client';
import { NextResponse } from 'next/server';

// Función para calcular saldo pendiente basado en cursos inscritos en un plan
async function calcularSaldoPendientePorInscripcion(
	enrollment: any
): Promise<number> {
	const { fechaInscripcionCursoDesde, planId, courses } = enrollment;

	const now = new Date();
	const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

	// Calcular meses desde la inscripción hasta el mes actual
	const monthsSinceEnrollment = Math.ceil(
		(startOfCurrentMonth.getTime() -
			new Date(fechaInscripcionCursoDesde).getTime()) /
			(1000 * 60 * 60 * 24 * 30)
	);

	// Obtener pagos realizados para esta inscripción
	const payments = await db.payment.findMany({
		where: { enrollmentId: enrollment.id },
	});

	// Crear un Set de meses pagos en formato "YYYY-MM"
	const paidMonths = new Set(
		payments.map(payment => {
			const fechaPago = new Date(payment.fechaPagoMes);
			return `${fechaPago.getFullYear()}-${fechaPago.getMonth() + 1}`;
		})
	);

	let totalSaldoPendiente = 0;

	if (planId) {
		// Obtener solo los cursos del plan que están en la inscripción
		const plan = await db.plan.findUnique({
			where: { id: planId },
			include: {
				items: { include: { curso: true } },
			},
		});

		if (!plan) throw new Error(`Plan no encontrado para el ID ${planId}`);

		// Filtrar los cursos del plan que están en la inscripción
		const cursosInscritosEnPlan = plan.items.filter(item =>
			courses.some((curso: any) => curso.id === item.curso.id)
		);

		// Calcular el costo mensual de los cursos inscritos en el plan
		const costoMensualPlan = cursosInscritosEnPlan.reduce((total, item) => {
			const cursoPrecio = item.curso.precio;
			const descuento = item.descuento || 0;
			const precioConDescuento = cursoPrecio - cursoPrecio * (descuento / 100);
			return total + precioConDescuento;
		}, 0);

		// Calcular saldo pendiente mes a mes
		for (let i = 0; i < monthsSinceEnrollment; i++) {
			const targetMonth = new Date(fechaInscripcionCursoDesde);
			targetMonth.setMonth(targetMonth.getMonth() + i);

			const monthKey = `${targetMonth.getFullYear()}-${
				targetMonth.getMonth() + 1
			}`;

			if (!paidMonths.has(monthKey)) {
				totalSaldoPendiente += costoMensualPlan;
			}
		}
	} else {
		// Obtener los cursos en la inscripción
		const cursos = await db.course.findMany({
			where: { id: { in: courses.map((curso: any) => curso.id) } },
		});

		const costoMensualCursos = cursos.reduce(
			(total, curso) => total + curso.precio,
			0
		);

		// Calcular saldo pendiente mes a mes
		for (let i = 0; i < monthsSinceEnrollment; i++) {
			const targetMonth = new Date(fechaInscripcionCursoDesde);
			targetMonth.setMonth(targetMonth.getMonth() + i);

			const monthKey = `${targetMonth.getFullYear()}-${
				targetMonth.getMonth() + 1
			}`;

			if (!paidMonths.has(monthKey)) {
				totalSaldoPendiente += costoMensualCursos;
			}
		}
	}

	return totalSaldoPendiente;
}

// ✅ Endpoint POST para actualizar saldos pendientes
export async function POST(req: Request) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse('Unauthorized', { status: 401 });

		// Obtener todas las inscripciones activas
		// const enrollments = await db.enrollment.findMany({
		// 	where: { estado: EstadoIncripcion.ACTIVO },
		// 	include: { plan: true, courses: true },
		// });

		// // Actualizar saldo pendiente de cada inscripción
		// for (const enrollment of enrollments) {
		// 	const saldoPendiente = await calcularSaldoPendientePorInscripcion(
		// 		enrollment
		// 	);
		// 	await db.enrollment.update({
		// 		where: { id: enrollment.id },
		// 		data: { saldoPendiente },
		// 	});
		// }
		console.log('aca');
		const today = new Date(); // Fecha actual
		const estudiantesSinPago = await db.student.findMany({
			where: {
				// Buscar estudiantes con inscripción activa
				enrollments: {
					some: {
						estado: 'ACTIVO', // Inscripción activa
						fechaInscripcionCursoDesde: {
							lte: today, // Inscripción antes o en la fecha actual
						},
						payments: {
							some: {
								fechaPagoMes: {
									lte: today, // Fecha de pago debe ser hasta la fecha actual
								},
								saldoPosterior: {
									lt: 0, // El saldo posterior debe ser negativo (quedó deuda)
								},
								estadoPago: 'INCOMPLETO', // Estado de pago incompleto
							},
						},
					},
				},
			},
		});

		console.log(estudiantesSinPago);
		console.log('termina');
		return NextResponse.json({
			message: 'Saldos pendientes actualizados correctamente.',
		});
	} catch (error) {
		console.log('[UPDATE_SALDOS]', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

// ✅ Endpoint GET para obtener las inscripciones activas de un estudiante
export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const estudianteId = searchParams.get('studentId');

		if (!estudianteId) {
			return new NextResponse('Bad Request: Missing estudianteId', {
				status: 400,
			});
		}

		const activeEnrollments = await db.enrollment.findMany({
			where: { estudianteId: Number(estudianteId), estado: 'ACTIVO' },
			include: { courses: true, plan: true },
		});

		return NextResponse.json(activeEnrollments);
	} catch (error) {
		console.log('[GET_ACTIVE_ENROLLMENTS]', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
