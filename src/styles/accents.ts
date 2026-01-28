export type Accent = "green" | "blue" | "red" | "pink" | "orange" | "danger"

export const accents: Record<Accent, string> = {
	green: ["bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700", "text-white"].join(" "),

	blue: ["bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600", "text-white"].join(" "),

	red: ["bg-gradient-to-br from-orange-500 via-rose-500 to-red-600", "text-white"].join(" "),

	pink: ["bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-600", "text-white"].join(" "),

	orange: ["bg-gradient-to-br from-orange-500 to-orange-700", "text-white"].join(" "),

	danger: ["bg-gradient-to-b from-red-600 to-red-700", "text-white"].join(" "),
}
