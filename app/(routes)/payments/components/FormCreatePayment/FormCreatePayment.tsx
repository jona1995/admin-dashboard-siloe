'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
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
import { Input } from '@/components/ui/input';
import { FormCreatePaymentProps } from './FormCreatePayment.types';

import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { EstadoPago, TipoPago } from '../../utils/enum';
import { Course, Enrollment, Plan, Student, User } from '@prisma/client';
import React from 'react';

const formSchema = z.object({
	fechaPagoMes: z.date({
		required_error: 'La fecha  es obligatoria.',
	}),
	fechaPagoRecibo: z.date().optional(), // Ahora no es obligatorio,
	monto: z.number(),
	tipoPago: z.string(),
	beneficiarios: z.array(z.string()),
	pagadorId: z.string(),
	enrollmentId: z.string(),
	comentario: z.string(),
});

export function FormCreatePayment(props: FormCreatePaymentProps) {
	const { setOpenModalCreate } = props;
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fechaPagoMes: undefined,
			fechaPagoRecibo: undefined,
			monto: 0,
			tipoPago: '',
			beneficiarios: [],
			enrollmentId: '',
			pagadorId: '',
			comentario: '',
		},
	});
	// Convertimos los valores del enum TipoPago a un arreglo
	const tipos = Object.values(TipoPago).map(tipo => ({
		value: tipo,
		label: tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase(), // Capitalizamos el tipo
	}));
	const [students, setStudents] = useState<User[]>([]);
	const [studentsAsociados, setStudentsAsociados] = useState<User[]>([]);
	const [inscriptions, setInscriptions] = useState<Enrollment[]>([]);
	const [plan, setPlan] = useState<Plan | null>(null);
	const [courses, setCourses] = useState<Course[]>([]);
	const [selectedPagador, setSelectedPagador] = useState<string | null>(null);
	const [selectedEnrollment, setSelectedEnrollment] = useState<string[]>([]);
	// Maneja la selección de una inscripción
	const handleEnrollmentChange = async (selectedOption: any) => {
		const enrollmentId = selectedOption?.value; // ID de la inscripción seleccionada
		form.setValue('enrollmentId', enrollmentId); // Actualiza el valor en el formulario

		if (enrollmentId) {
			try {
				// Llama a la API para obtener los estudiantes asociados a la inscripción
				const response = await axios.get(
					`/api/enrollment/${enrollmentId}/students`
				);
				const studentsAssociated = response.data; // Lista de estudiantes
				console.log(studentsAssociated);
				// Actualiza el estado local de estudiantes y beneficiarios en el formulario
				setStudentsAsociados(studentsAssociated);
				form.setValue(
					'beneficiarios',
					studentsAssociated.map((student: User) => student.id.toString()) // IDs de estudiantes como strings
				);
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
		} else {
			// Si no hay inscripción seleccionada, limpia los estudiantes
			setStudentsAsociados([]);
			form.setValue('beneficiarios', []); // Limpia los beneficiarios
		}
	};

	// Maneja la selección del pagador
	const handlePagadorChange = async (selectedOption: any) => {
		const pagadorId = selectedOption?.value;
		setSelectedPagador(pagadorId);

		if (pagadorId) {
			try {
				form.setValue('pagadorId', pagadorId);
				// Obtener las inscripciones activas para el pagador seleccionado
				const response = await axios.get(
					`/api/enrollment?studentId=${pagadorId}`
				);
				const inscriptions = response.data; // Inscripciones activas del pagador

				const enrollmentOptions = inscriptions.map(
					(enrollment: Enrollment) => ({
						value: enrollment.id,
						label: enrollment.fechaInscripcionCursoDesde,
					})
				);
				setInscriptions(response.data); // Lista de inscripciones
				form.setValue('enrollmentId', '');

				// Obtener estudiantes asociados a las inscripciones activas
				const studentIds = response.data.flatMap(
					(enrollment: Enrollment) => enrollment.estudianteId
				);
				const studentsResponse = await axios.get('/api/students', {
					params: { studentIds },
				});
				setStudents(studentsResponse.data);

				// // Obtener el plan y cursos asociados a las inscripciones
				// const planResponse = await axios.get(
				// 	`/api/plans?pagadorId=${pagadorId}`
				// );
				// setPlan(planResponse.data);
				// const coursesResponse = await axios.get(
				// 	`/api/courses?planId=${planResponse.data.id}`
				// );
				// setCourses(coursesResponse.data);
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
		} else {
			// Si no hay pagador seleccionado, limpia las inscripciones
			setInscriptions([]);
			form.setValue('enrollmentId', '');
		}
	};

	// Actualiza las inscripciones y beneficiarios
	// useEffect(() => {
	// 	if (selectedPagador) {
	// 		form.setValue(
	// 			'beneficiarios',
	// 			students
	// 				.filter(student => student.enrollment.includes(selectedPagador)) // Filtrar los estudiantes que tienen la inscripción activa
	// 				.map(student => student.id.toString()) // Mapear a un array de IDs en formato string
	// 		);
	// 	}
	// }, [selectedPagador, students]);
	// Prepara los datos de los estudiantes para que `react-select` los pueda manejar
	const studentOptions = students.map(student => ({
		value: student.id.toString(), // El ID debe ser el valor que se pasará al formulario
		label: student.nombre + ' - ' + student.cedula, // El nombre será lo que se mostrará en la opción
	}));
	const incriptionsMap = inscriptions.map(enrollment => ({
		value: enrollment.id.toString(),
		label: enrollment.id.toString(),
	}));
	const studentsMap = students.map(student => ({
		value: student.id.toString(),
		label: student.nombre + ' - ' + student.cedula, // Capitalizamos el tipo
	}));
	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const response = await axios.get<User[]>('/api/student');
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

		fetchSubjects();
	}, []);

	const { isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			console.log('formattedValues');
			const formattedValues = {
				...values,
				enrollmentId: parseInt(values.enrollmentId, 10),
				monto: values.monto,
				pagadorId: parseInt(values.pagadorId, 10),
				beneficiarios: values.beneficiarios.map(
					(beneficiario: string | number) => Number(beneficiario)
				),
			};
			console.log(values);
			console.log(formattedValues);
			const response = await axios.post('/api/payment', formattedValues);

			if (response.status === 200) {
				// Aquí obtienes el mensaje de éxito de la API y lo muestras con el toast
				const successMessage =
					response.data.message || 'Pago realizado con éxito';

				toast({
					title: successMessage,
				});

				setOpenModalCreate(false); // Cerrar el modal después de la operación exitosa
				router.refresh(); // Refrescar la página para obtener los datos actualizados
			} else {
				// Si no es un 200, puedes manejarlo aquí como un error
				throw new Error('Hubo un problema con el pago');
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
							name="fechaPagoMes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fecha Pago Mes</FormLabel>
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
							name="fechaPagoRecibo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fecha Pago Recibo</FormLabel>
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
							name="monto"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Monto Pago</FormLabel>
									<FormControl>
										<Input
											placeholder="Monto Pago..."
											type="number"
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
							name="tipoPago"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Tipo Pago</FormLabel>
										<FormControl>
											{/* El componente Select de react-select para TipoPago */}
											<Select
												options={tipos} // Usamos el array de tipos de pago
												onChange={selectedOption => {
													field.onChange(selectedOption?.value); // Actualizamos el campo con el valor seleccionado
												}}
												value={tipos.find(
													option => option.value === field.value
												)} // Filtramos la opción seleccionada
												placeholder="Seleccione un tipo de pago"
												noOptionsMessage={() =>
													'No hay tipos de pago disponibles'
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
							name="pagadorId"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Pagador</FormLabel>
										<FormControl>
											{/* El componente Select de react-select para TipoPago */}
											<Select
												options={studentsMap} // Usamos el array de tipos de pago
												onChange={handlePagadorChange}
												value={studentsMap.find(
													option =>
														option.value.toString() === field.value.toString()
												)} // Filtramos la opción seleccionada
												placeholder="Seleccione un tipo de pago"
												noOptionsMessage={() =>
													'No hay tipos de pago disponibles'
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
							name="enrollmentId"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Inscripciones</FormLabel>
										<FormControl>
											<Select
												options={incriptionsMap} // Opciones de inscripciones
												onChange={selectedOption => {
													handleEnrollmentChange(selectedOption); // Llama al método
												}}
												value={incriptionsMap.find(
													option =>
														option.value.toString() === field.value.toString()
												)} // Filtra la opción seleccionada
												placeholder="Seleccione una inscripción"
												noOptionsMessage={() =>
													'No hay inscripciones disponibles'
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						{/* Mostrar el campo solo si la inscripción seleccionada tiene beneficiarios */}
						{studentsAsociados.length > 0 && (
							<FormField
								control={form.control}
								name="beneficiarios"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Beneficiarios</FormLabel>
											<FormControl>
												<Select
													isMulti
													options={studentsAsociados.map(student => ({
														value: student.id.toString(),
														label: `${student.nombre} - ${student.cedula}`,
													}))}
													onChange={selectedOptions => {
														const selectedIds = selectedOptions.map(
															option => option.value
														);
														field.onChange(selectedIds);
													}}
													value={studentsAsociados
														.map(student => ({
															value: student.id.toString(),
															label: `${student.nombre} - ${student.cedula}`,
														}))
														.filter(option =>
															field.value?.includes(option.value)
														)}
													placeholder="Seleccione estudiantes"
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
						)}

						<FormField
							control={form.control}
							name="comentario"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Comentario</FormLabel>
									<FormControl>
										<textarea
											placeholder="Comentario..."
											{...field}
											className="resize-none p-2 border rounded-md w-full h-32" // Puedes personalizar estos estilos
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button type="submit">Enviar</Button>
				</form>
			</Form>
		</div>
	);
}
// disabled={!isValid}
