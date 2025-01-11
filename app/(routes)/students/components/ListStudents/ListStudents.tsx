import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

import { DataTable } from './data-table';
import { columns } from './columns';

export async function Students() {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}

	const students = await db.student.findMany({
		orderBy: {
			createdAt: 'desc',
		},
	});

	return <DataTable columns={columns} data={students} />;
}
