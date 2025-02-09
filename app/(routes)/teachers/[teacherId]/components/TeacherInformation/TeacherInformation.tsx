import Image from 'next/image';
import { TeacherInformationProps } from './TeacherInformation.types';
import { User } from 'lucide-react';
import { TeacherForm } from '../TeacherForm';

export function TeacherInformation(props: TeacherInformationProps) {
	const { teacher } = props;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 gap-y-4">
			<div className="p-4 rounded-lg shadow-md bg-background hover:shadow-lg">
				<div>
					<TeacherForm teacher={teacher} />
				</div>
			</div>
		</div>
	);
}
