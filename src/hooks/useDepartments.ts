import { useQuery } from "@tanstack/react-query"
import type { Department } from "../utils/types"
import { apiGet } from "../utils/api"

export function useDepartments() {
	return useQuery({
		queryKey: ["departments"],
		queryFn: () => apiGet<Department[]>("/departments"),
		staleTime: 60_000,
	})
}
