import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { paymentId: string } }
) {
	try {
		const { userId } = auth();
		const { paymentId } = params;
		const values = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const payment = await db.payment.update({
			where: {
				id: parseInt(paymentId, 10),
			},
			data: {
				...values,
				beneficiarios: {
					connect: values.beneficiarios.map((id: number) => ({ id })), // Conecta las materias por ID
				},
			},
		});

		return NextResponse.json(payment);
	} catch (error) {
		console.log('[PAYMENT ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { paymentId: string } }
) {
	try {
		const { userId } = auth();
		const { paymentId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const deletedPayment = await db.payment.delete({
			where: {
				id: parseInt(paymentId, 10),
			},
		});

		return NextResponse.json(deletedPayment);
	} catch (error) {
		console.log('[DELETE PAYMENT ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
