import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { enrollmentId: string } }
) {
	try {
		const { userId, user } = auth();
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
				updatedByName: user?.firstName
					? user?.firstName + ' ' + user.lastName
					: '',
				updatedBy: userId,
				courses: {
					set: values.courses.map((id: number) => ({ id })), // Conecta las materias por ID
				},
			},
		});

		// Si todo va bien, devolver una respuesta exitosa
		return NextResponse.json({
			success: true,
			message: 'Inscripcion procesado exitosamente',
			data: enrollment,
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

		// Si todo va bien, devolver una respuesta exitosa
		return NextResponse.json({
			success: true,
			message: 'Inscripcion procesado exitosamente',
			data: deletedEnrollment,
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
