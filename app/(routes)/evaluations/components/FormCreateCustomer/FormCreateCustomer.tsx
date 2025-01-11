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
import { Student, Subject } from '@prisma/client';
import { Tipo } from '../../utils/enum';

const formSchema = z.object({
	nombre: z.string(),
	descripcion: z.string(),
	tipo: z.string(),
	fecha: z.date(),
	subjectId: z.string(),
	estudianteId: z.string(),
	nota: z.number(),
	comentario: z.string(),
});

export function FormCreateCustomer(props: FormCreateCustomerProps) {
	const { setOpenModalCreate } = props;
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre: '',
			descripcion: '',
			tipo: '',
			fecha: undefined,
			subjectId: '',
			estudianteId: '',
			nota: undefined,
			comentario: '',
		},
	});
	const [students, setStudents] = useState<Student[]>([]); // Estado para
	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const response = await axios.get<Student[]>('/api/student');

				console.log(response.data); // Log the response data
				setStudents(response.data);
			} catch (error) {
				console.error('Error fetching students:', error);
			}
		};

		fetchStudents();
	}, []);
	const studentsMap = students.map(student => ({
		value: student.id,
		label: student.nombre, // Capitalizamos el tipo
	}));
	const tipos = Object.values(Tipo).map(tipo => ({
		value: tipo,
		label: tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase(), // Capitalizamos el estado
	}));
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
			const formattedValues = {
				...values,
				subjectId: parseInt(values.subjectId, 10), // Convertimos subjects a números
				estudianteId: parseInt(values.estudianteId, 10), // Convertimos estudiantes a números
			};
			await axios.post('/api/evaluation', formattedValues);
			toast({ title: 'Evaluacion Creada' });
			setOpenModalCreate(false);
			router.refresh();
		} catch (error) {
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
										<Input
											placeholder="Descripcion..."
											type="text"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="fecha"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fecha</FormLabel>
									<FormControl>
										<input
											type="date"
											className="w-full px-3 py-2 border rounded-md"
											value={
												field.value
													? new Date(field.value).toISOString().split('T')[0]
													: ''
											}
											onChange={e =>
												field.onChange(
													e.target.value ? new Date(e.target.value) : undefined
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
							name="tipo"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Tipo</FormLabel>
										<FormControl>
											{/* El componente Select de react-select */}
											<Select
												options={tipos} // Usamos el array de estados convertidos
												onChange={selectedOption => {
													field.onChange(selectedOption?.value); // Seleccionamos el valor del estado
												}}
												value={tipos.find(
													option => option.value === field.value
												)} // Filtramos la opción seleccionada
												placeholder="Seleccione un tipo"
												noOptionsMessage={() => 'No hay tipo disponibles'}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="estudianteId"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Estudiante</FormLabel>
										<FormControl>
											{/* El componente Select de react-select para TipoPago */}
											<Select
												options={studentsMap} // Usamos el array de tipos de pago
												onChange={selectedOption => {
													console.log(field);
													field.onChange(selectedOption?.value.toString()); // Actualizamos el campo con el valor seleccionado
												}}
												value={studentsMap.find(
													option =>
														option.value.toString() === field.value.toString()
												)} // Filtramos la opción seleccionada
												placeholder="Seleccione estudiante"
												noOptionsMessage={() =>
													'No hay estudiantes disponibles'
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="subjectId"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Materias</FormLabel>
										<FormControl>
											{/* El componente Select de react-select para TipoPago */}
											<Select
												options={subjectOptions} // Usamos el array de tipos de pago
												onChange={selectedOption => {
													console.log(field);
													field.onChange(selectedOption?.value.toString()); // Actualizamos el campo con el valor seleccionado
												}}
												value={subjectOptions.find(
													option =>
														option.value.toString() === field.value.toString()
												)} // Filtramos la opción seleccionada
												placeholder="Seleccione Materia"
												noOptionsMessage={() => 'No hay Materiases disponibles'}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						<FormField
							control={form.control}
							name="nota"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nota</FormLabel>
									<FormControl>
										<Input
											placeholder="Nota..."
											type="number"
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
					</div>
					<Button type="submit" disabled={!isValid}>
						Enviar
					</Button>
				</form>
			</Form>
		</div>
	);
}
