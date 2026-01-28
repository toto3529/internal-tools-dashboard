const eurFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "EUR",
	maximumFractionDigits: 0,
})

export function formatEUR(value: number): string {
	return eurFormatter.format(value)
}
