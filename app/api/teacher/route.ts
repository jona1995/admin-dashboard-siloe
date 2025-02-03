import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		const data = await req.json();
		const userName = req.headers.get('x-user-name');
		const userEmail = req.headers.get('x-user-email');
		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const teacher = await db.teacher.create({
			data: {
				...data,
				createdBy: userId,
				createdByName: userName ? userName : '',
				subjects: {
					connect: data.subjects.map((id: number) => ({ id })), // Conecta las materias por ID
				},
			},
		});

		// Si todo va bien, devolver una respuesta exitosa
		return NextResponse.json({
			success: true,
			message: 'Profesor procesado exitosamente',
			data: teacher,
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

// Manejo de la solicitud GET para obtener todos los cursos
export async function GET(req: Request) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const teachers = await db.teacher.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		});

		// Si todo va bien, devolver una respuesta exitosa
		return NextResponse.json({
			success: true,
			message: 'Profesor procesado exitosamente',
			data: teachers,
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
