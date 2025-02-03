import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Header } from './components/Header';
import { PlanInformation } from './components/PlanInformation';
import { PlanFooter } from './components/PlanFooter';
import { Plan } from '@prisma/client';

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
	// Transforma los items a la estructura esperada
	const planWithItems = {
		...plan,
		items: plan.items.map(item => ({
			cursoId: item.curso.id.toString(), // Asegúrate de extraer el cursoId correctamente
			cantidad: item.cantidad, // Asegúrate de que 'cantidad' exista
			descuento: item.descuento, // Asegúrate de que 'descuento' exista
		})),
	};
	return (
		<div>
			<Header />
			<PlanInformation plan={planWithItems} />
			<PlanFooter planId={plan.id} />
		</div>
	);
}
