import { Course } from '@prisma/client';

export type CourseInformationProps = {
	course: CourseWithSubjects;
};

type CourseWithSubjects = Course & {
	subjects: {
		id: number;
		nombre: string;
	}[];
};
