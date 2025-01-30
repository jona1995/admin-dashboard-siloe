import { Plan } from '@prisma/client';

// export type PlanFormProps = {
// 	plan: Plan;
// };

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
