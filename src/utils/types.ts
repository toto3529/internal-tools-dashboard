export type ToolStatus = "active" | "unused" | "expiring"

export interface Tool {
	id: number
	name: string
	description: string
	vendor: string
	category: string
	monthly_cost: number
	previous_month_cost: number
	owner_department: string
	status: ToolStatus
	website_url: string
	active_users_count: number
	icon_url: string
	created_at: string
	updated_at: string
}

export interface Analytics {
	budget_overview: {
		monthly_limit: number
		current_month_total: number
		previous_month_total: number
		budget_utilization: string
		trend_percentage: string
	}
	kpi_trends: {
		budget_change: string
		tools_change: string
		departments_change: string
		cost_per_user_change: string
	}
	cost_analytics: {
		cost_per_user: number
		previous_cost_per_user: number
		active_users: number
		total_users: number
	}
}

export interface Department {
	id: number
	name: string
	description: string
	created_at: string
	updated_at: string
}
