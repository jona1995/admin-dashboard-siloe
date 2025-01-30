import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

import { DataTable } from './data-table';
import { columns } from './columns';

export async function Debtors() {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}

	const students = await db.student.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			enrollments: {
				where: {
					estado: 'ACTIVO', // Solo inscripciones activas
				},
				include: {
					courses: true, // Incluir detalles del curso
				},
			},
			paymentsMade: {
				where: {
					fechaPagoMes: {
						lte: new Date(), // Solo pagos recibidos hasta la fecha actual
					},
				},
			},
			paymentsReceived: {
				where: {
					fechaPagoMes: {
						lte: new Date(), // Solo pagos recibidos hasta la fecha actual
					},
				},
			},
			Plan: true,
		},
	});
	const deudores = students.filter(student => {
		// Verificar si alguna inscripción tiene pagos atrasados
		return student.enrollments.some(enrollment => {
			let totalPaid = 0;
			let missingPayments = [];

			// Iterar sobre todos los cursos asociados a la inscripción
			enrollment.courses.forEach(course => {
				// Calcular el monto mensual de la cuota
				const montoMensual = course.precio / course.duracion;

				// Filtrar los pagos realizados para esta inscripción
				const pagosRealizados = student.paymentsMade.filter(payment =>
					payment.Enrollment.some(enr => enr.id === enrollment.id)
				);

				// Generar las cuotas mensuales esperadas para este curso
				const cuotasEsperadas = Array.from(
					{ length: course.duracion },
					(_, index) => {
						const fechaEsperada = new Date(enrollment.createdAt);
						fechaEsperada.setMonth(fechaEsperada.getMonth() + index); // Calcular la fecha de cuota mensual

						return {
							mes: index + 1,
							fechaEsperada: fechaEsperada,
							monto: montoMensual,
						};
					}
				);

				// Verificar las cuotas faltantes y los pagos realizados
				cuotasEsperadas.forEach(cuota => {
					const pagoParaMes = pagosRealizados.find(
						payment =>
							new Date(payment.fechaPagoMes).getMonth() ===
							cuota.fechaEsperada.getMonth()
					);

					if (!pagoParaMes) {
						missingPayments.push(cuota); // Si no se pagó la cuota, la marcamos como faltante
					} else {
						totalPaid += pagoParaMes.monto; // Si se pagó, sumamos el monto
					}
				});
			});

			// Si faltan pagos o el total pagado es menor al total del curso, se considera deudor
			return (
				missingPayments.length > 0 ||
				totalPaid <
					enrollment.courses.reduce((sum, course) => sum + course.precio, 0)
			);
		});
	});

	return <DataTable columns={columns} data={dataWithSubjects} />;
}
