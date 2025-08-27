// Comprehensive Interpreter for OCR ERL Trace Table Practice
// Converted from the legacy JavaScript interpreter with TypeScript types added

// Define the possible types that ERL variables can hold
export type VariableValue =
	| number
	| string
	| boolean
	| Array<number | string | boolean>
	| undefined;

// Helper functions for safe type conversion
function safeParseInt(value: VariableValue, radix?: number): number {
	const stringValue = value !== undefined ? String(value) : "0";
	const result = parseInt(stringValue, radix);
	return Number.isNaN(result) ? 0 : result;
}

function safeParseFloat(value: VariableValue): number {
	const stringValue = value !== undefined ? String(value) : "0";
	const result = parseFloat(stringValue);
	return Number.isNaN(result) ? 0 : result;
}

function safeToString(value: VariableValue): string {
	return value !== undefined ? String(value) : "";
}

export interface TraceStep {
	lineNumber: number;
	variables: Record<string, VariableValue>;
	output: string;
	changedVariables: Record<string, VariableValue>;
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
 * Comprehensive interpreter that handles all ERL language features
 * Converted from the battle-tested legacy JavaScript interpreter
 */
export class ASTInterpreter {
	private variables: Record<string, VariableValue> = {};
	private constants: Record<string, boolean> = {}; // Track which variables are constants
	private outputs: string[] = [];
	private trace: TraceStep[] = [];
	private inputs: string[] = [];
	private inputIndex = 0;
	private randomValue?: number | string;

	reset(): void {
		this.variables = {};
		this.constants = {};
		this.outputs = [];
		this.trace = [];
		this.inputs = [];
		this.inputIndex = 0;
	}

	// Convenience method for executing code without a program object
	execute(code: string): ExecutionResult {
		return this.executeProgram(code, {
			code,
			description: "",
			inputs: [],
			randomValue: undefined,
		});
	}

	// Execute code without resetting state (for testing)
	executeWithoutReset(code: string): ExecutionResult {
		const lines = code
			.split("\n")
			.map((l) => l.trim())
			.filter((l) => l.length > 0);

		this.executeBlock(lines, 0, lines.length);

		return {
			variables: this.getExpandedVariableNames(),
			outputs: this.outputs,
			trace: this.trace,
		};
	}

	executeProgram(code: string, program: Program): ExecutionResult {
		this.reset();
		this.inputs = program.inputs || [];
		this.inputIndex = 0;
		this.randomValue = program.randomValue;

		const lines = code
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line.length > 0);

		this.executeBlock(lines, 0, lines.length);

		return {
			variables: this.getExpandedVariableNames(),
			outputs: this.outputs,
			trace: this.trace,
		};
	}

	private getExpandedVariableNames(): string[] {
		const expandedNames: string[] = [];

		for (const [name, value] of Object.entries(this.variables)) {
			if (Array.isArray(value)) {
				// Expand array variables into individual elements
				for (let i = 0; i < value.length; i++) {
					expandedNames.push(`${name}[${i}]`);
				}
			} else {
				// Add regular variables as is
				expandedNames.push(name);
			}
		}

		return expandedNames;
	}

	private addTraceEntry(
		lineNum: number,
		vars: Record<string, VariableValue>,
		output = "",
		changedVariables: Record<string, VariableValue> = {},
	): void {
		this.trace.push({
			lineNumber: lineNum,
			variables: { ...vars },
			output: output,
			changedVariables: changedVariables,
		});
	}

