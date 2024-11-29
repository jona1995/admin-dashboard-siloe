import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { CardSummary } from './components/CardSummary/CardSummary';
import { BookOpenCheck, UserRound, Waypoints } from 'lucide-react';
import { LastCustomers } from '@/app/(routes)/components/LastCustomers';
import { Salesdistributors } from './components/Salesdistributors';
import { TotalSuscribers } from './components/TotalSuscribers';
import { ListIntegrations } from './components/ListIntegrations';
export const dataCardsSummary = [
	{
		icon: UserRound,
		total: '12.450',
		average: 15,
		title: 'Companies Created',
		tooltipText: 'See all of the companies created',
	},
	{
		icon: Waypoints,
		total: '83433%',
		average: 60,
		title: 'Bounce Rate',
		tooltipText: 'See all of the Summary',
	},
	{
		icon: BookOpenCheck,
		total: '83433',
		average: 80,
		title: 'Bounce Rate',
		tooltipText: 'See all of the Bounce Rate',
	},
];
export default function Home() {
	return (
		<div>
			<h2 className="text-2xl mb-4">Dashboard</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-x-20">
				{dataCardsSummary.map(
					({ icon, total, average, title, tooltipText }) => (
						<CardSummary
							key={title}
							icon={icon}
							total={total}
							average={average}
							title={title}
							tooltipText={tooltipText}
						/>
					)
				)}
			</div>
			<div className="grid grid-cols-1 xl-grid-cols-2 md:gap-x-10">
				<LastCustomers />
				<Salesdistributors />
			</div>
			<div className="flex-col md:gap-x-10 xl:flex xl:flex-row gap-y-4 md:gap-y-0 mt-12 md:mb-10 justify-center">
				<TotalSuscribers />
				<ListIntegrations />
			</div>
		</div>
	);
}
