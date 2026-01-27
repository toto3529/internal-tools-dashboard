import { Link } from "react-router-dom"

export default function Analytics() {
	return (
		<div className="min-h-screen p-6">
			<h1 className="text-2xl font-semibold">Analytics</h1>

			<nav className="mt-6 flex gap-3 text-sm">
				<Link className="underline" to="/">
					Dashboard
				</Link>
				<Link className="underline" to="/tools">
					Tools
				</Link>
			</nav>
		</div>
	)
}
