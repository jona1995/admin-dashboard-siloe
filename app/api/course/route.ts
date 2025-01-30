import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { userId, user } = auth();
		const data = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		console.log(data);
		const course = await db.course.create({
			data: {
				...data,
				createdBy: userId,
				createdByName: user?.firstName
					? user?.firstName + ' ' + user.lastName
					: '',
				subjects: {
					connect: data.subjects.map((id: number) => ({ id })), // Conecta las materias por ID
				},
			},
		});

		return NextResponse.json(course);
	} catch (error) {
		console.log('[COURSES]', error);
		return new NextResponse('Internal Error' + error, { status: 500 });
	}
}

// Manejo de la solicitud GET para obtener todos los cursos
export async function GET(req: Request) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const courses = await db.course.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json(courses);
	} catch (error) {
		console.log('[courses]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
