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
	fechaInscripcion: Date;
	fechaInscripcionCursoDesde: Date;
	fechaInscripcionCursoHasta: Date | null;
	estado: EstadoIncripcion;
	planId: number | null;
	modalidad: ModalidadEstudio;
	createdAt: Date;
	updatedAt: Date;
	createdBy: string;
	createdByName: string;
	updatedBy: string | null;
	updatedByName: string | null;
	student: Student; // Este es el objeto relacionado del estudiante
	plan: Plan | null; // Este es el objeto relacionado de la materia
	courses: Course[];
	user: User;
};
