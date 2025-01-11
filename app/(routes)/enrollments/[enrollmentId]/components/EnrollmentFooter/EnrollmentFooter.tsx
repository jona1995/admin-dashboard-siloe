'use client';

import { useRouter } from 'next/navigation';

import axios from 'axios';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { EnrollmentFooterProps } from './EnrollmentFooter.types';
import { toast } from '@/components/ui/use-toast';

export function EnrollmentFooter(props: EnrollmentFooterProps) {
	const { enrollmentId } = props;
	const router = useRouter();

	const onDeleteEnrollment = async () => {
		try {
			console.log(enrollmentId);
			await axios.delete(`/api/enrollment/${enrollmentId}`);
			toast({
				title: 'Inscripcion Eliminada',
			});
			router.push('/enrollments');
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
			<Button variant="destructive" onClick={onDeleteEnrollment}>
				<Trash className="w-4 h-4 mr-2" />
				Eliminar Incripcion
			</Button>
		</div>
	);
}
