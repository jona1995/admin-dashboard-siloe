import { z } from 'zod';

export const formSchema = z.object({
	nombre: z.string(),
	descripcion: z.string(),
	duracion: z.number(),
	revenuePercentage: z.number(),
	subjects: z.array(z.string()),
});
