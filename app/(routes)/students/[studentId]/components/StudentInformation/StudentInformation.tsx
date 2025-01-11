import Image from 'next/image';
import { StudentInformationProps } from './StudentInformation.types';
import { User } from 'lucide-react';
import { StudentForm } from '../StudentForm';

export function StudentInformation(props: StudentInformationProps) {
	const { student } = props;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 gap-y-4">
			<div className="p-4 rounded-lg shadow-md bg-background hover:shadow-lg">
				<div>
					<StudentForm student={student} />
				</div>
			</div>
		</div>
	);
}
