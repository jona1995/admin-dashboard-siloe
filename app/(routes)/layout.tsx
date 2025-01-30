import { Sidebar } from '@/components/Sidebar';
import GlobalLoader from './globalLoader/globalLoader';
import { Navbar } from '@/components/Navbar';

export default function LayoutDashboard({
	children,
}: {
	children: React.ReactElement;
}) {
	return (
		<div className="flex w-full h-full">
			{/* Sidebar */}
			<div className="hidden xl:block w-80 h-full fixed">
				<Sidebar />
			</div>

			{/* Main Content */}
			<div className="w-full xl:pl-80 h-full overflow-auto">
				<Navbar />
				<div className="p-6 bg-[#fafbfc] dark:bg-secondary min-h-full">
					{/* Componente GlobalLoader que envolverá todo */}
					<GlobalLoader>{children}</GlobalLoader>
				</div>
			</div>
		</div>
	);
}