	private executeStatement(
		line: string,
		vars: Record<string, VariableValue>,
	): {
		output: string;
		shouldTrace: boolean;
		changedVariables: Record<string, VariableValue>;
	} {
		let output = "";
		const shouldTrace = true;
		const changeRecord: Record<string, VariableValue> = {}; // Track which variables actually change

		if (line.startsWith("array ")) {
			// Array declaration with initialization like "array scores = [85, 92, 78, 90]"
			const initMatch = line.match(/array\s+(\w+)\s*=\s*\[([^\]]+)\]/);
			if (initMatch) {
				const arrayName = initMatch[1];
				const arrayElements = initMatch[2].split(",").map((s) => {
					const trimmed = s.trim();
					return !Number.isNaN(parseFloat(trimmed))
						? parseFloat(trimmed)
						: trimmed.replace(/"/g, "");
				});
				vars[arrayName] = arrayElements;

				// Record each array element as changed
				for (let i = 0; i < arrayElements.length; i++) {
					changeRecord[`${arrayName}[${i}]`] = arrayElements[i];
				}
				// Also record the full array for completeness
				changeRecord[arrayName] = vars[arrayName];
			} else {
				// Array declaration like "array nums[3]" - don't trace empty declarations
				const match = line.match(/array\s+(\w+)\[(\d+)\]/);
				if (match) {
					const arrayName = match[1];
					const size = parseInt(match[2], 10);
					vars[arrayName] = new Array(size).fill(0);
					// Don't add to changeRecord - empty array declarations shouldn't be traced
				}
			}
		} else if (line.startsWith("const ")) {
			// Constant declaration like "const vat = 0.2"
			const constMatch = line.match(/const\s+(\w+)\s*=\s*(.+)/);
			if (constMatch) {
				const constName = constMatch[1];
				const constValue = this.evaluateExpression(constMatch[2], vars);
				vars[constName] = constValue;
				this.constants[constName] = true;
				changeRecord[constName] = constValue;
			}
		} else if (line.startsWith("print(")) {
			// Print statement
			const content = line.substring(6, line.length - 1);

			// Check for comma-separated arguments like print("The score is", score)
			// But be careful not to break function calls like print(substring(x, 1))
			const hasComma = content.includes(",");
			const hasParens = content.includes("(") && content.includes(")");

			if (
				hasComma &&
				(!hasParens || content.indexOf(",") < content.indexOf("("))
			) {
				// This looks like comma-separated arguments, not function arguments
				const parts = content.split(",").map((part) => part.trim());
				const outputParts: string[] = [];

				for (const part of parts) {
					if (
						part.startsWith('"') &&
						part.endsWith('"') &&
						!part.slice(1, -1).includes('"')
					) {
						// Simple string literal
						outputParts.push(part.slice(1, -1));
					} else if (vars[part] !== undefined) {
						// Variable reference
						outputParts.push(safeToString(vars[part]));
					} else {
						// Try to evaluate as expression
						try {
							const result = this.evaluateExpression(part, vars);
							outputParts.push(safeToString(result));
						} catch {
							outputParts.push(part);
						}
					}
				}

				output = outputParts.join(" ");
			} else if (
				content.startsWith('"') &&
				content.endsWith('"') &&
				!content.slice(1, -1).includes('"')
			) {
				// Simple string literal with no internal quotes
				output = content.slice(1, -1);
			} else if (this.isStringConcatenation(content, vars)) {
				// Use the existing string concatenation method which handles complex expressions
				output = this.evaluateStringConcatenation(content, vars);
			} else if (
				content.startsWith("str(") ||
				content.startsWith("int(") ||
				content.startsWith("float(") ||
				content.startsWith("ASC(") ||
				content.startsWith("CHR(")
			) {
				// Handle type conversion functions and special functions
				const result = this.evaluateExpression(content, vars);
				output = safeToString(result);
			} else if (
				content.includes(".upper") ||
				content.includes(".lower") ||
				content.includes(".length") ||
				content.includes(".left(") ||
				content.includes(".right(") ||
				content.includes(".substring(")
			) {
				// Handle string methods in print
				output = this.evaluateStringMethod(content, vars).toString();
			} else if (this.isArithmeticExpression(content)) {
				// Handle arithmetic expressions like print(x*2) - AFTER checking for string methods
				output = this.evaluateArithmeticExpression(content, vars).toString();
			} else if (vars[content] !== undefined) {
				output = vars[content].toString();
			} else {
				// Fallback: if nothing else matches, treat as string concatenation
				output = this.evaluateStringConcatenation(content, vars);
			}
			if (output) this.outputs.push(output);
		} else if (
			line.includes("=") &&
			!line.includes("==") &&
			!line.includes("!=") &&
			!line.includes("<=") &&
			!line.includes(">=")
		) {
			// Assignment
			const [left, right] = line.split("=", 2);
			const varName = left.trim();
			const value = right.trim();

			// Check for reserved keywords
			const reservedKeywords = [
				"if",
				"then",
				"else",
				"endif",
				"for",
				"to",
				"next",
				"while",
				"endwhile",
				"do",
				"until",
				"switch",
				"case",
				"default",
				"endswitch",
				"print",
				"input",
				"array",
				"const",
				"true",
				"false",
				"and",
				"or",
				"not",
				"mod",
				"div",
			];

			if (reservedKeywords.includes(varName.toLowerCase())) {
				throw new Error(
					`Cannot use reserved keyword '${varName}' as a variable name`,
				);
			}

			// Check for constant assignment
			if (this.constants[varName]) {
				throw new Error(`Cannot reassign constant: ${varName}`);
			}

			if (varName.includes("[") && varName.includes("]")) {
				// Array element assignment like nums[0] = 10
				const arrayMatch = varName.match(/(\w+)\[(\w+|\d+)\]/);
				if (arrayMatch) {
					const arrayName = arrayMatch[1];
					const indexStr = arrayMatch[2];

					// Ensure array exists
					if (!vars[arrayName] || !Array.isArray(vars[arrayName])) {
						vars[arrayName] = [];
					}

					let index: number;
					if (/^\d+$/.test(indexStr)) {
						index = parseInt(indexStr, 10);
					} else if (vars[indexStr] !== undefined) {
						const indexValue = vars[indexStr];
						index = parseInt(String(indexValue), 10);
					} else {
						index = 0;
					}
					const newValue = this.evaluateExpression(value, vars);

					// Only record as changed if the value actually changed
					const oldValue = vars[arrayName]?.[index];
					if (oldValue !== newValue) {
						changeRecord[`${arrayName}[${index}]`] = newValue;
					}
					// Ensure we have a valid value for array assignment
					const validValue = newValue !== undefined ? newValue : 0;
					if (Array.isArray(vars[arrayName])) {
						(vars[arrayName] as Array<number | string | boolean>)[index] =
							validValue as number | string | boolean;
					}
				}
			} else {
				// Regular assignment - handle different expression types
				let newValue: VariableValue;

				// Check for type conversion functions first (they can contain string concatenation)
				if (
					value.startsWith("int(") ||
					value.startsWith("str(") ||
					value.startsWith("float(") ||
					value.startsWith("real(") ||
					value.startsWith("bool(") ||
					value.startsWith("ASC(") ||
					value.startsWith("CHR(") ||
					value.startsWith("random(")
				) {
					newValue = this.evaluateExpression(value, vars);
				} else if (this.isStringConcatenation(value, vars)) {
					// Check for string concatenation first (which includes string methods in concatenation)
					newValue = this.evaluateStringConcatenation(value, vars);
				} else if (
					value.includes(".upper") ||
					value.includes(".lower") ||
					value.includes(".left(") ||
					value.includes(".right(") ||
					value.includes(".substring(") ||
					value.includes(".length")
				) {
					// Handle single string methods (not part of concatenation)
					newValue = this.evaluateStringMethod(value, vars);
				} else {
					newValue = this.evaluateExpression(value, vars);
				}

				// Only record as changed if the value actually changed
				const oldValue = vars[varName];
				if (oldValue !== newValue) {
					changeRecord[varName] = newValue;
				}
				vars[varName] = newValue;
			}
		}

		return { output, shouldTrace, changedVariables: changeRecord };
	}

	// Helper function to get value from variable or array access
	private getVariableValue(
		operand: string,
		vars: Record<string, VariableValue>,
	): VariableValue {
		if (operand.includes("[") && operand.includes("]")) {
			// Array access like nums[i] or nums[0]
			const arrayMatch = operand.match(/(\w+)\[(\w+|\d+)\]/);
			if (arrayMatch) {
				const arrayName = arrayMatch[1];
				const indexStr = arrayMatch[2];

				if (vars[arrayName] && Array.isArray(vars[arrayName])) {
					let index: number;
					// Check if index is a literal number or a variable
					if (/^\d+$/.test(indexStr)) {
						// Literal index like [0], [1], etc.
						index = parseInt(indexStr, 10);
					} else {
						// Variable index like [i], [counter], etc.
						if (vars[indexStr] !== undefined) {
							const indexValue = vars[indexStr];
							index = parseInt(String(indexValue), 10);
						} else {
							return undefined;
						}
					}
					if (index >= 0 && index < vars[arrayName].length) {
						return vars[arrayName][index];
					} else {
						// Return 0 for out of bounds access to match legacy behavior
						return 0;
					}
				} else {
					// Array doesn't exist or isn't an array, return 0
					return 0;
				}
			}
			return 0;
		} else {
			return vars[operand];
		}
	}

