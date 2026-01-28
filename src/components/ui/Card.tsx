import type { HTMLAttributes, PropsWithChildren } from "react"

type DivProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

export function Card({ className = "", ...props }: DivProps) {
	return (
		<div
			className={[
				"rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur",
				"dark:border-white/10 dark:bg-zinc-950/60",
				"transition hover:border-zinc-300 hover:bg-white",
				"dark:hover:border-white/20 dark:hover:bg-zinc-950/80",
				className,
			].join(" ")}
			{...props}
		/>
	)
}

export function CardHeader({ className = "", ...props }: DivProps) {
	return <div className={["flex items-start justify-between gap-3", className].join(" ")} {...props} />
}

export function CardTitle({ className = "", ...props }: DivProps) {
	return <h3 className={["text-sm font-medium text-zinc-600 dark:text-zinc-300", className].join(" ")} {...props} />
}

export function CardValue({ className = "", ...props }: DivProps) {
	return <p className={["mt-1 text-2xl font-semibold text-zinc-900 dark:text-white", className].join(" ")} {...props} />
}

export function CardContent({ className = "", ...props }: DivProps) {
	return <div className={["mt-4", className].join(" ")} {...props} />
}

export function CardFooter({ className = "", ...props }: DivProps) {
	return <div className={["mt-4", className].join(" ")} {...props} />
}
