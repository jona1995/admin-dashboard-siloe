'use client';

import { useRouter } from 'next/navigation';

import axios from 'axios';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { EvaluationFooterProps } from './EvaluationFooter.types';
import { toast } from '@/components/ui/use-toast';

export function EvaluationFooter(props: EvaluationFooterProps) {
	const { evaluationId } = props;
	const router = useRouter();

	const onDeleteEvaluation = async () => {
		try {
			await axios.delete(`/api/evaluation/${evaluationId}`);
			toast({
				title: 'Evaluacion Eliminada',
			});
			router.push('/evaluations');
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
			<Button variant="destructive" onClick={onDeleteEvaluation}>
				<Trash className="w-4 h-4 mr-2" />
				Eliminar Evaluacion
			</Button>
		</div>
	);
}
