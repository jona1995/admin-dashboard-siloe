import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

import { DataTable } from './data-table';
import { columns } from './columns';

export async function Plans() {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}

	const plans = await db.plan.findMany({
		orderBy: {
			createdAt: 'desc',
		},
	});

	return <DataTable columns={columns} data={plans} />;
}
