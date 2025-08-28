import { cn } from "@/lib/utils";

export interface HintItem {
	title: string;
	description: string;
	examples: string[];
	color: "blue" | "purple" | "green" | "yellow" | "red";
}

interface HintPanelProps {
	title?: string;
	items: HintItem[];
}

/**
 * Generic help panel component for GCSE CS practice sites
 * Displays format rules, examples, or any educational content
 */
export function HintPanel({
	title = "📝 Help & Rules:",
	items,
}: HintPanelProps) {
	const colorClasses = {
		blue: "font-semibold text-blue-700",
		purple: "font-semibold text-purple-700",
		green: "font-semibold text-green-700",
		yellow: "font-semibold text-yellow-700",
		red: "font-semibold text-red-700",
	};

	return (
		<details className={cn(
				"mt-4 bg-slate-100 border-l-teal-500 border-l-4 rounded-lg p-6",
				"transition-all duration-300 ease-in-out",
				"max-h-none overflow-visible",
				"cursor-pointer list-none"
			)}
		>
			<summary className="mb-0 font-semibold text-md">{title}</summary>
			<div className="overflow-y-auto max-h-64">
				<ul className="space-y-4 text-gray-700">
					{items.map((item) => (
						<li key={item.title} className="flex flex-col gap-1">
							<div className={colorClasses[item.color]}>{item.title}:</div>
							<div className="text-sm">{item.description}</div>
							{item.examples.map((example) => (
								<div
									key={example}
									className="px-2 py-1 font-mono text-sm text-gray-600 bg-gray-200 rounded"
								>
									{example}
								</div>
							))}
						</li>
					))}
				</ul>
			</div>
		</details>

	);
}
