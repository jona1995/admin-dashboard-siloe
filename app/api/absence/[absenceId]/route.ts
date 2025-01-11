import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { absenceId: string } }
) {
	try {
		const { userId } = auth();
		const { absenceId } = params;
		const values = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const absence = await db.absence.update({
			where: {
				id: parseInt(absenceId, 10),
			},
			data: {
				...values,
			},
		});

		return NextResponse.json(absence);
	} catch (error) {
		console.log('[absence ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { absenceId: string } }
) {
	try {
		const { userId } = auth();
		const { absenceId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const deletedAbsence = await db.absence.delete({
			where: {
				id: parseInt(absenceId, 10),
			},
		});

		return NextResponse.json(deletedAbsence);
	} catch (error) {
		console.log('[DELETE absence ID]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
