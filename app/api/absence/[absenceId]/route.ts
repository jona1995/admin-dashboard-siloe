import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { AxiosError } from 'axios';
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
		const userName = req.headers.get('x-user-name');
		const userEmail = req.headers.get('x-user-email');
		const absence = await db.absence.update({
			where: {
				id: parseInt(absenceId, 10),
			},
			data: {
				...values,
				updatedBy: userId,
				updatedByName: userName ? userName : '',
			},
		});

		// Si todo va bien, devolver una respuesta exitosa
		return NextResponse.json({
			success: true,
			message: 'Inasistencia procesado exitosamente',
			data: absence,
			status: 200,
		});
	} catch (error) {
		// Manejo de excepciones
		if (error instanceof AxiosError) {
			// Si es un error de Axios, obtenemos el mensaje desde la respuesta
			const errorMessage = error.response?.data?.message || 'Error desconocido';

			return NextResponse.json(
				{
					success: false,
					message: errorMessage,
				},
				{ status: error.response?.status || 500 }
			);
		} else if (error instanceof Error) {
			// Si es un error genérico de JavaScript, lo manejamos aquí
			return NextResponse.json(
				{
					success: false,
					message: error.message || 'Error desconocido',
				},
				{ status: 500 }
			);
		}

		// En caso de que no sepamos qué tipo de error es
		return NextResponse.json(
			{
				success: false,
				message: 'Error desconocido',
			},
			{ status: 500 }
		);
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

		// Si todo va bien, devolver una respuesta exitosa
		return NextResponse.json({
			success: true,
			message: 'Inasistencia procesado exitosamente',
			data: deletedAbsence,
			status: 200,
		});
	} catch (error) {
		// Manejo de excepciones
		if (error instanceof AxiosError) {
			// Si es un error de Axios, obtenemos el mensaje desde la respuesta
			const errorMessage = error.response?.data?.message || 'Error desconocido';

			return NextResponse.json(
				{
					success: false,
					message: errorMessage,
				},
				{ status: error.response?.status || 500 }
			);
		} else if (error instanceof Error) {
			// Si es un error genérico de JavaScript, lo manejamos aquí
			return NextResponse.json(
				{
					success: false,
					message: error.message || 'Error desconocido',
				},
				{ status: 500 }
			);
		}

		// En caso de que no sepamos qué tipo de error es
		return NextResponse.json(
			{
				success: false,
				message: 'Error desconocido',
			},
			{ status: 500 }
		);
	}
}
