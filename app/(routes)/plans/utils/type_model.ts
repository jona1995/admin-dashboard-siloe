import { Course, Enrollment, Payment, PlanItem, Student } from '@prisma/client';

export type Plans_model = {
	id: number;
	nombre: string;
	descripcion: string;
	precioFinal: number;
	items: item[];
	// estudiantes: Student[];
	// enrollments: Enrollment[];
	// beneficiarios: Payment[];
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
