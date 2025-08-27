import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
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

type SearchParams = {
	difficulty?: "easy" | "medium" | "hard";
	program?: number;
};

export const Route = createFileRoute("/")({
	validateSearch: (search: Record<string, unknown>): SearchParams => {
		return {
			difficulty: (() => {
				const diff = search.difficulty;
				if (
					typeof diff === "string" &&
					["easy", "medium", "hard"].includes(diff)
				) {
					return diff as "easy" | "medium" | "hard";
				}
				return undefined;
			})(),
			program: (() => {
				const prog = search.program;
				// Handle both string and number types
				if (typeof prog === "string") {
					const num = parseInt(prog, 10);
					return Number.isNaN(num) || num < 0 ? undefined : num;
				} else if (typeof prog === "number") {
					return prog < 0 ? undefined : prog;
				}
				return undefined;
			})(),
		};
	},
	component: Index,
});

function Index() {
	const siteConfig = SITE_CONFIG;
	const search = useSearch({ from: "/" });
	const navigate = useNavigate({ from: "/" });

	// Score manager
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
			const stats = scoreManager.getTraceTableStats();

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
	}, [scoreManager, siteConfig.scoring.customLevels]);

	// Load program from URL using Tanstack Router search
	useEffect(() => {
		const { difficulty, program: programIndex } = search;

		// Set difficulty from URL or default to "easy"
		const selectedDifficulty = difficulty || "easy";
		setCurrentDifficulty(selectedDifficulty);

		if (typeof programIndex === "number" && programIndex >= 0) {
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
	}, [search]);

	const handleProgramSelect = useCallback(
		(program: Program, difficulty: string, index: number) => {
			setCurrentProgram(program);
			setCurrentDifficulty(difficulty);
			setCurrentProgramIndex(index);

			// Update URL using Tanstack Router navigation
			navigate({
				search: {
					difficulty: difficulty as "easy" | "medium" | "hard",
					program: index,
				},
			});
		},
		[navigate],
	);

	const handleDifficultyChange = useCallback(
		(difficulty: "easy" | "medium" | "hard") => {
			setCurrentDifficulty(difficulty);
			// Clear current program when difficulty changes
			setCurrentProgram(null);
			setCurrentProgramIndex(-1);

			// Update URL using Tanstack Router navigation
			navigate({
				search: {
					difficulty,
				},
			});
		},
		[navigate],
	);

	const handlePreviousProgram = useCallback(() => {
		if (currentProgramIndex > 0) {
			const newIndex = currentProgramIndex - 1;
			const programList =
				programs[currentDifficulty as "easy" | "medium" | "hard"] ||
				programs.easy;
			const program = { ...programList[newIndex] };

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
			setCurrentProgramIndex(newIndex);

			navigate({
				search: {
					difficulty: currentDifficulty as "easy" | "medium" | "hard",
					program: newIndex,
				},
			});
		}
	}, [currentProgramIndex, currentDifficulty, navigate]);

	const handleNextProgram = useCallback(() => {
		const programList =
			programs[currentDifficulty as "easy" | "medium" | "hard"] ||
			programs.easy;
		if (currentProgramIndex < programList.length - 1) {
			const newIndex = currentProgramIndex + 1;
			const program = { ...programList[newIndex] };

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
			setCurrentProgramIndex(newIndex);

			navigate({
				search: {
					difficulty: currentDifficulty as "easy" | "medium" | "hard",
					program: newIndex,
				},
			});
		}
	}, [currentProgramIndex, currentDifficulty, navigate]);

	const handleScoreUpdate = useCallback(
		(correct: number, total: number) => {
			if (currentDifficulty && currentProgramIndex >= 0) {
				scoreManager.saveScore(
					currentDifficulty,
					currentProgramIndex,
					correct,
					total,
				);
			}
		},
		[currentDifficulty, currentProgramIndex, scoreManager],
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
					scoreManager={scoreManager}
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
						onPreviousProgram={handlePreviousProgram}
						onNextProgram={handleNextProgram}
						canGoPrevious={currentProgramIndex > 0}
						canGoNext={
							currentProgramIndex <
							(
								programs[currentDifficulty as "easy" | "medium" | "hard"] ||
								programs.easy
							).length -
								1
						}
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
