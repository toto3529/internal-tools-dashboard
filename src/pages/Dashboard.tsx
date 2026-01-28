import { TrendingUp, Wrench, Building2, Users } from "lucide-react"
import KpiCard from "../components/dashboard/KpiCard"
import RecentToolsTable from "../components/dashboard/RecentToolsTable"
import { useOutletContext } from "react-router-dom"
import { useAnalytics } from "../hooks/useAnalytics"
import { useActiveToolsCount, useDepartmentsCount } from "../hooks/useCounts"
import { formatEUR } from "../utils/format"

export default function Dashboard() {
	const { searchQuery } = useOutletContext<{ searchQuery: string }>()

	const analyticsState = useAnalytics()
	const activeToolsState = useActiveToolsCount()
	const departmentsState = useDepartmentsCount()

	const analytics = analyticsState.status === "success" ? analyticsState.data : null
	const activeTools = activeToolsState.status === "success" ? activeToolsState.count : null
	const departments = departmentsState.status === "success" ? departmentsState.count : null

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Internal Tools Dashboard</h1>
				<p className="mt-1 text-sm text-zinc-500 dark:text-white/45">Monitor and manage your organization&apos;s software tools and expenses</p>
			</div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<KpiCard
					label="Monthly Budget"
					value={analytics ? formatEUR(analytics.budget_overview.current_month_total) : "—"}
					subValue={analytics ? `/€${Math.round(analytics.budget_overview.monthly_limit / 1000)}k` : undefined}
					badgeText={analytics ? `${analytics.kpi_trends.budget_change}` : undefined}
					variant="green"
					icon={<TrendingUp className="h-5 w-5" />}
					progressValue={analytics?.budget_overview.current_month_total}
					progressMax={analytics?.budget_overview.monthly_limit}
				/>

				<KpiCard
					label="Active Tools"
					value={typeof activeTools === "number" ? String(activeTools) : "—"}
					badgeText={analytics ? analytics.kpi_trends.tools_change : undefined}
					variant="blue"
					icon={<Wrench className="h-5 w-5" />}
				/>

				<KpiCard
					label="Departments"
					value={typeof departments === "number" ? String(departments) : "—"}
					badgeText={analytics ? analytics.kpi_trends.departments_change : undefined}
					variant="red"
					icon={<Building2 className="h-5 w-5" />}
				/>

				<KpiCard
					label="Cost / User"
					value={analytics ? `€${analytics.cost_analytics.cost_per_user}` : "—"}
					badgeText={analytics ? analytics.kpi_trends.cost_per_user_change : undefined}
					variant="pink"
					icon={<Users className="h-5 w-5" />}
				/>
			</div>

			<RecentToolsTable searchQuery={searchQuery} />
		</div>
	)
}
