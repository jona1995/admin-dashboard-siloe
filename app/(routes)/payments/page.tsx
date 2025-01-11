import { HeaderPayments } from './components/HeaderPayments';
import { Payments } from './components/ListPayments';

export default function PaymentsPage() {
	return (
		<div>
			<HeaderPayments />
			<Payments />
		</div>
	);
}
