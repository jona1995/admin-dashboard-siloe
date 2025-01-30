import { Suspense } from 'react';
import { HeaderPlans } from './components/HeaderPlans';
import { Plans } from './components/ListPlans';
import { Spinner } from '@/components/Spinner/spinner';

export default function PlansPage() {
	return (
		<div>
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-screen">
						<Spinner /> {/* Spinner mientras se carga */}
					</div>
				}
			>
				<HeaderPlans />
				<Plans />
			</Suspense>
		</div>
	);
}
