import { z } from 'zod';

export const formSchema = z.object({
	fechaPago: z.date(),
	monto: z.string(),
	estadoPago: z.string(),
	tipoPago: z.string(),
	beneficiarios: z.array(z.string()),
	pagadorId: z.string(),
	planId: z.string(),
	comentario: z.string().nullable(),
});
