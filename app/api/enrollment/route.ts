import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';
// Función para calcular el saldo pendiente basado en los cursos inscritos
async function calcularSaldoPendientePorInscripcion(
	enrollmentId: number
): Promise<number> {
	const enrollment = await db.enrollment.findUnique({
		where: { id: enrollmentId },
		include: {
			plan: {
				include: {
					items: {
						include: {
							curso: true, // Trae los cursos del plan
						},
					},
				},
			},
			courses: true, // Cursos inscritos
		},
	});

	if (!enrollment) throw new Error('Inscripción no encontrada');

	let saldo = 0;

	// Si tiene un plan, calcular solo los cursos inscritos dentro del plan
	if (enrollment.plan) {
		for (const cursoInscrito of enrollment.courses) {
			const planItem = enrollment.plan.items.find(
				(item: any) => item.curso.id === cursoInscrito.id
			);

			if (planItem) {
				const cursoPrecio = planItem.curso.precio;
				const descuento = planItem.descuento || 0;
				const precioConDescuento =
					cursoPrecio - cursoPrecio * (descuento / 100);
				saldo += precioConDescuento * planItem.cantidad;
			}
		}
	} else {
		// Si no tiene plan, el saldo es la suma de los precios de los cursos inscritos
		saldo = enrollment.courses.reduce(
			(acc: number, curso: { precio: number }) => acc + curso.precio,
			0
		);
	}

	return saldo;
}

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		const data = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		const userName = req.headers.get('x-user-name');
		const userEmail = req.headers.get('x-user-email');
		const {
			fechaInscripcion,
			fechaInscripcionCursoDesde,
			fechaInscripcionCursoHasta,
			courses,
			estudianteId,
			estado,
			modalidad,
			planId,
			estudiantesAsociados,
		} = data;
		console.log(data);
		// Crear inscripción sin saldo pendiente aún
		const enrollment = await db.enrollment.create({
			data: {
				fechaInscripcion: new Date(fechaInscripcion),
				fechaInscripcionCursoDesde: new Date(fechaInscripcionCursoDesde),
				fechaInscripcionCursoHasta: fechaInscripcionCursoHasta
					? new Date(fechaInscripcionCursoHasta)
					: null,
				courses: { connect: courses.map((id: number) => ({ id })) },
				createdBy: userId,
				createdByName: userName ? userName : '',
				estado,
				modalidad,
				student: { connect: { id: estudianteId } },
				plan: planId ? { connect: { id: parseInt(planId, 10) } } : undefined,
				estudiantesAsociados: estudiantesAsociados?.length
					? { connect: estudiantesAsociados.map((id: number) => ({ id })) }
					: undefined,
			},
		});

		// Calcular el saldo pendiente basado en los cursos inscritos
		// const saldoPendiente = 0;
		//  await calcularSaldoPendientePorInscripcion(
		// 	enrollment.id
		// );

		// Actualizar la inscripción con el saldo pendiente
		// await db.enrollment.update({
		// 	where: { id: enrollment.id },
		// 	data: { saldoPendiente },
		// });

		// Si todo va bien, devolver una respuesta exitosa
		return NextResponse.json({
			success: true,
			message: 'Inscripcion procesado exitosamente',
			data: enrollment,
			status: 200,
		});
	} catch (error) {
		// Manejo de excepciones
		if (error instanceof AxiosError) {
			// Si es un error de Axios, obtenemos el mensaje desde la respuesta
			const errorMessage = error.response?.data?.message || 'Error desconocido';

			return NextResponse.json(
				{
					success: false,
					message: errorMessage,
				},
				{ status: error.response?.status || 500 }
			);
		} else if (error instanceof Error) {
			// Si es un error genérico de JavaScript, lo manejamos aquí
			return NextResponse.json(
				{
					success: false,
					message: error.message || 'Error desconocido',
				},
				{ status: 500 }
			);
		}

		// En caso de que no sepamos qué tipo de error es
		return NextResponse.json(
			{
				success: false,
				message: 'Error desconocido',
			},
			{ status: 500 }
		);
	}
}

//GET /api/enrollments?estudianteId=123
export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const estudianteId = searchParams.get('studentId');

		if (!estudianteId) {
			return new NextResponse('Bad Request: Missing estudianteId', {
				status: 400,
			});
		}

		// Obtenemos las inscripciones activas del estudiante
		const activeEnrollments = await db.enrollment.findMany({
			where: {
				estudianteId: Number(estudianteId), // Aseguramos que el ID sea un número
				estado: 'ACTIVO', // Filtramos solo las inscripciones activas
			},
			include: {
				courses: true, // Incluimos los cursos asociados
				plan: true, // Incluimos el plan si está relacionado
			},
		});
		console.log(activeEnrollments);

		// Si todo va bien, devolver una respuesta exitosa
		return NextResponse.json({
			success: true,
			message: 'Inscripcion procesado exitosamente',
			data: activeEnrollments,
			status: 200,
		});
	} catch (error) {
		// Manejo de excepciones
		if (error instanceof AxiosError) {
			// Si es un error de Axios, obtenemos el mensaje desde la respuesta
			const errorMessage = error.response?.data?.message || 'Error desconocido';

			return NextResponse.json(
				{
					success: false,
					message: errorMessage,
				},
				{ status: error.response?.status || 500 }
			);
		} else if (error instanceof Error) {
			// Si es un error genérico de JavaScript, lo manejamos aquí
			return NextResponse.json(
				{
					success: false,
					message: error.message || 'Error desconocido',
				},
				{ status: 500 }
			);
		}

		// En caso de que no sepamos qué tipo de error es
		return NextResponse.json(
			{
				success: false,
				message: 'Error desconocido',
			},
			{ status: 500 }
		);
	}
}
