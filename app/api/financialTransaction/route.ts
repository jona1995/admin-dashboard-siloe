import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		const data = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
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
			},
		});

		return NextResponse.json(financialTransactions);
	} catch (error) {
		console.log('[financialTransactions]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
