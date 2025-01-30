import { Teacher } from '@prisma/client';

// export type TeacherFormProps = {
// 	teacher: Teacher;
// };
type TeacherWithSubjects = Teacher & {
	subjects: {
		id: number;
		nombre: string;
	}[];
};

export type TeacherFormProps = {
	teacher: TeacherWithSubjects;
};
