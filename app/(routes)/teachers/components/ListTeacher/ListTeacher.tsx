import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

import { DataTable } from './data-table';
import { columns } from './columns';

export async function Teachers() {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}

	const teachers = await db.teacher.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			subjects: true,
		},
	});
	const dataWithSubjects = teachers.map(teacher => ({
		...teacher,
		subjectsNames: teacher.subjects.map(subject => subject.nombre).join(', '), // Cambia "name" según el campo que quieras mostrar
	}));
	return <DataTable columns={columns} data={dataWithSubjects} />;
}
