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
			// If the program has multiple input sets, randomly select one
			const selectedProgram = { ...program };
			if (program.inputSets && program.inputSets.length > 0) {
				const randomInputSet =
					program.inputSets[
						Math.floor(Math.random() * program.inputSets.length)
					];
				selectedProgram.inputs = randomInputSet;
			}

			// If the program has multiple random values, randomly select one
			if (program.randomValues && program.randomValues.length > 0) {
				const randomValue =
					program.randomValues[
						Math.floor(Math.random() * program.randomValues.length)
					];
				selectedProgram.randomValue = randomValue;
			}

			onProgramSelect(selectedProgram, selectedDifficulty, index);
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
			<summary className="my-2 text-xl font-semibold text-gray-800">
				🖥️ Pick a program
			</summary>

			{/* Controls */}
			<div className="flex items-center gap-6 mb-6">
				<div className="flex items-center gap-3">
					<label
						htmlFor={difficultySelectId}
						className="font-bold text-gray-700 text-md"
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
						className="px-3 py-1.5 border border-gray-400 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
			<div className="overflow-scroll bg-white rounded-lg shadow-sm max-h-96">
				<table className="w-full text-base bg-white border-collapse">
					<thead>
						<tr className="sticky top-0 z-10 bg-gradient-to-br from-gray-800 to-gray-900">
							<th className="px-4 py-3 font-semibold text-left text-white border-b">
								Program
							</th>
							<th className="px-4 py-3 font-semibold text-left text-white border-b">
								Best Score
							</th>
							<th className="px-4 py-3 font-semibold text-left text-white border-b">
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
									className="transition-colors duration-150 border-b hover:bg-gray-50"
								>
									<td className="px-4 py-3 align-middle">
										<div>
											<div className="font-medium text-gray-800">
												{program.description}
											</div>
											{program.inputSets && (
												<div className="mt-1 text-xs text-gray-500">
													Multiple input variations available
												</div>
											)}
										</div>
									</td>
									<td className="px-4 py-3 align-middle">
										<span
											className={`inline-block min-w-24 text-center px-2 py-1 rounded-full text-xs font-semibold ${
												scoreDisplay.className === "score-perfect" ||
												scoreDisplay.className === "score-good"
													? "bg-emerald-200 text-emerald-800"
													: scoreDisplay.className === "score-okay"
														? "bg-lime-200 text-lime-800"
														: scoreDisplay.className === "score-poor"
															? "bg-amber-200 text-amber-800"
															: scoreDisplay.className === "score-bad"
																? "bg-red-200 text-red-800"
																: "bg-gray-200 text-gray-600"
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
