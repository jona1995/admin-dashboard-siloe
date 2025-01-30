import { Spinner } from '@/components/Spinner/spinner';
import { HeaderSubjects } from './components/HeaderSubject';
import { Subjects } from './components/ListSubject';
import { Suspense } from 'react';

export default function SubjectPage() {
	return (
		<div>
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-screen">
						<Spinner /> {/* Spinner mientras se carga */}
					</div>
				}
			>
				<HeaderSubjects />
				<Subjects />
			</Suspense>
		</div>
	);
}
