import { LucideIcon } from 'lucide-react';

export type CardSummaryProps = {
	icon: LucideIcon;
	total: string | number | null;
	average: number;
	title: string;
	tooltipText: string;
};
