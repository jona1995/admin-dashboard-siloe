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

		const student = await db.payment.create({
			data: {
				...data,
				beneficiarios: {
					connect: data.beneficiarios.map((id: number) => ({ id })), // Conecta las materias por ID
				},
			},
		});

		return NextResponse.json(student);
	} catch (error) {
		console.log('[PAYMENT]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
