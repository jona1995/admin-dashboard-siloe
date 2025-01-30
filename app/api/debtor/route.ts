import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
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
						fechaInscripcionDesde: {
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
			message: 'OK.',
		});
	} catch (error) {
		console.log('[DEUDORES]', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
