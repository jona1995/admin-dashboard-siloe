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

		const subject = await db.subject.create({
			data: {
				...data,
				createdBy: userId,
				createdByName: user?.firstName
					? user?.firstName + ' ' + user.lastName
					: '',
			},
		});

		return NextResponse.json(subject);
	} catch (error) {
		console.log('[SUBJECT]', error);
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

		const subjects = await db.subject.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json(subjects);
	} catch (error) {
		console.log('[subjects]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
