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
import { EstadoPago, TipoPago } from '../../utils/enum';
import { Plan, Student } from '@prisma/client';
import React from 'react';

const formSchema = z.object({
	fechaPagoMes: z.date({
		required_error: 'La fecha  es obligatoria.',
	}),
	monto: z.string().min(1, { message: 'El monto es obligatorio.' }),
	estadoPago: z.string().min(1, { message: 'El estado es obligatorio.' }),
	tipoPago: z.string().min(1, { message: 'El tipo es obligatorio.' }),
	beneficiarios: z.array(z.string()),
	pagadorId: z.string().min(1, { message: 'El pagador es obligatorio.' }),
	planId: z.string(),
	comentario: z.string(),
});

export function FormCreateCustomer(props: FormCreateCustomerProps) {
	const { setOpenModalCreate } = props;
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fechaPagoMes: undefined,
			monto: '',
			estadoPago: '',
			tipoPago: '',
			beneficiarios: [],
			pagadorId: '',
			planId: '',
			comentario: '',
		},
	});

	const [selectedStudent, setSelectedStudent] = useState(null);
	const [selectedEnrollment, setSelectedEnrollment] = useState(null);
	const [beneficiaries, setBeneficiaries] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);

	const handleStudentChange = async selectedOption => {
		setSelectedStudent(selectedOption);
		fetchEnrollments(selectedOption.value);
	};

	const fetchEnrollments = async studentId => {
		try {
			const response = await axios.get(`/api/student/${studentId}/enrollments`);
			const activeEnrollments = response.data.filter(
				enrollment => enrollment.estado === 'activo'
			);
			if (activeEnrollments.length === 0) {
				setTotalAmount(0);
			} else {
				setSelectedEnrollment(activeEnrollments[0]);
				calculateTotal(activeEnrollments[0]);
			}
		} catch (error) {
			console.error('Error al obtener las inscripciones:', error);
		}
	};

	const calculateTotal = enrollment => {
		if (enrollment.planId) {
			setTotalAmount(enrollment.plan.monto); // Si tiene plan, monto del plan
		} else {
			const total = enrollment.courses.reduce((acc, course) => {
				return acc + course.price;
			}, 0);
			setTotalAmount(total); // Si no tiene plan, suma de precios de cursos
		}
	};

	const handleEnrollmentChange = selectedOption => {
		setSelectedEnrollment(selectedOption);
		calculateTotal(selectedOption);
	};

	const handleBeneficiaryChange = selectedOptions => {
		setBeneficiaries(selectedOptions);
	};

	const [students, setStudents] = useState<Student[]>([]);
	// Prepara los datos de los estudiantes para que `react-select` los pueda manejar
	const studentOptions = students.map(student => ({
		value: student.id.toString(), // El ID debe ser el valor que se pasará al formulario
		label: student.nombre + ' - ' + student.cedula, // El nombre será lo que se mostrará en la opción
	}));
	console.log(EstadoPago);
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
				console.error('Error fetching students:', error);
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
				console.error('Error fetching planes:', error);
			}
		};

		fetchPlanes();
	}, []);
	const planesMap = planes.map(plan => ({
		value: plan.id,
		label: plan.nombre + ' - $' + plan.precioFinal, // Capitalizamos el tipo
	}));
	const { isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const formattedValues = {
				...values,
				monto: parseFloat(values.monto),
				pagadorId: parseInt(values.pagadorId, 10),
				planId: parseInt(values.planId, 10),
				beneficiarios: values.beneficiarios.map(
					(beneficiario: string | number) => Number(beneficiario)
				),
			};
			console.log(formattedValues);
			await axios.post('/api/payment', formattedValues);
			toast({ title: 'Pago Creado' });
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
							name="monto"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Monto Pago</FormLabel>
									<FormControl>
										<Input
											placeholder="Monto Pago..."
											type="number"
											{...field}
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
								console.log('Current value:', field.value);
								return (
									<FormItem>
										<FormLabel>Estado Pago</FormLabel>
										<FormControl>
											{/* El componente Select de react-select */}
											<Select
												options={estados} // Usamos el array de estados convertidos
												onChange={selectedOption => {
													console.log('Selected option:', selectedOption);
													field.onChange(selectedOption?.value.toString()); // Seleccionamos el valor del estado
												}}
												value={estados.find(
													option =>
														option.value.toString() === field.value.toString()
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
											className="resize-none p-2 border rounded-md w-full h-32" // Puedes personalizar estos estilos
										/>
									</FormControl>
									<FormMessage />
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
