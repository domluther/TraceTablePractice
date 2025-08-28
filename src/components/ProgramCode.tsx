import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import type { Program } from "@/lib/astInterpreter";
import type { Difficulty } from "@/lib/types";
import { captureElement } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ProgramCodeProps {
	currentProgram: Program;
	difficulty: Difficulty;
	programIndex: number;
	programCodeId: string;
}

export function ProgramCode({
	currentProgram,
	difficulty,
	programIndex,
	programCodeId,
}: ProgramCodeProps) {
	const cardRef = useRef<HTMLDivElement | null>(null);

	// Get program display name
	const getProgramDisplayName = (): string => {
		const difficultyName =
			difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
		return `${difficultyName} #${programIndex}`;
	};

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
	const generateShareURL = useCallback(async () => {
		if (!currentProgram) return;

		const shareURL = `${window.location.origin}${window.location.pathname}?difficulty=${difficulty}&program=${programIndex}`;

		try {
			await navigator.clipboard.writeText(shareURL);
		} catch (_err) {
			alert(`Share this URL: ${shareURL}`);
		}
	}, [currentProgram, difficulty, programIndex]);

	const valuesToDisplay =
		(currentProgram.inputs && currentProgram.inputs.length > 0) ||
		currentProgram.randomValue !== undefined;

	return (
		<Card
			ref={cardRef}
			id={programCodeId}
			className="gap-4 py-0 border-l-4 shadow-xl bg-slate-700 border-slate-600 border-l-blue-500"
		>
			<CardHeader className="border-b bg-gradient-to-br from-gray-800 to-gray-900 px-4 !pb-2 !pt-2 rounded-t-lg">
				<div className="flex flex-col justify-between gap-3 md:flex-row lg:items-center">
					<div className="flex flex-col">
						<CardTitle className="text-lg font-semibold text-white">
							Program Code
						</CardTitle>
						{currentProgram && (
							<div className="flex items-center gap-3">
								<span className="text-sm font-light text-blue-300 rounded-md ">
									{getProgramDisplayName()}: {currentProgram.description}
								</span>
							</div>
						)}
					</div>
					{currentProgram && (
						<div className="flex items-center flex-shrink-0 gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									window.open(generateERLURL(currentProgram.code), "_blank")
								}
								className="text-sm font-light text-blue-300 transition-all duration-200 bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500 hover:text-white"
							>
								💻 Open in ERL IDE
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={generateShareURL}
								className="text-sm font-light text-blue-300 transition-all duration-200 bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500 hover:text-white"
							>
								🔗 Share Link
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={() => captureElement(cardRef, getProgramDisplayName())}
								className="text-sm font-light text-blue-300 transition-all duration-200 bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500 hover:text-white"
							>
								📸 Screenshot
							</Button>
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent className="p-0 pt-0 pb-2 font-mono">
				<div className="overflow-x-auto ">
					<pre className="py-2 pl-2 m-0 text-sm leading-relaxed">
						{currentProgram.code.split("\n").map((line, index) => (
							<div
								key={`line-${index}-${line}`}
								className="flex transition-colors duration-150 hover:bg-slate-600"
							>
								<span className="text-blue-300 bg-slate-700 border-r border-slate-700 px-1 py-2 select-none min-w-[3rem] text-right font-medium text-xs leading-none">
									{index + 1}
								</span>
								<span className="flex-1 px-4 py-1 leading-none text-slate-100">
									{line || " "}
								</span>
							</div>
						))}
					</pre>
				</div>
				{valuesToDisplay && (
					<div className="p-2">
						{currentProgram.inputs && currentProgram.inputs.length > 0 && (
							<div className="px-3 py-0">
								<div className="flex items-start gap-2">
									<div className="flex-1">
										<div className="mb-1 text-sm font-medium text-blue-300">
											Input Values:{" "}
											<span className="font-mono text-sm text-blue-300">
												{currentProgram.inputs
													.map((input) => `"${input}"`)
													.join(", ")}
											</span>
										</div>
									</div>
								</div>
							</div>
						)}
						{currentProgram.randomValue !== undefined && (
							<div className="px-3 py-0">
								<div className="flex items-start gap-2">
									<div className="flex-1">
										<div className="mb-1 text-sm font-medium text-blue-300">
											Random Value: {currentProgram.randomValue}
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
