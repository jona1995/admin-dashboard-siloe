import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Header } from './components/Header';
import { SubjectInformation } from './components/Subjectnformation';
import { SubjectFooter } from './components/SubjectFooter';

export default async function SubjectIdPage({
	params,
}: {
	params: { subjectId: string };
}) {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}
	const subject = await db.subject.findUnique({
		where: {
			id: parseInt(params.subjectId, 10),
		},
	});

	if (!subject) {
		return redirect('/');
	}

	return (
		<div>
			<Header />
			<SubjectInformation subject={subject} />
			<SubjectFooter subjectId={subject.id} />
		</div>
	);
}
