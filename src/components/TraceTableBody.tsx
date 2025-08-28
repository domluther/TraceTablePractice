import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
	ASTInterpreter,
	TraceStep,
	VariableValue,
} from "@/lib/astInterpreter";
import type { Program } from "@/lib/programs";
import type { Difficulty } from "@/lib/types";
import { ProgramCode } from "./ProgramCode";
import { QuizButton } from "./QuizButton";

interface TraceTableBodyProps {
	currentProgram: Program | null;
	interpreter: ASTInterpreter;
	onScoreUpdate: (correct: number, total: number) => void;
	difficulty: Difficulty;
	programIndex: number;
	onPreviousProgram?: () => void;
	onNextProgram?: () => void;
	canGoPrevious?: boolean;
	canGoNext?: boolean;
	onProgramCodeIdReady?: (id: string) => void;
}

interface UserTraceEntry {
	id: string;
	lineNumber: string;
	variables: Record<string, string>;
	output: string;
}

export function TraceTableBody({
	currentProgram,
	interpreter,
	onScoreUpdate,
	difficulty,
	programIndex,
	onPreviousProgram,
	onNextProgram,
	canGoPrevious = false,
	canGoNext = false,
	onProgramCodeIdReady,
}: TraceTableBodyProps) {
	const [expectedTrace, setExpectedTrace] = useState<TraceStep[]>([]);
	const [programVariables, setProgramVariables] = useState<string[]>([]);
	const [userEntries, setUserEntries] = useState<UserTraceEntry[]>([]);
	const [feedback, setFeedback] = useState<{
		message: string;
		isCorrect: boolean;
		details?: string[];
	} | null>(null);
	const [cellResults, setCellResults] = useState<{
		[key: string]: boolean; // key format: "rowIndex-fieldName", value: isCorrect
	}>({});
	const [isMarked, setIsMarked] = useState(false);

	// Ref to focus on the first input cell after clearing
	const firstInputRef = useRef<HTMLInputElement>(null);

	// Generate unique ID for the program code section
	const programCodeId = useId();

	// Notify parent component of the program code ID
	useEffect(() => {
		onProgramCodeIdReady?.(programCodeId);
	}, [programCodeId, onProgramCodeIdReady]);

	// Execute program and generate expected trace when program changes
	useEffect(() => {
		if (currentProgram) {
			try {
				const result = interpreter.executeProgram(
					currentProgram.code,
					currentProgram,
				);
				setExpectedTrace(result.trace);
				setProgramVariables(result.variables);

				// Initialize empty user entries
				const emptyEntries: UserTraceEntry[] = [];
				for (let i = 0; i < result.trace.length + 3; i++) {
					const entry: UserTraceEntry = {
						id: `entry-${Date.now()}-${i}`,
						lineNumber: "",
						variables: {},
						output: "",
					};
					result.variables.forEach((varName) => {
						entry.variables[varName] = "";
					});
					emptyEntries.push(entry);
				}
				setUserEntries(emptyEntries);
				setFeedback(null);
				setIsMarked(false);
			} catch (error) {
				console.error("Error executing program:", error);
			}
		}
	}, [currentProgram, interpreter]);

	const updateUserEntry = useCallback(
		(rowIndex: number, field: string, value: string) => {
			setUserEntries((prev) => {
				const updated = [...prev];
				if (field === "lineNumber") {
					updated[rowIndex].lineNumber = value;
				} else if (field === "output") {
					updated[rowIndex].output = value;
				} else {
					updated[rowIndex].variables[field] = value;
				}
				return updated;
			});

			// Only clear marking if not already marked, to avoid clearing feedback when typing
			// User can re-mark to update results
		},
		[],
	);

	const markAnswer = useCallback(() => {
		if (!expectedTrace || expectedTrace.length === 0) {
			setFeedback({
				message: "Please generate a program first!",
				isCorrect: false,
			});
			return;
		}

		// Filter out empty user entries
		const validUserEntries = userEntries.filter(
			(entry) => entry.lineNumber.trim() !== "",
		);

		let correct = 0;
		let total = 0;
		const newCellResults: { [key: string]: boolean } = {};

		// Track variable values throughout execution to know when they change
		const currentValues: Record<string, VariableValue> = {};
		programVariables.forEach((varName) => {
			currentValues[varName] = undefined;
		});
		let userIndex = 0;
		const errors: string[] = [];

		expectedTrace.forEach((expectedStep) => {
			const lineNum = expectedStep.lineNumber;

			// Use the interpreter's changedVariables which correctly tracks what changed
			const changedVariables = new Set<string>();

			// First, add variables that the interpreter explicitly marked as changed
			if (expectedStep.changedVariables) {
				Object.keys(expectedStep.changedVariables).forEach((varName) => {
					changedVariables.add(varName);
				});
			}

			// Update current values based on the full variable state
			Object.keys(expectedStep.variables).forEach((varName) => {
				currentValues[varName] = expectedStep.variables[varName];
			});

			// Check if user has an entry for this line
			if (
				userIndex < validUserEntries.length &&
				parseInt(validUserEntries[userIndex].lineNumber, 10) === lineNum
			) {
				const userEntry = validUserEntries[userIndex];
				const actualUserIndex = userEntries.indexOf(userEntry);

				// Check line number (already correct since we matched it)
				total++;
				correct++;
				newCellResults[`${actualUserIndex}-lineNumber`] = true;

				// Check ALL variables - mark as correct if they match expected behavior
				programVariables.forEach((varName) => {
					total++;
					const userValue = userEntry.variables[varName]?.trim() || "";

					if (changedVariables.has(varName)) {
						// Variable should have a value (it changed)
						// For array elements, get the value from changedVariables
						// For regular variables, get from currentValues
						let expectedValue: VariableValue;
						if (
							expectedStep.changedVariables &&
							expectedStep.changedVariables[varName] !== undefined
						) {
							expectedValue = expectedStep.changedVariables[varName];
						} else {
							expectedValue = currentValues[varName];
						}

						let expectedStr = "";
						if (expectedValue !== undefined) {
							if (Array.isArray(expectedValue)) {
								expectedStr = `[${expectedValue.join(", ")}]`;
							} else {
								expectedStr = String(expectedValue);
							}
						}

						const isCorrect = userValue === expectedStr;
						newCellResults[`${actualUserIndex}-${varName}`] = isCorrect;

						if (isCorrect) {
							correct++;
						} else {
							errors.push(
								`Line ${lineNum}: Expected ${varName} = "${expectedStr}", got "${userValue}"`,
							);
						}
					} else {
						// Variable should be blank (it didn't change)
						const isCorrect = userValue === "";
						newCellResults[`${actualUserIndex}-${varName}`] = isCorrect;

						if (isCorrect) {
							correct++;
						} else {
							errors.push(
								`Line ${lineNum}: Expected ${varName} to be blank (variable doesn't change), got "${userValue}"`,
							);
						}
					}
				});

				// Check output
				total++;
				const expectedOutput = expectedStep.output;
				const userOutput = userEntry.output.trim();
				const outputCorrect = userOutput === expectedOutput;
				newCellResults[`${actualUserIndex}-output`] = outputCorrect;

				if (outputCorrect) {
					correct++;
				} else {
					errors.push(
						`Line ${lineNum}: Expected output "${expectedOutput}", got "${userOutput}"`,
					);
				}

				userIndex++;
			} else {
				// Missing line entry - count all cells as incorrect
				total += 1 + programVariables.length + 1; // Always count output cell
				expectedStep.output.length > 0 ? 1 : 0;
				errors.push(`Missing entry for line ${lineNum}`);
			}
		});

		// Check for extra user entries
		while (userIndex < validUserEntries.length) {
			const userEntry = validUserEntries[userIndex];
			const actualUserIndex = userEntries.indexOf(userEntry);

			errors.push(`Unexpected entry for line ${userEntry.lineNumber}`);

			// Mark all cells in extra entries as incorrect
			total++; // line number
			newCellResults[`${actualUserIndex}-lineNumber`] = false;

			programVariables.forEach((varName) => {
				total++;
				newCellResults[`${actualUserIndex}-${varName}`] = false;
			});

			// Always count output cell to be consistent
			total++; // output
			newCellResults[`${actualUserIndex}-output`] = false;
			userIndex++;
		}

		const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
		const isCorrect = percentage >= 80; // Use 80% threshold like legacy

		const feedbackTitle = isCorrect ? "Well done!" : "Not quite right.";
		const feedbackMessage = `${feedbackTitle} You got ${correct}/${total} correct (${percentage}%)`;

		setCellResults(newCellResults);
		setFeedback({
			message: feedbackMessage,
			isCorrect,
			details: errors.length > 0 ? errors : undefined,
		});

		setIsMarked(true);
		onScoreUpdate(correct, total);
	}, [expectedTrace, userEntries, programVariables, onScoreUpdate]);

	const clearTable = useCallback(() => {
		// Check if there's any user input before confirming
		const hasUserInput = userEntries.some(
			(entry) =>
				entry.lineNumber.trim() !== "" ||
				Object.values(entry.variables).some((value) => value.trim() !== "") ||
				entry.output.trim() !== "",
		);

		// Only show confirmation if there's actually data to clear
		if (hasUserInput) {
			if (
				!confirm(
					"Are you sure you want to clear the trace table? This will remove all your entries.",
				)
			) {
				return;
			}
		}

		const clearedEntries = userEntries.map((entry) => ({
			id: entry.id, // Preserve the original ID
			lineNumber: "",
			variables: Object.fromEntries(
				programVariables.map((varName) => [varName, ""]),
			),
			output: "",
		}));
		setUserEntries(clearedEntries);
		setFeedback(null);
		setCellResults({});
		setIsMarked(false);

		// Focus on the first input cell after clearing
		setTimeout(() => {
			firstInputRef.current?.focus();
		}, 0);
	}, [userEntries, programVariables]);

	// Helper function to get cell styling based on correctness
	const getCellClassName = (rowIndex: number, fieldName: string) => {
		const cellKey = `${rowIndex}-${fieldName}`;
		const isCorrect = cellResults[cellKey];

		// Base classes that maintain consistent sizing and styling
		const baseClass =
			"w-full h-8 px-2 text-center text-sm rounded-sm border-none focus:outline-2 focus:outline-blue-500 focus:bg-blue-50 box-border";

		if (isMarked && isCorrect !== undefined) {
			if (isCorrect) {
				return `${baseClass} bg-green-100 text-green-800 border-green-400`;
			} else {
				return `${baseClass} bg-red-100 text-red-800 border-red-400`;
			}
		}
		return `${baseClass} bg-white`;
	};

	const shuffleInputs = useCallback(() => {
		if (currentProgram?.inputSets && currentProgram.inputSets.length > 1) {
			// Get all input sets except the current one
			const availableInputSets = currentProgram.inputSets.filter(
				(inputSet) =>
					JSON.stringify(inputSet) !== JSON.stringify(currentProgram.inputs),
			);

			// If no different input sets available, use any random one
			const inputSetsToChooseFrom =
				availableInputSets.length > 0
					? availableInputSets
					: currentProgram.inputSets;

			const randomInputSet =
				inputSetsToChooseFrom[
					Math.floor(Math.random() * inputSetsToChooseFrom.length)
				];

			const shuffledProgram = { ...currentProgram, inputs: randomInputSet };

			// Re-execute with new inputs
			try {
				const result = interpreter.executeProgram(
					shuffledProgram.code,
					shuffledProgram,
				);
				setExpectedTrace(result.trace);
				setProgramVariables(result.variables);

				// Update the current program inputs to show the new values
				// This is a bit of a hack since we're mutating the prop, but it's needed
				// to update the displayed input values
				currentProgram.inputs = randomInputSet;

				// Clear user entries
				const emptyEntries: UserTraceEntry[] = [];
				for (let i = 0; i < result.trace.length + 3; i++) {
					const entry: UserTraceEntry = {
						id: `entry-${Date.now()}-${i}`,
						lineNumber: "",
						variables: {},
						output: "",
					};
					result.variables.forEach((varName) => {
						entry.variables[varName] = "";
					});
					emptyEntries.push(entry);
				}
				setUserEntries(emptyEntries);
				setFeedback(null);
				setCellResults({});
				setIsMarked(false);
			} catch (error) {
				console.error("Error shuffling inputs:", error);
			}
		}
	}, [currentProgram, interpreter]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const isInputFocused =
				e.target && (e.target as HTMLElement).tagName === "INPUT";

			switch (e.key) {
				case "Enter":
					e.preventDefault();
					markAnswer();
					break;
				case "Escape":
					e.preventDefault();
					clearTable();
					break;
				case "s":
				case "S":
					// Only respond to letter shortcuts when not focused on an input
					if (isInputFocused) return;
					e.preventDefault();
					shuffleInputs();
					break;
				case "n":
				case "N":
					// Only respond to letter shortcuts when not focused on an input
					if (isInputFocused) return;
					e.preventDefault();
					if (onNextProgram && canGoNext) {
						onNextProgram();
					}
					break;
				case "p":
				case "P":
					// Only respond to letter shortcuts when not focused on an input
					if (isInputFocused) return;
					e.preventDefault();
					if (onPreviousProgram && canGoPrevious) {
						onPreviousProgram();
					}
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		markAnswer,
		clearTable,
		shuffleInputs,
		onNextProgram,
		onPreviousProgram,
		canGoNext,
		canGoPrevious,
	]);

	if (!currentProgram) {
		return (
			<Card>
				<CardContent className="p-6">
					<p className="text-center text-gray-500">
						Select a program to start practicing!
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			{/* Code Display */}

			<ProgramCode
				currentProgram={currentProgram}
				difficulty={difficulty}
				programIndex={programIndex}
				programCodeId={programCodeId}
			/>

			{/* Trace Table */}
			<Card className="shadow-sm border-slate-200">
				<CardHeader className="pb-3">
					<CardTitle className="text-lg font-semibold text-slate-800">
						Trace Table
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="overflow-auto bg-white rounded-lg max-h-96">
						<table className="w-full text-sm bg-white border-collapse table-fixed">
							<thead>
								<tr className="sticky top-0 z-10 bg-slate-600">
									<th className="px-2 py-3 font-semibold text-center text-white border border-gray-800">
										Line Number
									</th>
									{programVariables.map((varName) => (
										<th
											key={varName}
											className="px-2 py-3 font-semibold text-center text-white border border-gray-800"
										>
											{varName}
										</th>
									))}
									<th className="px-2 py-3 font-semibold text-center text-white border border-gray-800">
										Output
									</th>
								</tr>
							</thead>
							<tbody>
								{userEntries.map((entry, rowIndex) => (
									<tr
										key={entry.id}
										className="transition-colors hover:bg-gray-50"
									>
										<td className="p-1 text-center border border-slate-200">
											<input
												ref={rowIndex === 0 ? firstInputRef : undefined}
												type="number"
												className={getCellClassName(rowIndex, "lineNumber")}
												value={entry.lineNumber}
												onChange={(e) =>
													updateUserEntry(
														rowIndex,
														"lineNumber",
														e.target.value,
													)
												}
												placeholder=""
											/>
										</td>
										{programVariables.map((varName) => (
											<td
												key={varName}
												className="p-1 text-center border border-slate-200"
											>
												<input
													type="text"
													className={getCellClassName(rowIndex, varName)}
													value={entry.variables[varName] || ""}
													onChange={(e) =>
														updateUserEntry(rowIndex, varName, e.target.value)
													}
													placeholder=""
												/>
											</td>
										))}
										<td className="p-1 text-center border border-slate-200">
											<input
												type="text"
												className={getCellClassName(rowIndex, "output")}
												value={entry.output}
												onChange={(e) =>
													updateUserEntry(rowIndex, "output", e.target.value)
												}
												placeholder=""
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			{/* Action Buttons */}
			<div className="flex flex-wrap justify-center gap-2">
				{onPreviousProgram && (
					<QuizButton
						onClick={onPreviousProgram}
						variant="selection"
						disabled={!canGoPrevious}
					>
						← Previous
					</QuizButton>
				)}
				<QuizButton onClick={markAnswer} variant="action">
					✅ Mark My Answer
				</QuizButton>
				{currentProgram.inputSets && currentProgram.inputSets.length > 1 && (
					<QuizButton onClick={shuffleInputs} variant="secondary">
						🔄 Shuffle Inputs
					</QuizButton>
				)}
				<QuizButton onClick={clearTable} variant="destructive">
					🗑️ Clear Table
				</QuizButton>
				{onNextProgram && (
					<QuizButton
						onClick={onNextProgram}
						variant="selection"
						disabled={!canGoNext}
					>
						Next →
					</QuizButton>
				)}{" "}
			</div>

			{/* Feedback */}
			{feedback && (
				<Card
					className={`mt-6 border-2 ${feedback.isCorrect ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"}`}
				>
					<CardContent className="p-6">
						<div
							className={`feedback ${feedback.isCorrect ? "correct" : "incorrect"}`}
						>
							<p
								className={`text-base font-semibold ${feedback.isCorrect ? "text-green-700" : "text-red-700"}`}
							>
								<strong>{feedback.message.split("You got")[0].trim()}</strong>{" "}
								{feedback.message.includes("You got")
									? `You got ${feedback.message.split("You got")[1]}`
									: ""}
							</p>
							{feedback.details && feedback.details.length > 0 && (
								<div className="mt-4 feedback-details">
									<p
										className={`text-sm font-semibold mb-3 ${feedback.isCorrect ? "text-green-700" : "text-red-700"}`}
									>
										<strong>Details:</strong>
									</p>
									<div className="space-y-2">
										{feedback.details.map((error) => (
											<div
												key={error}
												className="p-2 font-mono text-sm leading-relaxed text-red-800 bg-red-100 rounded feedback-item incorrect"
											>
												{error}
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Keyboard Shortcuts Help */}
			<div className="mx-auto my-4 border border-blue-100 rounded-lg bg-blue-50">
				<details open>
					<summary className="relative flex items-center gap-2 px-4 py-3 font-semibold text-gray-600 list-none cursor-pointer select-none">
						<span className="inline-block text-xs transition-transform duration-200 arrow-icon">
							▶
						</span>
						⌨️ Keyboard Shortcuts
					</summary>
					<div className="grid grid-cols-1 gap-2 p-4 pt-0 border-t border-blue-100 sm:flex sm:justify-evenly">
						<span className="flex items-center gap-2 text-sm text-gray-600">
							<kbd className="kbd-style">Enter</kbd>
							Mark Answer
						</span>
						{onNextProgram && (
							<span className="flex items-center gap-2 text-sm text-gray-600">
								<kbd className="kbd-style">N</kbd>
								Next Program
							</span>
						)}
						{onPreviousProgram && (
							<span className="flex items-center gap-2 text-sm text-gray-600">
								<kbd className="kbd-style">P</kbd>
								Previous Program
							</span>
						)}
						<span className="flex items-center gap-2 text-sm text-gray-600">
							<kbd className="kbd-style">S</kbd>
							Shuffle Inputs
						</span>
						<span className="flex items-center gap-2 text-sm text-gray-600">
							<kbd className="kbd-style">Esc</kbd>
							Clear Table
						</span>
					</div>
				</details>
			</div>
		</div>
	);
}
