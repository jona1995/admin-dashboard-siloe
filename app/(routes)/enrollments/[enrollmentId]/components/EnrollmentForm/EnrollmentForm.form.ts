import { z } from 'zod';

export const formSchema = z.object({
	fechaInscripcionCursoDesde: z.date({
		required_error: 'La fecha  es obligatoria.',
	}),
	fechaInscripcionCursoHasta: z.date(),
	courses: z.array(z.string()),
	estudianteId: z.string().min(1, { message: 'El estudiante es obligatorio.' }),
	estado: z.string().min(1, { message: 'El estado es obligatorio.' }),
	modalidad: z.string().min(1, { message: 'La modalidad es obligatorio.' }),
	planId: z.string(),
	estudiantesAsociados: z.array(z.string()),
});
