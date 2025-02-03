import { UserState } from '@prisma/client';

export type TeacherWithUser = {
	id: number;
	nombre: string;
	apellido: string;
	cedula: string;
	email: string;
	telefono: string;
	iglesia: string;
	localidadIglesia: string;
	state: UserState;
	updatedAt: Date;
	createdAt: Date;
	createdByName: string;
	updatedByName: string;
	// Otros campos adicionales que quieras incluir
};
