import { cn } from "@/lib/utils";

export interface HintItem {
	title: string;
	description: string;
	examples: string[];
	color: "blue" | "purple" | "green" | "yellow" | "red";
}

interface HintPanelProps {
	isVisible: boolean;
	title?: string;
	items: HintItem[];
}

/**
 * Generic help panel component for GCSE CS practice sites
 * Displays format rules, examples, or any educational content
 * Toggleable visibility with smooth transitions and color-coded sections
 */
export function HintPanel({
	isVisible,
	title = "📝 Help & Rules:",
	items,
}: HintPanelProps) {
	if (!isVisible) return null;

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
				isVisible
					? "opacity-100 max-h-96"
					: "opacity-0 max-h-0 overflow-hidden",
			)}
		>
			<h3 className="text-lg font-bold text-yellow-800 mb-4">{title}</h3>
			<ul className="space-y-4 text-gray-700">
				{items.map((item) => (
					<li key={item.title} className="flex flex-col gap-1">
						<div className={colorClasses[item.color]}>{item.title}:</div>
						<div className="text-sm">{item.description}</div>
						{item.examples.map((example) => (
							<div
								key={example}
								className="text-sm text-gray-600 bg-gray-100 rounded px-2 py-1 font-mono"
							>
								{example}
							</div>
						))}
					</li>
				))}
			</ul>
		</div>
	);
}
