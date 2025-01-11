import { z } from 'zod';

export const formSchema = z.object({
	nombre: z.string(),
	apellido: z.string(),
	cedula: z.string(),
	telefono: z.string(),
	email: z.string(),
	iglesia: z.string(),
	localidadIglesia: z.string(),
});
