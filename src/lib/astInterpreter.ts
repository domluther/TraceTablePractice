// Simplified AST Interpreter for OCR ERL Trace Table Practice
// This is a focused version that generates trace steps for educational purposes

export interface TraceStep {
	lineNumber: number;
	variables: Record<string, any>;
	output: string[];
}

export interface ExecutionResult {
	trace: TraceStep[];
	variables: string[];
	outputs: string[];
}

export interface Program {
	code: string;
	description: string;
	inputs?: string[];
	randomValue?: number | string;
}

/**
 * Simplified interpreter that focuses on generating trace table data
 * This is not a complete ERL interpreter but provides enough functionality
 * for educational trace table practice
 */
export class ASTInterpreter {
	private variables: Record<string, any> = {};
	private outputs: string[] = [];
	private trace: TraceStep[] = [];
	private programInputs: string[] = [];
	private inputIndex = 0;

	executeProgram(code: string, program: Program): ExecutionResult {
		// Reset state
		this.variables = {};
		this.outputs = [];
		this.trace = [];
		this.programInputs = program.inputs || [];
		this.inputIndex = 0;

		const lines = code.trim().split("\n");
		this.interpretLines(lines);

		// Get all variable names that were used
		const allVariables = new Set<string>();
		this.trace.forEach((step) => {
			Object.keys(step.variables).forEach((varName) => {
				allVariables.add(varName);
			});
		});

		return {
			trace: this.trace,
			variables: Array.from(allVariables).sort(),
			outputs: this.outputs,
		};
	}

	private interpretLines(lines: string[]): void {
		let i = 0;
		while (i < lines.length) {
			const line = lines[i].trim();
			if (line && !line.startsWith("//")) {
				i = this.executeLine(line, i + 1, lines) || i + 1;
			} else {
				i++;
			}
		}
	}

	private executeLine(
		line: string,
		lineNumber: number,
		allLines: string[],
	): number | void {
		const currentOutputs: string[] = [];

		try {
			// Handle different statement types
			if (
				line.includes(" = ") &&
				!line.includes("==") &&
				!line.includes("!=") &&
				!line.includes("<=") &&
				!line.includes(">=")
			) {
				this.handleAssignment(line);
			} else if (line.startsWith("print(")) {
				this.handlePrint(line, currentOutputs);
			} else if (line.startsWith("if ")) {
				return this.handleIf(line, lineNumber, allLines);
			} else if (line.startsWith("for ")) {
				return this.handleFor(line, lineNumber, allLines);
			} else if (line.startsWith("while ")) {
				return this.handleWhile(line, lineNumber, allLines);
			}

			// Create trace step
			this.addTraceStep(lineNumber, currentOutputs);
		} catch (error) {
			console.warn(`Error executing line ${lineNumber}: ${line}`, error);
			this.addTraceStep(lineNumber, [`Error: ${error}`]);
		}
	}

	private handleAssignment(line: string): void {
		const match = line.match(/^\s*([a-zA-Z_]\w*(?:\[[^\]]+\])?\s*) = (.+)$/);
		if (!match) return;

		const [, target, expression] = match;
		const varName = target.replace(/\[.*\]/, "").trim();
		const value = this.evaluateExpression(expression.trim());

