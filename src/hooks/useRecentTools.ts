import { useEffect, useState } from "react"
import { apiGet } from "../utils/api"
import type { Tool } from "../utils/types"

type State =
	| { status: "loading"; data: null; error: null }
	| { status: "error"; data: null; error: Error }
	| { status: "success"; data: Tool[]; error: null }

export function useRecentTools(limit = 8) {
	const [state, setState] = useState<State>({ status: "loading", data: null, error: null })

	useEffect(() => {
		let cancelled = false
		setState({ status: "loading", data: null, error: null })

		apiGet<Tool[]>(`/tools?_sort=updated_at&_order=desc&_limit=${limit}`)
			.then((data) => {
				if (cancelled) return
				setState({ status: "success", data, error: null })
			})
			.catch((error: Error) => {
				if (cancelled) return
				setState({ status: "error", data: null, error })
			})

		return () => {
			cancelled = true
		}
	}, [limit])

	return state
}
