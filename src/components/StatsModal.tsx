import { X } from "lucide-react";
import { useEffect, useId } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ScoreManager } from "@/lib/scoreManager";
import { cn } from "@/lib/utils";

interface StatsModalProps {
	isOpen: boolean;
	onClose: () => void;
	scoreManager: ScoreManager;
	/** Title for the modal */
	title?: string;
	/** Callback to trigger stats update in parent component */
	onStatsUpdate?: () => void;
}

/**
 * Reusable statistics modal for GCSE CS practice sites
 * Shows level progress, statistics, and breakdown by category
 */
export function StatsModal({
	isOpen,
	onClose,
	scoreManager,
	title = "Your Progress",
	onStatsUpdate,
}: StatsModalProps) {
	const titleId = useId();
	const headerIcon = "🏆";

	// Handle Escape key
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	// Don't render anything if not open
	if (!isOpen) return null;

	const overallStats = scoreManager.getOverallStats();
	const programScores = scoreManager.getProgramScores
		? scoreManager.getProgramScores()
		: [];

	const handleResetScores = () => {
		if (
			confirm(
				"Are you sure you want to reset all scores? This cannot be undone.",
			)
		) {
			scoreManager.resetAllScores();
			// Trigger stats update in parent component instead of reloading
			onStatsUpdate?.();
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-modal-overlay backdrop-blur-xs"
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			onClick={onClose}
			onKeyDown={(e) => {
				if (e.key === "Escape") {
					onClose();
				}
			}}
			tabIndex={-1}
		>
			<div
				className="bg-background rounded-lg shadow-xl max-w-xl w-full max-h-[80vh] overflow-hidden"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				role="document"
			>
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 text-modal-header-text bg-header/80">
					<h2
						id={titleId}
						className="flex items-center text-2xl font-bold gap-2"
					>
						{headerIcon} {title}
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="flex items-center justify-center w-8 h-8 text-2xl transition-colors hover:opacity-80"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				{/* Content */}
				<div className="p-4 overflow-y-auto max-h-[calc(80vh-140px)]">
					{overallStats.totalAttempts > 0 ? (
						<div className="space-y-4">
							{/* Level Info Card */}
							<Card className="text-level-card-text bg-level-card-bg">
								<CardHeader className="text-level-card-text">
									<div className="flex items-center gap-4">
										<div className="text-5xl animate-gentle-bounce">
											{overallStats.currentLevel.emoji}
										</div>
										<div className="flex-1 text-left">
											<CardTitle className="text-2xl">
												{overallStats.currentLevel.title}
											</CardTitle>
											<p className="mt-1 opacity-90">
												{overallStats.currentLevel.description}
											</p>
										</div>
									</div>
								</CardHeader>
								{overallStats.nextLevel && (
									<CardContent className="p-4 mx-4 rounded-md bg-card/20">
										<div className="flex items-center justify-between mb-2 text-sm font-semibold">
											<span>
												Progress to {overallStats.nextLevel.emoji}{" "}
												{overallStats.nextLevel.title}
											</span>
											<span>
												{Math.max(
													0,
													overallStats.nextLevel.minPoints -
														overallStats.totalPoints,
												)}{" "}
												points needed
											</span>
										</div>
										<Progress
											value={overallStats.progress}
											className="h-2 mb-3 [&>div]:bg-progress-bar"
										/>
										{/* Detailed requirements */}
										<div className="text-sm space-y-1">
											{overallStats.accuracy <
												overallStats.nextLevel.minAccuracy && (
												<div>
													🎯 {Math.round(overallStats.nextLevel.minAccuracy)}%
													accuracy required (currently{" "}
													{Math.round(overallStats.accuracy)}%)
												</div>
											)}
										</div>
									</CardContent>
								)}
								{!overallStats.nextLevel && (
									<CardContent className="pt-4">
										<div className="text-center">
											<div className="p-3 text-white bg-yellow-500 rounded-lg">
												<p className="text-lg font-semibold">
													🎉 Maximum Level Reached!
												</p>
												<p className="text-sm text-yellow-100">
													You&apos;re the ultimate master!
												</p>
											</div>
										</div>
									</CardContent>
								)}
							</Card>

							{/* Overall Statistics */}
							<Card className="p-4 gap-4">
								<CardHeader className="px-2 mb-0">
									<CardTitle className="flex items-center">
										📈 Overall Statistics
									</CardTitle>
								</CardHeader>
								<CardContent className="px-2">
									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										<div className="p-4 text-center border-l-4 rounded-lg bg-stats-card-bg border-stats-accuracy-high">
											<div className="text-2xl font-bold text-stats-accuracy-high">
												{overallStats.totalPoints}
											</div>
											<div className="text-sm text-muted-foreground">
												Total Points
											</div>
										</div>
										<div className="p-4 text-center border-l-4 rounded-lg bg-stats-card-bg border-stats-points">
											<div className="text-2xl font-bold text-stats-points">
												{overallStats.totalAttempts}
											</div>
											<div className="text-sm text-muted-foreground">
												Attempts
											</div>
										</div>
										<div className="p-4 text-center border-l-4 rounded-lg bg-stats-card-bg border-stats-record">
											<div className="text-2xl font-bold text-stats-record">
												{Math.floor(overallStats.accuracy)}%
											</div>
											<div className="text-sm text-muted-foreground">
												Accuracy
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Breakdown by Category */}
							<Card className="gap-4 p-4">
								<CardHeader className="px-2 mb-0">
									<CardTitle className="flex items-center">
										📋 Breakdown by Category
									</CardTitle>
								</CardHeader>
								<CardContent className="px-2">
									<div className="space-y-4">
										{
											// Show program scores for trace tables
											programScores.map((program) => (
												<div
													key={program.programName}
													className="flex items-center justify-between p-4 rounded-lg bg-muted"
												>
													<div>
														<div className="text-lg font-semibold">
															{program.programName}
														</div>
														<div className="text-sm text-muted-foreground">
															Attempts: {program.attempts} • Last:{" "}
															{program.lastAttempt}
														</div>
													</div>
													<div
														className={cn(
															"text-xl font-bold px-3 py-1 rounded-full ml-4 min-w-24 text-center",
															program.accuracy >= 80
																? "bg-emerald-200 text-emerald-800"
																: program.accuracy >= 60
																	? "bg-lime-200 text-lime-800"
																	: program.accuracy >= 40
																		? "bg-amber-200 text-amber-800"
																		: "bg-red-200 text-red-800",
														)}
													>
														{program.bestScore}
													</div>
												</div>
											))
										}
									</div>
								</CardContent>
							</Card>
						</div>
					) : (
						<div className="py-12 text-center">
							<div className="mb-4 text-6xl">🦆</div>
							<p className="mb-2 text-xl text-shadow-muted-foreground">
								No scores recorded yet
							</p>
							<p className="text-muted-foreground">
								Start practicing to see your progress!
							</p>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between p-4">
					<Button variant="destructive" onClick={handleResetScores}>
						Reset All Scores
					</Button>
					<Button onClick={onClose}>Close</Button>
				</div>
			</div>
		</div>
	);
}
