'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

import { PlanFormProps } from './PlanForm.types';
import { toast } from '@/components/ui/use-toast';
import { formSchema } from './PlanForm.form';
import { Course } from '@prisma/client';
type PlanFormValues = {
	nombre: string;
	descripcion: string;
	precioFinal: Number;
	items?: {
		cursoId: string;
		cantidad: number;
		descuento: number;
	}[];
};

export function PlanForm(props: PlanFormProps) {
	const { plan } = props;
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre: plan.nombre,
			descripcion: plan.descripcion,
			precioFinal: plan.precioFinal,
			items: plan.items,
		},
	});
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'items',
	});
	// Recalcular el precio final al eliminar un curso
	const handleRemoveCourse = (index: number) => {
		remove(index);
		calculateTotalPrice(form.getValues()); // Recalcular el precio final después de eliminar el curso
	};

	const [courses, setCourses] = useState<Course[]>([]); // Estado para
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await axios.get<Course[]>('/api/course');

				console.log(response.data); // Log the response data
				setCourses(response.data);
			} catch (error) {
				console.error('Error fetching courses:', error);
			}
		};

		fetchCourses();
	}, []);
	const coursesMap = courses.map(course => ({
		value: course.id.toString(),
		label: course.nombre, // Capitalizamos el tipo
	}));
	const [precioFinal, setPrecioFinal] = useState(0);

	// Función para calcular el precio final
	const calculateTotalPrice = (values: PlanFormValues) => {
		const total =
			values.items?.reduce((sum, item) => {
				const course = courses.find(c => c.id === parseInt(item.cursoId));
				if (!course) return sum;
				const discountedPrice =
					course.precio * item.cantidad * (1 - item.descuento / 100);
				return sum + discountedPrice;
			}, 0) || 0;
		setPrecioFinal(total);
	};
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const preparedData = {
				...values,
				items:
					values.items.length > 0
						? {
								create: values.items.map(item => ({
									...item,
									cursoId: Number(item.cursoId), // Asegurarse de que cursoId sea un número
								})),
						  }
						: undefined,
			};
			await axios.patch(`/api/plan/${plan.id}`, preparedData);
			toast({
				title: 'Plan actualizado!',
			});
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
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
					onChange={() => calculateTotalPrice(form.getValues())}
				>
					<div className="grid grid-cols-2 gap-3">
						<FormField
							control={form.control}
							name="nombre"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre del Plan</FormLabel>
									<FormControl>
										<Input placeholder="Nombre..." type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="precioFinal"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Precio</FormLabel>
									<FormControl>
										<Input
											placeholder="Precio..."
											type="number"
											{...field}
											value={
												field.value !== undefined ? field.value : precioFinal
											} // Muestra el valor calculado si no hay valor del usuario
											onChange={e => {
												const newValue = e.target.value
													? Number(e.target.value)
													: precioFinal;
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
							name="descripcion"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descripción</FormLabel>
									<FormControl>
										<Input
											placeholder="Descripción..."
											type="text"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div>
						<h3 className="text-lg font-medium">Cursos</h3>
						{fields.length === 0 && (
							<p className="text-gray-500">No hay cursos asociados al plan.</p>
						)}
						{fields.map((item, index) => (
							<div
								key={item.id}
								className="grid grid-cols-4 gap-4 items-end mb-4"
							>
								<FormField
									control={form.control}
									name={`items.${index}.cursoId`}
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>Cursos</FormLabel>
												<FormControl>
													{/* El componente Select de react-select */}
													<Select
														options={coursesMap} // Usamos el array de estados convertidos
														onChange={selectedOption => {
															field.onChange(selectedOption?.value); // Seleccionamos el valor del estado
														}}
														value={coursesMap.find(
															option => option.value === field.value
														)} // Filtramos la opción seleccionada
														placeholder="Seleccione curso"
														noOptionsMessage={() => 'No hay cursos disponibles'}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
								<FormField
									control={form.control}
									name={`items.${index}.cantidad`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Cantidad</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Cantidad"
													min={1}
													{...field}
													onChange={e => field.onChange(Number(e.target.value))}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`items.${index}.descuento`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Descuento (%)</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Descuento"
													min={0}
													max={100}
													{...field}
													onChange={e => field.onChange(Number(e.target.value))}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<Button
									type="button"
									variant="destructive"
									onClick={() => handleRemoveCourse(index)}
								>
									Eliminar
								</Button>
							</div>
						))}
						<Button
							type="button"
							onClick={() => append({ cursoId: '', cantidad: 1, descuento: 0 })}
						>
							+ Añadir Curso
						</Button>
					</div>

					<div className="mt-4">
						<h3 className="text-lg font-medium">
							Precio Final con Descuento: ${precioFinal.toFixed(2)}
						</h3>
					</div>
					<Button type="submit">Crear Plan</Button>
				</form>
			</Form>
		</div>
	);
}
