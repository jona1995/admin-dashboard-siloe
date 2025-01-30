import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { subjectId: string } }
) {
	try {
		const { userId, user } = auth();
		const { subjectId } = params;
		const values = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		console.log('user', userId);
		const subject = await db.subject.update({
			where: {
				id: parseInt(subjectId, 10),
			},
			data: {
				...values,
				updatedBy: userId,
				updatedByName: user?.firstName
					? user?.firstName + ' ' + user.lastName
					: '',
			},
		});

		return NextResponse.json(subject);
	} catch (error) {
		console.log('[SUBJECT ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { subjectId: string } }
) {
	try {
		const { userId } = auth();
		const { subjectId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const deletedSubject = await db.subject.delete({
			where: {
				id: parseInt(subjectId, 10),
			},
		});

		return NextResponse.json(deletedSubject);
	} catch (error) {
		console.log('[DELETE SUBJECT ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
