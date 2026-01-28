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
	progressValue?: number
	progressMax?: number
}

export default function KpiCard({ label, value, subValue, badgeText, icon, variant, progressValue, progressMax }: Props) {
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
					{typeof progressValue === "number" && typeof progressMax === "number" ? (
						<div className="mt-3">
							<div className="h-2 w-full rounded-full bg-white/10">
								<div
									className="h-2 rounded-full bg-white/60"
									style={{ width: `${Math.min(100, Math.max(0, (progressValue / progressMax) * 100))}%` }}
								/>
							</div>
						</div>
					) : null}

					{badgeText ? (
						<span className={["mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", styles].join(" ")}>{badgeText}</span>
					) : null}
				</div>

				<div className={["flex h-10 w-10 items-center justify-center rounded-xl", styles].join(" ")}>{icon}</div>
			</div>
		</Card>
	)
}
