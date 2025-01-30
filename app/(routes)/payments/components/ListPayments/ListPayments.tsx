import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

import { DataTable } from './data-table';
import { columns } from './columns';

export async function Payments() {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}

	const payments = await db.payment.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		include: {
			pagador: true,
			beneficiarios: true,
			// Enrollment: true,
			// FinancialTransaction: true,
		},
	});
	console.log(payments);
	return <DataTable columns={columns} data={payments} />;
}
