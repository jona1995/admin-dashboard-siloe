import { Suspense } from 'react';
import { HeaderDebtor } from './components/HeaderDebtor';
import { Debtors } from './components/ListDebtor';
import { Spinner } from '@/components/Spinner/spinner';

export default function DebtorsPage() {
	return (
		<div>
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-screen">
						<Spinner /> {/* Spinner mientras se carga */}
					</div>
				}
			>
				<HeaderDebtor />
				<Debtors />
			</Suspense>
		</div>
	);
}
