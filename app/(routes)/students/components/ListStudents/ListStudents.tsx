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
		include: {
			user: true, // Incluir la relación de Usuario con el Estudiante
		},
	});
	// Mapea los estudiantes para mostrar la información del usuario asociada
	const studentData = students.map(student => ({
		id: student.id,
		nombre: student.user.nombre,
		apellido: student.user.apellido,
		cedula: student.user.cedula,
		email: student.user.email,
		telefono: student.user.telefono,
		iglesia: student.user.iglesia,
		localidadIglesia: student.user.localidadIglesia,
		createdAt: student.createdAt,
		updatedAt: student.updatedAt,
		createdByName: student.createdByName,
		updatedByName: student.updatedByName,
		// Puedes agregar más campos si es necesario
	}));
	return <DataTable columns={columns} data={studentData} />;
}
