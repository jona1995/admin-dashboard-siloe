import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { studentId: string } }
) {
	try {
		const { userId } = auth();
		const { studentId } = params;
		const values = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const student = await db.student.update({
			where: {
				id: parseInt(studentId, 10),
			},
			data: {
				...values,
			},
		});

		return NextResponse.json(student);
	} catch (error) {
		console.log('[STUDENT ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { studentId: string } }
) {
	try {
		const { userId } = auth();
		const { studentId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const deletedStudent = await db.student.delete({
			where: {
				id: parseInt(studentId, 10),
			},
		});

		return NextResponse.json(deletedStudent);
	} catch (error) {
		console.log('[DELETE ESTUDIANTE ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
