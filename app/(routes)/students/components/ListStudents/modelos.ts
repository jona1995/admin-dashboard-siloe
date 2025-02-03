import { UserState } from '@prisma/client';

export type StudentWithUser = {
	user: {
		nombre: string;
		apellido: string;
		cedula: string;
		email: string;
		telefono: string;
		iglesia: string;
		localidadIglesia: string;
		state: UserState;
		createdBy: string;
		createdByName: string;
		updatedBy: string | null;
		updatedByName: string | null;
	};
	id: number;
	updatedAt: Date;
	createdAt: Date;
	createdBy: string;
	createdByName: string;
	updatedBy: string | null;
	updatedByName: string | null;
	// Otros campos adicionales que quieras incluir
};
