import Image from 'next/image';
import { PlanInformationProps } from './PlanInformation.types';
import { User } from 'lucide-react';
import { PlanForm } from '../PlanForm';

export function PlanInformation(props: PlanInformationProps) {
	const { plan } = props;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 gap-y-4">
			<div className="p-4 rounded-lg shadow-md bg-background hover:shadow-lg">
				<div>
					<PlanForm plan={plan} />
				</div>
			</div>
		</div>
	);
}
