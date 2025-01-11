import { Course } from '@prisma/client';

// export type CourseFormProps = {
// 	course: Course;
// };

type CourseWithSubjects = Course & {
	subjects: {
		id: number;
		nombre: string;
	}[];
};

export type CourseFormProps = {
	course: CourseWithSubjects;
};
