type Props = {
	showingFrom: number
	showingTo: number
	totalItems: number
	canPrev: boolean
	canNext: boolean
	onPrev: () => void
	onNext: () => void
}

export default function PaginationFooter({ showingFrom, showingTo, totalItems, canPrev, canNext, onPrev, onNext }: Props) {
	return (
		<div className="flex items-center justify-between gap-4 px-6 py-4">
			<div className="text-xs text-white/45">
				Showing {showingFrom}-{showingTo} of {totalItems} tools
			</div>

			<div className="flex items-center gap-2">
				<button
					type="button"
					disabled={!canPrev}
					onClick={onPrev}
					className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
				>
					Previous
				</button>
				<button
					type="button"
					disabled={!canNext}
					onClick={onNext}
					className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
				>
					Next
				</button>
			</div>
		</div>
	)
}
