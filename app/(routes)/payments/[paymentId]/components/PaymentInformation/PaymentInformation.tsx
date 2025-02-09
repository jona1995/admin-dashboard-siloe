import Image from 'next/image';
import { PaymentInformationProps } from './PaymentInformation.types';
import { User } from 'lucide-react';
import { PaymentForm } from '../PaymentForm';

export function PaymentInformation(props: PaymentInformationProps) {
	const { payment } = props;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 gap-y-4">
			<div className="p-4 rounded-lg shadow-md bg-background hover:shadow-lg">
				<div>
					<PaymentForm payment={payment} />
				</div>
			</div>
		</div>
	);
}
