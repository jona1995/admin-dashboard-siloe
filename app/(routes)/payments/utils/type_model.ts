import {
	Enrollment,
	EstadoPago,
	FinancialTransaction,
	Plan,
	Student,
	TipoPago,
} from '@prisma/client';

export type Payment_model = {
	id: number;
	monto: number;
	fechaPagoMes: Date;
	estadoPago: EstadoPago;
	tipoPago: TipoPago;
	pagadorId: number;
	comentario: string;
	createdAt: Date;
	updatedAt: Date;
	pagador: Student; // Este es el objeto relacionado del estudiante
	beneficiarios: Student[]; // Este es el objeto relacionado del estudiante
	plan: Plan; // Este es el objeto relacionado de la materia
	// Enrollment: Enrollment[];
	// FinancialTransaction: FinancialTransaction[];
};
