import { useOutletContext } from "react-router-dom"
import { Card } from "../components/ui/Card"
import { useTools } from "../hooks/useTools"
import StatusBadge from "../components/ui/StatusBadge"
import { MoreHorizontal } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type { Tool } from "../utils/types"
import { formatEUR } from "../utils/format"

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
	const toolsQuery = useTools()
	const pageSize = 10
	const [page, setPage] = useState(1)

	const [sortKey, setSortKey] = useState<SortKey>("monthly_cost")
	const [sortDir, setSortDir] = useState<SortDir>("desc")
	const [openMenuId, setOpenMenuId] = useState<number | null>(null)

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

	useEffect(() => {
		setPage(1)
	}, [searchQuery, sortKey, sortDir])

	const filteredTools = useMemo(() => {
		if (!toolsQuery.data) return []
		const q = searchQuery.trim().toLowerCase()
		if (!q) return toolsQuery.data

		return toolsQuery.data.filter((t) => {
			return (
				t.name.toLowerCase().includes(q) ||
				t.owner_department.toLowerCase().includes(q) ||
				t.category.toLowerCase().includes(q) ||
				t.status.toLowerCase().includes(q)
			)
		})
	}, [toolsQuery.data, searchQuery])

	const sortedTools = useMemo(() => {
		return sortTools(filteredTools, sortKey, sortDir)
	}, [filteredTools, sortKey, sortDir])

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

	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Tools</h1>
				<p className="text-sm text-zinc-500 dark:text-white/45">Browse the full catalog of internal tools, filter by status and review costs.</p>
			</div>

			<Card className="p-0">
				<div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
					<div className="min-w-0">
						<div className="text-sm font-semibold text-white">Tools Catalog</div>
						<div className="mt-1 text-xs text-white/45">
							Search: <span className="text-white/70">{searchQuery || "All tools"}</span>
						</div>
					</div>
				</div>

				{/* Mobile: cards */}
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
								<div key={t.id} className="relative rounded-xl border border-white/10 bg-white/5 p-4">
									<div className="flex items-start justify-between gap-3">
										<div className="flex min-w-0 items-start gap-3">
											<div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
												{t.icon_url ? (
													<img
														src={t.icon_url}
														alt={`${t.name} logo`}
														className="h-5 w-5 object-contain"
														loading="lazy"
														onError={(e) => {
															e.currentTarget.style.display = "none"
														}}
													/>
												) : (
													<span className="text-xs text-white/40">—</span>
												)}
											</div>

											<div className="min-w-0">
												<div className="truncate font-medium text-white">{t.name}</div>
												<div className="mt-1 text-xs text-white/45">
													{t.category} • {t.owner_department}
												</div>
											</div>
										</div>

										<div className="flex items-center gap-2">
											<StatusBadge status={t.status} />

											<div className="relative">
												<button
													type="button"
													className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
													aria-label="Row actions"
													aria-expanded={openMenuId === t.id}
													onClick={() => setOpenMenuId((prev) => (prev === t.id ? null : t.id))}
												>
													<MoreHorizontal className="h-4 w-4" />
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
															onClick={() => setOpenMenuId(null)}
														>
															Enable / Disable
														</button>
													</div>
												) : null}
											</div>
										</div>
									</div>

									<div className="mt-3 grid grid-cols-2 gap-3 text-sm text-white/70">
										<div>
											<div className="text-xs text-white/45">Users</div>
											<div className="mt-0.5">{t.active_users_count ?? 0}</div>
										</div>
										<div className="text-right">
											<div className="text-xs text-white/45">Monthly Cost</div>
											<div className="mt-0.5">{formatEUR(t.monthly_cost ?? 0)}</div>
										</div>
									</div>
								</div>
							))
						: null}
				</div>

				{/* Desktop+: table */}
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
								<th className="px-6 py-3 font-medium">Category</th>
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
								<th className="px-6 py-3 font-medium">Status</th>
								<th className="px-6 py-3 text-right font-medium">Actions</th>
							</tr>
						</thead>

						<tbody>
							{toolsQuery.isLoading ? (
								<tr className="border-b border-white/10">
									<td className="px-6 py-6 text-white/70" colSpan={7}>
										Loading…
									</td>
								</tr>
							) : null}

							{toolsQuery.isError ? (
								<tr className="border-b border-white/10">
									<td className="px-6 py-6 text-white/70" colSpan={7}>
										Error: {toolsQuery.error.message}
									</td>
								</tr>
							) : null}

							{toolsQuery.isSuccess && pagedTools.length === 0 ? (
								<tr className="border-b border-white/10">
									<td className="px-6 py-6 text-white/70" colSpan={7}>
										No tools found.
									</td>
								</tr>
							) : null}

							{toolsQuery.isSuccess
								? pagedTools.map((t) => (
										<tr key={t.id} className="border-b border-white/10 hover:bg-white/5">
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
														{t.icon_url ? (
															<img
																src={t.icon_url}
																alt={`${t.name} logo`}
																className="h-5 w-5 object-contain"
																loading="lazy"
																onError={(e) => {
																	e.currentTarget.style.display = "none"
																}}
															/>
														) : (
															<span className="text-xs text-white/40">—</span>
														)}
													</div>
													<div className="min-w-0">
														<div className="truncate font-medium text-white">{t.name}</div>
													</div>
												</div>
											</td>

											<td className="px-6 py-4 text-white/70">{t.category}</td>
											<td className="px-6 py-4 text-white/70">{t.owner_department}</td>
											<td className="px-6 py-4 text-white/70">{t.active_users_count ?? 0}</td>
											<td className="px-6 py-4 text-white/70">{formatEUR(t.monthly_cost ?? 0)}</td>

											<td className="px-6 py-4">
												<StatusBadge status={t.status} />
											</td>

											<td className="relative px-6 py-4 text-right">
												<button
													type="button"
													className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
													aria-label="Row actions"
													aria-expanded={openMenuId === t.id}
													onClick={() => setOpenMenuId((prev) => (prev === t.id ? null : t.id))}
												>
													<MoreHorizontal className="h-4 w-4" />
												</button>

												{openMenuId === t.id ? (
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
															Enable / Disable
														</button>
													</div>
												) : null}
											</td>
										</tr>
									))
								: null}
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
		</div>
	)
}
