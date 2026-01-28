const eurFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "EUR",
	maximumFractionDigits: 0,
})

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "short",
	day: "2-digit",
})

export function formatEUR(value: number): string {
	return eurFormatter.format(value)
}

export function formatShortDate(iso: string | undefined): string {
	if (!iso) return "—"
	const d = new Date(iso)
	if (Number.isNaN(d.getTime())) return "—"
	return shortDateFormatter.format(d)
}
