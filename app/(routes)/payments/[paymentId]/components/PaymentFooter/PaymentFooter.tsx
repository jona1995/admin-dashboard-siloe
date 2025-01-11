'use client';

import { useRouter } from 'next/navigation';

import axios from 'axios';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { PaymentFooterProps } from './PaymentFooter.types';
import { toast } from '@/components/ui/use-toast';

export function PaymentFooter(props: PaymentFooterProps) {
	const { paymentId } = props;
	const router = useRouter();

	const onDeletePayment = async () => {
		try {
			await axios.delete(`/api/payment/${paymentId}`);
			toast({
				title: 'Pago Eliminado',
			});
			router.push('/payments');
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
			<Button variant="destructive" onClick={onDeletePayment}>
				<Trash className="w-4 h-4 mr-2" />
				Eliminar Pago
			</Button>
		</div>
	);
}
