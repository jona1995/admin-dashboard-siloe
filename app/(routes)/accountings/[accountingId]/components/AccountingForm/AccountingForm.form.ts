import { z } from 'zod';

export const formSchema = z.object({
	descripcion: z.string(),
	fecha: z.date(),
	tipo: z.string(),
	monto: z.number(),
});
