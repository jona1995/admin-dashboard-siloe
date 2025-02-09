import Image from 'next/image';
import { EnrollmentInformationProps } from './EnrollmentInformation.types';
import { User } from 'lucide-react';
import { EnrollmentForm } from '../EnrollmentForm';

export function EnrollmentInformation(props: EnrollmentInformationProps) {
	const { enrollment } = props;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 gap-y-4">
			<div className="p-4 rounded-lg shadow-md bg-background hover:shadow-lg">
				<div>
					<EnrollmentForm enrollment={enrollment} />
				</div>
			</div>
		</div>
	);
}
