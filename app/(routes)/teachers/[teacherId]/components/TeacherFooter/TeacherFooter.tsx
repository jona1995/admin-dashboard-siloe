'use client';

import { useRouter } from 'next/navigation';

import axios from 'axios';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { TeacherFooterProps } from './TeacherFooter.types';
import { toast } from '@/components/ui/use-toast';

export function TeacherFooter(props: TeacherFooterProps) {
	const { teacherId } = props;
	const router = useRouter();

	const onDeleteTeacher = async () => {
		try {
			await axios.delete(`/api/teacher/${teacherId}`);
			toast({
				title: 'Profesor Eliminado',
			});
			router.push('/teachers');
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
			<Button variant="destructive" onClick={onDeleteTeacher}>
				<Trash className="w-4 h-4 mr-2" />
				Eliminar Profesor
			</Button>
		</div>
	);
}
