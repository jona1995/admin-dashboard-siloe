'use client';

import { useRouter } from 'next/navigation';

import axios from 'axios';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { SubjectFooterProps } from './SubjectFooter.types';
import { toast } from '@/components/ui/use-toast';

export function SubjectFooter(props: SubjectFooterProps) {
	const { subjectId } = props;
	const router = useRouter();

	const onDeleteSubject = async () => {
		try {
			await axios.delete(`/api/subject/${subjectId}`);
			toast({
				title: 'Materia Eliminada',
			});
			router.push('/subjects');
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
			<Button variant="destructive" onClick={onDeleteSubject}>
				<Trash className="w-4 h-4 mr-2" />
				Eliminar Materia
			</Button>
		</div>
	);
}
