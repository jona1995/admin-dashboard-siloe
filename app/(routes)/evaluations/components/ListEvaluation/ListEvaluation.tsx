import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

import { DataTable } from './data-table';
import { columns } from './columns';

export async function Evaluations() {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}

	const evaluation = await db.evaluation.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			subject: true, // Incluye la información de la materia
			student: {
				include: {
					user: true, // Incluye la información del usuario asociado con el estudiante
				},
			},
		},
	});

	return <DataTable columns={columns} data={evaluation} />;
}
