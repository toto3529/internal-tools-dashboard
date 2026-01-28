import { useMemo, useState } from "react"
import { Card } from "../ui/Card"
import StatusBadge from "../ui/StatusBadge"
import { Calendar, MoreHorizontal } from "lucide-react"

type ToolStatus = "active" | "expiring" | "unused"

type RecentToolRow = {
	id: string
	name: string
	department: string
	users: number
	monthlyCost: number
	status: ToolStatus
}

const rows: RecentToolRow[] = [
	{ id: "1", name: "Figma", department: "Design", users: 24, monthlyCost: 1240, status: "active" },
	{ id: "2", name: "Slack", department: "Operations", users: 56, monthlyCost: 980, status: "active" },
	{ id: "3", name: "Notion", department: "Engineering", users: 41, monthlyCost: 760, status: "expiring" },
	{ id: "4", name: "Jira", department: "Engineering", users: 38, monthlyCost: 690, status: "active" },
	{ id: "5", name: "Miro", department: "Product", users: 19, monthlyCost: 410, status: "unused" },
	{ id: "6", name: "GitHub", department: "Engineering", users: 44, monthlyCost: 1320, status: "active" },
	{ id: "7", name: "Linear", department: "Product", users: 16, monthlyCost: 520, status: "expiring" },
	{ id: "8", name: "Google Workspace", department: "Operations", users: 66, monthlyCost: 1580, status: "active" },
]

const currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "EUR",
	maximumFractionDigits: 0,
})

type SortKey = "name" | "monthlyCost" | "users"
type SortDir = "asc" | "desc"

export default function RecentToolsTable({ searchQuery = "" }: { searchQuery?: string }) {
	const pageSize = 10
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

	const filteredRows = useMemo(() => {
		const q = searchQuery.trim().toLowerCase()
		if (!q) return rows
		return rows.filter((r) => r.name.toLowerCase().includes(q) || r.department.toLowerCase().includes(q) || r.status.toLowerCase().includes(q))
	}, [searchQuery])

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

			<div className="overflow-x-auto">
				<table className="w-full min-w-[760px] text-left text-sm">
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
						{pagedRows.map((row) => {
							return (
								<tr key={row.id} className="border-b border-white/10 hover:bg-white/[0.04]">
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">{/* future icon */}</div>
											<div className="min-w-0">
												<div className="truncate font-medium text-white">{row.name}</div>
											</div>
										</div>
									</td>

									<td className="px-6 py-4 text-white/70">{row.department}</td>
									<td className="px-6 py-4 text-white/70">{row.users}</td>
									<td className="px-6 py-4 text-white/70">{currency.format(row.monthlyCost)}</td>

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
											<div className="absolute right-6 top-[52px] z-10 w-36 rounded-xl border border-white/10 bg-black/80 p-1 shadow-lg backdrop-blur">
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
						})}
					</tbody>
				</table>
			</div>

			<div className="flex items-center justify-between gap-4 px-6 py-4">
				<div className="text-xs text-white/45">
					Showing {showingFrom}-{showingTo} of {totalItems} tools
				</div>

				<div className="flex items-center gap-2">
					<button
						type="button"
						disabled={!canPrev}
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
					>
						Previous
					</button>
					<button
						type="button"
						disabled={!canNext}
						onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
					>
						Next
					</button>
				</div>
			</div>
		</Card>
	)
}
