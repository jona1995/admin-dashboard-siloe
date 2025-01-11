'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Select from 'react-select'; // Importa react-select
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Toast } from '@/components/ui/toast';

import { CourseFormProps } from './CourseForm.types';
import { formSchema } from './CourseForm.form';
import { toast } from '@/components/ui/use-toast';
import React from 'react';
import { Subject } from '@prisma/client';

export function CourseForm(props: CourseFormProps) {
	const { course } = props;
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre: course.nombre,
			descripcion: course.descripcion,
			duracion: Number(course.duracion),
			revenuePercentage: Number(course.revenuePercentage),
			subjects: course.subjects.map(subject => subject.id.toString()),
		},
	});

	const [subjects, setSubjects] = useState<Subject[]>([]); // Estado para
	const [searchQuery, setSearchQuery] = React.useState('');
	const subjectOptions = subjects.map(subject => ({
		value: subject.id.toString(), // El ID debe ser el valor que se pasará al formulario
		label: subject.nombre, // El nombre será lo que se mostrará en la opción
	}));
	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const response = await axios.get<Subject[]>('/api/subject');
				console.log(response.data); // Log the response data
				setSubjects(response.data);
			} catch (error) {
				console.error('Error fetching subjects:', error);
			}
		};

		fetchSubjects();
	}, []);
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const formattedValues = {
				...values,
				subjects: values.subjects.map((subject: string | number) =>
					Number(subject)
				), // Asegúrate de que todos los valores sean números
			};
			await axios.patch(`/api/course/${course.id}`, formattedValues);
			toast({
				title: 'Curso actualizado!',
			});
			router.refresh();
		} catch (error) {
			console.log('Error al crear el curso:', error);
			toast({
				title: 'Something went wrong',
				variant: 'destructive',
			});
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid grid-cols-2 gap-3">
					<FormField
						control={form.control}
						name="nombre"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nombres</FormLabel>
								<FormControl>
									<Input placeholder="Nombres..." type="text" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="descripcion"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Descripcion</FormLabel>
								<FormControl>
									<Input placeholder="Descripcion..." type="text" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="duracion"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Duracion</FormLabel>
								<FormControl>
									<Input
										placeholder="Duracion..."
										type="text"
										{...field}
										onChange={e =>
											field.onChange(
												e.target.value ? Number(e.target.value) : undefined
											)
										}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="revenuePercentage"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Porcentaje Recaudacion</FormLabel>
								<FormControl>
									<Input
										placeholder="Porcentaje Recaudacion..."
										type="text"
										{...field}
										onChange={e =>
											field.onChange(
												e.target.value ? Number(e.target.value) : undefined
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="subjects"
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Materias</FormLabel>
									<FormControl>
										{/* El componente Select de react-select */}
										<Select
											isMulti // Habilita la selección múltiple
											options={subjectOptions} // Lista de opciones de estudiantes
											onChange={selectedOptions => {
												// `selectedOptions` es un array con las opciones seleccionadas
												const selectedIds = selectedOptions.map(
													option => option.value
												);
												field.onChange(selectedIds); // Guarda los IDs seleccionados
											}}
											value={subjectOptions.filter(option =>
												field.value?.includes(option.value.toString())
											)} // Filtra las opciones seleccionadas
											placeholder="Seleccione materias"
											noOptionsMessage={() => 'No hay materias disponibles'} // Mensaje cuando no hay opciones
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
				</div>
				<Button type="submit">Editar Curso</Button>
			</form>
		</Form>
	);
}
