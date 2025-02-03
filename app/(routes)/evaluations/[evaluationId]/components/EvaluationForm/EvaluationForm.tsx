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
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Toast } from '@/components/ui/toast';

import { EvaluationFormProps } from './EvaluationForm.types';
import { formSchema } from './EvaluationForm.form';
import { toast } from '@/components/ui/use-toast';
import { Student, Subject, Teacher } from '@prisma/client';
import { Tipo } from '../../../utils/enum';
import moment from 'moment';
import { StudentWithUser } from '@/app/(routes)/students/components/ListStudents/modelos';
import { TeacherWithUser } from '@/app/(routes)/teachers/components/ListTeacher/modelos';

export function EvaluationForm(props: EvaluationFormProps) {
	const { evaluation } = props;
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre: evaluation.descripcion,
			descripcion: evaluation.descripcion,
			tipo: evaluation.tipo,
			fecha: evaluation.fecha,
			teacherId: evaluation.teacherId.toString(),
			subjectId: evaluation.subjectId.toString(),
			estudianteId: evaluation.estudianteId.toString(),
			nota: evaluation.nota,
			comentario: evaluation.comentario,
		},
	});

	const [students, setStudents] = useState<StudentWithUser[]>([]); // Estado para
	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const response = await axios.get<StudentWithUser[]>('/api/student');

				console.log(response.data); // Log the response data
				setStudents(response.data);
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

		fetchStudents();
	}, []);
	const studentsMap = students.map(student => ({
		value: student.id,
		label: student.user.nombre + ' - ' + student.user.cedula, // Capitalizamos el tipo
	}));

	const [teachers, setTeachers] = useState<TeacherWithUser[]>([]); // Estado para
	useEffect(() => {
		const fetchTeachers = async () => {
			try {
				const response = await axios.get<TeacherWithUser[]>('/api/teacher');

				console.log(response.data); // Log the response data
				setTeachers(response.data);
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

		fetchTeachers();
	}, []);
	const teachersMap = teachers.map(teacher => ({
		value: teacher.user.id,
		label: teacher.user.nombre + ' - ' + teacher.user.cedula, // Capitalizamos el tipo
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
	const subjectOptions = subjects.map(subject => ({
		value: subject.id.toString(), // El ID debe ser el valor que se pasará al formulario
		label: subject.nombre, // El nombre será lo que se mostrará en la opción
	}));
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const formattedValues = {
				...values,
				subjectId: parseInt(values.subjectId, 10), // Convertimos subjects a números
				estudianteId: parseInt(values.estudianteId, 10), // Convertimos estudiantes a números
				teacherId: parseInt(values.teacherId, 10),
			};
			const response = await axios.patch(
				`/api/evaluation/${evaluation.id}`,
				formattedValues
			);
			if (response.status === 200) {
				// Aquí obtienes el mensaje de éxito de la API y lo muestras con el toast
				const successMessage =
					response.data.message || 'Evaluacion realizado con éxito';

				toast({
					title: successMessage,
				});

				router.refresh(); // Refrescar la página para obtener los datos actualizados
			} else {
				// Si no es un 200, puedes manejarlo aquí como un error
				throw new Error('Hubo un problema con el evaluacion');
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
												? moment(field.value).local().format('YYYY-MM-DD') // Formatear con moment
												: ''
										}
										onChange={e =>
											field.onChange(
												e.target.value
													? moment(e.target.value, 'YYYY-MM-DD').toDate()
													: undefined
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
											value={tipos.find(option => option.value === field.value)} // Filtramos la opción seleccionada
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
											noOptionsMessage={() => 'No hay estudiantes disponibles'}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<FormField
						control={form.control}
						name="teacherId"
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Profesor</FormLabel>
									<FormControl>
										{/* El componente Select de react-select para TipoPago */}
										<Select
											options={teachersMap} // Usamos el array de tipos de pago
											onChange={selectedOption => {
												console.log(field);
												field.onChange(selectedOption?.value.toString()); // Actualizamos el campo con el valor seleccionado
											}}
											value={teachersMap.find(
												option =>
													option.value.toString() === field.value.toString()
											)} // Filtramos la opción seleccionada
											placeholder="Seleccione profesor"
											noOptionsMessage={() => 'No hay profesores disponibles'}
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
										min={1} // Límite inferior
										max={10} // Límite superior
										step={1} // Incrementos de 1
										{...field}
										onChange={e => {
											const value = Number(e.target.value);
											// Validar que el valor esté dentro del rango permitido
											if (value >= 1 && value <= 10) {
												field.onChange(value);
											} else if (value < 1) {
												field.onChange(1); // Ajustar al mínimo
											} else if (value > 10) {
												field.onChange(10); // Ajustar al máximo
											}
										}}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit">Editar Evaluacion</Button>
			</form>
		</Form>
	);
}
