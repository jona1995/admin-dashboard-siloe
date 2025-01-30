import { z } from 'zod';

export const formSchema = z.object({
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
