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

		const evaluation = await db.evaluation.create({
			data: {
				...data,
				createdBy: userId,
			},
		});

		return NextResponse.json(evaluation);
	} catch (error) {
		console.log('[EVALUATION]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
