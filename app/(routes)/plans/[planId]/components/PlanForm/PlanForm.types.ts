import { Plan } from '@prisma/client';

type PlansWithItems = Plan & {
	items: {
		cursoId: string;
		cantidad: number;
		descuento: number;
	}[];
};

export type PlanFormProps = {
	plan: PlansWithItems;
};
