'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import axios from 'axios';
import Select from 'react-select'; // Importa react-select
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormCreateCustomerProps } from './FormCreateCustomer.types';

import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import React from 'react';

const formSchema = z.object({
	nombre: z.string().min(1, { message: 'El nombre es obligatorio.' }),
	descripcion: z.string(),
	duracion: z.number().min(1, { message: 'La duracion es obligatorio.' }),
	precio: z.number().min(1, { message: 'El precio es obligatorio.' }),
	subjects: z.array(z.string()),
});
// Define the interface for the subject
interface Subject {
	id: number;
	nombre: string;
	descripcion: string;
	cursoId: number;
	createdAt: string;
	updatedAt: string;
}

export function FormCreateCustomer(props: FormCreateCustomerProps) {
	const { setOpenModalCreate } = props;
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre: '',
			descripcion: '',
			duracion: undefined,
			precio: undefined,
			subjects: [],
		},
	});
	const [subjects, setSubjects] = useState<Subject[]>([]);

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
	const subjectOptions = subjects.map(subject => ({
		value: subject.id.toString(), // El ID debe ser el valor que se pasará al formulario
		label: subject.nombre, // El nombre será lo que se mostrará en la opción
	}));
	const { isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			console.log(values);
			const formattedValues = {
				...values,
				subjects: values.subjects.map((subject: string | number) =>
					Number(subject)
				), // Asegúrate de que todos los valores sean números
			};
			await axios.post('/api/course', formattedValues);
			toast({ title: 'Curso Creado' });
			setOpenModalCreate(false);
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
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid grid-cols-2 gap-3">
						<FormField
							control={form.control}
							name="nombre"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre</FormLabel>
									<FormControl>
										<Input placeholder="Nombre..." type="text" {...field} />
									</FormControl>
									<FormMessage />
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
										<Input
											placeholder="Descripcion..."
											type="text"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="duracion"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Duracion (Meses)</FormLabel>
									<FormControl>
										<Input
											placeholder="Duracion (Meses)..."
											type="text"
											{...field}
											onChange={e => {
												const newValue = e.target.value
													? Number(e.target.value)
													: 0;
												// Verificar si el valor es negativo y no permitirlo
												field.onChange(newValue >= 0 ? newValue : 0);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="precio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Precio</FormLabel>
									<FormControl>
										<Input
											placeholder="Precio..."
											type="text"
											{...field}
											onChange={e => {
												const newValue = e.target.value
													? Number(e.target.value)
													: 0;
												// Verificar si el valor es negativo y no permitirlo
												field.onChange(newValue >= 0 ? newValue : 0);
											}}
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
					<Button type="submit" disabled={!isValid}>
						Enviar
					</Button>
				</form>
			</Form>
		</div>
	);
}
