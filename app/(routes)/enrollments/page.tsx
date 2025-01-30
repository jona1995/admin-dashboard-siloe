import { Suspense } from 'react';
import { HeaderEnrollment } from './components/HeaderEnrollment';
import { Enrollments } from './components/ListEnrollment';
import { Spinner } from '@/components/Spinner/spinner';

export default function EnrollmentsPage() {
	return (
		<div>
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-screen">
						<Spinner /> {/* Spinner mientras se carga */}
					</div>
				}
			>
				<HeaderEnrollment />
				<Enrollments />
			</Suspense>
		</div>
	);
}
