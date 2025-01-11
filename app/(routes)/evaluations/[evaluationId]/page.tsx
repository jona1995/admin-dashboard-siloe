import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Header } from '../../evaluations/[evaluationId]/components/Header';
import { EvaluationFooter } from '../../evaluations/[evaluationId]/components/EvaluationFooter';
import { EvaluationInformation } from '../../evaluations/[evaluationId]/components/EvaluationInformation';

export default async function EvaluationIdPage({
	params,
}: {
	params: { evaluationId: string };
}) {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}
	const evaluation = await db.evaluation.findUnique({
		where: {
			id: parseInt(params.evaluationId, 10),
		},
	});

	if (!evaluation) {
		return redirect('/');
	}

	return (
		<div>
			<Header />
			<EvaluationInformation evaluation={evaluation} />
			<EvaluationFooter evaluationId={evaluation.id} />
		</div>
	);
}
