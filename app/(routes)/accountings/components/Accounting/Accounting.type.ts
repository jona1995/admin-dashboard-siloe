// /types/index.ts
export interface Income {
	id: string;
	description: string;
	amount: number;
}

export interface Expense {
	id: string;
	description: string;
	amount: number;
}

export interface Balance {
	total: number;
	incomeTotal: number;
	expenseTotal: number;
}

// /utils/formatters.ts
export const formatCurrency = (amount: number): string =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(amount);

// /utils/api.ts
export async function fetchAccountingData() {
	return {
		income: [
			{ id: '1', description: 'Tuition Fee', amount: 1000 },
			{ id: '2', description: 'Donation', amount: 500 },
		],
		expenses: [
			{ id: '1', description: 'Rent', amount: 800 },
			{ id: '2', description: 'Utilities', amount: 200 },
		],
		balance: {
			total: 500,
			incomeTotal: 1500,
			expenseTotal: 1000,
		},
	};
}
