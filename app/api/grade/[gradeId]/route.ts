import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { gradeId: string } }
) {
	try {
		const { userId } = auth();
		const { gradeId } = params;
		const values = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const grade = await db.grade.update({
			where: {
				id: parseInt(gradeId, 10),
			},
			data: {
				...values,
			},
		});

		return NextResponse.json(grade);
	} catch (error) {
		console.log('[gradeId ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { gradeId: string } }
) {
	try {
		const { userId } = auth();
		const { gradeId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const deletedGrade = await db.grade.delete({
			where: {
				id: parseInt(gradeId, 10),
			},
		});

		return NextResponse.json(deletedGrade);
	} catch (error) {
		console.log('[DELETE grade ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
