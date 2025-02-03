import { Course, Enrollment, Payment, PlanItem, Student } from '@prisma/client';

export type Plans_model = {
	id: number;
	nombre: string;
	descripcion: string | null;
	precioFinal: number;
	items: item[];
	// estudiantes: Student[];
	// enrollments: Enrollment[];
	// beneficiarios: Payment[];
	createdBy: string;
	createdByName: string;
	updatedBy: string | null;
	updatedByName: string | null;
	createdAt: Date;
	updatedAt: Date;
};
export type item = {
	id: number;
	cursoId: number;
	planId: number;
	cantidad: number;
	descuento: number;
	curso: Course;
};
