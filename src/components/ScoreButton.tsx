interface ScoreButtonProps {
	levelEmoji: string;
	levelTitle: string;
	points: number;
	onClick: () => void;
}

/**
 * Responsive score display button for quiz sites
 * Shows current level, points, and opens stats modal when clicked
 * Automatically adjusts layout for different screen sizes
 */
export function ScoreButton({
	levelEmoji,
	levelTitle,
	points,
	onClick,
}: ScoreButtonProps) {
	return (
		<button
			onClick={onClick}
			className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm whitespace-nowrap"
			type="button"
		>
			{/* Full text on larger screens */}
			<span className="hidden xl:block">
				{levelEmoji} {levelTitle} ({points} pts)
			</span>
			{/* Compact text on smaller screens */}
			<span className="xl:hidden">
				{levelEmoji} {points} pts
			</span>
		</button>
	);
}
