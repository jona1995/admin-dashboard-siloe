import { z } from 'zod';

export const formSchema = z.object({
	nombre: z.string(),
	descripcion: z.string(),
});
