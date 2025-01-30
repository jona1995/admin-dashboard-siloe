import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Header } from './components/Header';
import { PlanInformation } from './components/PlanInformation';
import { PlanFooter } from './components/PlanFooter';

export default async function PlanIdPage({
	params,
}: {
	params: { planId: string };
}) {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}
	const plan = await db.plan.findUnique({
		where: {
			id: parseInt(params.planId, 10),
		},
		include: {
			items: {
				include: {
					curso: true,
				},
			},
		},
	});
	console.log(plan);
	if (!plan) {
		return redirect('/');
	}

	return (
		<div>
			<Header />
			<PlanInformation plan={plan} />
			<PlanFooter planId={plan.id} />
		</div>
	);
}
