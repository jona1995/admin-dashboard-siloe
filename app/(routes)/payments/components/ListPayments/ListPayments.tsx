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
			pagador: {
				include: {
					user: true, // Incluir datos del usuario (nombre, etc.)
				},
			},

			beneficiarios: {
				include: {
					user: true, // Incluir la relación con el usuario
				},
			},
			// Enrollment: true,
			// FinancialTransaction: true,
		},
	});
	console.log(payments);
	// Aquí accedes a la propiedad 'user' del 'pagador' para obtener el nombre

	return <DataTable columns={columns} data={payments} />;
}
