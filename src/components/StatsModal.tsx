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
}: StatsModalProps) {
	const headerIcon = "🏆";
	const titleId = useId();

	// Handle Escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			return () => document.removeEventListener("keydown", handleEscape);
		}
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const overallStats = scoreManager.getOverallStats();
	const typeStats = scoreManager.getScoresByType();

	const handleResetScores = () => {
		if (
			confirm(
				"Are you sure you want to reset all scores? This cannot be undone.",
			)
		) {
			scoreManager.resetAllScores();
			window.location.reload(); // Refresh to update all displays
		}
	};

	return (
		<div
			className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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
				className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[80vh] overflow-hidden"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				role="document"
			>
				{/* Header */}
				<div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-4 flex items-center justify-between">
					<h2
						id={titleId}
						className="text-2xl font-bold flex items-center gap-2"
					>
						{headerIcon} {title}
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-white hover:text-gray-200 transition-colors text-2xl w-8 h-8 flex items-center justify-center"
					>
						<X className="h-6 w-6" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
					{overallStats.totalAttempts > 0 ? (
						<div className="space-y-6 ">
							{/* Level Info Card */}
							<Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
								<CardHeader className=" text-white">
									<div className="flex items-center gap-4">
										<div className="text-5xl animate-gentle-bounce">
											{overallStats.level.emoji}
										</div>
										<div className="flex-1 text-left">
											<CardTitle className="text-2xl">
												{overallStats.level.title}
											</CardTitle>
											<p className="text-indigo-100 mt-1">
												{overallStats.level.description}
											</p>
										</div>
									</div>
								</CardHeader>
								{overallStats.nextLevel && (
									<CardContent className="mx-4 pt-4 rounded-md bg-white/20 backdrop-blur-sm">
										<div className="flex justify-between items-center mb-2 text-sm font-semibold">
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
											className="h-2 mb-3 [&>div]:bg-green-600 "
										/>
										{/* Detailed requirements */}
										<div className="text-sm text-white space-y-1">
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
											<div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg p-3">
												<p className="font-semibold text-lg">
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
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										📈 Overall Statistics
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="bg-blue-50 rounded-lg p-4 text-center border-l-4 border-blue-500">
											<div className="text-2xl font-bold text-blue-600">
												{overallStats.totalAttempts}
											</div>
											<div className="text-sm text-gray-600">
												Total Attempts
											</div>
										</div>
										<div className="bg-green-50 rounded-lg p-4 text-center border-l-4 border-green-500">
											<div className="text-2xl font-bold text-green-600">
												{overallStats.totalCorrect}
											</div>
											<div className="text-sm text-gray-600">Correct</div>
										</div>
										<div className="bg-purple-50 rounded-lg p-4 text-center border-l-4 border-purple-500">
											<div className="text-2xl font-bold text-purple-600">
												{Math.round(overallStats.accuracy)}%
											</div>
											<div className="text-sm text-gray-600">Accuracy</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Breakdown by Category */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										📋 Breakdown by Category
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{Object.entries(typeStats).map(
											([type, stats]) =>
												stats.attempts > 0 && (
													<div
														key={type}
														className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
													>
														<div>
															<div className="font-semibold text-lg">
																{type === "none" ? "Invalid Items" : type}
															</div>
															<div className="text-sm text-gray-600">
																{stats.correct} correct out of {stats.attempts}{" "}
																attempts
															</div>
														</div>
														<div className="text-right">
															<div
																className={cn(
																	"text-2xl font-bold",
																	stats.accuracy >= 80
																		? "text-green-600"
																		: stats.accuracy >= 60
																			? "text-yellow-600"
																			: "text-red-600",
																)}
															>
																{Math.round(stats.accuracy)}%
															</div>
															<div className="text-xs text-gray-500">
																accuracy
															</div>
														</div>
													</div>
												),
										)}
									</div>
								</CardContent>
							</Card>
						</div>
					) : (
						<div className="text-center py-12">
							<div className="text-6xl mb-4">🦆</div>
							<p className="text-xl text-gray-600 mb-2">
								No scores recorded yet
							</p>
							<p className="text-gray-500">
								Start practicing to see your progress!
							</p>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="px-6 py-4 bg-gray-50 flex justify-between items-center gap-4">
					<Button variant="destructive" onClick={handleResetScores}>
						Reset All Scores
					</Button>
					<Button onClick={onClose}>Close</Button>
				</div>
			</div>
		</div>
	);
}
