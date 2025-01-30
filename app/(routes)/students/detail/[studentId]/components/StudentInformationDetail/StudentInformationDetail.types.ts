import { Enrollment, Evaluation, Payment, Plan, Student } from '@prisma/client';

// export type StudentInformationDetailProps = {
// 	student: Student;
// };

type StudentInformation = Student & {
	enrollments: (Enrollment & {
		courses: { name: string; description: string }[]; // Aquí defines los cursos asociados a la inscripción
	})[]; // Inscripciones y cursos asociados

	evaluations: Evaluation[]; // Evaluaciones asociadas

	paymentsMade: Payment[]; // Pagos realizados por el estudiante

	paymentsReceived: Payment[]; // Pagos recibidos

	plan: Plan | null; // Plan del estudiante, puede ser null si no tiene
};

export type StudentInformationDetailProps = {
	student: StudentInformation;
};
