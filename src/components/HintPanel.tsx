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
		<div
			className={cn(
				"mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-6",
				"transition-all duration-300 ease-in-out",
				"opacity-100 max-h-none overflow-visible",
			)}
		>
			<h3 className="mb-4 text-lg font-bold text-yellow-800">{title}</h3>
			<div className="overflow-y-auto max-h-64">
				<ul className="space-y-4 text-gray-700">
					{items.map((item) => (
						<li key={item.title} className="flex flex-col gap-1">
							<div className={colorClasses[item.color]}>{item.title}:</div>
							<div className="text-sm">{item.description}</div>
							{item.examples.map((example) => (
								<div
									key={example}
									className="px-2 py-1 font-mono text-sm text-gray-600 bg-gray-100 rounded"
								>
									{example}
								</div>
							))}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
