import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { Corben } from 'next/font/google';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { userId } = auth();
		const { courseId } = params;
		const values = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const course = await db.course.update({
			where: {
				id: parseInt(courseId, 10),
			},
			data: {
				...values,
				subjects: {
					connect: values.subjects.map((id: number) => ({ id })), // Conecta las materias por ID
				},
			},
		});
		console.log(course);
		return NextResponse.json(course);
	} catch (error) {
		console.log('[COURSES ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { userId } = auth();
		const { courseId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const deletedCourse = await db.course.delete({
			where: {
				id: parseInt(courseId, 10),
			},
		});

		return NextResponse.json(deletedCourse);
	} catch (error) {
		console.log('[DELETE COURSE ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
