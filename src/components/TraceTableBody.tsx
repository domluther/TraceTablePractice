import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ASTInterpreter, TraceStep } from "@/lib/astInterpreter";
import type { Program } from "@/lib/programs";

interface TraceTableBodyProps {
	currentProgram: Program | null;
	interpreter: ASTInterpreter;
	onScoreUpdate: (correct: number, total: number) => void;
	difficulty: string;
	programIndex: number;
}

interface UserTraceEntry {
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
		const currentValues: Record<string, any> = {};
		programVariables.forEach((varName) => {
			currentValues[varName] = undefined;
		});

		let userIndex = 0;
		const errors: string[] = [];

		expectedTrace.forEach((expectedStep) => {
			const lineNum = expectedStep.lineNumber;

			// Determine which variables changed on this line
			const changedVariables = new Set<string>();
			Object.keys(expectedStep.variables).forEach((varName) => {
				const newValue = expectedStep.variables[varName];
				if (newValue !== undefined && newValue !== currentValues[varName]) {
					changedVariables.add(varName);
					currentValues[varName] = newValue;
				}
			});

			// Check if user has an entry for this line
			if (
				userIndex < validUserEntries.length &&
				parseInt(validUserEntries[userIndex].lineNumber) === lineNum
			) {
				const userEntry = validUserEntries[userIndex];
				const actualUserIndex = userEntries.findIndex(
					(entry) => entry === userEntry,
				);

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
						const expectedValue = currentValues[varName];
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
				const expectedOutput = expectedStep.output.join("");
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
				total +=
					1 +
					programVariables.length +
					(expectedStep.output.length > 0 ? 1 : 0);
				errors.push(`Missing entry for line ${lineNum}`);
			}
		});

