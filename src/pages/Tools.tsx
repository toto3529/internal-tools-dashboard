import { useOutletContext } from "react-router-dom"
import { Card } from "../components/ui/Card"
import { useTools } from "../hooks/useTools"
import StatusBadge from "../components/ui/StatusBadge"
import { MoreHorizontal } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type { Tool, ToolStatus } from "../utils/types"
import { formatEUR, formatShortDate } from "../utils/format"
import TableStateRow from "../components/ui/TableStateRow"
import ToolIcon from "../components/ui/ToolIcon"
import PaginationFooter from "../components/ui/PaginationFooter"
import { useDepartments } from "../hooks/useDepartments"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiPatch } from "../utils/api"

type SortKey = "name" | "monthly_cost" | "active_users_count"
type SortDir = "asc" | "desc"

function sortTools(tools: Tool[], key: SortKey, dir: SortDir): Tool[] {
	const copy = [...tools]
	copy.sort((a, b) => {
		let res = 0
		if (key === "name") res = a.name.localeCompare(b.name)
		if (key === "monthly_cost") res = (a.monthly_cost ?? 0) - (b.monthly_cost ?? 0)
		if (key === "active_users_count") res = (a.active_users_count ?? 0) - (b.active_users_count ?? 0)
		return dir === "asc" ? res : -res
	})
	return copy
}

