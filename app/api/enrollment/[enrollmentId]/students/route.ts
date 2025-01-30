import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
	req: Request,
	{ params }: { params: { enrollmentId: string } }
) {
	try {
		const { userId } = auth();
		const { enrollmentId } = params;

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		// Obtener los estudiantes asociados a la inscripción
		const enrollment = await db.enrollment.findUnique({
			where: {
				id: parseInt(enrollmentId, 10),
			},

			select: {
				estudiantesAsociados: {
					include: {
						user: true, // Incluye el usuario relacionado con el estudiante
					},
				}, // Selecciona solo los estudiantes
			},
		});

		if (!enrollment) {
			return new NextResponse('Enrollment not found', { status: 404 });
		}
		// Formatear y devolver solo los datos de los estudiantes
		const studentsData = enrollment.estudiantesAsociados.map(student => ({
			nombre: student.user.nombre,
			cedula: student.user.cedula,
			id: student.id,
		}));
		return NextResponse.json(studentsData || []);
	} catch (error) {
		console.log('[GET ENROLLMENT STUDENTS]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
