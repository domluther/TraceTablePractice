import { useCallback, useEffect, useId, useState } from "react";
import { type Program, programs } from "@/lib/programs";
import type { ScoreManager } from "@/lib/scoreManager";
import type { Difficulty } from "@/lib/types";
import { QuizButton } from "./QuizButton";

interface ProgramSelectorProps {
	onProgramSelect: (
		program: Program,
		difficulty: Difficulty,
		index: number,
	) => void;
	onDifficultyChange?: (difficulty: Difficulty) => void;
	scoreManager: ScoreManager;
	currentDifficulty?: Difficulty;
}

export function ProgramSelector({
	onProgramSelect,
	onDifficultyChange,
	scoreManager,
	currentDifficulty,
}: ProgramSelectorProps) {
	const [selectedDifficulty, setSelectedDifficulty] =
		useState<Difficulty>("easy");
	const difficultySelectId = useId();

	// Sync with parent difficulty
	useEffect(() => {
		if (
			currentDifficulty &&
			["easy", "medium", "hard"].includes(currentDifficulty)
		) {
			setSelectedDifficulty(currentDifficulty);
		}
	}, [currentDifficulty]);

	const handleProgramSelect = useCallback(
		(program: Program, index: number) => {
			// Just pass the raw program - let the parent handle pickProgramInputs
			onProgramSelect(program, selectedDifficulty, index);
		},
		[selectedDifficulty, onProgramSelect],
	);

	const generateRandomProgram = useCallback(() => {
		const programList = programs[selectedDifficulty];
		const randomIndex = Math.floor(Math.random() * programList.length);
		handleProgramSelect(programList[randomIndex], randomIndex);
	}, [selectedDifficulty, handleProgramSelect]);

	const getScoreDisplay = useCallback(
		(difficulty: Difficulty, index: number) => {
			return scoreManager.getScoreDisplay(difficulty, index);
		},
		[scoreManager],
	);

	return (
		<details open>
			<summary className="my-2 text-xl font-semibold text-nav-item-text">
				🖥️ Pick a program
			</summary>

			{/* Controls */}
			<div className="flex items-center mb-6 gap-6">
				<div className="flex items-center gap-3">
					<label
						htmlFor={difficultySelectId}
						className="font-bold text-stats-label text-md"
					>
						Difficulty:
					</label>
					<select
						id={difficultySelectId}
						value={selectedDifficulty}
						onChange={(e) => {
							const newDifficulty = e.target.value as Difficulty;
							setSelectedDifficulty(newDifficulty);
							onDifficultyChange?.(newDifficulty);
						}}
						className="px-3 py-1.5 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
					>
						<option value="easy">Easy</option>
						<option value="medium">Medium</option>
						<option value="hard">Hard</option>
					</select>
				</div>

				<QuizButton onClick={generateRandomProgram} size="xs">
					🎲 Random
				</QuizButton>
			</div>

			{/* Program Table */}
			<div className="overflow-scroll bg-card rounded-lg shadow-sm max-h-96">
				<table className="w-full text-base bg-card border-collapse">
					<thead>
						<tr className="sticky top-0 z-10 bg-button-primary">
							<th className="px-4 py-3 font-semibold text-left text-button-primary-text border-b border-border">
								Program
							</th>
							<th className="px-4 py-3 font-semibold text-left text-button-primary-text border-b border-border">
								Best Score
							</th>
							<th className="px-4 py-3 font-semibold text-left text-button-primary-text border-b border-border">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{programs[selectedDifficulty].map((program, index) => {
							const scoreDisplay = getScoreDisplay(selectedDifficulty, index);
							return (
								<tr
									key={`${selectedDifficulty}-${index}-${program.description}`}
									className="border-b border-border transition-colors duration-150 hover:bg-checkbox-label-bg-hover"
								>
									<td className="px-4 py-3 align-middle">
										<div>
											<div className="font-medium text-card-foreground">
												{program.description}
											</div>
											{program.inputSets && (
												<div className="mt-1 text-xs text-muted-foreground">
													Multiple input variations available
												</div>
											)}
										</div>
									</td>
									<td className="px-4 py-3 align-middle">
										<span
											className={`inline-block min-w-24 text-center px-2 py-1 rounded-full text-xs font-semibold ${
												// No attempt grey, otherwise colour coded
												scoreDisplay.accuracy === null
													? "bg-muted text-muted-foreground"
													: scoreDisplay.accuracy >= 80
														? "bg-feedback-success-bg text-feedback-success-text"
														: scoreDisplay.accuracy >= 60
															? "bg-stats-accuracy-medium/20 text-stats-accuracy-medium"
															: scoreDisplay.accuracy >= 40
																? "bg-stats-accuracy-medium/30 text-stats-accuracy-medium"
																: "bg-feedback-error-bg text-feedback-error-text"
											}`}
										>
											{scoreDisplay.text}
										</span>
									</td>
									<td className="px-4 py-3 align-middle">
										<QuizButton
											onClick={() => handleProgramSelect(program, index)}
											size="xs"
											variant="selection"
										>
											Select
										</QuizButton>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</details>
	);
}
