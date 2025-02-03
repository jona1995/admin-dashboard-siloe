import { TeacherWithUser } from '../../../components/ListTeacher/modelos';

type TeacherWithSubjects = TeacherWithUser & {
	subjects: {
		id: number;
		nombre: string;
	}[];
};

export type TeacherFormProps = {
	teacher: TeacherWithSubjects;
};
