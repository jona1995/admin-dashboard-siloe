import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
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

		return NextResponse.json(student);
	} catch (error) {
		console.log('[STUDENT]', error);
		return new NextResponse('Internal Error', { status: 500 });
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
		console.log(studentData);
		return NextResponse.json(studentData);
	} catch (error) {
		console.log('[students]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
