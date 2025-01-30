import { Spinner } from '@/components/Spinner/spinner';
import { HeaderAccountings } from './components/HeaderAccountings';
import { Accountings } from './components/ListAccountings';
import { Suspense } from 'react';

export default function AccountingPage() {
	return (
		<div>
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-screen">
						<Spinner /> {/* Spinner mientras se carga */}
					</div>
				}
			>
				<HeaderAccountings />
				<Accountings />
			</Suspense>
		</div>
	);
}
