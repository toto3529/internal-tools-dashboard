import { Outlet } from "react-router-dom"
import Header from "./Header"
import { useState } from "react"

export default function AppLayout() {
	const [searchQuery, setSearchQuery] = useState("")
	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100">
			<Header query={searchQuery} onQueryChange={setSearchQuery} />
			<main className="mx-auto max-w-7xl px-4 py-6">
				<Outlet context={{ searchQuery }} />
			</main>
		</div>
	)
}
