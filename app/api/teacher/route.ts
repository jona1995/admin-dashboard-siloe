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

		const teacher = await db.teacher.create({
			data: {
				...data,
			},
		});

		return NextResponse.json(teacher);
	} catch (error) {
		console.log('[TEACHER]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
