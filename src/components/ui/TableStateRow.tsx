type Props = {
	colSpan: number
	children: React.ReactNode
}

export default function TableStateRow({ colSpan, children }: Props) {
	return (
		<tr className="border-b border-white/10">
			<td className="px-6 py-6 text-white/70" colSpan={colSpan}>
				{children}
			</td>
		</tr>
	)
}
