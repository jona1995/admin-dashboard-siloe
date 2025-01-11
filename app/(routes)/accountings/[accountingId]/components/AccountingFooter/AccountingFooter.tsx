'use client';

import { useRouter } from 'next/navigation';

import axios from 'axios';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { AccountingFooterProps } from './AccountingFooter.types';
import { toast } from '@/components/ui/use-toast';

export function AccountingFooter(props: AccountingFooterProps) {
	const { accountingId } = props;
	const router = useRouter();

	const onDeleteStudent = async () => {
		try {
			await axios.delete(`/api/accounting/${accountingId}`);
			toast({
				title: 'Cuenta Eliminado',
			});
			router.push('/accountings');
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
			<Button variant="destructive" onClick={onDeleteStudent}>
				<Trash className="w-4 h-4 mr-2" />
				Eliminar Cuenta
			</Button>
		</div>
	);
}
