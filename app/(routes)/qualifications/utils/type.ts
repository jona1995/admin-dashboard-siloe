import { StudentWithUser } from '../../students/components/ListStudents/modelos';

export type GradeDTO = {
	id: number;
	promedio: number;
	studentName: StudentWithUser;
	subjectName: string;
	courseName: string;
};
