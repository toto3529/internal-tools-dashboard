import type { ReactNode } from "react"
import { Card } from "../ui/Card"
import { accents, type Accent } from "../../styles/accents"

type Props = {
	label: string
	value: ReactNode
	subValue?: ReactNode
	badgeText?: string
	icon: ReactNode
	variant: Accent
}

export default function KpiCard({ label, value, subValue, badgeText, icon, variant }: Props) {
	const styles = accents[variant]

	return (
		<Card className="p-6">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<div className="text-sm text-zinc-500 dark:text-zinc-400">{label}</div>

					<div className="mt-3 flex items-baseline gap-2">
						<div className="text-3xl font-semibold text-zinc-900 dark:text-white">{value}</div>
						{subValue ? <div className="text-xl font-semibold text-zinc-500 dark:text-white/35">{subValue}</div> : null}
					</div>

					{badgeText ? (
						<span className={["mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", styles].join(" ")}>{badgeText}</span>
					) : null}
				</div>

				<div className={["flex h-10 w-10 items-center justify-center rounded-xl", styles].join(" ")}>{icon}</div>
			</div>
		</Card>
	)
}
