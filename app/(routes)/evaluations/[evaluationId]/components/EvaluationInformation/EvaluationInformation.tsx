import Image from 'next/image';
import { EvaluationInformationProps } from './EnrollmentInformation.types';
import { User } from 'lucide-react';
import { EvaluationForm } from '../EvaluationForm';

export function EvaluationInformation(props: EvaluationInformationProps) {
	const { evaluation } = props;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 gap-y-4">
			<div className="p-4 rounded-lg shadow-md bg-background hover:shadow-lg">
				<div>
					<EvaluationForm evaluation={evaluation} />
				</div>
			</div>
		</div>
	);
}
