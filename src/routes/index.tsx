import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
	ProgramSelector,
	QuizLayout,
	ScoreButton,
	StatsModal,
	TraceTableBody,
} from "@/components";
import { HintPanel } from "@/components/HintPanel";
import { QuizButton } from "@/components/QuizButton";
import { ASTInterpreter } from "@/lib/astInterpreter";
import type { Program } from "@/lib/programs";
import { ScoreManager } from "@/lib/scoreManager";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { TraceTableScoreManager } from "@/lib/traceTableScoreManager";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const siteConfig = SITE_CONFIG;

	// Score managers
	const [traceTableScoreManager] = useState(() => new TraceTableScoreManager());
	const [scoreManager] = useState(
		() => new ScoreManager(siteConfig.siteKey, siteConfig.scoring.customLevels),
	);

	// AST Interpreter
	const [interpreter] = useState(() => new ASTInterpreter());

	// Application state
	const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
	const [currentDifficulty, setCurrentDifficulty] = useState<string>("");
	const [currentProgramIndex, setCurrentProgramIndex] = useState<number>(-1);
	const [showStatsModal, setShowStatsModal] = useState(false);
	const [showHints, setShowHints] = useState(false);

	// Overall statistics for score display
	const [overallStats, setOverallStats] = useState({
		level: siteConfig.scoring.customLevels?.[0] || {
			emoji: "🥚",
			title: "Beginner",
			description: "Just getting started!",
			minPoints: 0,
			minAccuracy: 0,
		},
		totalPoints: 0,
		accuracy: 0,
	});

	// Update overall stats periodically
	useEffect(() => {
		const updateStats = () => {
			const stats = traceTableScoreManager.getOverallStats();

			// Calculate level based on performance
			let currentLevel = siteConfig.scoring.customLevels?.[0];
			if (siteConfig.scoring.customLevels) {
				for (const level of siteConfig.scoring.customLevels) {
					if (
						stats.totalCorrect >= level.minPoints &&
						stats.percentage >= level.minAccuracy
					) {
						currentLevel = level;
					}
				}
			}

			setOverallStats({
				level: currentLevel || {
					emoji: "🥚",
					title: "Beginner",
					description: "Just getting started!",
					minPoints: 0,
					minAccuracy: 0,
				},
				totalPoints: stats.totalCorrect,
				accuracy: stats.percentage,
			});
		};

		updateStats();
		// Update stats every few seconds to reflect changes
		const interval = setInterval(updateStats, 5000);
		return () => clearInterval(interval);
	}, [traceTableScoreManager, siteConfig.scoring.customLevels]);

	const handleProgramSelect = useCallback(
		(program: Program, difficulty: string, index: number) => {
			setCurrentProgram(program);
			setCurrentDifficulty(difficulty);
			setCurrentProgramIndex(index);
		},
		[],
	);

	const handleScoreUpdate = useCallback(
		(correct: number, total: number) => {
			if (currentDifficulty && currentProgramIndex >= 0) {
				traceTableScoreManager.saveScore(
					currentDifficulty,
					currentProgramIndex,
					correct,
					total,
				);
			}
		},
		[currentDifficulty, currentProgramIndex, traceTableScoreManager],
	);

	// Help section
	const helpSection = currentProgram ? (
		<div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500 mt-6 max-w-full">
			<div className="flex items-center justify-between mb-3">
				<h2 className="text-lg font-semibold text-gray-800">Need Help?</h2>
				<QuizButton
					variant="primary"
					size="sm"
					onClick={() => setShowHints(!showHints)}
				>
					{showHints ? "Hide" : "Show"} Help
				</QuizButton>
			</div>
			<HintPanel
				isVisible={showHints}
				title="📝 Trace Table Tips:"
				items={siteConfig.hints || []}
			/>
		</div>
	) : null;

	return (
		<QuizLayout
			title={siteConfig.title}
			subtitle={siteConfig.subtitle}
			titleIcon={siteConfig.icon}
			scoreButton={
				<ScoreButton
					levelEmoji={overallStats.level.emoji}
					levelTitle={overallStats.level.title}
					points={overallStats.totalPoints}
					onClick={() => setShowStatsModal(true)}
				/>
			}
		>
			<div className="space-y-6">
				{/* Program Selection */}
				<ProgramSelector
					onProgramSelect={handleProgramSelect}
					scoreManager={traceTableScoreManager}
				/>

				{/* Trace Table Interface */}
				{currentProgram && (
					<TraceTableBody
						currentProgram={currentProgram}
						interpreter={interpreter}
						onScoreUpdate={handleScoreUpdate}
						difficulty={currentDifficulty}
						programIndex={currentProgramIndex}
					/>
				)}

				{/* Help Section */}
				{helpSection}
			</div>

			{/* Statistics Modal */}
			<StatsModal
				isOpen={showStatsModal}
				onClose={() => setShowStatsModal(false)}
				scoreManager={scoreManager}
				title="Trace Table Statistics"
			/>
		</QuizLayout>
	);
}
