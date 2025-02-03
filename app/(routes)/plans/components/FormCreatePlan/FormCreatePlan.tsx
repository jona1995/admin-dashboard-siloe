'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
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
import { FormCreatePlanProps } from './FormCreatePlan.types';

import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { strict } from 'assert';
import { Course } from '@prisma/client';

const formSchema = z.object({
	nombre: z.string().min(1, { message: 'El nombre es obligatorio.' }),
	descripcion: z.string(),
	precioFinal: z.number().min(1, { message: 'El precio es obligatorio.' }),
	items: z.array(
		z.object({
			cursoId: z.string(),
			cantidad: z.number().min(1, 'La cantidad debe ser mayor a 0'),
			descuento: z
				.number()
				.min(0)
				.max(100, 'El descuento debe estar entre 0 y 100'),
		})
	),
});

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

export function FormCreatePlan(props: FormCreatePlanProps) {
	const { setOpenModalCreate } = props;
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre: '',
			descripcion: '',
			precioFinal: 0,
			items: [],
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
	const [precioFinal, setPrecioFinal] = useState(0);
	const [hasDiscount, setHasDiscount] = useState(false); // Estado para saber si el plan tiene descuento

	const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setHasDiscount(e.target.value === 'yes');
		// Limpiar el precio final si el plan tiene descuento
		// if (hasDiscount) {
		//   setPrecioFinal(0);
		// } else {
		//   // Puedes decidir si deseas recalcular el precio aquí o mantener el valor ingresado
		//   // setPrecioFinal(ValorDefault);  // O asignar el valor calculado previamente si lo deseas
		// }
	};
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
		// Actualizar precioFinal en el formulario usando setValue
		form.setValue('precioFinal', total);
		console.log(total);
	};
	const { isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			console.log(values);
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

			const response = await axios.post('/api/plan', preparedData);

			if (response.status === 200) {
				// Aquí obtienes el mensaje de éxito de la API y lo muestras con el toast
				const successMessage =
					response.data.message || 'Plan realizado con éxito';

				toast({
					title: successMessage,
				});

				setOpenModalCreate(false); // Cerrar el modal después de la operación exitosa
				router.refresh(); // Refrescar la página para obtener los datos actualizados
			} else {
				// Si no es un 200, puedes manejarlo aquí como un error
				throw new Error('Hubo un problema con el plan');
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
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
					onChange={() => calculateTotalPrice(form.getValues())}
				>
					<div className="grid grid-cols-2 gap-3">
						{/* Otros campos */}
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
											disabled={hasDiscount} // Deshabilitar si tiene descuento
											{...field}
											value={field.value} // El valor debe venir del form
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

					{/* Opción para seleccionar si tiene descuento */}
					<div className="my-4">
						<FormLabel>¿Este plan tiene cursos con descuento?</FormLabel>
						<div>
							<label className="mr-4">
								<input
									type="radio"
									name="discountOption"
									value="yes"
									onChange={handleDiscountChange}
									checked={hasDiscount}
								/>
								Sí, tiene descuento
							</label>
							<label>
								<input
									type="radio"
									name="discountOption"
									value="no"
									onChange={handleDiscountChange}
									checked={!hasDiscount}
								/>
								No, no tiene descuento
							</label>
						</div>
					</div>

					{/* Mostrar los cursos solo si tiene descuento */}
					{hasDiscount && (
						<div>
							<h3 className="text-lg font-medium">Cursos</h3>
							{fields.length === 0 && (
								<p className="text-gray-500">
									No hay cursos asociados al plan.
								</p>
							)}
							{fields.map((item, index) => (
								<div
									key={item.id}
									className="grid grid-cols-4 gap-4 items-end mb-4"
								>
									<FormField
										control={form.control}
										name={`items.${index}.cursoId`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Cursos</FormLabel>
												<FormControl>
													<Select
														options={coursesMap}
														onChange={selectedOption => {
															field.onChange(selectedOption?.value);
														}}
														value={coursesMap.find(
															option => option.value === field.value
														)}
														placeholder="Seleccione curso"
														noOptionsMessage={() => 'No hay cursos disponibles'}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
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
														onChange={e =>
															field.onChange(Number(e.target.value))
														}
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
														onChange={e =>
															field.onChange(Number(e.target.value))
														}
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
								onClick={() =>
									append({ cursoId: '', cantidad: 1, descuento: 0 })
								}
							>
								+ Añadir Curso
							</Button>
							{/* Mostrar el precio final con descuento */}
							<div className="mt-4">
								<h3 className="text-lg font-medium">
									Precio Final con Descuento: ${precioFinal.toFixed(2)}
								</h3>
							</div>
						</div>
					)}

					<Button type="submit">Crear Plan</Button>
				</form>
			</Form>
		</div>
	);
}
// disabled={!form.formState.isValid}