		if (target.includes("[")) {
			// Array assignment
			const arrayMatch = target.match(/([a-zA-Z_]\w*)\[(.+)\]/);
			if (arrayMatch) {
				const [, arrayName, indexExpr] = arrayMatch;
				const index = this.evaluateExpression(indexExpr);
				if (!this.variables[arrayName]) {
					this.variables[arrayName] = [];
				}
				if (Array.isArray(this.variables[arrayName])) {
					this.variables[arrayName][index] = value;
				}
			}
		} else {
			// Regular variable assignment
			this.variables[varName] = value;
		}
	}

	private handlePrint(line: string, currentOutputs: string[]): void {
		const match = line.match(/^print\((.+)\)$/);
		if (!match) return;

		const expression = match[1].trim();
		const value = this.evaluateExpression(expression);
		const output = String(value);

		this.outputs.push(output);
		currentOutputs.push(output);
	}

	private handleIf(
		line: string,
		lineNumber: number,
		allLines: string[],
	): number {
		const match = line.match(/^if (.+) then$/);
		if (!match) return lineNumber;

		const condition = this.evaluateExpression(match[1]);
		const endIfIndex = this.findMatchingEndif(lineNumber - 1, allLines);

		if (condition) {
			// Execute then block
			let i = lineNumber;
			while (
				i <= endIfIndex &&
				!allLines[i - 1].trim().startsWith("else") &&
				!allLines[i - 1].trim().startsWith("elseif")
			) {
				const currentLine = allLines[i - 1].trim();
				if (currentLine && !currentLine.startsWith("//")) {
					this.executeLine(currentLine, i, allLines);
				}
				i++;
			}
		} else {
			// Look for else block
			let elseStart = -1;
			for (let i = lineNumber - 1; i < endIfIndex; i++) {
				if (allLines[i].trim().startsWith("else")) {
					elseStart = i + 1;
					break;
				}
			}

			if (elseStart !== -1) {
				let i = elseStart;
				while (i < endIfIndex) {
					const currentLine = allLines[i].trim();
					if (currentLine && !currentLine.startsWith("//")) {
						this.executeLine(currentLine, i + 1, allLines);
					}
					i++;
				}
			}
		}

		return endIfIndex + 1;
	}

	private handleFor(
		line: string,
		lineNumber: number,
		allLines: string[],
	): number {
		const match = line.match(/^for (\w+) = (.+) to (.+)$/);
		if (!match) return lineNumber;

		const [, varName, startExpr, endExpr] = match;
		const startValue = this.evaluateExpression(startExpr);
		const endValue = this.evaluateExpression(endExpr);
		const endForIndex = this.findMatchingEndfor(lineNumber - 1, allLines);

		for (let i = startValue; i <= endValue; i++) {
			this.variables[varName] = i;
			this.addTraceStep(lineNumber, []);

			// Execute loop body
			let bodyLine = lineNumber;
			while (bodyLine < endForIndex) {
				const currentLine = allLines[bodyLine].trim();
				if (currentLine && !currentLine.startsWith("//")) {
					this.executeLine(currentLine, bodyLine + 1, allLines);
				}
				bodyLine++;
			}
		}

		return endForIndex + 1;
	}

	private handleWhile(
		line: string,
		lineNumber: number,
		allLines: string[],
	): number {
		const match = line.match(/^while (.+)$/);
		if (!match) return lineNumber;

		const condition = match[1];
		const endWhileIndex = this.findMatchingEndwhile(lineNumber - 1, allLines);

		while (this.evaluateExpression(condition)) {
			this.addTraceStep(lineNumber, []);

			// Execute loop body
			let bodyLine = lineNumber;
			while (bodyLine < endWhileIndex) {
				const currentLine = allLines[bodyLine].trim();
				if (currentLine && !currentLine.startsWith("//")) {
					this.executeLine(currentLine, bodyLine + 1, allLines);
				}
				bodyLine++;
			}
		}

		return endWhileIndex + 1;
	}

	private isStringConcatenation(expr: string): boolean {
		// Check if the expression is a string concatenation
		// Must contain + and have string indicators
		if (!expr.includes("+")) {
			return false;
		}

		const parts = this.parseStringConcatenation(expr);
		
		const hasStringIndicators = parts.some((part) => {
			const trimmed = part.trim();
			
			// Check for string literals (both single and double quotes)
			if (
				(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
				(trimmed.startsWith("'") && trimmed.endsWith("'"))
			) {
				return true;
			}

			// Check for string methods/functions
			if (
				trimmed.startsWith("str(") ||
				trimmed.includes(".substring(") ||
				trimmed.includes(".toUpperCase(") ||
				trimmed.includes(".toLowerCase(")
			) {
				return true;
			}

			// Check if variable contains a string value
			if (this.variables[trimmed] !== undefined && typeof this.variables[trimmed] === "string") {
				return true;
			}

			return false;
		});

		console.log("String concatenation check:", expr, "->", hasStringIndicators, parts);
		return hasStringIndicators;
	}

	private parseStringConcatenation(expr: string): string[] {
		// Smart parser that handles quotes, parentheses, and function calls
		const parts: string[] = [];
		let current = "";
		let inQuotes = false;
		let quoteChar: string | null = null;
		let parenDepth = 0;
		let i = 0;

		console.log("Parsing expression:", expr);

		while (i < expr.length) {
			const char = expr[i];

			if (
				(char === '"' || char === "'") &&
				(i === 0 || expr[i - 1] !== "\\")
			) {
				if (!inQuotes) {
					// Starting a quoted string
					inQuotes = true;
					quoteChar = char;
					current += char;
				} else if (char === quoteChar) {
					// Ending the quoted string with matching quote
					inQuotes = false;
					quoteChar = null;
					current += char;
				} else {
					// Different quote character inside string
					current += char;
				}
			} else if (!inQuotes && char === "(") {
				parenDepth++;
				current += char;
			} else if (!inQuotes && char === ")") {
				parenDepth--;
				current += char;
			} else if (!inQuotes && parenDepth === 0 && char === "+" && 
					   // Make sure it's a standalone + operator, not part of a number
					   (i === 0 || !/\d/.test(expr[i-1]) || /\s/.test(expr[i-1])) &&
					   (i === expr.length - 1 || !/\d/.test(expr[i+1]) || /\s/.test(expr[i+1]))) {
				// This is a concatenation operator
				if (current.trim()) {
					parts.push(current.trim());
				}
				current = "";
			} else {
				current += char;
			}
			i++;
		}

		if (current.trim()) {
			parts.push(current.trim());
		}

		console.log("Parsed parts:", parts);
		return parts;
	}

	private evaluateStringConcatenation(expr: string): string {
		const parts = this.parseStringConcatenation(expr);
		let result = "";

		parts.forEach((part) => {
			const trimmed = part.trim();
			
			if (trimmed.startsWith("str(") && trimmed.endsWith(")")) {
				// Handle str() function - convert to string
				const argument = trimmed.slice(4, -1).trim();
				const value = this.evaluateExpression(argument);
				result += String(value);
			} else if (
				(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
				(trimmed.startsWith("'") && trimmed.endsWith("'"))
			) {
				// Handle quoted strings
				result += trimmed.slice(1, -1);
			} else if (this.variables[trimmed] !== undefined) {
				// Handle variables
				result += String(this.variables[trimmed]);
			} else if (!isNaN(parseFloat(trimmed))) {
				// Handle numeric literals
				result += trimmed;
			} else if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
				// Handle parenthesized expressions
				const innerExpression = trimmed.slice(1, -1);
				const value = this.evaluateExpression(innerExpression);
				result += String(value);
			} else {
				// Fallback - evaluate as expression
				const value = this.evaluateExpression(trimmed);
				result += String(value);
			}
		});

		return result;
	}

	private evaluateExpression(expr: string): any {
		console.log("Evaluating expression:", expr);
		
		// Handle input() function
		if (expr.includes("input(")) {
			const inputMatch = expr.match(/input\("([^"]*)"\)/);
			if (inputMatch && this.inputIndex < this.programInputs.length) {
				return this.programInputs[this.inputIndex++];
			}
			return ""; // Default input
		}

		// Handle int() function
		if (expr.includes("int(")) {
			const intMatch = expr.match(/int\((.+)\)/);
			if (intMatch) {
				const innerValue = this.evaluateExpression(intMatch[1]);
				return parseInt(String(innerValue)) || 0;
			}
		}

		// Handle str() function
		if (expr.includes("str(")) {
			const strMatch = expr.match(/str\((.+)\)/);
			if (strMatch) {
				const innerValue = this.evaluateExpression(strMatch[1]);
				return String(innerValue);
			}
		}

		// Handle string literals
		if (expr.startsWith('"') && expr.endsWith('"')) {
			return expr.slice(1, -1);
		}

		// Handle numbers
		if (/^-?\d+(\.\d+)?$/.test(expr)) {
			return parseFloat(expr);
		}

		// Handle variables
		if (/^[a-zA-Z_]\w*$/.test(expr)) {
			return this.variables[expr] !== undefined ? this.variables[expr] : 0;
		}

		// Handle array access
		if (expr.includes("[")) {
			const arrayMatch = expr.match(/([a-zA-Z_]\w*)\[(.+)\]/);
			if (arrayMatch) {
				const [, arrayName, indexExpr] = arrayMatch;
				const index = this.evaluateExpression(indexExpr);
				const array = this.variables[arrayName];
				return Array.isArray(array) ? array[index] || 0 : 0;
			}
		}

		// Check for string concatenation before arithmetic
		if (this.isStringConcatenation(expr)) {
			return this.evaluateStringConcatenation(expr);
		}

		// Handle simple arithmetic and comparisons
		try {
			// Replace variables with their values
			let evaluatedExpr = expr;
			Object.keys(this.variables).forEach((varName) => {
				const regex = new RegExp(`\\b${varName}\\b`, "g");
				evaluatedExpr = evaluatedExpr.replace(
					regex,
					String(this.variables[varName]),
				);
			});

			// Handle simple arithmetic
			if (/^[\d\s+\-*/().<>=!]+$/.test(evaluatedExpr)) {
				// Simple evaluation for basic arithmetic and comparisons
				evaluatedExpr = evaluatedExpr.replace(/=/g, "==");
				return Function(`"use strict"; return (${evaluatedExpr})`)();
			}
		} catch (error) {
			console.warn("Error evaluating expression:", expr, error);
		}

		return expr;
	}

	private findMatchingEndif(startLine: number, lines: string[]): number {
		let depth = 1;
		for (let i = startLine + 1; i < lines.length; i++) {
			const line = lines[i].trim();
			if (line.startsWith("if ")) {
				depth++;
			} else if (line === "endif") {
				depth--;
				if (depth === 0) {
					return i;
				}
			}
		}
		return lines.length - 1;
	}

	private findMatchingEndfor(startLine: number, lines: string[]): number {
		let depth = 1;
		for (let i = startLine + 1; i < lines.length; i++) {
			const line = lines[i].trim();
			if (line.startsWith("for ")) {
				depth++;
			} else if (line === "endfor") {
				depth--;
				if (depth === 0) {
					return i;
				}
			}
		}
		return lines.length - 1;
	}

	private findMatchingEndwhile(startLine: number, lines: string[]): number {
		let depth = 1;
		for (let i = startLine + 1; i < lines.length; i++) {
			const line = lines[i].trim();
			if (line.startsWith("while ")) {
				depth++;
			} else if (line === "endwhile") {
				depth--;
				if (depth === 0) {
					return i;
				}
			}
		}
		return lines.length - 1;
	}

	private addTraceStep(lineNumber: number, outputs: string[]): void {
		this.trace.push({
			lineNumber,
			variables: { ...this.variables },
			output: [...outputs],
		});
	}
}
