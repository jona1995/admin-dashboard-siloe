import Image from 'next/image';
import { SubjectInformationProps } from './SubjectInformation.types';
import { User } from 'lucide-react';
import { SubjectForm } from '../SubjectForm';

export function SubjectInformation(props: SubjectInformationProps) {
	const { subject } = props;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 gap-y-4">
			<div className="p-4 rounded-lg shadow-md bg-background hover:shadow-lg">
				<div>
					<SubjectForm subject={subject} />
				</div>
			</div>
			{/* <div className="p-4 rounded-lg shadow-md bg-background hover:shadow-lg h-min">
				<div className="flex items-center justify-between gap-x-2">
					<div className="flex items-center gap-x-2">
						<User className="w-5 h-5" />
						Contacts
					</div>
					<div>
						<NewContact />
					</div>
				</div>
				<ListContacts company={student} />
			</div> */}
		</div>
	);
}
