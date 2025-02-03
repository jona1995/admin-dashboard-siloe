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

import { PaymentFormProps } from './PaymentForm.types';
import { formSchema } from './PaymentForm.form';
import { toast } from '@/components/ui/use-toast';
import { EstadoPago, Plan, Student, TipoPago } from '@prisma/client';
import React from 'react';
import moment from 'moment';

export function PaymentForm(props: PaymentFormProps) {
	const { payment } = props;
	const router = useRouter();
	console.log(payment);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fechaPagoMes: payment.fechaPagoMes,
			monto: payment.monto.toString(),
			estadoPago: payment.estadoPago,
			tipoPago: payment.tipoPago,
			planId: payment.planId.toString(),
			beneficiarios: payment.beneficiarios.map(beneficiario =>
				beneficiario.id.toString()
			),
			pagadorId: payment.pagadorId.toString(),
			comentario: payment.comentario,
		},
	});
	const [students, setStudents] = useState<Student[]>([]);
	// Prepara los datos de los estudiantes para que `react-select` los pueda manejar
	const studentOptions = students.map(student => ({
		value: student.id.toString(), // El ID debe ser el valor que se pasará al formulario
		label: student.nombre, // El nombre será lo que se mostrará en la opción
	}));
	const estados = Object.values(EstadoPago).map(estado => ({
		value: estado,
		label: estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase(), // Capitalizamos el estado
	}));
	// Convertimos los valores del enum TipoPago a un arreglo
	const tipos = Object.values(TipoPago).map(tipo => ({
		value: tipo,
		label: tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase(), // Capitalizamos el tipo
	}));

	const studentsMap = students.map(student => ({
		value: student.id,
		label: student.nombre + ' - ' + student.cedula, // Capitalizamos el tipo
	}));
	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const response = await axios.get<Student[]>('/api/student');
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
		label: plan.nombre + ' - $' + plan.precioFinal, // Capitalizamos el tipo
	}));
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const formattedValues = {
				...values,
				monto: parseFloat(values.monto),
				pagadorId: parseInt(values.pagadorId, 10),
				planId: parseInt(values.planId, 10),
				beneficiarios: values.beneficiarios.map(beneficiario =>
					Number(beneficiario)
				),
			};
			const response = await axios.patch(
				`/api/payment/${payment.id}`,
				formattedValues
			);

			if (response.status === 200) {
				// Aquí obtienes el mensaje de éxito de la API y lo muestras con el toast
				const successMessage =
					response.data.message || 'Pago realizado con éxito';

				toast({
					title: successMessage,
				});

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
						name="estadoPago"
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Estado Pago</FormLabel>
									<FormControl>
										{/* El componente Select de react-select */}
										<Select
											options={estados} // Usamos el array de estados convertidos
											onChange={selectedOption => {
												field.onChange(selectedOption?.value.toString()); // Seleccionamos el valor del estado
											}}
											value={estados.find(
												option => option.value === field.value
											)} // Filtramos la opción seleccionada
											placeholder="Seleccione un estado"
											noOptionsMessage={() => 'No hay estados disponibles'}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
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
												field.onChange(selectedOption?.value.toString()); // Actualizamos el campo con el valor seleccionado
											}}
											value={tipos.find(option => option.value === field.value)} // Filtramos la opción seleccionada
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
											onChange={selectedOption => {
												field.onChange(selectedOption?.value.toString()); // Actualizamos el campo con el valor seleccionado
											}}
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
						name="beneficiarios"
						render={({ field }) => {
							console.log(field);
							return (
								<FormItem>
									<FormLabel>beneficiarios</FormLabel>
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
												field.value?.includes(option.value.toString())
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
													option.value.toString() === field.value.toString()
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
						name="comentario"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Comentario</FormLabel>
								<FormControl>
									<textarea
										placeholder="Comentario..."
										{...field}
										value={field.value ?? ''}
										className="resize-none p-2 border rounded-md w-full h-32" // Estilos personalizados
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit">Editar Pago</Button>
			</form>
		</Form>
	);
}
