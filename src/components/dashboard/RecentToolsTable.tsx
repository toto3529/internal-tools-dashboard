import { useMemo, useState } from "react"
import { Card } from "../ui/Card"
import StatusBadge from "../ui/StatusBadge"
import { Calendar, MoreHorizontal } from "lucide-react"
import type { Tool } from "../../utils/types"
import { useRecentTools } from "../../hooks/useRecentTools"
import { formatEUR } from "../../utils/format"
import TableStateRow from "../ui/TableStateRow"
import ToolIcon from "../ui/ToolIcon"
import PaginationFooter from "../ui/PaginationFooter"
import { DEFAULT_PAGE_SIZE } from "../../styles/constants"

type ToolStatus = "active" | "expiring" | "unused"

type RecentToolRow = {
	id: string
	name: string
	department: string
	users: number
	monthlyCost: number
	status: ToolStatus
	iconUrl?: string
}

type SortKey = "name" | "monthlyCost" | "users"
type SortDir = "asc" | "desc"

function mapToolToRow(t: Tool): RecentToolRow {
	return {
		id: String(t.id),
		name: t.name,
		department: t.owner_department,
		users: t.active_users_count ?? 0,
		monthlyCost: typeof t.monthly_cost === "number" ? t.monthly_cost : 0,
		status: t.status,
		iconUrl: t.icon_url,
	}
}

