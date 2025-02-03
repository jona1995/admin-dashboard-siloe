import { Student, Subject, TipoEvaluacion } from '@prisma/client';
import { StudentWithUser } from '../../students/components/ListStudents/modelos';

export enum Tipo {
	CALIFICACION_FINAL = 'CALIFICACION_FINAL',
	PARTICIPACION_CLASE = 'PARTICIPACION_CLASE',
	LECTURA = 'LECTURA',
	TAREA = 'TAREA',
	EXAMEN = 'EXAMEN',
	PROYECTO_FINAL = 'PROYECTO_FINAL',
	OTRO = 'OTRO',
}
export const NotaEstado = {
	APROBADO: {
		label: 'APROBADO',
		colorClass: 'bg-green-100 text-green-700',
	},
	DESAPROBADO: {
		label: 'DESAPROBADO',
		colorClass: 'bg-red-100 text-red-700',
	},
};
export enum NotaEstadoEnum {
	APROBADO = 'APROBADO',
	DESAPROBADO = 'DESAPROBADO',
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
	student: StudentWithUser; // Este es el objeto relacionado del estudiante
	subject: Subject; // Este es el objeto relacionado de la materia
	updatedAt: Date;
	createdBy: string;
	createdByName: string;
	updatedBy: string | null;
	updatedByName: string | null;
};
