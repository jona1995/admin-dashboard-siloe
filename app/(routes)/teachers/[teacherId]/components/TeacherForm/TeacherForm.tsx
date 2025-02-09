'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
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

import { Input } from '@/components/ui/input';
import { Toast } from '@/components/ui/toast';

import { TeacherFormProps } from './TeacherForm.types';
import { formSchema } from './TeacherForm.form';
import { toast } from '@/components/ui/use-toast';
import { Subject } from '@prisma/client';

export function TeacherForm(props: TeacherFormProps) {
	const { teacher } = props;
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre: teacher.user.nombre,
			apellido: teacher.user.apellido,
			cedula: teacher.user.cedula,
			telefono: teacher.user.telefono,
			email: teacher.user.email,
			iglesia: teacher.user.iglesia,
			localidadIglesia: teacher.user.localidadIglesia,
			subjects: teacher.subjects.map(subject => subject.id.toString()),
		},
	});
	const [subjects, setSubjects] = useState<Subject[]>([]); // Estado para
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
				// Asegurarse de que `error` es un AxiosError
				if (error instanceof AxiosError) {
					const errorMessage =
						error.response?.data?.message || 'Algo salió mal';

					toast({
						title: errorMessage, // Mostrar el mensaje de error recibido desde la API
						variant: 'destructive',
					});
				} else {
					toast({
						title: 'Something went wrong',
						variant: 'destructive',
					});
				}
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
			const response = await axios.patch(
				`/api/teacher/${teacher.user.id}`,
				formattedValues
			);
			if (response.status === 200) {
				// Aquí obtienes el mensaje de éxito de la API y lo muestras con el toast
				const successMessage =
					response.data.message || 'Profesor realizado con éxito';

				toast({
					title: successMessage,
				});

				router.refresh(); // Refrescar la página para obtener los datos actualizados
			} else {
				// Si no es un 200, puedes manejarlo aquí como un error
				throw new Error('Hubo un problema con el profesor');
			}
		} catch (error) {
			// Asegurarse de que `error` es un AxiosError
			if (error instanceof AxiosError) {
				const errorMessage = error.response?.data?.message || 'Algo salió mal';

				toast({
					title: errorMessage, // Mostrar el mensaje de error recibido desde la API
					variant: 'destructive',
				});
			} else {
				toast({
					title: 'Something went wrong',
					variant: 'destructive',
				});
			}
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
						name="apellido"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Apellidos</FormLabel>
								<FormControl>
									<Input placeholder="Apellidos..." type="text" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="cedula"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Cedula</FormLabel>
								<FormControl>
									<Input placeholder="Cedula..." type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="telefono"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Telefono</FormLabel>
								<FormControl>
									<Input placeholder="Telefono" type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Email" type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="iglesia"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Iglesia</FormLabel>
								<FormControl>
									<Input placeholder="Iglesia" type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="localidadIglesia"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Localidad Iglesia</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Localidad Iglesia..."
										{...field}
										value={form.getValues().localidadIglesia ?? ''}
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
				<Button type="submit">Editar Profesor</Button>
			</form>
		</Form>
	);
}
