import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Header } from './components/Header';
import { TeacherInformation } from './components/TeacherInformation';
import { TeacherFooter } from './components/TeacherFooter';

export default async function TeacherIdPage({
	params,
}: {
	params: { teacherId: string };
}) {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}
	const teacher = await db.teacher.findUnique({
		where: {
			id: parseInt(params.teacherId, 10),
		},
		include: { subjects: true },
	});

	if (!teacher) {
		return redirect('/');
	}

	return (
		<div>
			<Header />
			<TeacherInformation teacher={teacher} />
			<TeacherFooter teacherId={teacher.id} />
		</div>
	);
}
