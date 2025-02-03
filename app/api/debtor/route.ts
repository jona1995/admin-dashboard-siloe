import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		if (!userId) return new NextResponse('Unauthorized', { status: 401 });

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

		// Si todo va bien, devolver una respuesta exitosa
		return NextResponse.json({
			success: true,
			message: 'Estudiante procesado exitosamente',
			data: estudiantesSinPago,
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
