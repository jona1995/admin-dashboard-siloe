import { Suspense } from 'react';
import { HeaderPayments } from './components/HeaderPayments';
import { Payments } from './components/ListPayments';
import { Spinner } from '@/components/Spinner/spinner';

export default function PaymentsPage() {
	return (
		<div>
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-screen">
						<Spinner /> {/* Spinner mientras se carga */}
					</div>
				}
			>
				<HeaderPayments />
				<Payments />
			</Suspense>
		</div>
	);
}
