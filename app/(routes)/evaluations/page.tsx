import { Spinner } from '@/components/Spinner/spinner';
import { HeaderEvaluation } from './components/HeaderEvaluation';
import { Evaluations } from './components/ListEvaluation';
import { Suspense } from 'react';

export default function EvaluationPage() {
	return (
		<div>
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-screen">
						<Spinner /> {/* Spinner mientras se carga */}
					</div>
				}
			>
				<HeaderEvaluation />
				<Evaluations />
			</Suspense>
		</div>
	);
}
