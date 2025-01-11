import Image from 'next/image';
import { CourseInformationProps } from './CourseInformation.types';
import { User } from 'lucide-react';
import { CourseForm } from '../CourseForm';

export function CourseInformation(props: CourseInformationProps) {
	const { course } = props;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 gap-y-4">
			<div className="p-4 rounded-lg shadow-md bg-background hover:shadow-lg">
				<div>
					<CourseForm course={course} />
				</div>
			</div>
		</div>
	);
}
