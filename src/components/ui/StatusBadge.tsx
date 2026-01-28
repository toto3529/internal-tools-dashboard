import { accents, type Accent } from "../../styles/accents"

type Status = "active" | "expiring" | "unused"

const statusToAccent: Record<Status, Accent> = {
	active: "green",
	expiring: "orange",
	unused: "danger",
}

const statusLabels: Record<Status, string> = {
	active: "Active",
	expiring: "Expiring",
	unused: "Unused",
}

type Props = {
	status: Status
	className?: string
}

export default function StatusBadge({ status, className = "" }: Props) {
	const accent = statusToAccent[status]
	const label = statusLabels[status]

	return (
		<span
			className={["inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", accents[accent], className].join(" ")}
			aria-label={`Status: ${label}`}
			title={label}
		>
			{label}
		</span>
	)
}
