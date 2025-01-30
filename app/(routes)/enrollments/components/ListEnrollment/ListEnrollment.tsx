import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

import { DataTable } from './data-table';
import { columns } from './columns';

export async function Enrollments() {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}

	const enrollments = await db.enrollment.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			plan: true, // Incluye la información de la materia
			student: {
				include: {
					user: true, // Incluye el usuario relacionado con el estudiante
				},
			}, // Incluye la información del estudiante
			courses: true,
		},
	});
	// Mapear los datos para incluir información de `course`
	// Mapear los datos para incluir los nombres de los cursos
	// const dataWithCourses = enrollments.map(enrollment => ({
	// 	...enrollment,
	// 	courseNames:
	// 		enrollment.courses?.length > 0
	// 			? enrollment.courses.map(course => course.nombre).join(', ')
	// 			: 'Sin cursos asignados',
	// }));

	const dataWithCourses = enrollments.map(enrollment => ({
		...enrollment,
		user: enrollment.student?.user, // Agrega los datos del usuario
		courseNames: enrollment.courses.map(course => course.nombre).join(', '), // Cambia "name" según el campo que quieras mostrar
	}));

	console.log(dataWithCourses);
	return <DataTable columns={columns} data={dataWithCourses} />;
}
