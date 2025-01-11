'use client';

import { useRouter } from 'next/navigation';

import axios from 'axios';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { PlanFooterProps } from './PlanFooter.types';
import { toast } from '@/components/ui/use-toast';

export function PlanFooter(props: PlanFooterProps) {
	const { planId } = props;
	const router = useRouter();

	const onDeletePlan = async () => {
		try {
			await axios.delete(`/api/plan/${planId}`);
			toast({
				title: 'Plan Eliminado',
			});
			router.push('/plans');
			router.refresh();
		} catch (error) {
			toast({
				title: 'Something went wrong',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="flex justify-end mt-5">
			<Button variant="destructive" onClick={onDeletePlan}>
				<Trash className="w-4 h-4 mr-2" />
				Eliminar Plan
			</Button>
		</div>
	);
}
