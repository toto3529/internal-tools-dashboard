import { Link } from "react-router-dom"

export default function Tools() {
	return (
		<div className="min-h-screen p-6">
			<h1 className="text-2xl font-semibold">Tools</h1>

			<nav className="mt-6 flex gap-3 text-sm">
				<Link className="underline" to="/">
					Dashboard
				</Link>
				<Link className="underline" to="/analytics">
					Analytics
				</Link>
			</nav>
		</div>
	)
}
