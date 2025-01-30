import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { planId: string } }
) {
	try {
		const { userId, user } = auth();
		const { planId } = params;
		const values = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const plan = await db.plan.update({
			where: {
				id: parseInt(planId, 10),
			},
			data: {
				...values,
				updatedBy: userId,
				updatedByName: user?.firstName
					? user?.firstName + ' ' + user.lastName
					: '',
			},
		});

		return NextResponse.json(plan);
	} catch (error) {
		console.log('[PLAN ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { planId: string } }
) {
	try {
		const { userId } = auth();
		const { planId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const deletedPlan = await db.plan.delete({
			where: {
				id: parseInt(planId, 10),
			},
		});

		return NextResponse.json(deletedPlan);
	} catch (error) {
		console.log('[DELETE PLAN ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
