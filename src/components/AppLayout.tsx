import { Outlet } from "react-router-dom"

export default function AppLayout() {
	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100">
			{/* Header viendra ici (Étape 2.2) */}
			<main className="mx-auto max-w-7xl px-4 py-6">
				<Outlet />
			</main>
		</div>
	)
}
