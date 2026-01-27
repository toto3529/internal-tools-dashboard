import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Tools from "./pages/Tools"
import Analytics from "./pages/Analytics"
import AppLayout from "./components/AppLayout"

export default function App() {
	return (
		<Routes>
			<Route element={<AppLayout />}>
				<Route path="/" element={<Dashboard />} />
				<Route path="/tools" element={<Tools />} />
				<Route path="/analytics" element={<Analytics />} />
			</Route>
		</Routes>
	)
}
