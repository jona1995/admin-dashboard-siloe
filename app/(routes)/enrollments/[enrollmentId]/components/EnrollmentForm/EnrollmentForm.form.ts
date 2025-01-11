import { z } from 'zod';

export const formSchema = z.object({
	estudianteId: z.string(),
	courses: z.array(z.string()),
	fechaInscripcion: z.date(),
	estado: z.string(),
	modalidad: z.string(),
	planId: z.string(),
});
