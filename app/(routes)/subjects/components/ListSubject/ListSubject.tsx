import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

import { DataTable } from './data-table';
import { columns } from './columns';

export async function Subjects() {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}

	const subjects = await db.subject.findMany({
		orderBy: {
			createdAt: 'desc',
		},
	});

	return <DataTable columns={columns} data={subjects} />;
}
