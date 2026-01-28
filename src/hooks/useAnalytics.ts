import { useEffect, useState } from "react"
import { apiGet } from "../utils/api"
import type { Analytics } from "../utils/types"

type State =
	| { status: "loading"; data: null; error: null }
	| { status: "error"; data: null; error: Error }
	| { status: "success"; data: Analytics; error: null }

export function useAnalytics() {
	const [state, setState] = useState<State>({ status: "loading", data: null, error: null })

	useEffect(() => {
		let cancelled = false
		setState({ status: "loading", data: null, error: null })

		apiGet<Analytics>("/analytics")
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
	}, [])

	return state
}
