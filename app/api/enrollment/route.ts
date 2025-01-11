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

		const enrollment = await db.enrollment.create({
			data: {
				...data,
				courses: {
					connect: data.courses.map((id: number) => ({ id })), // Conecta las materias por ID
				},
			},
		});

		return NextResponse.json(enrollment);
	} catch (error) {
		console.log('[ENROLLMENT]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
