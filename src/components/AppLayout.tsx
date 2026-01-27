import { Outlet } from "react-router-dom"
import Header from "./Header"

export default function AppLayout() {
	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100">
			<Header />
			<main className="mx-auto max-w-7xl px-4 py-6">
				<Outlet />
			</main>
		</div>
	)
}