	private isStringConcatenation(
		value: string,
		vars: Record<string, VariableValue>,
	): boolean {
		// Check if the expression is a string concatenation

		// Check for CHR function calls (which return strings)
		if (value.startsWith("CHR(") && value.endsWith(")")) {
			return true;
		}

		// Check if expression contains + and any string indicators
		if (!value.includes("+")) {
			return false;
		}

		// Parse the expression to find top-level + operators (not inside function calls or parentheses)
		const parts = this.parseStringConcatenation(value);

		// Check if any part is a string indicator
		const hasStringIndicators = parts.some((part) => {
			// Check for string literals (both single and double quotes)
			if (
				(part.startsWith('"') && part.endsWith('"')) ||
				(part.startsWith("'") && part.endsWith("'"))
			) {
				return true;
			}

			// Check for string methods and functions that return strings
			if (
				part.includes(".left(") ||
				part.includes(".right(") ||
				part.includes(".substring(") ||
				part.includes(".upper") ||
				part.includes(".lower") ||
				part.startsWith("str(") ||
				part.startsWith("CHR(") ||
				part.startsWith("ASC(")
			) {
				return true;
			}

			// Check if variable contains a string value
			if (vars[part] !== undefined && typeof vars[part] === "string") {
				return true;
			}

			return false;
		});

		// If we have string indicators, it's definitely string concatenation
		if (hasStringIndicators) {
			return true;
		}

		// If we don't have string indicators, check if all parts are numeric
		// If so, it's numeric addition, not string concatenation
		const allPartsNumeric = parts.every((part) => {
			// Check if it's a number literal
			if (!Number.isNaN(parseFloat(part)) && isFinite(Number(part))) {
				return true;
			}
			
			// Check if it's a numeric variable
			if (vars[part] !== undefined && typeof vars[part] === "number") {
				return true;
			}
			
			// Check if it's array access (like nums[0])
			if (part.includes("[") && part.includes("]")) {
				const arrayValue = this.getVariableValue(part, vars);
				return arrayValue !== undefined && typeof arrayValue === "number";
			}
			
			// Check if it's a simple arithmetic expression without strings
			if (this.isArithmeticExpression(part)) {
				// Remove function calls and check for arithmetic operators
				const withoutFunctions = part.replace(/\w+\([^)]*\)/g, "FUNC");
				return !withoutFunctions.includes('"') && !withoutFunctions.includes("'");
			}
			
			return false;
		});
		
		// If all parts are numeric, it's numeric addition
		if (allPartsNumeric) {
			return false;
		}

