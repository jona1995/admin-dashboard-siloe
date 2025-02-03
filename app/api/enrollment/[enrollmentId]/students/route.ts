import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { AxiosError } from 'axios';
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
		// Si todo va bien, devolver una respuesta exitosa
		return NextResponse.json({
			success: true,
			message: 'Inscripcion procesado exitosamente',
			data: studentsData || [],
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
