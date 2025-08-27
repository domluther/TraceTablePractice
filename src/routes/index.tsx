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
import { programs } from "@/lib/programs";
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

	// Load program from URL on mount
	useEffect(() => {
		// Access raw search parameters from window location
		const urlParams = new URLSearchParams(window.location.search);
		const difficulty = urlParams.get('difficulty') as "easy" | "medium" | "hard" | null;
		const programParam = urlParams.get('program');
		const programIndex = programParam ? parseInt(programParam, 10) : null;
		
		// Set difficulty from URL or default to "easy"
		const selectedDifficulty = (difficulty && ["easy", "medium", "hard"].includes(difficulty)) ? difficulty : "easy";
		setCurrentDifficulty(selectedDifficulty);
		
		if (typeof programIndex === "number" && programIndex >= 0 && !isNaN(programIndex)) {
			const programList = programs[selectedDifficulty];
			
			if (programList && programIndex < programList.length) {
				const program = { ...programList[programIndex] };
				
				// Apply random selections as in ProgramSelector
				if (program.inputSets && program.inputSets.length > 0) {
					const randomInputSet =
						program.inputSets[
							Math.floor(Math.random() * program.inputSets.length)
						];
					program.inputs = randomInputSet;
				}

				if (program.randomValues && program.randomValues.length > 0) {
					const randomValue =
						program.randomValues[
							Math.floor(Math.random() * program.randomValues.length)
						];
					program.randomValue = randomValue;
				}

				setCurrentProgram(program);
				setCurrentProgramIndex(programIndex);
			}
		} else {
			// Clear program if no valid program index in URL
			setCurrentProgram(null);
			setCurrentProgramIndex(-1);
		}
	}, []);  // Only run on mount

	const handleProgramSelect = useCallback(
		(program: Program, difficulty: string, index: number) => {
			setCurrentProgram(program);
			setCurrentDifficulty(difficulty);
			setCurrentProgramIndex(index);
			
			// Update URL with new selection using window.history
			const url = new URL(window.location.href);
			url.searchParams.set('difficulty', difficulty);
			url.searchParams.set('program', index.toString());
			window.history.replaceState({}, '', url.toString());
		},
		[],
	);

	const handleDifficultyChange = useCallback(
		(difficulty: "easy" | "medium" | "hard") => {
			setCurrentDifficulty(difficulty);
			// Clear current program when difficulty changes
			setCurrentProgram(null);
			setCurrentProgramIndex(-1);
			
			// Update URL with new difficulty only
			const url = new URL(window.location.href);
			url.searchParams.set('difficulty', difficulty);
			url.searchParams.delete('program'); // Remove program parameter
			window.history.replaceState({}, '', url.toString());
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
					onDifficultyChange={handleDifficultyChange}
					scoreManager={traceTableScoreManager}
					currentDifficulty={currentDifficulty}
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
