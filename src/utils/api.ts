const API_BASE_URL = "https://tt-jsonserver-01.alt-tools.tech"

export async function apiGet<T>(path: string, init: RequestInit = {}): Promise<T> {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		method: "GET",
		...init,
		headers: {
			Accept: "application/json",
			...init.headers,
		},
	})

	if (!res.ok) {
		const text = await res.text().catch(() => "")
		throw new Error(`API ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`)
	}

	return (await res.json()) as T
}
export async function apiPatch<T>(path: string, body: unknown, init: RequestInit = {}): Promise<T> {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		method: "PATCH",
		...init,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			...init.headers,
		},
		body: JSON.stringify(body),
	})

	if (!res.ok) {
		const text = await res.text().catch(() => "")
		throw new Error(`API ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`)
	}

	return (await res.json()) as T
}
