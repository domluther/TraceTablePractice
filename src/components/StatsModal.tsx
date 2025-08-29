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
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
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
				<div className="flex items-center justify-between px-6 py-4 text-white bg-gradient-to-r from-gray-700 to-gray-900">
					<h2
						id={titleId}
						className="flex items-center text-2xl font-bold gap-2"
					>
						{headerIcon} {title}
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="flex items-center justify-center w-8 h-8 text-2xl text-white hover:text-gray-200 transition-colors"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
					{overallStats.programsAttempted > 0 ? (
						<div className="space-y-6 ">
							{/* Level Info Card */}
							<Card className="text-white bg-gradient-to-r from-indigo-500 to-purple-600">
								<CardHeader className="text-white ">
									<div className="flex items-center gap-4">
										<div className="text-5xl animate-gentle-bounce">
											{overallStats.level.emoji}
										</div>
										<div className="flex-1 text-left">
											<CardTitle className="text-2xl">
												{overallStats.level.title}
											</CardTitle>
											<p className="mt-1 text-indigo-100">
												{overallStats.level.description}
											</p>
										</div>
									</div>
								</CardHeader>
								{overallStats.nextLevel && (
									<CardContent className="pt-4 mx-4 rounded-md bg-white/20 backdrop-blur-sm">
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
											<div className="p-3 text-white rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600">
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
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										📈 Overall Statistics
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="p-4 text-center border-l-4 border-blue-500 rounded-lg bg-blue-50">
											<div className="text-2xl font-bold text-blue-600">
												{overallStats.totalPoints}
											</div>
											<div className="text-sm text-gray-600">
												Best Points Total
											</div>
										</div>
										<div className="p-4 text-center border-l-4 border-green-500 rounded-lg bg-green-50">
											<div className="text-2xl font-bold text-green-600">
												{overallStats.programsAttempted}
											</div>
											<div className="text-sm text-gray-600">
												Programs Attempted
											</div>
										</div>
										<div className="p-4 text-center border-l-4 border-purple-500 rounded-lg bg-purple-50">
											<div className="text-2xl font-bold text-purple-600">
												{Math.round(overallStats.accuracy)}%
											</div>
											<div className="text-sm text-gray-600">
												Overall Accuracy
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Breakdown by Category */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										📋 Program Scores
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{
											// Show program scores for trace tables
											programScores.map((program) => (
												<div
													key={program.programName}
													className="p-4 rounded-lg bg-gray-50"
												>
													<div className="flex items-center justify-between">
														<div className="flex-1">
															<div className="text-lg font-semibold">
																{program.programName}
															</div>
															<div className="text-sm text-gray-600">
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
							<p className="mb-2 text-xl text-gray-600">
								No scores recorded yet
							</p>
							<p className="text-gray-500">
								Start practicing to see your progress!
							</p>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between px-6 py-4 bg-gray-50 gap-4">
					<Button variant="destructive" onClick={handleResetScores}>
						Reset All Scores
					</Button>
					<Button onClick={onClose}>Close</Button>
				</div>
			</div>
		</div>
	);
}
