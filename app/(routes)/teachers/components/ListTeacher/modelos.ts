import { UserState } from '@prisma/client';

export type TeacherWithUser = {
	user: {
		id: number;
		clerkId: string | null;
		nombre: string;
		apellido: string;
		cedula: string;
		email: string;
		telefono: string;
		iglesia: string;
		localidadIglesia: string;
		state: string;
		createdAt: Date;
		updatedAt: Date;
	};
	subjects: { id: number; nombre: string }[]; // Agrega las materias (subjects)
};