		// Check for extra user entries
		while (userIndex < validUserEntries.length) {
			const userEntry = validUserEntries[userIndex];
			const actualUserIndex = userEntries.findIndex(
				(entry) => entry === userEntry,
			);

			errors.push(`Unexpected entry for line ${userEntry.lineNumber}`);

			// Mark all cells in extra entries as incorrect
			total++; // line number
			newCellResults[`${actualUserIndex}-lineNumber`] = false;

			programVariables.forEach((varName) => {
				total++;
				newCellResults[`${actualUserIndex}-${varName}`] = false;
			});

			if (
				userEntry.output?.trim() ||
				expectedTrace.some((step) => step.output.length > 0)
			) {
				total++; // output
				newCellResults[`${actualUserIndex}-output`] = false;
			}

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
		const clearedEntries = userEntries.map(() => ({
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
	}, [userEntries, programVariables]);

	// Helper function to get cell styling based on correctness
	const getCellClassName = (rowIndex: number, fieldName: string) => {
		const cellKey = `${rowIndex}-${fieldName}`;
		const isCorrect = cellResults[cellKey];

		let baseClass =
			"w-full border-none p-2 text-center text-sm bg-white rounded";

		if (isMarked && isCorrect !== undefined) {
			if (isCorrect) {
				// Legacy correct styling: --success-bg: #c6f6d5, --success-text: #22543d, --success-border: #9ae6b4
				baseClass += " !important";
				return (
					baseClass + " focus:outline-2 focus:outline-blue-500 focus:bg-blue-50"
				);
			} else {
				// Legacy incorrect styling: --error-bg: #fed7d7, --error-text: #c53030, --error-border: #feb2b2
				baseClass += " !important";
				return (
					baseClass + " focus:outline-2 focus:outline-blue-500 focus:bg-blue-50"
				);
			}
		} else {
			baseClass += " focus:outline-2 focus:outline-blue-500 focus:bg-blue-50";
		}

		return baseClass;
	};

	// Helper function to get cell inline styles for correct/incorrect coloring
	const getCellStyle = (rowIndex: number, fieldName: string) => {
		const cellKey = `${rowIndex}-${fieldName}`;
		const isCorrect = cellResults[cellKey];

		if (isMarked && isCorrect !== undefined) {
			if (isCorrect) {
				return {
					background: "#c6f6d5",
					color: "#22543d",
					border: "1px solid #9ae6b4",
				};
			} else {
				return {
					background: "#fed7d7",
					color: "#c53030",
					border: "1px solid #feb2b2",
				};
			}
		}

		return {
			background: "#ffffff",
			borderRadius: "4px",
			padding: "8px",
			fontSize: "13px",
		};
	};

	const shuffleInputs = useCallback(() => {
		if (currentProgram?.inputSets && currentProgram.inputSets.length > 0) {
			const randomInputSet =
				currentProgram.inputSets[
					Math.floor(Math.random() * currentProgram.inputSets.length)
				];
			const shuffledProgram = { ...currentProgram, inputs: randomInputSet };

			// Re-execute with new inputs
			const result = interpreter.executeProgram(
				shuffledProgram.code,
				shuffledProgram,
			);
			setExpectedTrace(result.trace);
			clearTable();
		}
	}, [currentProgram, interpreter, clearTable]);

	// Helper function to encode code for ERL IDE URL
	const encodeForERL = useCallback((code: string): string => {
		return code
			.replace(/\\/g, "%5C") // Convert backslashes to %5C
			.replace(/"/g, "%5C%22") // Convert double quotes to \\" -> %5C%22
			.replace(/'/g, "%27") // Convert single quotes to %27
			.replace(/\?/g, "%3F") // Convert question marks to %3F
			.replace(/=/g, "%3D") // Convert equals signs to %3D
			.replace(/\+/g, "%2B") // Convert + operators to %2B
			.replace(/\n/g, "%5Cn") // Convert newlines to %5Cn
			.replace(/ /g, "+") // Convert spaces to +
			.replace(/\(/g, "%28") // Convert ( to %28
			.replace(/\)/g, "%29"); // Convert ) to %29
	}, []);

	// Generate ERL IDE URL
	const generateERLURL = useCallback(
		(code: string): string => {
			const encodedCode = encodeForERL(code);
			return `https://www.examreferencelanguage.co.uk/index.php?code=%5B%7B%22name%22%3A%22code%22%2C%22content%22%3A%22${encodedCode}%22%7D%5D`;
		},
		[encodeForERL],
	);

	// Share current program
	const shareProgram = useCallback(async () => {
		if (!currentProgram) return;

		const shareURL = `${window.location.origin}${window.location.pathname}?difficulty=${difficulty}&program=${programIndex}`;

		try {
			await navigator.clipboard.writeText(shareURL);
			// You could add a toast notification here
			console.log("Share URL copied to clipboard:", shareURL);
		} catch (error) {
			console.error("Failed to copy to clipboard:", error);
			// Fallback: show URL in alert
			alert(`Share this URL: ${shareURL}`);
		}
	}, [currentProgram, difficulty, programIndex]);

	// Get program display name
	const getProgramDisplayName = useCallback((): string => {
		if (!currentProgram || difficulty === "" || programIndex < 0) return "";

		const difficultyName =
			difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
		return `${difficultyName} #${programIndex}`;
	}, [currentProgram, difficulty, programIndex]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Only respond to keyboard shortcuts when not focused on an input
			if (e.target && (e.target as HTMLElement).tagName === "INPUT") {
				return;
			}

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
					e.preventDefault();
					shuffleInputs();
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [markAnswer, clearTable, shuffleInputs]);

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
		<div className="space-y-6">
			{/* Code Display */}
			<Card className="border-slate-200 shadow-sm">
				<CardHeader className="pb-3">
					<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
						<div className="flex flex-col gap-2">
							<CardTitle className="text-lg font-semibold text-slate-800">
								Program Code
							</CardTitle>
							{currentProgram && (
								<div className="flex items-center gap-3">
									<span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
										{getProgramDisplayName()}: {currentProgram.description}
									</span>
								</div>
							)}
						</div>
						{currentProgram && (
							<div className="flex items-center gap-2 flex-shrink-0">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										window.open(generateERLURL(currentProgram.code), "_blank")
									}
									className="text-xs hover:bg-blue-50 hover:border-blue-200 transition-colors"
								>
									🖥️ Open in ERL IDE
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={shareProgram}
									className="text-xs hover:bg-green-50 hover:border-green-200 transition-colors"
								>
									🔗 Share Link
								</Button>
							</div>
						)}
					</div>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="bg-slate-50 rounded-lg p-4 overflow-x-auto border border-slate-200">
						<pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed">
							{currentProgram.code.split("\n").map((line, index) => (
								<div
									key={index}
									className="flex hover:bg-slate-100 px-1 py-0.5 rounded"
								>
									<span className="text-slate-400 mr-4 select-none w-8 text-right font-medium text-xs">
										{index + 1}
									</span>
									<span className="text-slate-800">{line || " "}</span>
								</div>
							))}
						</pre>
					</div>
					<div className="mt-4 space-y-2">
						{currentProgram.inputs && currentProgram.inputs.length > 0 && (
							<div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
								<div className="flex items-start gap-2">
									<span className="text-blue-600 text-sm">📝</span>
									<div className="flex-1">
										<div className="text-sm font-medium text-blue-800 mb-1">
											Input Values
										</div>
										<div className="text-sm text-blue-700 font-mono">
											{currentProgram.inputs
												.map((input) => `"${input}"`)
												.join(", ")}
										</div>
									</div>
								</div>
							</div>
						)}
						{currentProgram.randomValue !== undefined && (
							<div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
								<div className="flex items-start gap-2">
									<span className="text-purple-600 text-sm">🎲</span>
									<div className="flex-1">
										<div className="text-sm font-medium text-purple-800 mb-1">
											Random Value
										</div>
										<div className="text-sm text-purple-700 font-mono">
											{currentProgram.randomValue}
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Trace Table */}
			<Card className="border-slate-200 shadow-sm">
				<CardHeader className="pb-3">
					<CardTitle className="text-lg font-semibold text-slate-800">
						Trace Table
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-0">
					<div
						className="bg-white rounded-lg p-5 max-h-96 overflow-auto"
						style={{
							borderRadius: "8px",
						}}
					>
						<table className="w-full border-collapse bg-white text-sm">
							<thead>
								<tr
									className="sticky top-0 z-10"
									style={{
										background: "#4a5568",
									}}
								>
									<th
										className="text-center text-white font-semibold border border-gray-800 p-3"
										style={{
											padding: "12px 8px",
										}}
									>
										Line Number
									</th>
									{programVariables.map((varName) => (
										<th
											key={varName}
											className="text-center text-white font-semibold border border-gray-800 p-3"
											style={{
												padding: "12px 8px",
											}}
										>
											{varName}
										</th>
									))}
									<th
										className="text-center text-white font-semibold border border-gray-800 p-3"
										style={{
											padding: "12px 8px",
										}}
									>
										Output
									</th>
								</tr>
							</thead>
							<tbody>
								{userEntries.map((entry, rowIndex) => (
									<tr
										key={rowIndex}
										className="hover:bg-gray-50 transition-colors"
									>
										<td
											className="text-center bg-white p-1"
											style={{
												border: "1px solid #e2e8f0",
												padding: "5px",
											}}
										>
											<input
												type="text"
												className={getCellClassName(rowIndex, "lineNumber")}
												style={getCellStyle(rowIndex, "lineNumber")}
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
												className="text-center bg-white p-1"
												style={{
													border: "1px solid #e2e8f0",
													padding: "5px",
												}}
											>
												<input
													type="text"
													className={getCellClassName(rowIndex, varName)}
													style={getCellStyle(rowIndex, varName)}
													value={entry.variables[varName] || ""}
													onChange={(e) =>
														updateUserEntry(rowIndex, varName, e.target.value)
													}
													placeholder=""
												/>
											</td>
										))}
										<td
											className="text-center bg-white p-1"
											style={{
												border: "1px solid #e2e8f0",
												padding: "5px",
											}}
										>
											<input
												type="text"
												className={getCellClassName(rowIndex, "output")}
												style={getCellStyle(rowIndex, "output")}
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
			<div className="flex flex-wrap gap-2 justify-center">
				<Button
					onClick={markAnswer}
					className="bg-green-600 hover:bg-green-700"
				>
					✅ Mark My Answer
				</Button>
				<Button onClick={clearTable} variant="destructive">
					🗑️ Clear Table
				</Button>
				{currentProgram.inputSets && currentProgram.inputSets.length > 1 && (
					<Button onClick={shuffleInputs} variant="secondary">
						🔄 Shuffle Inputs
					</Button>
				)}
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
									? "You got" + feedback.message.split("You got")[1]
									: ""}
							</p>
							{feedback.details && feedback.details.length > 0 && (
								<div className="feedback-details mt-4">
									<p
										className={`text-sm font-semibold mb-3 ${feedback.isCorrect ? "text-green-700" : "text-red-700"}`}
									>
										<strong>Details:</strong>
									</p>
									<div className="space-y-2">
										{feedback.details.map((error, index) => (
											<div
												key={index}
												className="feedback-item incorrect bg-red-100 p-2 rounded text-sm font-mono text-red-800 leading-relaxed"
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
			<Card>
				<CardContent className="p-4">
					<details>
						<summary className="cursor-pointer text-sm font-medium">
							⌨️ Keyboard Shortcuts
						</summary>
						<div className="mt-2 space-y-1 text-sm text-gray-600">
							<div>
								<kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> Mark
								Answer
							</div>
							<div>
								<kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> Clear
								Table
							</div>
						</div>
					</details>
				</CardContent>
			</Card>
		</div>
	);
}
