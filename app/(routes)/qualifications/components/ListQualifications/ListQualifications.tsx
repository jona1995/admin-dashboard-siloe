import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

import { DataTable } from './data-table';
import { columns } from './columns';
import { GradeDTO } from '../../utils/type';

export async function Qualifications() {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}
	(
		await db.grade.findMany({
			include: {
				student: {
					include: {
						user: true, // Incluir la relación de Usuario con el Estudiante
					},
				},
				subject: { select: { descripcion: true } },
				course: { select: { descripcion: true } },
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	).map(grade => ({
		id: grade.id,
		promedio: grade.promedio,
		studentName: grade.student.user.nombre,
		subjectName: grade.subject.descripcion,
		courseName: grade.course.descripcion,
	}));
	// const averages = await db.evaluation.groupBy({
	// 	by: ['subjectId', 'estudianteId'], // Agrupar por asignatura y estudiante
	// 	_avg: {
	// 		nota: true, // Calcular promedio de notas
	// 	},
	// });
	const averages = await db.evaluation.groupBy({
		by: ['subjectId', 'estudianteId'],
		_avg: { nota: true },
	});
	const enrichedData = await Promise.all(
		averages.map(async average => {
			const student = await db.student.findUnique({
				where: { id: average.estudianteId },
				include: {
					user: true, // Incluir la relación de Usuario con el Estudiante
				},
			});

			const subject = await db.subject.findUnique({
				where: { id: average.subjectId },
				select: {
					nombre: true,
					course: {
						// Aquí obtienes todos los cursos asociados al subject
						select: { id: true, nombre: true },
					},
				},
			});
			console.log(subject);
			// if (!subject) {
			// 	console.error('Course ID is required');
			// 	return; // Evita hacer la consulta si no hay un ID válido
			// }

			// Verifica si hay cursos asociados al subject
			if (subject?.course && subject.course.length > 0) {
				// Puedes iterar sobre los cursos asociados
				for (const course of subject.course) {
					console.log(course.id); // Id del curso
					console.log(course.nombre); // Nombre del curso

					// Aquí puedes hacer lo que necesites con cada curso
					const courseDetails = await db.course.findUnique({
						where: { id: course.id }, // Usar el id del curso
						select: { nombre: true }, // Obtener solo el nombre del curso
					});

					console.log(courseDetails); // Muestra los detalles del curso
				}
			} else {
				console.log('No hay cursos asociados a esta materia');
			}

			return {
				studentName: student?.user?.nombre || 'Sin nombre',
				subjectName: subject?.nombre || 'Sin materia',
				courseName: subject?.course?.[0]?.nombre || 'Sin curso',
				promedio: average._avg.nota?.toFixed(2) || '0.00',
			};
		})
	);

	return <DataTable columns={columns} data={enrichedData} />;
}
