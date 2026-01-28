type Props = {
	name: string
	iconUrl?: string
}

export default function ToolIcon({ name, iconUrl }: Props) {
	return (
		<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
			{iconUrl ? (
				<img
					src={iconUrl}
					alt={`${name} logo`}
					className="h-5 w-5 object-contain"
					loading="lazy"
					referrerPolicy="no-referrer"
					onError={(e) => {
						e.currentTarget.style.display = "none"
					}}
				/>
			) : (
				<span className="text-xs text-white/40">—</span>
			)}
		</div>
	)
}
