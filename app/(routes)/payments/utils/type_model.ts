import {
	Enrollment,
	EstadoPago,
	FinancialTransaction,
	Plan,
	Student,
	TipoPago,
} from '@prisma/client';
import { StudentWithUser } from '../../students/components/ListStudents/modelos';

export type Payment_model = {
	id: number;
	monto: number;
	fechaPagoMes: Date;
	fechaPagoRecibo: Date | null;
	estadoPago: EstadoPago;
	tipoPago: TipoPago;
	pagadorId: number | null;
	beneficiadoId: number | null;
	comentario: string | null;
	createdAt: Date;
	updatedAt: Date;
	pagador?: StudentWithUser | null; // Este es el objeto relacionado del estudiante
	beneficiarios: StudentWithUser[]; // Este es el objeto relacionado del estudiante
	plan?: Plan | null; // Este es el objeto relacionado de la materia
	createdBy: string;
	createdByName: string;
	updatedBy: string | null;
	updatedByName: string | null;
	// Enrollment: Enrollment[];
	// FinancialTransaction: FinancialTransaction[];
};
