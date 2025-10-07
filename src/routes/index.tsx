import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
	ProgramSelector,
	ScoreButton,
	SiteLayout,
	StatsModal,
	TraceTableBody,
} from "@/components";
import { Panel } from "@/components/Panel";
import { ASTInterpreter } from "@/lib/astInterpreter";
import type { Program } from "@/lib/programs";
import { programs } from "@/lib/programs";
import { ScoreManager } from "@/lib/scoreManager";
import { SITE_CONFIG } from "@/lib/siteConfig";
import type { Difficulty } from "@/lib/types";
import { pickProgramInputs } from "@/lib/utils";

type SearchParams = {
	difficulty?: Difficulty;
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
					return diff as Difficulty;
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
	const [currentDifficulty, setCurrentDifficulty] =
		useState<Difficulty>("easy");
	const [currentProgramIndex, setCurrentProgramIndex] = useState<number>(-1);
	const [showStatsModal, setShowStatsModal] = useState(false);
	// Used for scrolling
	const [programCodeId, setProgramCodeId] = useState<string>("");

	// Score update trigger to force re-renders when score changes
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_scoreUpdateTrigger, setScoreUpdateTrigger] = useState(0);

	// Get overall stats (computed fresh on each render)
	const overallStats = scoreManager.getOverallStats();

	// Used to set a program
	useEffect(() => {
		const { difficulty, program: programIndex } = search;

		// Set difficulty from URL or default to "easy"
		const selectedDifficulty = difficulty || "easy";
		setCurrentDifficulty(selectedDifficulty);

		if (typeof programIndex === "number" && programIndex >= 0) {
			const programList = programs[selectedDifficulty];

			if (programList && programIndex < programList.length) {
				const program = pickProgramInputs(programList[programIndex]);
				setCurrentProgram(program);
				setCurrentProgramIndex(programIndex);
			}
		} else {
			// Clear program if no valid program index in URL
			setCurrentProgram(null);
			setCurrentProgramIndex(-1);
		}
	}, [search]);

	// Helper function to scroll to program code section
	const scrollToProgramCode = useCallback(() => {
		setTimeout(() => {
			const programCodeSection = document.getElementById(programCodeId);
			if (programCodeSection) {
				programCodeSection.scrollIntoView({
					behavior: "smooth",
				});
			}
		}, 0);
	}, [programCodeId]);

	// Handle when program code ID is ready
	const handleProgramCodeIdReady = useCallback((id: string) => {
		setProgramCodeId(id);
	}, []);

	// Central function to navigate to a specific program
	const navigateToProgram = useCallback(
		(difficulty: Difficulty, index: number) => {
			const programList = programs[difficulty as Difficulty] || programs.easy;

			if (index >= 0 && index < programList.length) {
				// Update URL using Tanstack Router navigation
				navigate({
					search: {
						difficulty: difficulty as Difficulty,
						program: index,
					},
				});

				scrollToProgramCode();
			}
		},
		[navigate, scrollToProgramCode],
	);

	const handleProgramSelect = useCallback(
		(_program: Program, difficulty: Difficulty, index: number) => {
			navigateToProgram(difficulty, index);
		},
		[navigateToProgram],
	);

	const handleDifficultyChange = useCallback(
		(difficulty: Difficulty) => {
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

	// Helper functions for difficulty progression
	const getDifficultyOrder = useCallback((): Difficulty[] => {
		return ["easy", "medium", "hard"];
	}, []);

	const getNextDifficultyAndIndex = useCallback(
		(
			currentDiff: Difficulty,
			currentIdx: number,
		): { difficulty: Difficulty; index: number } | null => {
			const difficulties = getDifficultyOrder();
			const currentProgramList = programs[currentDiff] || [];

			// If not at the end of current difficulty, move to next program in same difficulty
			if (currentIdx < currentProgramList.length - 1) {
				return { difficulty: currentDiff, index: currentIdx + 1 };
			}

			// At the end of current difficulty, try to move to next difficulty
			const currentDiffIndex = difficulties.indexOf(currentDiff);
			if (currentDiffIndex < difficulties.length - 1) {
				const nextDifficulty = difficulties[currentDiffIndex + 1];
				const nextProgramList = programs[nextDifficulty] || [];
				if (nextProgramList.length > 0) {
					return { difficulty: nextDifficulty, index: 0 };
				}
			}

			return null; // No next program available
		},
		[getDifficultyOrder],
	);

	const getPreviousDifficultyAndIndex = useCallback(
		(
			currentDiff: Difficulty,
			currentIdx: number,
		): { difficulty: Difficulty; index: number } | null => {
			const difficulties = getDifficultyOrder();

			// If not at the beginning of current difficulty, move to previous program in same difficulty
			if (currentIdx > 0) {
				return { difficulty: currentDiff, index: currentIdx - 1 };
			}

			// At the beginning of current difficulty, try to move to previous difficulty
			const currentDiffIndex = difficulties.indexOf(currentDiff);
			if (currentDiffIndex > 0) {
				const prevDifficulty = difficulties[currentDiffIndex - 1];
				const prevProgramList = programs[prevDifficulty] || [];
				if (prevProgramList.length > 0) {
					return {
						difficulty: prevDifficulty,
						index: prevProgramList.length - 1,
					};
				}
			}

			return null; // No previous program available
		},
		[getDifficultyOrder],
	);

	const handlePreviousProgram = useCallback(() => {
		const previousNav = getPreviousDifficultyAndIndex(
			currentDifficulty,
			currentProgramIndex,
		);
		if (previousNav) {
			navigateToProgram(previousNav.difficulty, previousNav.index);
		}
	}, [
		currentProgramIndex,
		currentDifficulty,
		navigateToProgram,
		getPreviousDifficultyAndIndex,
	]);

	const handleNextProgram = useCallback(() => {
		const nextNav = getNextDifficultyAndIndex(
			currentDifficulty,
			currentProgramIndex,
		);
		if (nextNav) {
			navigateToProgram(nextNav.difficulty, nextNav.index);
		}
	}, [
		currentProgramIndex,
		currentDifficulty,
		navigateToProgram,
		getNextDifficultyAndIndex,
	]);

	// Helper functions for determining navigation availability
	const canNavigatePrevious = useCallback(() => {
		return (
			getPreviousDifficultyAndIndex(currentDifficulty, currentProgramIndex) !==
			null
		);
	}, [currentDifficulty, currentProgramIndex, getPreviousDifficultyAndIndex]);

	const canNavigateNext = useCallback(() => {
		return (
			getNextDifficultyAndIndex(currentDifficulty, currentProgramIndex) !== null
		);
	}, [currentDifficulty, currentProgramIndex, getNextDifficultyAndIndex]);

	const handleScoreUpdate = useCallback(
		(correct: number, total: number) => {
			if (currentDifficulty && currentProgramIndex >= 0) {
				scoreManager.recordScore(
					currentDifficulty,
					currentProgramIndex,
					correct,
					total,
				);
				// Update stats immediately after score changes
				setScoreUpdateTrigger((prev) => prev + 1);
			}
		},
		[currentDifficulty, currentProgramIndex, scoreManager],
	);

	return (
		<SiteLayout
			title={siteConfig.title}
			subtitle={siteConfig.subtitle}
			titleIcon={siteConfig.icon}
			scoreButton={
				<ScoreButton
					levelEmoji={overallStats.currentLevel.emoji}
					levelTitle={overallStats.currentLevel.title}
					points={overallStats.totalPoints}
					onClick={() => setShowStatsModal(true)}
				/>
			}
		>
			<div className="space-y-6">
				<Panel>
					{/* Program Selection */}
					<ProgramSelector
						onProgramSelect={handleProgramSelect}
						onDifficultyChange={handleDifficultyChange}
						scoreManager={scoreManager}
						currentDifficulty={currentDifficulty}
					/>
				</Panel>

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
						onProgramCodeIdReady={handleProgramCodeIdReady}
						canGoPrevious={canNavigatePrevious()}
						canGoNext={canNavigateNext()}
						siteConfig={siteConfig}
					/>
				)}
			</div>

			{/* Statistics Modal */}
			<StatsModal
				isOpen={showStatsModal}
				onClose={() => setShowStatsModal(false)}
				scoreManager={scoreManager}
				title="Trace Table Statistics"
				onStatsUpdate={() => setScoreUpdateTrigger((prev) => prev + 1)}
			/>
		</SiteLayout>
	);
}
