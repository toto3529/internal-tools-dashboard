const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://tt-jsonserver-01.alt-tools.tech"

async function parseOrThrow(res: Response) {
	if (res.ok) return
	const text = await res.text().catch(() => "")
	throw new Error(`API ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`)
}

export async function apiGet<T>(path: string, init: RequestInit = {}): Promise<T> {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		method: "GET",
		...init,
		headers: { Accept: "application/json", ...init.headers },
	})
	await parseOrThrow(res)
	return (await res.json()) as T
}

export async function apiPatch<T>(path: string, body: unknown, init: RequestInit = {}): Promise<T> {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		method: "PATCH",
		...init,
		headers: { "Content-Type": "application/json", Accept: "application/json", ...init.headers },
		body: JSON.stringify(body),
	})
	await parseOrThrow(res)
	return (await res.json()) as T
}
