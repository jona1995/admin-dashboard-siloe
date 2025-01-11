import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

import { DataTable } from './data-table';
import { columns } from './columns';

export async function Courses() {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}

	const courses = await db.course.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			subjects: true,
		},
	});
	console.log(courses);
	// Mapear los datos para incluir información de `subjects`
	const dataWithSubjects = courses.map(course => ({
		...course,
		subjectsNames: course.subjects.map(subject => subject.nombre).join(', '), // Cambia "name" según el campo que quieras mostrar
	}));

	return <DataTable columns={columns} data={dataWithSubjects} />;
}
