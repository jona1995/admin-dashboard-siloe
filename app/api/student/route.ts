import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		const data = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const student = await db.student.create({
			data: {
				...data,
			},
		});

		return NextResponse.json(student);
	} catch (error) {
		console.log('[STUDENT]', error);
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

		const students = await db.student.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json(students);
	} catch (error) {
		console.log('[students]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
