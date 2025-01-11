import { Student, Subject, TipoEvaluacion } from '@prisma/client';

export enum Tipo {
	PARTICIPACION_CLASE = 'PARTICIPACION_CLASE',
	LECTURA = 'LECTURA',
	TAREA = 'TAREA',
	EXAMEN = 'EXAMEN',
	PROYECTO_FINAL = 'PROYECTO_FINAL',
	OTRO = 'OTRO',
}

export type Evaluation = {
	id: number;
	nombre: string;
	descripcion: string;
	tipo: TipoEvaluacion;
	fecha: Date;
	subjectId: number;
	estudianteId: number;
	nota: number;
	comentario: string;
	createdAt: Date;
	student: Student; // Este es el objeto relacionado del estudiante
	subject: Subject; // Este es el objeto relacionado de la materia
};
