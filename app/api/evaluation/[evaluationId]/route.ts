import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { evaluationId: string } }
) {
	try {
		const { userId, user } = auth();
		const { evaluationId } = params;
		const values = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const evaluation = await db.evaluation.update({
			where: {
				id: parseInt(evaluationId, 10),
			},
			data: {
				...values,
				updatedBy: userId,
				updatedByName: user?.firstName
					? user?.firstName + ' ' + user.lastName
					: '',
			},
		});

		return NextResponse.json(evaluation);
	} catch (error) {
		console.log('[EVALUATION ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { evaluationId: string } }
) {
	try {
		const { userId } = auth();
		const { evaluationId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const deletedEvaluation = await db.evaluation.delete({
			where: {
				id: parseInt(evaluationId, 10),
			},
		});

		return NextResponse.json(deletedEvaluation);
	} catch (error) {
		console.log('[DELETE EVALUATION ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
