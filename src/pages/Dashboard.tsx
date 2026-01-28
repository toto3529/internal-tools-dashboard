import { TrendingUp, Wrench, Building2, Users } from "lucide-react"
import KpiCard from "../components/dashboard/KpiCard"
import RecentToolsTable from "../components/dashboard/RecentToolsTable"

export default function Dashboard() {
	return (
		<div className="space-y-8">
			<h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Dashboard</h1>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<KpiCard label="Monthly Budget" value="€28,750" subValue="/€30k" badgeText="+12%" variant="green" icon={<TrendingUp className="h-5 w-5" />} />

				<KpiCard label="Active Tools" value="147" badgeText="+8" variant="blue" icon={<Wrench className="h-5 w-5" />} />

				<KpiCard label="Departments" value="8" badgeText="+2" variant="red" icon={<Building2 className="h-5 w-5" />} />

				<KpiCard label="Cost / User" value="€156" badgeText="-€12" variant="pink" icon={<Users className="h-5 w-5" />} />
			</div>

			<RecentToolsTable />
		</div>
	)
}
