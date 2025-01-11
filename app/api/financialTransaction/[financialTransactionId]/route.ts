import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { financialTransactionId: string } }
) {
	try {
		const { userId } = auth();
		const { financialTransactionId } = params;
		const values = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const financialTransaction = await db.financialTransaction.update({
			where: {
				id: parseInt(financialTransactionId, 10),
			},
			data: {
				...values,
			},
		});

		return NextResponse.json(financialTransaction);
	} catch (error) {
		console.log('[COMPANY ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { financialTransactionId: string } }
) {
	try {
		const { userId } = auth();
		const { financialTransactionId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const deletedfinancialTransaction = await db.financialTransaction.delete({
			where: {
				id: parseInt(financialTransactionId, 10),
			},
		});

		return NextResponse.json(deletedfinancialTransaction);
	} catch (error) {
		console.log('[DELETE financialTransaction ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
