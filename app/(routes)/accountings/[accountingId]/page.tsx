import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Header } from './components/Header';
import { AccountingFooter } from './components/AccountingFooter';
import { AccountingInformation } from './components/AccountingInformation';

export default async function AccountingIdPage({
	params,
}: {
	params: { accountingId: string };
}) {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}
	const accounting = await db.financialTransaction.findUnique({
		where: {
			id: parseInt(params.accountingId, 10),
		},
	});

	if (!accounting) {
		return redirect('/');
	}

	return (
		<div>
			<Header />
			<AccountingInformation accounting={accounting} />
			<AccountingFooter accountingId={accounting.id} />
		</div>
	);
}
