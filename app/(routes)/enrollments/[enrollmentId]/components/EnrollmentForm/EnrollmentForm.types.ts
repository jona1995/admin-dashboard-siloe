import { Enrollment } from '@prisma/client';

// export type EnrollmentFormProps = {
// 	enrollment: Enrollment;
// };

type EnrollmentWitCourses = Enrollment & {
	courses: { id: number; nombre: string }[];
};

export type EnrollmentFormProps = {
	enrollment: EnrollmentWitCourses;
};
