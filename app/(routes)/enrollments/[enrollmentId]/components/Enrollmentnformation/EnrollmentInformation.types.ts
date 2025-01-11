import { Enrollment } from '@prisma/client';

// export type EnrollmentInformationProps = {
// 	enrollment: Enrollment;
// };

type EnrollmentWitCourses = Enrollment & {
	courses: { id: number; nombre: string }[];
};

export type EnrollmentInformationProps = {
	enrollment: EnrollmentWitCourses;
};
