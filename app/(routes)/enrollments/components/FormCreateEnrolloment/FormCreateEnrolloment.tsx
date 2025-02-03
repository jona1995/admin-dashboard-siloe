'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Select from 'react-select'; // Importa react-select
import { z } from 'zod';
import axios, { AxiosError } from 'axios';

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
import { FormCreateEnrollomentProps } from './FormCreateEnrolloment.types';

import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Course, Plan, Student } from '@prisma/client';
import React from 'react';
import { EstadoIncripcion, ModalidadEstudio } from '../../utils/type';
import moment from 'moment';
import { StudentWithUser } from '@/app/(routes)/students/components/ListStudents/modelos';

const formSchema = z.object({
	fechaInscripcion: z.date({
		required_error: 'La fecha  es obligatoria.',
	}),
	fechaInscripcionCursoDesde: z.date({
		required_error: 'La fecha  es obligatoria.',
	}),
	fechaInscripcionCursoHasta: z.date().optional(),
	courses: z.array(z.string()),
	estudianteId: z.string().min(1, { message: 'El estudiante es obligatorio.' }),
	estado: z.string().min(1, { message: 'El estado es obligatorio.' }),
	modalidad: z.string().min(1, { message: 'La modalidad es obligatorio.' }),
	planId: z.string(),
	estudiantesAsociados: z.array(z.string()),
});

