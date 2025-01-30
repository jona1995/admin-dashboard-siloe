import { Suspense } from 'react';
import { HeaderCourse } from './components/HeaderCourse';
import { Courses } from './components/ListCourse';
import { Spinner } from '@/components/Spinner/spinner';

export default function CoursePage() {
	return (
		<div>
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-screen">
						<Spinner /> {/* Spinner mientras se carga */}
					</div>
				}
			>
				<HeaderCourse />
				<Courses />
			</Suspense>
		</div>
	);
}
