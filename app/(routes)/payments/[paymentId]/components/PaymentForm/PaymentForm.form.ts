import { z } from 'zod';

export const formSchema = z.object({
	fechaPagoMes: z.date({
		required_error: 'La fecha  es obligatoria.',
	}),
	monto: z.string().min(1, { message: 'El monto es obligatorio.' }),
	estadoPago: z.string().min(1, { message: 'El estado es obligatorio.' }),
	tipoPago: z.string().min(1, { message: 'El tipo es obligatorio.' }),
	beneficiarios: z.array(z.string()),
	pagadorId: z.string().min(1, { message: 'El pagador es obligatorio.' }),
	planId: z.string(),
	comentario: z.string().nullable(),
});