		// Default to string concatenation if we can't determine otherwise
		return true;
	}

	private isArithmeticExpression(value: string): boolean {
		// Don't treat string methods or type conversion functions as arithmetic expressions
		if (
			value.includes(".substring(") ||
			value.includes(".left(") ||
			value.includes(".right(") ||
			value.includes(".upper") ||
			value.includes(".lower") ||
			value.includes(".length") ||
			value.startsWith("str(") ||
			value.startsWith("int(") ||
			value.startsWith("float(") ||
			value.startsWith("real(") ||
			value.startsWith("bool(") ||
			value.startsWith("ASC(") ||
			value.startsWith("CHR(")
		) {
			return false;
		}

		// Check if the expression contains arithmetic operators
		return (
			value.includes("+") ||
			value.includes("-") ||
			value.includes("*") ||
			value.includes("/") ||
			value.includes("MOD") ||
			value.includes("DIV") ||
			value.includes("(") ||
			value.includes(")")
		);
	}

	private evaluateStringConcatenation(
		value: string,
		vars: Record<string, VariableValue>,
	): string {
		// Handle single function calls that aren't part of concatenation
		if (value.startsWith("ASC(") && value.endsWith(")")) {
			const argument = value.slice(4, -1);
			return this.evaluateASCFunction(argument, vars).toString(); // Return string representation
		}

		if (value.startsWith("CHR(") && value.endsWith(")")) {
			const argument = value.slice(4, -1);
			return this.evaluateCHRFunction(argument, vars);
		}

		// Smart parsing for string concatenation that handles quotes and parentheses
		const parts = this.parseStringConcatenation(value);
		let result = "";

		parts.forEach((part) => {
			if (part.startsWith("str(") && part.endsWith(")")) {
				// Handle str() function - convert to string
				const argument = part.slice(4, -1).trim();
				if (vars[argument] !== undefined) {
					result += vars[argument].toString();
				} else if (!Number.isNaN(parseFloat(argument))) {
					result += argument.toString();
				} else {
					// Could be an expression
					const value = this.evaluateArithmeticExpression(argument, vars);
					result += value.toString();
				}
			} else if (part.startsWith("ASC(") && part.endsWith(")")) {
				const argument = part.slice(4, -1);
				result += this.evaluateASCFunction(argument, vars).toString();
			} else if (part.startsWith("CHR(") && part.endsWith(")")) {
				const argument = part.slice(4, -1);
				result += this.evaluateCHRFunction(argument, vars);
			} else if (
				(part.startsWith('"') && part.endsWith('"')) ||
				(part.startsWith("'") && part.endsWith("'"))
			) {
				// Handle both single and double quoted strings
				result += part.slice(1, -1);
			} else if (
				part.includes(".left(") ||
				part.includes(".right(") ||
				part.includes(".substring(") ||
				part.includes(".upper") ||
				part.includes(".lower") ||
				part.includes(".length")
			) {
				result += this.evaluateStringMethod(part, vars);
			} else if (part === '""' || part === "''") {
				result += "";
			} else if (part.includes("[") && part.includes("]")) {
				// Handle array access like colours[0]
				const arrayValue = this.getVariableValue(part, vars);
				if (arrayValue !== undefined) {
					result += arrayValue.toString();
				}
			} else if (vars[part] !== undefined) {
				result += vars[part].toString();
			} else if (this.isArithmeticExpression(part)) {
				// Handle arithmetic expressions like (i + 1)
				result += this.evaluateArithmeticExpression(part, vars).toString();
			} else if (part.startsWith("(") && part.endsWith(")")) {
				// Handle parenthesized expressions
				const innerExpression = part.slice(1, -1);
				if (this.isArithmeticExpression(innerExpression)) {
					result += this.evaluateArithmeticExpression(
						innerExpression,
						vars,
					).toString();
				} else if (vars[innerExpression] !== undefined) {
					result += vars[innerExpression].toString();
				}
			}
		});
		return result;
	}

	private parseStringConcatenation(value: string): string[] {
		// Smart parser that handles quotes, parentheses, and function calls
		const parts: string[] = [];
		let current = "";
		let inQuotes = false;
		let quoteChar: string | null = null; // Track which quote character we're in
		let parenDepth = 0;
		let i = 0;

		while (i < value.length) {
			const char = value[i];

			if (
				(char === '"' || char === "'") &&
				(i === 0 || value[i - 1] !== "\\")
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
			} else if (!inQuotes && parenDepth === 0 && char === "+") {
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

		return parts;
	}

	/**
	 * Centralized ASC function evaluation
	 */
	private evaluateASCFunction(
		argument: string,
		vars: Record<string, VariableValue>,
	): number {
		argument = argument.trim();
		let charValue: string;

		if (argument.startsWith('"') && argument.endsWith('"')) {
			// String literal like ASC("A")
			charValue = argument.slice(1, -1);
		} else if (vars[argument] !== undefined) {
			// Variable like ASC(letter)
			const varValue = vars[argument];
			charValue = varValue !== undefined ? varValue.toString() : "";
		} else {
			// Could be an expression or method call
			const result = this.evaluateExpressionOrVariable(argument, vars);
			charValue = safeToString(result);
		}
		if (charValue && charValue.length > 0) {
			return charValue.charCodeAt(0);
		}
		return 0;
	}

	/**
	 * Centralized CHR function evaluation
	 */
	private evaluateCHRFunction(
		argument: string,
		vars: Record<string, VariableValue>,
	): string {
		argument = argument.trim();
		let asciiValue: number;

		if (!Number.isNaN(parseFloat(argument))) {
			// Numeric literal like CHR(65)
			asciiValue = parseInt(argument, 10);
		} else if (vars[argument] !== undefined) {
			// Variable like CHR(ascii_val)
			const varValue = vars[argument];
			asciiValue = parseInt(String(varValue), 10);
		} else {
			// Could be an expression like CHR(ascii_value + 1)
			asciiValue = this.evaluateArithmeticExpression(argument, vars);
		}
		if (!Number.isNaN(asciiValue)) {
			return String.fromCharCode(asciiValue);
		}
		return "";
	}

	/**
	 * Centralized string method evaluation
	 */
	private evaluateStringMethod(
		expression: string,
		vars: Record<string, VariableValue>,
	): string | number {
		if (expression.includes(".left(")) {
			const match = expression.match(/(\w+)\.left\(([^)]+)\)/);
			if (match && vars[match[1]] !== undefined) {
				const varName = match[1];
				const lengthParam = match[2].trim();
				let length: number;
				if (vars[lengthParam] !== undefined) {
					const lengthValue = vars[lengthParam];
					length = parseInt(String(lengthValue), 10);
				} else if (!Number.isNaN(parseInt(lengthParam, 10))) {
					length = parseInt(lengthParam, 10);
				} else {
					length = 1;
				}
				const varValue = vars[varName];
				return varValue !== undefined
					? varValue.toString().substring(0, length)
					: "";
			}
		} else if (expression.includes(".right(")) {
			const match = expression.match(/(\w+)\.right\(([^)]+)\)/);
			if (match && vars[match[1]] !== undefined) {
				const varName = match[1];
				const lengthParam = match[2].trim();
				let length: number;
				if (vars[lengthParam] !== undefined) {
					const lengthValue = vars[lengthParam];
					length = parseInt(String(lengthValue), 10);
				} else if (!Number.isNaN(parseInt(lengthParam, 10))) {
					length = parseInt(lengthParam, 10);
				} else {
					length = 1;
				}
				const varValue = vars[varName];
				if (varValue !== undefined) {
					const str = varValue.toString();
					return str.substring(str.length - length);
				}
			}
		} else if (expression.includes(".substring(")) {
			const match = expression.match(/(\w+)\.substring\(([^,]+),\s*([^)]+)\)/);
			if (match && vars[match[1]] !== undefined) {
				const sourceVar = match[1];
				const startParam = match[2].trim();
				const lengthParam = match[3].trim();

				// Parse start parameter (could be variable or literal)
				let start = 0;
				if (vars[startParam] !== undefined) {
					const startValue = vars[startParam];
					start = parseInt(String(startValue), 10);
				} else if (!Number.isNaN(parseInt(startParam, 10))) {
					start = parseInt(startParam, 10);
				}

				// Parse length parameter (could be variable or literal)
				let length = 1;
				if (vars[lengthParam] !== undefined) {
					const lengthValue = vars[lengthParam];
					length = parseInt(String(lengthValue), 10);
				} else if (!Number.isNaN(parseInt(lengthParam, 10))) {
					length = parseInt(lengthParam, 10);
				}

				const sourceValue = vars[sourceVar];
				return sourceValue !== undefined
					? sourceValue.toString().substring(start, start + length)
					: "";
			}
		} else if (expression.includes(".upper")) {
			const varName = expression.split(".")[0];
			if (vars[varName] !== undefined) {
				const varValue = vars[varName];
				return varValue !== undefined ? varValue.toString().toUpperCase() : "";
			}
		} else if (expression.includes(".lower")) {
			const varName = expression.split(".")[0];
			if (vars[varName] !== undefined) {
				return vars[varName].toString().toLowerCase();
			}
		} else if (expression.includes(".length")) {
			const varName = expression.split(".")[0];
			if (vars[varName] !== undefined) {
				return vars[varName].toString().length;
			}
		}
		return "";
	}

	// =================================================================
	// REFACTORED EXPRESSION EVALUATION
	// =================================================================

	private evaluateExpression(
		expression: string,
		vars: Record<string, VariableValue>,
	): VariableValue {
		// Handle type conversions and simple expressions
		expression = expression.trim();

		// Handle bool() conversion
		if (expression.startsWith("bool(") && expression.endsWith(")")) {
			const inner = expression.substring(5, expression.length - 1).trim();
			if (inner.startsWith('"') && inner.endsWith('"')) {
				// String literal
				const strValue = inner.slice(1, -1).toLowerCase();
				return strValue === "true";
			} else if (vars[inner] !== undefined) {
				// Variable
				const value = vars[inner];
				if (typeof value === "boolean") {
					return value;
				} else if (typeof value === "string") {
					return value.toLowerCase() === "true";
				} else if (typeof value === "number") {
					return value !== 0;
				} else {
					return false;
				}
			} else if (!Number.isNaN(parseFloat(inner))) {
				// Numeric literal
				return parseFloat(inner) !== 0;
			} else {
				return false;
			}
		}

		// Handle other type conversions
		if (expression.startsWith("int(") && expression.endsWith(")")) {
			const inner = expression.substring(4, expression.length - 1).trim();
			if (inner.startsWith("input(")) {
				// Handle int(input()) case
				const inputValue = this.evaluateExpression(inner, vars);
				return safeParseInt(inputValue, 10);
			} else if (inner.startsWith('"') && inner.endsWith('"')) {
				// String literal
				const strValue = inner.slice(1, -1);
				return parseInt(strValue, 10);
			} else if (vars[inner] !== undefined) {
				return safeParseInt(vars[inner], 10);
			} else if (!Number.isNaN(parseFloat(inner))) {
				return parseInt(inner, 10);
			} else {
				// Handle complex expressions like int(a + b + 0.5)
				const value = this.evaluateExpression(inner, vars);
				return parseInt(String(value), 10);
			}
		}

		if (expression.startsWith("str(") && expression.endsWith(")")) {
			const inner = expression.substring(4, expression.length - 1).trim();
			// First try to evaluate the inner expression
			const value = this.evaluateExpression(inner, vars);
			return String(value);
		}

		if (expression.startsWith("float(") && expression.endsWith(")")) {
			const inner = expression.substring(6, expression.length - 1).trim();
			if (inner.startsWith("input(")) {
				// Handle float(input()) case
				const inputValue = this.evaluateExpression(inner, vars);
				return safeParseFloat(inputValue);
			} else if (inner.startsWith('"') && inner.endsWith('"')) {
				// Handle string literals like float("3.14")
				const stringValue = inner.slice(1, -1);
				return parseFloat(stringValue);
			} else if (vars[inner] !== undefined) {
				return safeParseFloat(vars[inner]);
			} else if (!Number.isNaN(parseFloat(inner))) {
				return parseFloat(inner);
			} else {
				// Handle complex expressions like float(a + b)
				const arithmeticResult = this.evaluateArithmeticExpression(inner, vars);
				return parseFloat(String(arithmeticResult));
			}
		}

		if (expression.startsWith("real(") && expression.endsWith(")")) {
			const inner = expression.substring(5, expression.length - 1).trim();
			if (inner.startsWith("input(")) {
				// Handle real(input()) case
				const inputValue = this.evaluateExpression(inner, vars);
				return safeParseFloat(inputValue);
			} else if (vars[inner] !== undefined) {
				return safeParseFloat(vars[inner]);
			} else if (!Number.isNaN(parseFloat(inner))) {
				return parseFloat(inner);
			} else {
				// Handle complex expressions like real(a + b)
				const arithmeticResult = this.evaluateArithmeticExpression(inner, vars);
				return parseFloat(String(arithmeticResult));
			}
		}

		// Handle input() function
		if (expression.startsWith("input(") && expression.endsWith(")")) {
			// Extract and evaluate the prompt (though we don't use it for trace tables)
			const promptExpression = expression.slice(6, -1);
			if (
				promptExpression &&
				this.isStringConcatenation(promptExpression, vars)
			) {
				// Evaluate the prompt to ensure any variables are processed
				this.evaluateStringConcatenation(promptExpression, vars);
			}

			if (this.inputIndex < this.inputs.length) {
				const inputValue = this.inputs[this.inputIndex];
				this.inputIndex++;
				return inputValue;
			} else {
				return "";
			}
		}

		// Handle ASC/CHR functions
		if (expression.startsWith("ASC(") && expression.endsWith(")")) {
			const argument = expression.slice(4, -1);
			return this.evaluateASCFunction(argument, vars);
		}

		if (expression.startsWith("CHR(") && expression.endsWith(")")) {
			const argument = expression.slice(4, -1);
			return this.evaluateCHRFunction(argument, vars);
		}

		// Handle random function
		if (expression.startsWith("random(") && expression.endsWith(")")) {
			const args = expression.slice(7, -1);
			if (this.randomValue !== undefined) {
				// Use the provided random value for testing
				return this.randomValue;
			} else {
				// Parse range and generate random number
				const parts = args.split(",").map((s) => s.trim());
				if (parts.length === 2) {
					const min = parseInt(parts[0], 10);
					const max = parseInt(parts[1], 10);
					return Math.floor(Math.random() * (max - min + 1)) + min;
				}
				return 0;
			}
		}

		// Handle variables
		if (vars[expression] !== undefined) {
			return vars[expression];
		}

		// Handle array access like names[index] or nums[0], but not complex expressions
		if (
			expression.includes("[") &&
			expression.includes("]") &&
			!/[+\-*/]/.test(expression.replace(/\[.*?\]/g, ""))
		) {
			return this.getVariableValue(expression, vars);
		}

		// Handle string methods
		if (
			expression.includes(".upper") ||
			expression.includes(".lower") ||
			expression.includes(".left(") ||
			expression.includes(".right(") ||
			expression.includes(".substring(") ||
			expression.includes(".length")
		) {
			return this.evaluateStringMethod(expression, vars);
		}

		// Handle numeric literals (must be purely numeric)
		if (/^-?\d+(\.\d+)?$/.test(expression)) {
			return parseFloat(expression);
		}

		// Handle string literals (both single and double quotes)
		if (
			(expression.startsWith('"') && expression.endsWith('"')) ||
			(expression.startsWith("'") && expression.endsWith("'"))
		) {
			return expression.slice(1, -1);
		}

		// Handle boolean literals
		if (expression.toLowerCase() === "true") {
			return true;
		}
		if (expression.toLowerCase() === "false") {
			return false;
		}

		// Default to evaluating as arithmetic expression
		const result = this.evaluateArithmeticExpression(expression, vars);
		return result;
	}

	private getExpressionValue(
		operand: string,
		vars: Record<string, VariableValue>,
	): number {
		// Handle ASC() function
		if (operand.startsWith("ASC(") && operand.endsWith(")")) {
			const argument = operand.slice(4, -1);
			return this.evaluateASCFunction(argument, vars);
		}

		// Handle CHR() function - CHR returns a string, but in arithmetic context it should be 0
		if (operand.startsWith("CHR(") && operand.endsWith(")")) {
			// CHR in arithmetic context is unusual, but return 0 for safety
			return 0;
		}

		// Handle array access
		if (operand.includes("[") && operand.includes("]")) {
			const arrayMatch = operand.match(/(\w+)\[(\w+|\d+)\]/);
			if (arrayMatch) {
				const arrayName = arrayMatch[1];
				const indexStr = arrayMatch[2];

				if (vars[arrayName] && Array.isArray(vars[arrayName])) {
					let index: number;
					// Check if index is a literal number or a variable
					if (/^\d+$/.test(indexStr)) {
						// Literal index like [0], [1], etc.
						index = parseInt(indexStr, 10);
					} else {
						// Variable index like [i], [counter], etc.
						if (vars[indexStr] !== undefined) {
							const indexValue = vars[indexStr];
							index = parseInt(String(indexValue), 10);
						} else {
							return 0;
						}
					}

					if (index >= 0 && index < vars[arrayName].length) {
						const arrayValue = vars[arrayName][index];
						return parseFloat(String(arrayValue));
					}
				}
			}
			return 0;
		}

		// Handle regular variables
		if (vars[operand] !== undefined) {
			const varValue = vars[operand];
			return parseFloat(String(varValue));
		}

		// Handle numeric literals
		if (!Number.isNaN(parseFloat(operand))) {
			return parseFloat(operand);
		}

		return 0;
	}

	private evaluateArithmeticExpression(
		expression: string,
		vars: Record<string, VariableValue>,
	): number {
		// Normalize whitespace around word operators
		expression = expression.replace(/\s*\bMOD\b\s*/g, " MOD ");
		expression = expression.replace(/\s*\bDIV\b\s*/g, " DIV ");

		// Clean up multiple spaces
		expression = expression.replace(/\s+/g, " ").trim();

		// Handle parentheses by recursively evaluating inner expressions
		while (expression.includes("(")) {
			let depth = 0;
			let start = -1;

			for (let i = 0; i < expression.length; i++) {
				if (expression[i] === "(") {
					if (depth === 0) start = i;
					depth++;
				} else if (expression[i] === ")") {
					depth--;
					if (depth === 0) {
						const innerExpression = expression.substring(start + 1, i);
						const innerResult = this.evaluateArithmeticExpression(
							innerExpression,
							vars,
						);
						expression =
							expression.substring(0, start) +
							innerResult +
							expression.substring(i + 1);
						break;
					}
				}
			}
		}

		// Handle exponentiation first (right to left)
		while (expression.includes("^")) {
			const pos = expression.lastIndexOf("^");

			// Find left operand (skip spaces)
			let leftStart = pos - 1;
			while (leftStart >= 0 && expression[leftStart] === " ") {
				leftStart--; // Skip spaces
			}
			const leftEnd = leftStart + 1;
			while (leftStart >= 0 && /[A-Za-z0-9_[\].]/.test(expression[leftStart])) {
				leftStart--;
			}
			leftStart++;

			// Find right operand (skip spaces)
			let rightStart = pos + 1;
			while (rightStart < expression.length && expression[rightStart] === " ") {
				rightStart++; // Skip spaces
			}
			let rightEnd = rightStart;
			// Handle negative numbers - if we encounter a minus sign, include it
			if (rightEnd < expression.length && expression[rightEnd] === "-") {
				rightEnd++; // Include the minus sign
			}
			while (
				rightEnd < expression.length &&
				/[A-Za-z0-9_[\].]/.test(expression[rightEnd])
			) {
				rightEnd++;
			}

			const leftOperand = expression.substring(leftStart, leftEnd).trim();
			const rightOperand = expression.substring(rightStart, rightEnd).trim();

			const leftVal = this.getExpressionValue(leftOperand, vars);
			const rightVal = this.getExpressionValue(rightOperand, vars);
			const result = leftVal ** rightVal;

			expression =
				expression.substring(0, leftStart) +
				result +
				expression.substring(rightEnd);
		}

		// Then handle *, /, DIV, MOD (left to right)
		expression = this.handleLeftToRightOperators(
			expression,
			["*", "/", "DIV", "MOD"],
			vars,
		);

		// Finally handle +, - (left to right)
		expression = this.handleLeftToRightOperators(expression, ["+", "-"], vars);

		// At this point, expression should be a single value
		return this.getExpressionValue(expression, vars);
	}

	private handleLeftToRightOperators(
		expression: string,
		operators: string[],
		vars: Record<string, VariableValue>,
	): string {
		let changed = true;
		while (changed) {
			changed = false;

			// Find the leftmost operator from our list
			let earliestPos = expression.length;
			let earliestOp: string | null = null;
			let earliestLength = 0;

			for (const op of operators) {
				let pos = 0;
				while (pos < expression.length) {
					if (op === "DIV" || op === "MOD") {
						// Find whole word operators
						pos = expression.indexOf(op, pos);
						if (pos === -1) break;

						// Check if it's a whole word (not part of another word)
						if (
							(pos === 0 || !/[A-Za-z0-9_]/.test(expression[pos - 1])) &&
							(pos + op.length === expression.length ||
								!/[A-Za-z0-9_]/.test(expression[pos + op.length]))
						) {
							if (pos < earliestPos) {
								earliestPos = pos;
								earliestOp = op;
								earliestLength = op.length;
							}
							break;
						}
						pos++;
					} else {
						pos = expression.indexOf(op, pos);
						if (pos === -1) break;

						if (pos < earliestPos) {
							earliestPos = pos;
							earliestOp = op;
							earliestLength = 1;
						}
						break;
					}
				}
			}

			if (earliestOp && earliestPos < expression.length) {
				// Find left operand (skip spaces)
				let leftStart = earliestPos - 1;
				while (leftStart >= 0 && expression[leftStart] === " ") {
					leftStart--; // Skip spaces
				}
				const leftEnd = leftStart + 1;
				while (
					leftStart >= 0 &&
					/[A-Za-z0-9_[\].]/.test(expression[leftStart])
				) {
					leftStart--;
				}
				leftStart++;

				// Find right operand (skip spaces)
				let rightStart = earliestPos + earliestLength;
				while (
					rightStart < expression.length &&
					expression[rightStart] === " "
				) {
					rightStart++; // Skip spaces
				}
				let rightEnd = rightStart;
				// Handle negative numbers - if we encounter a minus sign, include it
				if (rightEnd < expression.length && expression[rightEnd] === "-") {
					rightEnd++; // Include the minus sign
				}
				while (
					rightEnd < expression.length &&
					/[A-Za-z0-9_[\].]/.test(expression[rightEnd])
				) {
					rightEnd++;
				}

				const leftOperand = expression.substring(leftStart, leftEnd).trim();
				const rightOperand = expression.substring(rightStart, rightEnd).trim();

				if (leftOperand && rightOperand) {
					const leftVal = this.getExpressionValue(leftOperand, vars);
					const rightVal = this.getExpressionValue(rightOperand, vars);
					let result: number;

					switch (earliestOp) {
						case "+":
							result = leftVal + rightVal;
							break;
						case "-":
							result = leftVal - rightVal;
							break;
						case "*":
							result = leftVal * rightVal;
							break;
						case "/":
							result = leftVal / rightVal; // Normal division (floating-point)
							break;
						case "DIV":
							result = Math.floor(leftVal / rightVal); // Integer division
							break;
						case "MOD":
							result = leftVal % rightVal;
							break;
						default:
							result = 0;
							break;
					}

					// Replace the entire operation (from leftStart to rightEnd) with the result
					const beforeOperation = expression.substring(0, leftStart);
					const afterOperation = expression.substring(rightEnd);
					expression = beforeOperation + result + afterOperation;
					changed = true;
				}
			}
		}

		return expression;
	}

	// =================================================================
	// REFACTORED CONDITION EVALUATION
	// =================================================================

	private evaluateCondition(
		condition: string,
		vars: Record<string, VariableValue>,
		recursionDepth: number = 0,
	): boolean {
		// Prevent infinite recursion in condition evaluation
		const maxRecursionDepth = 50;
		if (recursionDepth > maxRecursionDepth) {
			console.error(
				`Maximum recursion depth exceeded in evaluateCondition: ${condition}`,
			);
			throw new Error(
				`Maximum recursion depth exceeded in condition evaluation`,
			);
		}

		// Enhanced condition evaluation that handles arithmetic expressions

		// Handle AND operator
		if (condition.includes(" AND ")) {
			const parts = condition.split(" AND ");
			let result = true;
			for (const part of parts) {
				if (!this.evaluateCondition(part.trim(), vars, recursionDepth + 1)) {
					result = false;
					break;
				}
			}
			return result;
		}

		// Handle OR operator
		if (condition.includes(" OR ")) {
			const parts = condition.split(" OR ");
			let result = false;
			for (const part of parts) {
				if (this.evaluateCondition(part.trim(), vars, recursionDepth + 1)) {
					result = true;
					break;
				}
			}
			return result;
		}

		// Handle all comparison operators
		const comparisonOperators = [">=", "<=", "==", "!=", ">", "<"];

		for (const operator of comparisonOperators) {
			if (condition.includes(operator)) {
				const [left, right] = condition.split(operator).map((s) => s.trim());
				const leftVal = this.evaluateExpressionOrVariable(left, vars);
				const rightVal = this.evaluateExpressionOrVariable(right, vars);

				const leftNum = leftVal !== undefined ? Number(leftVal) : 0;
				const rightNum = rightVal !== undefined ? Number(rightVal) : 0;

				switch (operator) {
					case ">=":
						return leftNum >= rightNum;
					case "<=":
						return leftNum <= rightNum;
					case "==":
						return leftVal === rightVal;
					case "!=":
						return leftVal !== rightVal;
					case ">":
						return leftNum > rightNum;
					case "<":
						return leftNum < rightNum;
				}
			}
		}

		return false;
	}

	private evaluateExpressionOrVariable(
		expression: string,
		vars: Record<string, VariableValue>,
	): VariableValue {
		// Helper function to evaluate expressions or variables in conditions
		expression = expression.trim();

		// Handle ASC() function
		if (expression.startsWith("ASC(") && expression.endsWith(")")) {
			const argument = expression.slice(4, -1);
			return this.evaluateASCFunction(argument, vars);
		}

		// Handle CHR() function
		if (expression.startsWith("CHR(") && expression.endsWith(")")) {
			const argument = expression.slice(4, -1);
			return this.evaluateCHRFunction(argument, vars);
		}

		// Check if it's a string literal
		if (expression.startsWith('"') && expression.endsWith('"')) {
			return expression.slice(1, -1);
		}

		// Check if it contains operators (arithmetic expression)
		if (
			expression.includes("+") ||
			expression.includes("-") ||
			expression.includes("*") ||
			expression.includes("/") ||
			expression.includes("MOD") ||
			expression.includes("DIV")
		) {
			return this.evaluateArithmeticExpression(expression, vars);
		}

		// Check if it's a string method like .length
		if (expression.includes(".length")) {
			const varName = expression.split(".")[0];
			if (vars[varName] !== undefined) {
				return vars[varName].toString().length;
			}
		}

		// Check if it's array access like colours[0]
		if (expression.includes("[") && expression.includes("]")) {
			const arrayValue = this.getVariableValue(expression, vars);
			if (arrayValue !== undefined) {
				return arrayValue;
			}
		}

		// Check if it's a variable
		if (vars[expression] !== undefined) {
			return vars[expression];
		}

		// Check if it's a boolean literal
		if (expression.toLowerCase() === "true") {
			return true;
		}
		if (expression.toLowerCase() === "false") {
			return false;
		}

		// Check if it's a number
		if (!Number.isNaN(parseFloat(expression))) {
			return parseFloat(expression);
		}

		// Return as string literal
		return expression;
	}

	// =================================================================
	// REFACTORED CONTROL STRUCTURE EXECUTION
	// =================================================================

	/**
	 * Generic method to execute a block of statements between two line indices
	 */
	private executeBlock(
		lines: string[],
		startIndex: number,
		endIndex: number,
	): number {
		let bodyLine = startIndex;
		let iterationCount = 0;
		const maxIterations = 10000; // Safety limit to prevent infinite loops

		while (bodyLine < endIndex) {
			iterationCount++;
			if (iterationCount > maxIterations) {
				console.error(
					`Infinite loop detected in executeBlock! Line range: ${startIndex}-${endIndex}, Current line: ${bodyLine}`,
				);
				console.error(`Current line content: "${lines[bodyLine]}"`);
				throw new Error(
					`Infinite loop detected after ${maxIterations} iterations`,
				);
			}

			const bodyLineCode = lines[bodyLine];
			const bodyLineNum = bodyLine + 1;

			// Check if this line is a nested control structure
			if (bodyLineCode.startsWith("if ") && bodyLineCode.includes(" then")) {
				// Handle nested if statement
				bodyLine = this.handleIfStatement(lines, bodyLine);
			} else if (bodyLineCode.startsWith("switch ")) {
				// Handle nested switch statement
				bodyLine = this.handleSwitchStatement(lines, bodyLine);
			} else if (bodyLineCode.startsWith("while ")) {
				// Handle nested while loop
				bodyLine = this.handleWhileLoop(lines, bodyLine);
			} else if (bodyLineCode === "do") {
				// Handle nested do-until loop
				bodyLine = this.handleDoUntilLoop(lines, bodyLine);
			} else if (
				bodyLineCode.startsWith("for ") &&
				bodyLineCode.includes(" to ")
			) {
				// Handle nested for loop
				bodyLine = this.handleForLoop(lines, bodyLine);
			} else if (
				bodyLineCode.startsWith("next ") ||
				bodyLineCode === "endif" ||
				bodyLineCode === "else" ||
				bodyLineCode.startsWith("elseif ") ||
				bodyLineCode === "endwhile" ||
				bodyLineCode.startsWith("until ") ||
				bodyLineCode.startsWith("case ") ||
				bodyLineCode === "default" ||
				bodyLineCode === "endswitch"
			) {
				// Skip control flow statements as they're handled by their parent structures
				bodyLine++;
			} else {
				// Regular statement
				const result = this.executeStatement(bodyLineCode, this.variables);

				if (
					result.shouldTrace &&
					(Object.keys(result.changedVariables || {}).length > 0 ||
						result.output)
				) {
					this.addTraceEntry(
						bodyLineNum,
						this.variables,
						result.output,
						result.changedVariables,
					);
				}
				bodyLine++;
			}
		}
		return bodyLine;
	}

	private handleIfStatement(lines: string[], i: number): number {
		// If-elseif-else statement
		const line = lines[i];
		const condition = line.substring(3, line.indexOf(" then")).trim();

		// Find the structure of the if statement
		let endifIndex = -1;
		const elseifIndices: number[] = [];
		let elseIndex = -1;
		let depth = 0;

		for (let j = i + 1; j < lines.length; j++) {
			if (lines[j].startsWith("if ")) depth++;
			if (lines[j] === "endif") {
				if (depth === 0) {
					endifIndex = j;
					break;
				}
				depth--;
			} else if (lines[j].startsWith("elseif ") && depth === 0) {
				elseifIndices.push(j);
			} else if (lines[j] === "else" && depth === 0) {
				elseIndex = j;
			}
		}

		// Evaluate conditions and execute the appropriate block
		let conditionMet = this.evaluateCondition(condition, this.variables, 0);
		let executionStart = i + 1;
		let executionEnd =
			elseifIndices.length > 0
				? elseifIndices[0]
				: elseIndex !== -1
					? elseIndex
					: endifIndex;

		if (!conditionMet) {
			// Check elseif conditions
			for (let k = 0; k < elseifIndices.length; k++) {
				const elseifLine = lines[elseifIndices[k]];
				const elseifCondition = elseifLine
					.substring(7, elseifLine.indexOf(" then"))
					.trim();

				if (this.evaluateCondition(elseifCondition, this.variables, 0)) {
					conditionMet = true;
					executionStart = elseifIndices[k] + 1;
					executionEnd =
						k + 1 < elseifIndices.length
							? elseifIndices[k + 1]
							: elseIndex !== -1
								? elseIndex
								: endifIndex;
					break;
				}
			}

			// If no conditions met and there's an else
			if (!conditionMet && elseIndex !== -1) {
				executionStart = elseIndex + 1;
				executionEnd = endifIndex;
				conditionMet = true;
			}
		}

		// Execute the appropriate block
		if (conditionMet) {
			this.executeBlock(lines, executionStart, executionEnd);
		}

		// Return the position after endif
		return endifIndex + 1;
	}

	private handleWhileLoop(lines: string[], i: number): number {
		// While loop
		const line = lines[i];
		const condition = line.substring(6).trim();

		// Find the matching endwhile statement
		let endwhileIndex = -1;
		let depth = 0;
		for (let j = i + 1; j < lines.length; j++) {
			if (lines[j].startsWith("while ")) depth++;
			if (lines[j] === "endwhile") {
				if (depth === 0) {
					endwhileIndex = j;
					break;
				}
				depth--;
			}
		}

		// Execute the while loop with safety limit
		let loopIterations = 0;
		const maxLoopIterations = 1000;

		while (this.evaluateCondition(condition, this.variables, 0)) {
			loopIterations++;
			if (loopIterations > maxLoopIterations) {
				console.error(
					`Infinite while loop detected! Condition: "${condition}"`,
				);
				console.error(`Variables at loop start:`, this.variables);
				throw new Error(
					`Infinite while loop detected after ${maxLoopIterations} iterations`,
				);
			}

			this.executeBlock(lines, i + 1, endwhileIndex);
		}

		// Return the position after endwhile
		return endwhileIndex + 1;
	}

	private handleDoUntilLoop(lines: string[], i: number): number {
		// Do-until loop
		// Find the matching until statement
		let untilIndex = -1;
		let depth = 0;
		for (let j = i + 1; j < lines.length; j++) {
			if (lines[j] === "do") depth++;
			if (lines[j].startsWith("until ")) {
				if (depth === 0) {
					untilIndex = j;
					break;
				}
				depth--;
			}
		}

		// Execute the do-until loop (execute body at least once, then check condition)
		let loopIterations = 0;
		const maxLoopIterations = 1000;
		let shouldContinue = true;

		do {
			loopIterations++;
			if (loopIterations > maxLoopIterations) {
				console.error(`Infinite do-until loop detected!`);
				throw new Error(
					`Infinite do-until loop detected after ${maxLoopIterations} iterations`,
				);
			}

			this.executeBlock(lines, i + 1, untilIndex);

			// Get the until condition
			const untilLine = lines[untilIndex];
			const condition = untilLine.substring(6).trim(); // Remove "until "

			// Check if condition is met to exit the loop
			if (this.evaluateCondition(condition, this.variables, 0)) {
				shouldContinue = false;
			}
		} while (shouldContinue);

		// Return the position after until
		return untilIndex + 1;
	}

	private handleForLoop(lines: string[], i: number): number {
		// For loop with optional step
		const line = lines[i];

		// Try to match pattern with step first: "for var = start to end step stepValue"
		let forMatch = line.match(
			/for\s+(\w+)\s*=\s*(-?\d+)\s+to\s+(-?\d+)\s+step\s+(-?\d+)/,
		);
		let stepValue = 1; // Default step value

		if (forMatch) {
			// Pattern with step found
			stepValue = parseInt(forMatch[4], 10);
		} else {
			// Try pattern without step: "for var = start to end"
			forMatch = line.match(/for\s+(\w+)\s*=\s*(-?\d+)\s+to\s+(-?\d+)/);
			if (!forMatch) {
				// If no match, just skip this line
				return i + 1;
			}
		}

		const loopVar = forMatch[1];
		const startVal = parseInt(forMatch[2], 10);
		const endVal = parseInt(forMatch[3], 10);

		// Find the matching next statement
		let nextLineIndex = -1;
		let depth = 0;
		for (let j = i + 1; j < lines.length; j++) {
			if (lines[j].startsWith("for ")) depth++;
			if (lines[j].startsWith("next ")) {
				if (depth === 0) {
					nextLineIndex = j;
					break;
				}
				depth--;
			}
		}

		// Execute the loop with proper step handling
		let loopVal = startVal;
		let loopIterations = 0;
		const maxLoopIterations = 10000; // Safety limit to prevent infinite loops

		// Determine loop condition based on step direction
		const shouldContinue =
			stepValue > 0 ? () => loopVal <= endVal : () => loopVal >= endVal;

		while (shouldContinue()) {
			loopIterations++;
			if (loopIterations > maxLoopIterations) {
				console.error(`Infinite for loop detected! Loop: "${line}"`);
				console.error(`Variables at loop start:`, this.variables);
				throw new Error(
					`Infinite for loop detected after ${maxLoopIterations} iterations`,
				);
			}

			// Set the loop variable - trace this as if it's an assignment on the for line
			this.variables[loopVar] = loopVal;
			const forLineChanges: Record<string, VariableValue> = {};
			forLineChanges[loopVar] = loopVal;
			this.addTraceEntry(i + 1, this.variables, "", forLineChanges);

			// Execute loop body
			this.executeBlock(lines, i + 1, nextLineIndex);

			// Increment by step value
			loopVal += stepValue;
		}

		// Return the position after the next statement
		return nextLineIndex + 1;
	}

	private handleSwitchStatement(lines: string[], i: number): number {
		// Switch statement: switch variableName:
		const line = lines[i];

		// Extract the switch variable (format: "switch varName:")
		const switchMatch = line.match(/switch\s+(\w+):/);
		if (!switchMatch) {
			return i + 1; // Skip if invalid syntax
		}

		const switchVar = switchMatch[1];
		const switchValue = this.variables[switchVar]; // Get raw value, not parsed

		// Find all case statements and default, plus endswitch
		let endswitchIndex = -1;
		const caseIndices: Array<{ index: number; value: string }> = [];
		let defaultIndex = -1;
		let depth = 0;

		for (let j = i + 1; j < lines.length; j++) {
			const currentLine = lines[j].trim();

			if (currentLine.startsWith("switch ")) depth++;
			if (currentLine === "endswitch") {
				if (depth === 0) {
					endswitchIndex = j;
					break;
				}
				depth--;
			} else if (currentLine.startsWith("case ") && depth === 0) {
				// Extract case value (format: 'case "value":' or 'case value:')
				const caseMatch = currentLine.match(/case\s+(.+?):/);
				if (caseMatch) {
					const caseValue = caseMatch[1].trim();
					// Remove quotes if present
					const cleanCaseValue =
						caseValue.startsWith('"') && caseValue.endsWith('"')
							? caseValue.slice(1, -1)
							: caseValue;

					caseIndices.push({
						index: j,
						value: cleanCaseValue,
					});
				}
			} else if (currentLine === "default:" && depth === 0) {
				defaultIndex = j;
			}
		}

		// Find which case matches the switch value
		let matchedCaseIndex = -1;
		let executionStart = -1;
		let executionEnd = endswitchIndex;

		// Convert switch value to string for comparison
		const switchValueStr = String(switchValue);

		for (let k = 0; k < caseIndices.length; k++) {
			if (caseIndices[k].value === switchValueStr) {
				matchedCaseIndex = k;
				executionStart = caseIndices[k].index + 1;

				// Find execution end (next case or default or endswitch)
				if (k + 1 < caseIndices.length) {
					executionEnd = caseIndices[k + 1].index;
				} else if (defaultIndex !== -1 && defaultIndex > caseIndices[k].index) {
					executionEnd = defaultIndex;
				} else {
					executionEnd = endswitchIndex;
				}
				break;
			}
		}

		// If no case matched and there's a default
		if (matchedCaseIndex === -1 && defaultIndex !== -1) {
			executionStart = defaultIndex + 1;
			executionEnd = endswitchIndex;
		}

		// Execute the matching block
		if (executionStart !== -1) {
			this.executeBlock(lines, executionStart, executionEnd);
		}

		// Return the position after the endswitch statement
		return endswitchIndex + 1;
	}
}
