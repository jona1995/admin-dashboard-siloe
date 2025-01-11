import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Header } from './components/Header';
import { CourseFooter } from './components/CourseFooter';
import { CourseInformation } from './components/CourseInformation';

export default async function CourseIdPage({
	params,
}: {
	params: { courseId: string };
}) {
	const { userId } = auth();

	if (!userId) {
		return redirect('/');
	}
	console.log(params.courseId);
	const course = await db.course.findUnique({
		where: {
			id: parseInt(params.courseId, 10),
		},
		include: { subjects: true },
	});

	console.log(course);
	if (!course) {
		return redirect('/');
	}

	return (
		<div>
			<Header />
			<CourseInformation course={course} />
			<CourseFooter courseId={course.id} />
		</div>
	);
}
