import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		const data = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const userName = req.headers.get('x-user-name');
		const userEmail = req.headers.get('x-user-email');
		// Asegúrate de que monto sea un número de tipo float
		if (data.monto) {
			data.monto = parseFloat(data.monto);
			// También podrías agregar una validación para verificar que el monto es un número válido
			if (isNaN(data.monto)) {
				return new NextResponse('Invalid amount', { status: 400 });
			}
		}
		const financialTransactions = await db.financialTransaction.create({
			data: {
				...data,
				createdBy: userId,
				createdByName: userName ? userName : '',
			},
		});

		// Si todo va bien, devolver una respuesta exitosa
		return NextResponse.json({
			success: true,
			message: 'Transaccion procesado exitosamente',
			data: financialTransactions,
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