export default function Tools() {
	const { searchQuery } = useOutletContext<{ searchQuery: string }>()
	const [statusFilter, setStatusFilter] = useState<"all" | ToolStatus>("all")
	const [departmentFilter, setDepartmentFilter] = useState<string>("all")
	const [categoryFilter, setCategoryFilter] = useState<string>("all")
	const [minCost, setMinCost] = useState<string>("")
	const [maxCost, setMaxCost] = useState<string>("")
	const [selectedIds, setSelectedIds] = useState<number[]>([])
	const departmentsQuery = useDepartments()
	const allToolsQuery = useTools()

	const toolsQuery = useTools({
		status: statusFilter === "all" ? undefined : statusFilter,
		search: searchQuery,
		department: departmentFilter === "all" ? undefined : departmentFilter,
		category: categoryFilter === "all" ? undefined : categoryFilter,
		minCost: minCost.trim() ? Number(minCost) : undefined,
		maxCost: maxCost.trim() ? Number(maxCost) : undefined,
	})

	const pageSize = 10
	const [page, setPage] = useState(1)

	const [sortKey, setSortKey] = useState<SortKey>("monthly_cost")
	const [sortDir, setSortDir] = useState<SortDir>("desc")
	const [openMenuId, setOpenMenuId] = useState<number | null>(null)

	const queryClient = useQueryClient()

	const toggleStatusMutation = useMutation({
		mutationFn: async (tool: Tool) => {
			const nextStatus: ToolStatus = tool.status === "active" ? "unused" : "active"
			return apiPatch<Tool>(`/tools/${tool.id}`, { status: nextStatus })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tools"] })
		},
	})

	const bulkStatusMutation = useMutation({
		mutationFn: async (payload: { ids: number[]; status: ToolStatus }) => {
			await Promise.all(payload.ids.map((id) => apiPatch<Tool>(`/tools/${id}`, { status: payload.status })))
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tools"] })
			setSelectedIds([])
		},
	})

	function toggleSort(key: SortKey) {
		setSortKey((prevKey) => {
			if (prevKey !== key) {
				setSortDir("asc")
				return key
			}
			setSortDir((prevDir) => (prevDir === "asc" ? "desc" : "asc"))
			return prevKey
		})
	}

	function toggleSelect(id: number) {
		setOpenMenuId(null)
		setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
	}

	function isSelected(id: number) {
		return selectedIds.includes(id)
	}

	function toggleSelectAll(ids: number[]) {
		setSelectedIds((prev) => (prev.length === ids.length ? [] : ids))
	}

	useEffect(() => {
		setPage(1)
		setOpenMenuId(null)
	}, [searchQuery, sortKey, sortDir, statusFilter, departmentFilter, categoryFilter, minCost, maxCost])

	const filteredTools = toolsQuery.data ?? []

	const sortedTools = useMemo(() => {
		return sortTools(filteredTools, sortKey, sortDir)
	}, [filteredTools, sortKey, sortDir])

	const departmentOptions = useMemo(() => {
		const deps = departmentsQuery.data ?? []
		return deps.map((d) => d.name).sort((a, b) => a.localeCompare(b))
	}, [departmentsQuery.data])

	const categoryOptions = useMemo(() => {
		const tools = allToolsQuery.data ?? []
		const set = new Set<string>()
		for (const t of tools) set.add(t.category)
		return Array.from(set).sort((a, b) => a.localeCompare(b))
	}, [allToolsQuery.data])

	const totalItems = sortedTools.length
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

	const pagedTools = useMemo(() => {
		const start = (page - 1) * pageSize
		return sortedTools.slice(start, start + pageSize)
	}, [sortedTools, page])

	const showingFrom = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
	const showingTo = Math.min(page * pageSize, totalItems)

	const canPrev = page > 1
	const canNext = page < totalPages
	const isBulkPending = bulkStatusMutation.isPending
	const allPageSelected = pagedTools.length > 0 && pagedTools.every((t) => selectedIds.includes(t.id))

	const DESKTOP_COLS = 9

	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Tools</h1>
				<p className="text-sm text-zinc-500 dark:text-white/45">Browse the full catalog of internal tools, filter by status and review costs.</p>
			</div>

			<Card className="p-0">
				<div className="flex items-start justify-between gap-6 border-b border-white/10 px-6 py-6">
					<div className="min-w-0 space-y-4">
						<div className="text-sm font-semibold text-white">Tools Catalog</div>
						<div className="mt-1 text-xs text-white/45">
							Search: <span className="text-white/70">{searchQuery || "All tools"}</span>
						</div>
						<div className="flex flex-wrap items-end gap-x-6 gap-y-4">
							{/* Status */}
							<div className="flex flex-col gap-1">
								<label className="text-xs text-white/45">Status</label>
								<select
									className="min-w-28 h-9 rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white/80 outline-none hover:bg-white/10"
									value={statusFilter}
									onChange={(e) => setStatusFilter(e.target.value as "all" | ToolStatus)}
								>
									<option className="bg-zinc-950 text-white" value="all">
										All
									</option>
									<option className="bg-zinc-950 text-white" value="active">
										Active
									</option>
									<option className="bg-zinc-950 text-white" value="unused">
										Unused
									</option>
									<option className="bg-zinc-950 text-white" value="expiring">
										Expiring
									</option>
								</select>
							</div>

							{/* Department */}
							<div className="flex flex-col gap-1">
								<label className="text-xs text-white/45">Department</label>
								<select
									className="min-w-40 h-9 rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white/80 outline-none hover:bg-white/10"
									value={departmentFilter}
									onChange={(e) => setDepartmentFilter(e.target.value)}
								>
									<option className="bg-zinc-950 text-white" value="all">
										All
									</option>
									{departmentOptions.map((d) => (
										<option key={d} className="bg-zinc-950 text-white" value={d}>
											{d}
										</option>
									))}
								</select>
							</div>

							{/* Category */}
							<div className="flex flex-col gap-1">
								<label className="text-xs text-white/45">Category</label>
								<select
									className="min-w-40 h-9 rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white/80 outline-none hover:bg-white/10"
									value={categoryFilter}
									onChange={(e) => setCategoryFilter(e.target.value)}
								>
									<option className="bg-zinc-950 text-white" value="all">
										All
									</option>
									{categoryOptions.map((c) => (
										<option key={c} className="bg-zinc-950 text-white" value={c}>
											{c}
										</option>
									))}
								</select>
							</div>

							{/* Cost range */}
							<div className="flex flex-col gap-1">
								<label className="text-xs text-white/45">Cost €</label>
								<div className="flex items-center gap-2">
									<input
										className="w-20 h-9 rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white/80 outline-none placeholder:text-white/30"
										placeholder="Min"
										value={minCost}
										onChange={(e) => setMinCost(e.target.value)}
										inputMode="numeric"
									/>
									<span className="text-white/30">–</span>
									<input
										className="w-20 h-9 rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white/80 outline-none placeholder:text-white/30"
										placeholder="Max"
										value={maxCost}
										onChange={(e) => setMaxCost(e.target.value)}
										inputMode="numeric"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Bulk actions slot — reserved space (desktop/tablet only) */}
				<div className="hidden md:block h-[72px]">
					<div
						className={[
							"flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4 transition-all",
							selectedIds.length > 0 ? "opacity-100" : "pointer-events-none opacity-0",
						].join(" ")}
					>
						<div className="text-sm text-white/70">
							<span className="font-medium text-white">{selectedIds.length}</span> selected
							{isBulkPending ? <span className="ml-2 text-xs text-white/45">Updating…</span> : null}
						</div>

						<div className="flex items-center gap-2">
							<button
								type="button"
								disabled={isBulkPending}
								className={[
									"h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 hover:bg-white/10",
									isBulkPending ? "cursor-not-allowed opacity-50 hover:bg-white/5" : "",
								].join(" ")}
								onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: "active" })}
							>
								Enable
							</button>

							<button
								type="button"
								disabled={isBulkPending}
								className={[
									"h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 hover:bg-white/10",
									isBulkPending ? "cursor-not-allowed opacity-50 hover:bg-white/5" : "",
								].join(" ")}
								onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: "unused" })}
							>
								Disable
							</button>

							<button
								type="button"
								disabled={isBulkPending}
								className={[
									"h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 hover:bg-white/10",
									isBulkPending ? "cursor-not-allowed opacity-50 hover:bg-white/5" : "",
								].join(" ")}
								onClick={() => setSelectedIds([])}
							>
								Clear
							</button>
						</div>
					</div>
				</div>
				{/* Bulk actions (mobile) — inline, no reserved space */}
				{selectedIds.length > 0 ? (
					<div className="md:hidden border-b border-white/10 px-4 py-4">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<div className="text-sm text-white/70">
								<span className="font-medium text-white">{selectedIds.length}</span> selected
								{isBulkPending ? <span className="ml-2 text-xs text-white/45">Updating…</span> : null}
							</div>

							<div className="flex items-center gap-2">
								<button
									type="button"
									disabled={isBulkPending}
									className={[
										"h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 hover:bg-white/10",
										isBulkPending ? "cursor-not-allowed opacity-50 hover:bg-white/5" : "",
									].join(" ")}
									onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: "active" })}
								>
									Enable
								</button>

								<button
									type="button"
									disabled={isBulkPending}
									className={[
										"h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 hover:bg-white/10",
										isBulkPending ? "cursor-not-allowed opacity-50 hover:bg-white/5" : "",
									].join(" ")}
									onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: "unused" })}
								>
									Disable
								</button>

								<button
									type="button"
									disabled={isBulkPending}
									className={[
										"h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 hover:bg-white/10",
										isBulkPending ? "cursor-not-allowed opacity-50 hover:bg-white/5" : "",
									].join(" ")}
									onClick={() => setSelectedIds([])}
								>
									Clear
								</button>
							</div>
						</div>
					</div>
				) : null}

				<div className="md:hidden space-y-3 px-4 py-4">
					{toolsQuery.isLoading ? <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">Loading…</div> : null}

					{toolsQuery.isError ? (
						<div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">Error: {toolsQuery.error.message}</div>
					) : null}

					{toolsQuery.isSuccess && pagedTools.length === 0 ? (
						<div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">No tools found.</div>
					) : null}

					{toolsQuery.isSuccess
						? pagedTools.map((t) => (
								<div key={t.id} className="relative rounded-xl border border-white/10 bg-white/5 p-4 pl-12">
									<label className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center">
										<input
											type="checkbox"
											className="h-3.5 w-3.5 rounded border-white/20 bg-transparent text-white accent-white"
											checked={selectedIds.includes(t.id)}
											onChange={() => toggleSelect(t.id)}
											aria-label={`Select ${t.name}`}
										/>
									</label>
									<div className="flex items-start justify-between gap-3">
										<div className="flex min-w-0 items-start gap-2">
											<div className="shrink-0 h-9 w-9 rounded-lg border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center">
												<ToolIcon name={t.name} iconUrl={t.icon_url} />
											</div>
											<div className="min-w-0">
												<div className="truncate font-medium text-white">{t.name}</div>
												<div className="mt-0.5 truncate text-xs text-white/45">
													{t.category} • {t.owner_department}
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<StatusBadge status={t.status} />

											<div className="relative">
												<button
													type="button"
													className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
													aria-label="Row actions"
													aria-expanded={openMenuId === t.id}
													onClick={() => setOpenMenuId((prev) => (prev === t.id ? null : t.id))}
												>
													<MoreHorizontal className="h-3.5 w-3.5" />
												</button>

												{openMenuId === t.id ? (
													<div className="absolute right-0 top-10 z-10 w-36 rounded-xl border border-white/10 bg-black/80 p-1 shadow-lg backdrop-blur">
														<button
															type="button"
															className="w-full rounded-lg px-3 py-2 text-left text-xs text-white/70 hover:bg-white/10 hover:text-white"
															onClick={() => setOpenMenuId(null)}
														>
															View
														</button>
														<button
															type="button"
															className="w-full rounded-lg px-3 py-2 text-left text-xs text-white/70 hover:bg-white/10 hover:text-white"
															onClick={() => setOpenMenuId(null)}
														>
															Edit
														</button>
														<button
															type="button"
															className="w-full rounded-lg px-3 py-2 text-left text-xs text-white/70 hover:bg-white/10 hover:text-white"
															onClick={() => {
																toggleStatusMutation.mutate(t)
																setOpenMenuId(null)
															}}
														>
															Enable / Disable
														</button>
													</div>
												) : null}
											</div>
										</div>
									</div>
									<div className="mt-3 flex items-center justify-between text-sm text-white/70">
										<div className="min-w-0 truncate">
											<span className="text-xs text-white/45">Dept</span> <span className="text-white/70">{t.owner_department}</span>
										</div>

										<div className="flex items-baseline gap-2 shrink-0">
											<span className="text-xs text-white/45">Cost</span>
											<span>{formatEUR(t.monthly_cost ?? 0)}</span>
										</div>
									</div>
								</div>
							))
						: null}
				</div>
				<div className="hidden md:block overflow-x-auto overflow-y-visible">
					<table className="w-full min-w-3xl text-left text-sm">
						<thead className="text-xs text-white/50">
							<tr className="border-b border-white/10">
								<th className="px-6 py-3 font-medium">
									<div className="flex items-center gap-3">
										<input
											type="checkbox"
											className="accent-white"
											checked={allPageSelected}
											onChange={() => toggleSelectAll(pagedTools.map((t) => t.id))}
										/>
										<button
											type="button"
											onClick={() => toggleSort("name")}
											className="inline-flex items-center gap-2 hover:text-white/80"
											aria-label="Sort by tool name"
										>
											Tool
											{sortKey === "name" ? <span className="text-white/60">{sortDir === "asc" ? "↑" : "↓"}</span> : null}
										</button>
									</div>
								</th>
								<th className="px-6 py-3 font-medium">Status</th>
								<th className="px-6 py-3 font-medium">Department</th>
								<th className="px-6 py-3 font-medium">
									<button
										type="button"
										onClick={() => toggleSort("active_users_count")}
										className="inline-flex items-center gap-2 hover:text-white/80"
										aria-label="Sort by users"
									>
										Users
										{sortKey === "active_users_count" ? <span className="text-white/60">{sortDir === "asc" ? "↑" : "↓"}</span> : null}
									</button>
								</th>
								<th className="px-6 py-3 font-medium">
									<button
										type="button"
										onClick={() => toggleSort("monthly_cost")}
										className="inline-flex items-center gap-2 hover:text-white/80"
										aria-label="Sort by monthly cost"
									>
										Monthly Cost
										{sortKey === "monthly_cost" ? <span className="text-white/60">{sortDir === "asc" ? "↑" : "↓"}</span> : null}
									</button>
								</th>
								<th className="px-6 py-3 font-medium">Category</th>
								<th className="px-6 py-3 font-medium whitespace-nowrap">Last update</th>
								<th className="px-6 py-3 font-medium">Description</th>
								<th className="sticky right-0 px-6 py-3 text-right font-medium bg-zinc-950">Actions</th>
							</tr>
						</thead>
						<tbody>
							{toolsQuery.isLoading ? <TableStateRow colSpan={DESKTOP_COLS}>Loading…</TableStateRow> : null}
							{toolsQuery.isError ? <TableStateRow colSpan={DESKTOP_COLS}>Error: {toolsQuery.error.message}</TableStateRow> : null}
							{toolsQuery.isSuccess && pagedTools.length === 0 ? <TableStateRow colSpan={DESKTOP_COLS}>No tools found.</TableStateRow> : null}
							{toolsQuery.isSuccess
								? pagedTools.map((t) => {
										const isOpen = openMenuId === t.id

										return (
											<tr key={t.id} className="border-b border-white/10 hover:bg-white/5">
												<td className="px-6 py-4">
													<div className="flex items-center gap-3 min-w-0">
														<input
															type="checkbox"
															className="accent-white"
															checked={selectedIds.includes(t.id)}
															onChange={() => toggleSelect(t.id)}
														/>
														<ToolIcon name={t.name} iconUrl={t.icon_url} />
														<div className="min-w-0 max-w-[320px]">
															<div className="truncate font-medium text-white">{t.name}</div>
														</div>
													</div>
												</td>

												<td className="px-6 py-4">
													<StatusBadge status={t.status} />
												</td>

												<td className="px-6 py-4 text-white/70">{t.owner_department}</td>
												<td className="px-6 py-4 text-white/70">{t.active_users_count ?? 0}</td>
												<td className="px-6 py-4 text-white/70">{formatEUR(t.monthly_cost ?? 0)}</td>
												<td className="px-6 py-4 text-white/70">{t.category}</td>
												<td className="px-6 py-4 text-white/70 whitespace-nowrap min-w-32">{formatShortDate(t.updated_at)}</td>

												<td className="px-6 py-4 text-white/70">
													<div className="max-w-sm truncate">{t.description}</div>
												</td>

												<td className={`sticky right-0 relative px-6 py-4 text-right bg-zinc-950 ${isOpen ? "z-50" : "z-20"}`}>
													<button
														type="button"
														className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
														aria-label="Row actions"
														aria-expanded={isOpen}
														onClick={() => setOpenMenuId((prev) => (prev === t.id ? null : t.id))}
													>
														<MoreHorizontal className="h-4 w-4" />
													</button>

													{isOpen ? (
														<div className="absolute right-6 top-14 z-50 w-36 rounded-xl border border-white/10 bg-zinc-950 p-1 shadow-lg backdrop-blur">
															<button
																type="button"
																className="w-full rounded-lg px-3 py-2 text-left text-xs text-white/70 hover:bg-white/10 hover:text-white"
																onClick={() => setOpenMenuId(null)}
															>
																View
															</button>
															<button
																type="button"
																className="w-full rounded-lg px-3 py-2 text-left text-xs text-white/70 hover:bg-white/10 hover:text-white"
																onClick={() => setOpenMenuId(null)}
															>
																Edit
															</button>
															<button
																type="button"
																className="w-full rounded-lg px-3 py-2 text-left text-xs text-white/70 hover:bg-white/10 hover:text-white"
																onClick={() => {
																	toggleStatusMutation.mutate(t)
																	setOpenMenuId(null)
																}}
															>
																Enable / Disable
															</button>
														</div>
													) : null}
												</td>
											</tr>
										)
									})
								: null}
						</tbody>
					</table>
				</div>

				<PaginationFooter
					showingFrom={showingFrom}
					showingTo={showingTo}
					totalItems={totalItems}
					canPrev={canPrev}
					canNext={canNext}
					onPrev={() => setPage((p) => Math.max(1, p - 1))}
					onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
				/>
			</Card>
		</div>
	)
}
