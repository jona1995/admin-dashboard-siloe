import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db'; // Asegúrate de importar correctamente tu instancia de Prisma
import { UserState, UserType } from '@prisma/client';
import { AxiosError } from 'axios';
export async function POST(req: Request) {
	try {
		// Obtener el ID del usuario autenticado
		const { userId, user } = auth();
		const data = await req.json();
		// Verificar si el usuario está autenticado
		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		const userName = req.headers.get('x-user-name');
		const userEmail = req.headers.get('x-user-email');

		console.log('llego');
		console.log(userName);
		// Crear el Usuario
		const userCreate = await db.user.create({
			data: {
				// clerkId: userId,
				nombre: data.nombre,
				apellido: data.apellido,
				cedula: data.cedula,
				email: data.email,
				telefono: data.telefono,
				iglesia: data.iglesia,
				localidadIglesia: data.localidadIglesia,
				state: UserState.ACTIVO, // Establecer el estado como ACTIVO
				tipo: UserType.ESTUDIANTE, // Establecer el tipo de usuario como ESTUDIANTE
				createdByName: userName ? userName : '',
				createdBy: userId, // El ID del usuario autenticado
			},
		});

		// Crear el Estudiante y asociarlo al Usuario creado
		const student = await db.student.create({
			data: {
				userId: userCreate.id, // Asociar el ID del Usuario recién creado
				createdByName: userName ? userName : '',
				createdBy: userId, // El ID del usuario autenticado
			},
		});

		// Si todo va bien, devolver una respuesta exitosa
		return NextResponse.json({
			success: true,
			message: 'Usuario procesado exitosamente',
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