export function FormCreateEnrolloment(props: FormCreateEnrollomentProps) {
	const { setOpenModalCreate } = props;
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fechaInscripcion: undefined,
			fechaInscripcionCursoDesde: undefined,
			fechaInscripcionCursoHasta: undefined,
			courses: [],
			estudianteId: '',
			estado: '',
			modalidad: '',
			planId: '',
			estudiantesAsociados: [],
		},
	});
	const [students, setStudents] = useState<StudentWithUser[]>([]);

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
	// Prepara los datos de los estudiantes para que `react-select` los pueda manejar
	const studentOptions = students.map(student => ({
		value: student.id.toString(), // El ID debe ser el valor que se pasará al formulario
		label: student.nombre + ' - ' + student.cedula, // El nombre será lo que se mostrará en la opción
	}));

	const studentsMap = students.map(student => ({
		value: student.id,
		label: student.nombre + ' - ' + student.cedula, // Capitalizamos el tipo
	}));
	const [courses, setCourses] = useState<Course[]>([]); // Estado para
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await axios.get<Course[]>('/api/course');

				console.log(response.data); // Log the response data
				setCourses(response.data);
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

		fetchCourses();
	}, []);
	const coursesMap = courses.map(course => ({
		value: course.id.toString(),
		label: course.nombre, // Capitalizamos el tipo
	}));

	const estadoIncripciones = Object.values(EstadoIncripcion).map(estado => ({
		value: estado,
		label: estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase(), // Capitalizamos el estado
	}));
	const modalidadEstudios = Object.values(ModalidadEstudio).map(modalidad => ({
		value: modalidad,
		label: modalidad.charAt(0).toUpperCase() + modalidad.slice(1).toLowerCase(), // Capitalizamos el estado
	}));

	const [planes, setPlanes] = useState<Plan[]>([]); // Estado para
	useEffect(() => {
		const fetchPlanes = async () => {
			try {
				const response = await axios.get<Plan[]>('/api/plan');

				console.log(response.data); // Log the response data
				setPlanes(response.data);
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

		fetchPlanes();
	}, []);
	const planesMap = planes.map(plan => ({
		value: plan.id,
		label: plan.nombre, // Capitalizamos el tipo
	}));
	const { isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const formattedValues = {
				...values,
				estudiantesAsociados: values.estudiantesAsociados.map(
					(estudiante: string | number) => Number(estudiante)
				),
				estudianteId: parseInt(values.estudianteId, 10), // Convertimos estudiantes a números
				planId: parseInt(values.planId, 10),
				courses: values.courses.map((course: string | number) =>
					Number(course)
				),
			};
			console.log(formattedValues);
			const response = await axios.post('/api/enrollment', formattedValues);

			if (response.status === 200) {
				// Aquí obtienes el mensaje de éxito de la API y lo muestras con el toast
				const successMessage =
					response.data.message || 'Inscripcion realizado con éxito';

				toast({
					title: successMessage,
				});

				setOpenModalCreate(false); // Cerrar el modal después de la operación exitosa
				router.refresh(); // Refrescar la página para obtener los datos actualizados
			} else {
				// Si no es un 200, puedes manejarlo aquí como un error
				throw new Error('Hubo un problema con el inscripcion');
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
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid grid-cols-2 gap-3">
						<FormField
							control={form.control}
							name="fechaInscripcion"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fecha Inscripción</FormLabel>
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
							name="fechaInscripcionCursoDesde"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fecha Inscripción Desde</FormLabel>
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
							name="fechaInscripcionCursoHasta"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fecha Inscripción Hasta</FormLabel>
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
							name="estado"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Estado</FormLabel>
										<FormControl>
											{/* El componente Select de react-select */}
											<Select
												options={estadoIncripciones} // Usamos el array de estados convertidos
												onChange={selectedOption => {
													field.onChange(selectedOption?.value); // Seleccionamos el valor del estado
												}}
												value={estadoIncripciones.find(
													option => option.value === field.value
												)} // Filtramos la opción seleccionada
												placeholder="Seleccione un estado"
												noOptionsMessage={() => 'No hay estado disponibles'}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						<FormField
							control={form.control}
							name="modalidad"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Modalidad</FormLabel>
										<FormControl>
											{/* El componente Select de react-select */}
											<Select
												options={modalidadEstudios} // Usamos el array de estados convertidos
												onChange={selectedOption => {
													field.onChange(selectedOption?.value); // Seleccionamos el valor del estado
												}}
												value={modalidadEstudios.find(
													option => option.value === field.value
												)} // Filtramos la opción seleccionada
												placeholder="Seleccione una modalidad"
												noOptionsMessage={() => 'No hay modalidad disponibles'}
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
							name="courses"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Cursos</FormLabel>
										<FormControl>
											{/* El componente Select de react-select */}
											<Select
												isMulti // Habilita la selección múltiple
												options={coursesMap} // Lista de opciones de estudiantes
												onChange={selectedOptions => {
													// `selectedOptions` es un array con las opciones seleccionadas
													const selectedIds = selectedOptions.map(
														option => option.value
													);
													field.onChange(selectedIds); // Guarda los IDs seleccionados
												}}
												value={coursesMap.filter(option =>
													field.value?.includes(option.value)
												)} // Filtra las opciones seleccionadas
												placeholder="Seleccione curso"
												noOptionsMessage={() => 'No hay cursos disponibles'} // Mensaje cuando no hay opciones
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						<FormField
							control={form.control}
							name="planId"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Plan</FormLabel>
										<FormControl>
											<Select
												options={planesMap}
												onChange={selectedOption => {
													field.onChange(
														selectedOption?.value?.toString() || ''
													);
												}}
												value={
													planesMap.find(
														option =>
															option.value.toString() === field.value.toString()
													) || null
												}
												placeholder="Seleccione un plan"
												noOptionsMessage={() => 'No hay planes disponibles'}
												isClearable // ✅ Habilita la opción de limpiar con una "X"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						{/* Mostrar el campo de estudiantes asociados solo si se ha seleccionado un plan */}
						{form.watch('planId') && (
							<FormField
								control={form.control}
								name="estudiantesAsociados"
								render={({ field }) => {
									// Obtener el estudiante seleccionado en el primer Select
									const selectedStudentId = form.watch('estudianteId');

									// Filtrar los estudiantes activos excluyendo el seleccionado
									const filteredStudentOptions = studentOptions.filter(
										student => student.value !== selectedStudentId
									);

									return (
										<FormItem>
											<FormLabel>Estudiantes Asociados al Plan</FormLabel>
											<FormControl>
												{/* El componente Select de react-select */}
												<Select
													isMulti // Habilita la selección múltiple
													options={filteredStudentOptions} // Lista de opciones de estudiantes
													onChange={selectedOptions => {
														// `selectedOptions` es un array con las opciones seleccionadas
														const selectedIds = selectedOptions.map(
															option => option.value
														);
														field.onChange(selectedIds); // Guarda los IDs seleccionados
													}}
													value={studentOptions.filter(option =>
														field.value?.includes(option.value)
													)} // Filtra las opciones seleccionadas
													placeholder="Seleccione estudiantes"
													noOptionsMessage={() =>
														'No hay estudiantes disponibles'
													} // Mensaje cuando no hay opciones
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
						)}
					</div>
					<Button type="submit" disabled={!isValid}>
						Enviar
					</Button>
				</form>
			</Form>
		</div>
	);
}
