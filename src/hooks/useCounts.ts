import { useEffect, useState } from "react"
import { apiGet } from "../utils/api"
import type { Tool, Department } from "../utils/types"

type CountState =
	| { status: "loading"; count: null; error: null }
	| { status: "error"; count: null; error: Error }
	| { status: "success"; count: number; error: null }

export function useActiveToolsCount() {
	const [state, setState] = useState<CountState>({ status: "loading", count: null, error: null })

	useEffect(() => {
		let cancelled = false
		setState({ status: "loading", count: null, error: null })

		apiGet<Tool[]>("/tools?status=active")
			.then((data) => {
				if (cancelled) return
				setState({ status: "success", count: data.length, error: null })
			})
			.catch((error: Error) => {
				if (cancelled) return
				setState({ status: "error", count: null, error })
			})

		return () => {
			cancelled = true
		}
	}, [])

	return state
}

export function useDepartmentsCount() {
	const [state, setState] = useState<CountState>({ status: "loading", count: null, error: null })

	useEffect(() => {
		let cancelled = false
		setState({ status: "loading", count: null, error: null })

		apiGet<Department[]>("/departments")
			.then((data) => {
				if (cancelled) return
				setState({ status: "success", count: data.length, error: null })
			})
			.catch((error: Error) => {
				if (cancelled) return
				setState({ status: "error", count: null, error })
			})

		return () => {
			cancelled = true
		}
	}, [])

	return state
}
