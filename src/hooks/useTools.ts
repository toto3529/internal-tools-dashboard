import { useQuery } from "@tanstack/react-query"
import type { Tool, ToolStatus } from "../utils/types"
import { apiGet } from "../utils/api"

export type ToolsQuery = {
	limit?: number
	sortBy?: "updated_at" | "monthly_cost" | "name"
	order?: "asc" | "desc"
	status?: ToolStatus
	search?: string
	department?: string
	category?: string
}

function buildToolsPath(q: ToolsQuery): string {
	const params = new URLSearchParams()

	if (q.status) params.set("status", q.status)
	if (q.search && q.search.trim().length > 0) params.set("name_like", q.search.trim())
	if (q.department && q.department.trim().length > 0) params.set("owner_department", q.department.trim())
	if (q.category && q.category.trim().length > 0) params.set("category", q.category.trim())
	if (q.sortBy) params.set("_sort", q.sortBy)
	if (q.order) params.set("_order", q.order)
	if (typeof q.limit === "number") params.set("_limit", String(q.limit))

	const qs = params.toString()
	return `/tools${qs ? `?${qs}` : ""}`
}

export function useTools(query: ToolsQuery = {}) {
	const path = buildToolsPath(query)

	return useQuery({
		queryKey: ["tools", path],
		queryFn: () => apiGet<Tool[]>(path),
		staleTime: 30_000,
	})
}
