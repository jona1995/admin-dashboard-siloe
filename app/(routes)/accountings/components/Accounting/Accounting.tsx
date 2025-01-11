// app/(routes)/accounting/page.tsx
import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import {
	Balance,
	Expense,
	fetchAccountingData,
	formatCurrency,
	Income,
} from './Accounting.type';

const AccountingPage: NextPage = () => {
	const [income, setIncome] = useState<Income[]>([]);
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [balance, setBalance] = useState<Balance | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				const data = await fetchAccountingData(); // Simulación de llamada API
				setIncome(data.income);
				setExpenses(data.expenses);
				setBalance(data.balance);
			} catch (error) {
				console.error('Error fetching accounting data:', error);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	if (loading) {
		return <p className="text-center text-gray-500">Loading...</p>;
	}

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<h1 className="text-3xl font-bold text-center text-blue-600">
				Accounting Dashboard
			</h1>

			<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{/* Card de Balance */}
				<div className="p-4 bg-white rounded shadow">
					<h2 className="text-xl font-semibold text-green-500">Balance</h2>
					<p className="text-2xl font-bold">
						{formatCurrency(balance?.total || 0)}
					</p>
				</div>

				{/* Card de Ingresos */}
				<div className="p-4 bg-white rounded shadow">
					<h2 className="text-xl font-semibold text-green-600">Ingresos</h2>
					<p className="text-2xl font-bold">
						{formatCurrency(balance?.incomeTotal || 0)}
					</p>
				</div>

				{/* Card de Egresos */}
				<div className="p-4 bg-white rounded shadow">
					<h2 className="text-xl font-semibold text-red-500">Egresos</h2>
					<p className="text-2xl font-bold">
						{formatCurrency(balance?.expenseTotal || 0)}
					</p>
				</div>
			</div>

			{/* Listado de Ingresos */}
			<div className="mt-8">
				<h2 className="text-2xl font-bold text-gray-700">
					Detalle de Ingresos
				</h2>
				<ul className="mt-4">
					{income.map(inc => (
						<li key={inc.id} className="p-2 border-b">
							<span>{inc.description}</span> -{' '}
							<span>{formatCurrency(inc.amount)}</span>
						</li>
					))}
				</ul>
			</div>

			{/* Listado de Egresos */}
			<div className="mt-8">
				<h2 className="text-2xl font-bold text-gray-700">Detalle de Egresos</h2>
				<ul className="mt-4">
					{expenses.map(exp => (
						<li key={exp.id} className="p-2 border-b">
							<span>{exp.description}</span> -{' '}
							<span>{formatCurrency(exp.amount)}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default AccountingPage;
