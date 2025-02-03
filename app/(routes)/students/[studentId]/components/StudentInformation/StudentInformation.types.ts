import { Student } from '@prisma/client';
import { StudentWithUser } from '../../../components/ListStudents/modelos';

export type StudentInformationProps = {
	student: StudentWithUser;
};
