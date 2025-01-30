import { Suspense } from 'react';
import { HeaderStudents } from './components/HeaderStudents';
import { Students } from './components/ListStudents';
import { Spinner } from '@/components/Spinner/spinner';

export default function StudentsPage() {
	return (
		<div>
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-screen">
						<Spinner /> {/* Spinner mientras se carga */}
					</div>
				}
			>
				<HeaderStudents />
				<Students />
			</Suspense>
		</div>
	);
}
