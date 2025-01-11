import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { enrollmentId: string } }
) {
	try {
		const { userId } = auth();
		const { enrollmentId } = params;
		const values = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		console.log(enrollmentId);
		const enrollment = await db.enrollment.update({
			where: {
				id: parseInt(enrollmentId, 10),
			},
			data: {
				...values,
				courses: {
					connect: values.courses.map((id: number) => ({ id })), // Conecta las materias por ID
				},
			},
		});

		return NextResponse.json(enrollment);
	} catch (error) {
		console.log('[ENROLLMENT ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { enrollmentId: string } }
) {
	try {
		const { userId } = auth();
		console.log(params);
		const { enrollmentId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		console.log('da');
		console.log(enrollmentId);
		const deletedEnrollment = await db.enrollment.delete({
			where: {
				id: parseInt(enrollmentId, 10),
			},
		});

		return NextResponse.json(deletedEnrollment);
	} catch (error) {
		console.log('[DELETE ENROLLMENT ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
