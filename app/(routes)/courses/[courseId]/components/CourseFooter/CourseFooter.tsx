'use client';

import { useRouter } from 'next/navigation';

import axios from 'axios';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { CourseFooterProps } from './CourseFooter.types';
import { toast } from '@/components/ui/use-toast';

export function CourseFooter(props: CourseFooterProps) {
	const { courseId } = props;
	const router = useRouter();

	const onDeleteCourse = async () => {
		try {
			await axios.delete(`/api/course/${courseId}`);
			toast({
				title: 'Curso Eliminado',
			});
			router.push('/course');
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
			<Button variant="destructive" onClick={onDeleteCourse}>
				<Trash className="w-4 h-4 mr-2" />
				Eliminar Curso
			</Button>
		</div>
	);
}
