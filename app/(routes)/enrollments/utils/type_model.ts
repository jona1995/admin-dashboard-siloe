import {
	Course,
	EstadoIncripcion,
	ModalidadEstudio,
	Plan,
	Student,
	User,
} from '@prisma/client';

export type Enrollment = {
	id: number;
	estudianteId: number;
	fechaInscripcionDesde: Date;
	fechaInscripcionHasta: Date;
	estado: EstadoIncripcion;
	planId: number;
	modalidad: ModalidadEstudio;
	createdAt: Date;
	updatedAt: Date;
	student: Student; // Este es el objeto relacionado del estudiante
	plan: Plan; // Este es el objeto relacionado de la materia
	courses: Course[];
	user: User;
};
