import { Spinner } from '@/components/Spinner/spinner';
import { Qualifications } from './components/ListQualifications';
import { HeaderQualification } from './HeaderPlans';
import { Suspense } from 'react';

export default function QualificationsPage() {
	return (
		<div>
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-screen">
						<Spinner /> {/* Spinner mientras se carga */}
					</div>
				}
			>
				<HeaderQualification />
				<Qualifications />
			</Suspense>
		</div>
	);
}
