import { useCallback, useId, useState } from "react";
import { type Program, programs } from "@/lib/programs";
import type { TraceTableScoreManager } from "@/lib/traceTableScoreManager";

interface ProgramSelectorProps {
	onProgramSelect: (
		program: Program,
		difficulty: string,
		index: number,
	) => void;
	scoreManager: TraceTableScoreManager;
}

export function ProgramSelector({
	onProgramSelect,
	scoreManager,
}: ProgramSelectorProps) {
	const [selectedDifficulty, setSelectedDifficulty] = useState<
		"easy" | "medium" | "hard"
	>("easy");
	const difficultySelectId = useId();

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
		(difficulty: string, index: number) => {
			return scoreManager.getScoreDisplay(difficulty, index);
		},
		[scoreManager],
	);

	return (
		<div className="bg-white">
			<h3 className="text-xl font-semibold mb-6 text-gray-800">
				Select a program
			</h3>

			{/* Controls */}
			<div className="flex items-center gap-6 mb-6">
				<div className="flex items-center gap-3">
					<label
						htmlFor={difficultySelectId}
						className="text-sm font-medium text-gray-700"
					>
						Difficulty:
					</label>
					<select
						id={difficultySelectId}
						value={selectedDifficulty}
						onChange={(e) =>
							setSelectedDifficulty(
								e.target.value as "easy" | "medium" | "hard",
							)
						}
						className="px-3 py-1.5 border border-gray-400 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="easy">Easy</option>
						<option value="medium">Medium</option>
						<option value="hard">Hard</option>
					</select>
				</div>

				<button
					onClick={generateRandomProgram}
					className="px-4 py-1.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-medium rounded-md hover:from-orange-500 hover:to-orange-600 transition-all duration-200 shadow-sm"
					title="Pick a random program from current difficulty"
					type="button"
				>
					🎲 Random
				</button>
			</div>

			{/* Program Table */}
			<div
				className="bg-white rounded-lg shadow-sm max-h-96 overflow-auto"
				style={{
					borderRadius: "8px",
					boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
				}}
			>
				<table className="w-full border-collapse bg-white text-sm">
					<thead>
						<tr
							className="sticky top-0 z-10"
							style={{
								background: "#2d3748",
							}}
						>
							<th
								className="px-4 py-3 text-left font-semibold text-white border-b"
								style={{
									borderBottom: "1px solid #4a5568",
									padding: "15px 20px",
								}}
							>
								Program
							</th>
							<th
								className="px-4 py-3 text-left font-semibold text-white border-b"
								style={{
									borderBottom: "1px solid #4a5568",
									padding: "15px 20px",
								}}
							>
								Last Score
							</th>
							<th
								className="px-4 py-3 text-left font-semibold text-white border-b"
								style={{
									borderBottom: "1px solid #4a5568",
									padding: "15px 20px",
								}}
							>
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
									className="hover:bg-gray-50 transition-colors duration-150"
									style={{
										borderBottom: "1px solid #e2e8f0",
									}}
								>
									<td
										className="px-4 py-3 align-middle"
										style={{
											padding: "15px 20px",
										}}
									>
										<div>
											<div className="font-medium text-gray-800">
												{program.description}
											</div>
											{program.inputSets && (
												<div className="text-xs text-gray-500 mt-1">
													Multiple input variations available
												</div>
											)}
										</div>
									</td>
									<td
										className="px-4 py-3 align-middle"
										style={{
											padding: "15px 20px",
										}}
									>
										<span
											className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
												scoreDisplay.className === "score-perfect"
													? "bg-green-100 text-green-800"
													: scoreDisplay.className === "score-good"
														? "bg-blue-100 text-blue-800"
														: scoreDisplay.className === "score-okay"
															? "bg-yellow-100 text-yellow-800"
															: scoreDisplay.className === "score-poor"
																? "bg-red-100 text-red-800"
																: "bg-gray-100 text-gray-600"
											}`}
										>
											{scoreDisplay.text}
										</span>
									</td>
									<td
										className="px-4 py-3 align-middle"
										style={{
											padding: "15px 20px",
										}}
									>
										<button
											onClick={() => handleProgramSelect(program, index)}
											className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
											type="button"
										>
											Select
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
