import { Spinner } from '@/components/Spinner/spinner';
import { HeaderTeachers } from './components/HeaderTeachers';
import { Teachers } from './components/ListTeacher';
import { Suspense } from 'react';

export default function TeachearPage() {
	return (
		<div>
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-screen">
						<Spinner /> {/* Spinner mientras se carga */}
					</div>
				}
			>
				<HeaderTeachers />
				<Teachers />
			</Suspense>
		</div>
	);
}
