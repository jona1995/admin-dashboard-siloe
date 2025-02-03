import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

import { DataTable } from './data-table';
import { columns } from './columns';
import { StudentWithUser } from './modelos';

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
		// Datos del usuario
		user: {
			nombre: student.user.nombre,
			apellido: student.user.apellido,
			cedula: student.user.cedula,
			email: student.user.email,
			telefono: student.user.telefono,
			iglesia: student.user.iglesia,
			localidadIglesia: student.user.localidadIglesia,
			state: student.user.state,
			createdBy: student.user.createdBy,
			createdByName: student.user.createdByName,
			updatedByName: student.user.updatedByName,
			updatedBy: student.user.updatedBy,
		},
		// Datos del estudiante
		createdAt: student.createdAt,
		updatedAt: student.updatedAt,
		createdBy: student.createdBy,
		createdByName: student.createdByName,
		updatedByName: student.updatedByName,
		updatedBy: student.updatedBy,
		// Puedes agregar más campos del estudiante si lo necesitas
	}));

	return <DataTable columns={columns} data={studentData} />;
}
