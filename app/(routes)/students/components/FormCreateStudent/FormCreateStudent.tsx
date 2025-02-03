'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
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
import { FormCreateStudentProps } from './FormCreateStudent.types';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
	nombre: z.string().min(1, { message: 'El nombre es obligatorio.' }),
	apellido: z.string().min(1, { message: 'El apellido es obligatorio.' }),
	cedula: z.string().min(1, { message: 'La cédula es obligatoria.' }),
	email: z.string().email({ message: 'Debe ser un email válido.' }).optional(),
	telefono: z.string().min(1, { message: 'El teléfono es obligatorio.' }),
	iglesia: z.string().min(1, { message: 'La iglesia es obligatoria.' }),
	localidadIglesia: z
		.string()
		.min(1, { message: 'La localidad iglesia es obligatoria.' }),
});

export function FormCreateStudent(props: FormCreateStudentProps) {
	const { setOpenModalCreate } = props;
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre: '',
			apellido: '',
			cedula: '',
			email: '',
			telefono: '',
			iglesia: '',
			localidadIglesia: '',
		},
	});

	const { isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const response = await axios.post('/api/user', values);

			if (response.status === 200) {
				// Aquí obtienes el mensaje de éxito de la API y lo muestras con el toast
				const successMessage =
					response.data.message || 'Estudiante realizado con éxito';

				toast({
					title: successMessage,
				});

				setOpenModalCreate(false); // Cerrar el modal después de la operación exitosa
				router.refresh(); // Refrescar la página para obtener los datos actualizados
			} else {
				// Si no es un 200, puedes manejarlo aquí como un error
				throw new Error('Hubo un problema con el estudiante');
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
							name="nombre"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombres</FormLabel>
									<FormControl>
										<Input placeholder="Nombres..." type="text" {...field} />
									</FormControl>
									<FormMessage />
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
									<FormMessage />
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
							name="telefono"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Telefono</FormLabel>
									<FormControl>
										<Input placeholder="Telefono" type="number" {...field} />
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
										<Input
											placeholder="Localidad Iglesia"
											type="text"
											{...field}
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
