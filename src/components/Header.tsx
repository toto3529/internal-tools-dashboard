import { useEffect, useMemo, useRef, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { Bell, ChevronDown, Menu, Search, Settings, Sun, Zap } from "lucide-react"
import { accents } from "../styles/accents"

type HeaderProps = {
	query: string
	onQueryChange: (v: string) => void
}
export default function Header({ query, onQueryChange }: HeaderProps) {
	const location = useLocation()
	const [mobileOpen, setMobileOpen] = useState(false)
	const notificationsCount = 1

	const menuRef = useRef<HTMLDivElement | null>(null)
	const [userMenuOpen, setUserMenuOpen] = useState(false)
	const userMenuRef = useRef<HTMLDivElement | null>(null)

	const searchPlaceholder = useMemo(() => {
		if (location.pathname.startsWith("/tools")) return "Search in tools catalog..."
		if (location.pathname.startsWith("/analytics")) return "Search metrics, insights..."
		return "Search tools..."
	}, [location.pathname])

	useEffect(() => {
		const onClickOutside = (e: MouseEvent) => {
			const target = e.target as Node
			if (menuRef.current && !menuRef.current.contains(target)) {
				setMobileOpen(false)
			}
			if (userMenuRef.current && !userMenuRef.current.contains(target)) {
				setUserMenuOpen(false)
			}
		}
		document.addEventListener("mousedown", onClickOutside)
		return () => document.removeEventListener("mousedown", onClickOutside)
	}, [])

	const linkClass = ({ isActive }: { isActive: boolean }) =>
		[
			"rounded-lg px-3 py-2 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-white/10",
			isActive
				? "text-zinc-900 dark:text-white underline decoration-violet-400 decoration-2 underline-offset-[10px]"
				: "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white",
		].join(" ")

	return (
		<header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-zinc-950/80">
			<div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
				<div className="flex items-center gap-2">
					<div className={["flex h-9 w-9 items-center justify-center rounded-xl", accents.blue].join(" ")}>
						<Zap className="h-5 w-5 text-white" />
					</div>
					<span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">TechCorp</span>
				</div>

				<nav className="hidden lg:flex items-center gap-2">
					<NavLink to="/" end className={linkClass}>
						Dashboard
					</NavLink>
					<NavLink to="/tools" className={linkClass}>
						Tools
					</NavLink>
					<NavLink to="/analytics" className={linkClass}>
						Analytics
					</NavLink>
					<NavLink
						to="/settings"
						className="rounded-lg px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed opacity-80"
						onClick={(e) => e.preventDefault()}
					>
						Settings
					</NavLink>
				</nav>

				<div className="hidden lg:flex flex-1 justify-center">
					<div className="relative w-full max-w-md">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
						<input
							value={query}
							onChange={(e) => onQueryChange(e.target.value)}
							placeholder={searchPlaceholder}
							className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-300 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-white/20 dark:focus:bg-white/10"
						/>
					</div>
				</div>

				<div className="ml-auto hidden lg:flex items-center gap-4">
					<button
						type="button"
						className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white"
						aria-label="Toggle theme"
						//TODO dark/light
						onClick={() => {}}
					>
						<Sun className="h-5 w-5" />
					</button>

					<button
						type="button"
						className="relative text-zinc-600 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white"
						aria-label="Notifications"
					>
						<Bell className="h-5 w-5" />
						{notificationsCount > 0 && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />}
					</button>

					<button
						type="button"
						className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white"
						aria-label="Settings"
						onClick={() => {}}
					>
						<Settings className="h-5 w-5" />
					</button>

					<div className="relative" ref={userMenuRef}>
						<button
							type="button"
							className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white"
							aria-label="User menu"
							aria-expanded={userMenuOpen}
							onClick={() => setUserMenuOpen((v) => !v)}
						>
							<div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-white/15" />
							<ChevronDown className="h-4 w-4 text-zinc-400" />
						</button>

						{userMenuOpen ? (
							<div className="absolute right-0 top-11 z-50 w-48 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-zinc-950">
								<button
									className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
									onClick={() => setUserMenuOpen(false)}
								>
									Profile
								</button>
								<button
									className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
									onClick={() => setUserMenuOpen(false)}
								>
									Settings
								</button>
								<div className="my-1 h-px bg-zinc-200 dark:bg-white/10" />
								<button
									className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
									onClick={() => setUserMenuOpen(false)}
								>
									Sign out
								</button>
							</div>
						) : null}
					</div>
				</div>

				<div className="relative ml-auto lg:hidden" ref={menuRef}>
					<button
						type="button"
						className="inline-flex items-center justify-center rounded-full p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white"
						aria-label="Open navigation"
						aria-expanded={mobileOpen}
						onClick={() => setMobileOpen((v) => !v)}
					>
						<Menu className="h-5 w-5" />
					</button>

					{mobileOpen && (
						<div className="fixed right-4 top-16 mt-2 w-56 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-zinc-950">
							<nav className="flex flex-col gap-1">
								<NavLink to="/" end className={linkClass} onClick={() => setMobileOpen(false)}>
									Dashboard
								</NavLink>
								<NavLink to="/tools" className={linkClass} onClick={() => setMobileOpen(false)}>
									Tools
								</NavLink>
								<NavLink to="/analytics" className={linkClass} onClick={() => setMobileOpen(false)}>
									Analytics
								</NavLink>
								<div className="my-1 h-px bg-zinc-200 dark:bg-white/10" />
								<NavLink
									to="/settings"
									className="rounded-lg px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed opacity-80"
									onClick={(e) => e.preventDefault()}
								>
									Settings
								</NavLink>
							</nav>
						</div>
					)}
				</div>
			</div>
		</header>
	)
}
