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

		const teacher = await db.teacher.create({
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

		return NextResponse.json(teacher);
	} catch (error) {
		console.log('[TEACHER]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

// Manejo de la solicitud GET para obtener todos los cursos
export async function GET(req: Request) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const teachers = await db.teacher.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json(teachers);
	} catch (error) {
		console.log('[teachers]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
