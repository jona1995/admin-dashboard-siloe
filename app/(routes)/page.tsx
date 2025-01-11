import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { CardSummary } from './components/CardSummary';
import { BookOpenCheck, UsersRound, Waypoints } from 'lucide-react';
import { LastCustomers } from './components/LastCustomers';
import { Salesdistributor } from './components/Salesdistributors';
import { TotalSuscribers } from './components/TotalSuscribers';
import { ListIntegrations } from './components/ListItengrations';
import { db } from '@/lib/db';

import moment from 'moment';

const startOfMonth = moment().startOf('month').toDate(); // Inicio del mes
const endOfMonth = moment().endOf('month').toDate(); // Fin del mes
const total = await db.payment.aggregate({
	_sum: {
		monto: true, // Campo que suma el monto total
	},
	where: {
		fechaPago: {
			gte: startOfMonth, // Desde el inicio del mes
			lte: endOfMonth, // Hasta el final del mes
		},
	},
});
console.log(total);
const dataCardsSummary = [
	{
		icon: UsersRound,
		total: (await db.student.count()) || '',
		average: 15,
		title: 'Total Estudiantes',
		tooltipText: 'Estudiantes creados',
	},
	{
		icon: Waypoints,
		total: total._sum.monto || '',
		average: 80,
		title: 'Total Cuotas del Mes',
		tooltipText: 'Total de cuotas del mes',
	},
	{
		icon: BookOpenCheck,
		total: (await db.enrollment.count()) || '',
		average: 30,
		title: 'Total de incripciones',
		tooltipText: 'Total de incripciones',
	},
];

export default function Home() {
	return (
		<div>
			<h2 className="mb-4 text-2xl">Dashboard</h2>
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-20">
				{dataCardsSummary.map(
					({ icon, total, average, title, tooltipText }) => (
						<CardSummary
							key={title}
							icon={icon}
							total={total?.toString() || null}
							average={average}
							title={title}
							tooltipText={tooltipText}
						/>
					)
				)}
			</div>
			{/* <div className="grid grid-cols-1 mt-12 xl:grid-cols-2 md:gap-x-10">
				<LastCustomers />
				<Salesdistributor />
			</div>
			<div className="flex-col justify-center mt-12 md:gap-x-10 xl:flex xl:flex-row gap-y-4 md:gap-y-0 md:mb-10">
				<TotalSuscribers />
				<ListIntegrations />
			</div> */}
		</div>
	);
}
