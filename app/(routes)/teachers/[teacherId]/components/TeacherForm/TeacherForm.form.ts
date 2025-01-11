import { z } from 'zod';

export const formSchema = z.object({
	nombre: z.string(),
	apellido: z.string(),
	telefono: z.string(),
	email: z.string(),
});
