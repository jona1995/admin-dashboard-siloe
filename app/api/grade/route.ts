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

		const grades = await db.grade.create({
			data: {
				...data,
			},
		});

		return NextResponse.json(grades);
	} catch (error) {
		console.log('[grades]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
