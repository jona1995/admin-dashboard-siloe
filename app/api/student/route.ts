import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { userId, user } = auth();
		const data = await req.json();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		const student = await db.student.create({
			data: {
				...data,
				createdBy: userId,
				createdByName: user?.firstName
					? user?.firstName + ' ' + user.lastName
					: '',
			},
		});

		// Si todo va bien, devolver una respuesta exitosa
		return NextResponse.json({
			success: true,
			message: 'Estudiante procesado exitosamente',
			data: student,
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

		const students = await db.student.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				user: true, // Incluir la relación de Usuario con el Estudiante
			},
		});
		// Mapea los estudiantes para mostrar la información del usuario asociada
		const studentData = students.map(student => ({
			id: student.id,
			nombre: student.user.nombre,
			apellido: student.user.apellido,
			cedula: student.user.cedula,
			email: student.user.email,
			telefono: student.user.telefono,
			iglesia: student.user.iglesia,
			localidadIglesia: student.user.localidadIglesia,
			createdAt: student.createdAt,
			updatedAt: student.updatedAt,
			createdByName: student.createdByName,
			updatedByName: student.updatedByName,
			// Puedes agregar más campos si es necesario
		}));
		// Si todo va bien, devolver una respuesta exitosa
		return NextResponse.json({
			success: true,
			message: 'Estudiante procesado exitosamente',
			data: studentData,
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
