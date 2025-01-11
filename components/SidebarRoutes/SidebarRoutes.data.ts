import {
	BarChart4,
	Building2,
	PanelsTopLeft,
	Settings,
	ShieldCheck,
	CircleHelpIcon,
	Calendar,
	DollarSign,
	Users,
	GraduationCap,
	LibraryBig,
	UsersRound,
	UserCheck,
	NotebookPen,
	BookText,
	BookOpenText,
	CircleDollarSign,
	CirclePercent,
} from 'lucide-react';

export const dataGeneralSidebar = [
	{
		icon: PanelsTopLeft,
		label: 'Dashboard',
		href: '/',
	},
	{
		icon: Users,
		label: 'Estudiantes',
		href: '/students',
	},
	{
		icon: UserCheck,
		label: 'Profesores',
		href: '/teachers',
	},
	{
		icon: LibraryBig,
		label: 'Materias',
		href: '/subjects',
	},
	{
		icon: CirclePercent,
		label: 'Planes',
		href: '/plans',
	},
	{
		icon: BookOpenText,
		label: 'Cursos',
		href: '/courses',
	},

	{
		icon: BookText,
		label: 'Inscripciones',
		href: '/enrollments',
	},
	{
		icon: NotebookPen,
		label: 'Evaluaciones',
		href: '/evaluations',
	},
	{
		icon: GraduationCap,
		label: 'Calificaciones',
		href: '/qualifications',
	},
	{
		icon: DollarSign,
		label: 'Pagos',
		href: '/payments',
	},
	{
		icon: CircleDollarSign,
		label: 'Contabilidad',
		href: '/accountings',
	},

	// {
	// 	icon: Building2,
	// 	label: 'Companies',
	// 	href: '/companies',
	// },
];

export const dataToolsSidebar = [
	{
		icon: CircleHelpIcon,
		label: 'Faqs',
		href: '/faqs',
	},
	{
		icon: BarChart4,
		label: 'Analytics',
		href: '/analytics',
	},
];

export const dataSupportSidebar = [
	{
		icon: Settings,
		label: 'Setting',
		href: '/setting',
	},
	{
		icon: ShieldCheck,
		label: 'Security',
		href: '/security',
	},
];
