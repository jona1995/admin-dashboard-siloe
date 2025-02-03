'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Select from 'react-select'; // Importa react-select
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { EnrollmentFormProps } from './EnrollmentForm.types';
import { formSchema } from './EnrollmentForm.form';
import { toast } from '@/components/ui/use-toast';
import { Course, Plan, Student } from '@prisma/client';
import { EstadoIncripcion, ModalidadEstudio } from '../../../utils/type';
import moment from 'moment';
import { StudentWithUser } from '@/app/(routes)/students/components/ListStudents/modelos';

export function EnrollmentForm(props: EnrollmentFormProps) {
	const { enrollment } = props;
	const router = useRouter();
	console.log(enrollment);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			estudianteId: enrollment.estudianteId.toString(),
			courses: enrollment.courses.map(course => course.id.toString()),
			fechaInscripcionCursoDesde: enrollment.fechaInscripcionCursoDesde,
			fechaInscripcionCursoHasta:
				enrollment.fechaInscripcionCursoHasta || undefined,
			estado: enrollment.estado,
			planId: enrollment.planId ? enrollment.planId.toString() : undefined,
			modalidad: enrollment.modalidad,
			estudiantesAsociados: [],
			// enrollment.estudiantesAsociados.map(
			// 	estudianteAsociado => beneficiario.id.toString()
			// ),
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
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const formattedValues = {
				...values,
				estudianteId: parseInt(values.estudianteId, 10), // Convertimos estudiantes a números
				planId: parseInt(values.planId, 10),
				courses: values.courses.map(course => Number(course)),
			};
			console.log(enrollment);
			const response = await axios.patch(
				`/api/enrollment/${enrollment.id}`,
				formattedValues
			);
			if (response.status === 200) {
				// Aquí obtienes el mensaje de éxito de la API y lo muestras con el toast
				const successMessage =
					response.data.message || 'Inscripcion realizado con éxito';

				toast({
					title: successMessage,
				});

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
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid grid-cols-2 gap-3">
					<FormField
						control={form.control}
						name="fechaInscripcionCursoDesde"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Fecha Incripcion Desde</FormLabel>
								<FormControl>
									<input
										type="date"
										className="w-full px-3 py-2 border rounded-md"
										value={
											field.value
												? moment(field.value).local().format('YYYY-MM-DD') // Formatear con moment
												: ''
										}
										onChange={e => {
											const selectedDate = e.target.value
												? moment(e.target.value, 'YYYY-MM-DD').toDate()
												: undefined;

											console.log('Fecha seleccionada:', selectedDate); // Mostrar la fecha en consola
											field.onChange(selectedDate);
										}}
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
								<FormLabel>Fecha Incripcion hasta</FormLabel>
								<FormControl>
									<input
										type="date"
										className="w-full px-3 py-2 border rounded-md"
										value={
											field.value
												? moment(field.value).local().format('YYYY-MM-DD') // Formatear con moment
												: ''
										}
										onChange={e => {
											const selectedDate = e.target.value
												? moment(e.target.value, 'YYYY-MM-DD').toDate()
												: undefined;

											console.log('Fecha seleccionada:', selectedDate); // Mostrar la fecha en consola
											field.onChange(selectedDate);
										}}
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
						name="estudiantesAsociados"
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Estudiante Asociados al Plan</FormLabel>
									<FormControl>
										{/* El componente Select de react-select */}
										<Select
											isMulti // Habilita la selección múltiple
											options={studentOptions} // Lista de opciones de estudiantes
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
											noOptionsMessage={() => 'No hay estudiantes disponibles'} // Mensaje cuando no hay opciones
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
										{/* El componente Select de react-select para TipoPago */}
										<Select
											options={planesMap} // Usamos el array de tipos de pago
											onChange={selectedOption => {
												field.onChange(selectedOption?.value.toString()); // Actualizamos el campo con el valor seleccionado
											}}
											value={planesMap.find(
												option =>
													option.value.toString() ===
													(field.value ? field.value.toString() : undefined)
											)} // Filtramos la opción seleccionada
											placeholder="Seleccione un plan"
											noOptionsMessage={() => 'No hay planes disponibles'}
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
												field.value?.includes(option.value.toString())
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
				</div>
				<Button type="submit">Editar Incripcion</Button>
			</form>
		</Form>
	);
}