export default function RecentToolsTable({ searchQuery = "" }: { searchQuery?: string }) {
	const RECENT_TOOLS_LIMIT = 8
	const toolsState = useRecentTools(RECENT_TOOLS_LIMIT)
	const pageSize = DEFAULT_PAGE_SIZE
	const [page, setPage] = useState(1)

	const [sortKey, setSortKey] = useState<SortKey>("monthlyCost")
	const [sortDir, setSortDir] = useState<SortDir>("desc")
	const [openMenuId, setOpenMenuId] = useState<string | null>(null)

	function toggleSort(key: SortKey) {
		setPage(1)
		setSortKey((prevKey) => {
			if (prevKey !== key) {
				setSortDir("asc")
				return key
			}
			setSortDir((prevDir) => (prevDir === "asc" ? "desc" : "asc"))
			return prevKey
		})
	}

	const apiRows: RecentToolRow[] = useMemo(() => {
		if (toolsState.status !== "success") return []
		return toolsState.data.map(mapToolToRow)
	}, [toolsState.status, toolsState.data])

	const filteredRows = useMemo(() => {
		const q = searchQuery.trim().toLowerCase()
		if (!q) return apiRows
		return apiRows.filter((r) => r.name.toLowerCase().includes(q) || r.department.toLowerCase().includes(q) || r.status.toLowerCase().includes(q))
	}, [searchQuery, apiRows])

	const sortedRows = useMemo(() => {
		const copy = [...filteredRows]
		copy.sort((a, b) => {
			let res = 0
			if (sortKey === "name") res = a.name.localeCompare(b.name)
			if (sortKey === "monthlyCost") res = a.monthlyCost - b.monthlyCost
			if (sortKey === "users") res = a.users - b.users
			return sortDir === "asc" ? res : -res
		})
		return copy
	}, [filteredRows, sortKey, sortDir])

	const totalItems = sortedRows.length
	const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize))

	const pagedRows = useMemo(() => {
		const start = (page - 1) * pageSize
		return sortedRows.slice(start, start + pageSize)
	}, [sortedRows, page])

	const showingFrom = sortedRows.length === 0 ? 0 : (page - 1) * pageSize + 1
	const showingTo = Math.min(page * pageSize, sortedRows.length)

	const canPrev = page > 1
	const canNext = page < totalPages
	const DESKTOP_COLS = 6

	return (
		<Card className="p-0">
			<div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
				<div className="min-w-0">
					<div className="text-sm font-semibold text-white">Recent Tools</div>
				</div>

				<button type="button" className="inline-flex items-center gap-2 text-xs font-medium text-white/60 hover:text-white/80 transition-colors">
					<Calendar className="h-4 w-4" />
					Last 30 days
				</button>
			</div>

			<div className="md:hidden space-y-3 px-4 py-4">
				{toolsState.status === "loading" ? (
					<div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">Loading…</div>
				) : null}

				{toolsState.status === "error" ? (
					<div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">Error: {toolsState.error.message}</div>
				) : null}

				{toolsState.status === "success" && pagedRows.length === 0 ? (
					<div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">No tools found.</div>
				) : null}

				{toolsState.status === "success"
					? pagedRows.map((row) => (
							<div key={row.id} className="relative rounded-xl border border-white/10 bg-white/5 p-4">
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<div className="truncate font-medium text-white">{row.name}</div>
										<div className="mt-1 text-xs text-white/45">{row.department}</div>
									</div>

									<div className="flex items-center gap-2">
										<StatusBadge status={row.status} />

										<div className="relative">
											<button
												type="button"
												className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
												aria-label="Row actions"
												aria-expanded={openMenuId === row.id}
												onClick={() => setOpenMenuId((prev) => (prev === row.id ? null : row.id))}
											>
												<MoreHorizontal className="h-4 w-4" />
											</button>

											{openMenuId === row.id ? (
												<div
													className="absolute right-0 top-10 z-10 w-36 rounded-xl border border-white/10 bg-black/80 p-1 shadow-lg backdrop-blur"
													onMouseLeave={() => setOpenMenuId(null)}
												>
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
														onClick={() => setOpenMenuId(null)}
													>
														Delete
													</button>
												</div>
											) : null}
										</div>
									</div>
								</div>

								<div className="mt-3 grid grid-cols-2 gap-3 text-sm text-white/70">
									<div>
										<div className="text-xs text-white/45">Users</div>
										<div className="mt-0.5">{row.users}</div>
									</div>
									<div className="text-right">
										<div className="text-xs text-white/45">Monthly Cost</div>
										<div className="mt-0.5">{formatEUR(row.monthlyCost)}</div>
									</div>
								</div>
							</div>
						))
					: null}
			</div>

			<div className="hidden md:block overflow-x-auto">
				<table className="w-full min-w-3xl text-left text-sm">
					<thead className="text-xs text-white/50">
						<tr className="border-b border-white/10">
							<th className="px-6 py-3 font-medium">
								<button
									type="button"
									onClick={() => toggleSort("name")}
									className="inline-flex items-center gap-2 hover:text-white/80"
									aria-label="Sort by tool name"
								>
									Tool
									{sortKey === "name" ? <span className="text-white/60">{sortDir === "asc" ? "↑" : "↓"}</span> : null}
								</button>
							</th>
							<th className="px-6 py-3 font-medium">Department</th>
							<th className="px-6 py-3 font-medium">
								<button
									type="button"
									onClick={() => toggleSort("users")}
									className="inline-flex items-center gap-2 hover:text-white/80"
									aria-label="Sort by users"
								>
									Users
									{sortKey === "users" ? <span className="text-white/60">{sortDir === "asc" ? "↑" : "↓"}</span> : null}
								</button>
							</th>

							<th className="px-6 py-3 font-medium">
								<button
									type="button"
									onClick={() => toggleSort("monthlyCost")}
									className="inline-flex items-center gap-2 hover:text-white/80"
									aria-label="Sort by monthly cost"
								>
									Monthly Cost
									{sortKey === "monthlyCost" ? <span className="text-white/60">{sortDir === "asc" ? "↑" : "↓"}</span> : null}
								</button>
							</th>
							<th className="px-6 py-3 font-medium">Status</th>
							<th className="px-6 py-3 text-right font-medium">Actions</th>
						</tr>
					</thead>

					<tbody>
						{toolsState.status === "loading" ? <TableStateRow colSpan={DESKTOP_COLS}>Loading…</TableStateRow> : null}

						{toolsState.status === "error" ? <TableStateRow colSpan={DESKTOP_COLS}>Error:</TableStateRow> : null}

						{toolsState.status === "success" && pagedRows.length === 0 ? <TableStateRow colSpan={DESKTOP_COLS}>No tools found.</TableStateRow> : null}

						{toolsState.status === "success"
							? pagedRows.map((row) => {
									return (
										<tr key={row.id} className="border-b border-white/10 hover:bg-white/5">
											<td className="px-6 py-4 max-w-105">
												<div className="flex items-center gap-3 min-w-0">
													<ToolIcon name={row.name} iconUrl={row.iconUrl} />
													<div className="min-w-0 flex-1">
														<div className="truncate font-medium text-white">{row.name}</div>
													</div>
												</div>
											</td>

											<td className="px-6 py-4 text-white/70">{row.department}</td>
											<td className="px-6 py-4 text-white/70">{row.users}</td>
											<td className="px-6 py-4 text-white/70">{formatEUR(row.monthlyCost)}</td>

											<td className="px-6 py-4">
												<StatusBadge status={row.status} />
											</td>
											<td className="relative px-6 py-4 text-right">
												<button
													type="button"
													className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
													aria-label="Row actions"
													aria-expanded={openMenuId === row.id}
													onClick={() => setOpenMenuId((prev) => (prev === row.id ? null : row.id))}
												>
													<MoreHorizontal className="h-4 w-4" />
												</button>

												{openMenuId === row.id ? (
													<div className="absolute right-6 top-14 z-10 w-36 rounded-xl border border-white/10 bg-black/80 p-1 shadow-lg backdrop-blur">
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
															onClick={() => setOpenMenuId(null)}
														>
															Delete
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
	)
}
