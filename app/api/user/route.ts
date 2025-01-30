import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db'; // Asegúrate de importar correctamente tu instancia de Prisma
import { UserState, UserType } from '@prisma/client';
export async function POST(req: Request) {
	try {
		// Obtener el ID del usuario autenticado
		const { userId } = auth();
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

		// Responder con el estudiante creado
		return NextResponse.json(student);
	} catch (error) {
		console.log('[STUDENT]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
