import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { teacherId: string } }
) {
	try {
		const { userId, user } = auth();
		const { teacherId } = params;
		const values = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		console.log(values);
		const teacher = await db.teacher.update({
			where: {
				id: parseInt(teacherId, 10),
			},
			data: {
				...values,
				updatedByName: user?.firstName
					? user?.firstName + ' ' + user.lastName
					: '',
				subjects: {
					set: values.subjects.map((id: number) => ({ id })), // Conecta las materias por ID
				},
			},
		});

		return NextResponse.json(teacher);
	} catch (error) {
		console.log('[TEACHER ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { teacherId: string } }
) {
	try {
		const { userId } = auth();
		const { teacherId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const deletedTeacher = await db.teacher.delete({
			where: {
				id: parseInt(teacherId, 10),
			},
		});

		return NextResponse.json(deletedTeacher);
	} catch (error) {
		console.log('[DELETE TEACHER ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
