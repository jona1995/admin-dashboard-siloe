import { TeacherWithUser } from '../../../components/ListTeacher/modelos';

// export type TeacherFormProps = {
// 	teacher: Teacher;
// };
type TeacherWithSubjects = TeacherWithUser & {
	subjects: {
		id: number;
		nombre: string;
	}[];
};

export type TeacherFormProps = {
	teacher: TeacherWithSubjects;
};
