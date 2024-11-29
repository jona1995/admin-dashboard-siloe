import { Company } from '@prisma/client';

export type CalenderProps = {
	companies: Company[];
	events: Event[];
};
