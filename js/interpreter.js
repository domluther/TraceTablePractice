// Comprehensive Interpreter module for executing pseudocode programs and generating trace tables

export class Interpreter {
	constructor() {
		this.variables = {};
		this.constants = {}; // Track which variables are constants
		this.outputs = [];
		this.trace = [];
		this.inputs = [];
		this.inputIndex = 0;
		this.currentProgram = null;
	}

	reset() {
		this.variables = {};
		this.constants = {};
		this.outputs = [];
		this.trace = [];
		this.inputs = [];
		this.inputIndex = 0;
		this.currentProgram = null;
	}

	// Convenience method for executing code without a program object
	execute(code) {
		return this.executeProgram(code, { inputs: [], randomValue: undefined });
	}

	// Execute code without resetting state (for testing)
	executeWithoutReset(code) {
		const lines = code
			.split("\n")
			.map((l) => l.trim())
			.filter((l) => l.length > 0);
		this.programLines = lines;

		this.executeBlock(lines, 0, lines.length);

		return {
			variables: this.getExpandedVariableNames(),
			outputs: this.outputs,
			trace: this.trace,
		};
	}

	executeProgram(program, inputData = { inputs: [], randomValue: undefined }) {
		this.reset();
		this.inputs = inputData.inputs || [];
		this.inputIndex = 0;
		this.randomValue = inputData.randomValue;

		const lines = program
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line.length > 0);
		this.programLines = lines;

		this.executeBlock(lines, 0, lines.length);

		return {
			variables: this.getExpandedVariableNames(),
			outputs: this.outputs,
			trace: this.trace,
		};
	}

	getExpandedVariableNames() {
		const expandedNames = [];

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

	addTraceEntry(lineNum, vars, output = "", changedVariables = {}) {
		this.trace.push({
			lineNumber: lineNum,
			variables: { ...vars },
			output: output,
			changedVariables: changedVariables,
		});
	}

	executeStatement(line, lineNum, vars) {
		let output = "";
		const shouldTrace = true;
		const changeRecord = {}; // Track which variables actually change

		if (line.startsWith("array ")) {
			// Array declaration with initialization like "array scores = [85, 92, 78, 90]"
			const initMatch = line.match(/array\s+(\w+)\s*=\s*\[([^\]]+)\]/);
			if (initMatch) {
				const arrayName = initMatch[1];
				const arrayElements = initMatch[2].split(",").map((s) => {
					const trimmed = s.trim();
					return !isNaN(trimmed)
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
					const size = parseInt(match[2]);
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
			if (
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
			} else if (content.startsWith("str(") && content.endsWith(")")) {
				const varName = content.substring(4, content.length - 1);
				if (vars[varName] !== undefined) {
					output = vars[varName].toString();
				}
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

					let index;
					if (/^\d+$/.test(indexStr)) {
						index = parseInt(indexStr);
					} else if (vars[indexStr] !== undefined) {
						index = parseInt(vars[indexStr]);
					} else {
						index = 0;
					}

					const newValue = this.evaluateExpression(value, vars);
					vars[arrayName][index] = newValue;
					changeRecord[`${arrayName}[${index}]`] = newValue;
				}
			} else {
				// Regular assignment - handle different expression types
				let newValue;

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
					newValue = this.evaluateStringConcatenation(value, vars);
				} else {
					newValue = this.evaluateExpression(value, vars);
				}
				vars[varName] = newValue;
				changeRecord[varName] = newValue;
			}
		}

		return { output, shouldTrace, changedVariables: changeRecord };
	}

	// =================================================================
	// EXTRACTED FUNCTION EVALUATION METHODS
	// =================================================================

	/**
	 * Centralized ASC function evaluation
	 * @param {string} argument - The argument inside ASC()
	 * @param {object} vars - Variable context
	 * @returns {number} ASCII code
	 */
	evaluateASCFunction(argument, vars) {
		argument = argument.trim();
		let charValue;

		if (argument.startsWith('"') && argument.endsWith('"')) {
			// String literal like ASC("A")
			charValue = argument.slice(1, -1);
		} else if (vars[argument] !== undefined) {
			// Variable like ASC(letter)
			charValue = vars[argument].toString();
		} else {
			// Could be an expression or method call
			charValue = this.evaluateExpressionOrVariable(argument, vars);
			if (typeof charValue !== "string") {
				charValue = charValue.toString();
			}
		}

		if (charValue && charValue.length > 0) {
			return charValue.charCodeAt(0);
		}
		return 0;
	}

	/**
	 * Centralized CHR function evaluation
	 * @param {string} argument - The argument inside CHR()
	 * @param {object} vars - Variable context
	 * @returns {string} Character
	 */
	evaluateCHRFunction(argument, vars) {
		argument = argument.trim();
		let asciiValue;

		if (!isNaN(argument)) {
			// Numeric literal like CHR(65)
			asciiValue = parseInt(argument);
		} else if (vars[argument] !== undefined) {
			// Variable like CHR(ascii_val)
			asciiValue = parseInt(vars[argument]);
		} else {
			// Could be an expression like CHR(ascii_value + 1)
			asciiValue = this.evaluateArithmeticExpression(argument, vars);
		}

		if (!isNaN(asciiValue)) {
			return String.fromCharCode(asciiValue);
		}
		return "";
	}

	/**
	 * Centralized string method evaluation
	 * @param {string} expression - The method call expression
	 * @param {object} vars - Variable context
	 * @returns {string} Result of the method call
	 */
	evaluateStringMethod(expression, vars) {
		if (expression.includes(".left(")) {
			const match = expression.match(/(\w+)\.left\(([^)]+)\)/);
			if (match && vars[match[1]] !== undefined) {
				const varName = match[1];
				const lengthParam = match[2].trim();
				let length;
				if (vars[lengthParam] !== undefined) {
					length = parseInt(vars[lengthParam]);
				} else if (!isNaN(lengthParam)) {
					length = parseInt(lengthParam);
				} else {
					length = 1;
				}
				return vars[varName].toString().substring(0, length);
			}
		} else if (expression.includes(".right(")) {
			const match = expression.match(/(\w+)\.right\(([^)]+)\)/);
			if (match && vars[match[1]] !== undefined) {
				const varName = match[1];
				const lengthParam = match[2].trim();
				let length;
				if (vars[lengthParam] !== undefined) {
					length = parseInt(vars[lengthParam]);
				} else if (!isNaN(lengthParam)) {
					length = parseInt(lengthParam);
				} else {
					length = 1;
				}
				const str = vars[varName].toString();
				return str.substring(str.length - length);
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
					start = parseInt(vars[startParam]);
				} else if (!isNaN(startParam)) {
					start = parseInt(startParam);
				}

				// Parse length parameter (could be variable or literal)
				let length = 1;
				if (vars[lengthParam] !== undefined) {
					length = parseInt(vars[lengthParam]);
				} else if (!isNaN(lengthParam)) {
					length = parseInt(lengthParam);
				}

				return vars[sourceVar].toString().substring(start, start + length);
			}
		} else if (expression.includes(".upper")) {
			const varName = expression.split(".")[0];
			if (vars[varName] !== undefined) {
				return vars[varName].toString().toUpperCase();
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

	evaluateExpression(expression, vars) {
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
			} else if (!isNaN(inner)) {
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
				return parseInt(inputValue);
			} else if (vars[inner] !== undefined) {
				return parseInt(vars[inner]);
			} else if (!isNaN(inner)) {
				return parseInt(inner);
			} else {
				// Handle complex expressions like int(a + b + 0.5)
				const arithmeticResult = this.evaluateArithmeticExpression(inner, vars);
				return parseInt(arithmeticResult);
			}
		}

		if (expression.startsWith("str(") && expression.endsWith(")")) {
			const inner = expression.substring(4, expression.length - 1).trim();
			if (vars[inner] !== undefined) {
				return vars[inner].toString();
			} else {
				return inner.toString();
			}
		}

		if (expression.startsWith("float(") && expression.endsWith(")")) {
			const inner = expression.substring(6, expression.length - 1).trim();
			if (inner.startsWith("input(")) {
				// Handle float(input()) case
				const inputValue = this.evaluateExpression(inner, vars);
				return parseFloat(inputValue);
			} else if (vars[inner] !== undefined) {
				return parseFloat(vars[inner]);
			} else if (!isNaN(inner)) {
				return parseFloat(inner);
			} else {
				// Handle complex expressions like float(a + b)
				const arithmeticResult = this.evaluateArithmeticExpression(inner, vars);
				return parseFloat(arithmeticResult);
			}
		}

		if (expression.startsWith("real(") && expression.endsWith(")")) {
			const inner = expression.substring(5, expression.length - 1).trim();
			if (inner.startsWith("input(")) {
				// Handle real(input()) case
				const inputValue = this.evaluateExpression(inner, vars);
				return parseFloat(inputValue);
			} else if (vars[inner] !== undefined) {
				return parseFloat(vars[inner]);
			} else if (!isNaN(inner)) {
				return parseFloat(inner);
			} else {
				// Handle complex expressions like real(a + b)
				const arithmeticResult = this.evaluateArithmeticExpression(inner, vars);
				return parseFloat(arithmeticResult);
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
					const min = parseInt(parts[0]);
					const max = parseInt(parts[1]);
					return Math.floor(Math.random() * (max - min + 1)) + min;
				}
				return 0;
			}
		}

		// Handle variables
		if (vars[expression] !== undefined) {
			return vars[expression];
		}

		// Handle numeric literals
		if (!isNaN(expression)) {
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
		return this.evaluateArithmeticExpression(expression, vars);
	}

	getVariableValue(operand, vars) {
		// Helper function to get value from variable or array access
		if (operand.includes("[") && operand.includes("]")) {
			// Array access like nums[i] or nums[0]
			const arrayMatch = operand.match(/(\w+)\[(\w+|\d+)\]/);
			if (arrayMatch) {
				const arrayName = arrayMatch[1];
				const indexStr = arrayMatch[2];

				if (vars[arrayName] && Array.isArray(vars[arrayName])) {
					let index;
					// Check if index is a literal number or a variable
					if (/^\d+$/.test(indexStr)) {
						// Literal index like [0], [1], etc.
						index = parseInt(indexStr);
					} else {
						// Variable index like [i], [counter], etc.
						if (vars[indexStr] !== undefined) {
							index = parseInt(vars[indexStr]);
						} else {
							return undefined;
						}
					}

					if (index >= 0 && index < vars[arrayName].length) {
						return vars[arrayName][index];
					}
				}
			}
			return undefined;
		} else {
			return vars[operand];
		}
	}

	isStringConcatenation(value, vars) {
		// Check if the expression is a string concatenation

		// Check for CHR function calls (which return strings)
		if (value.startsWith("CHR(") && value.endsWith(")")) {
			return true;
		}

		// Check if expression contains + and any string indicators
		if (!value.includes("+")) {
			return false;
		}

		const parts = value.split("+").map((p) => p.trim());

		return parts.some((part) => {
			// Check for string literals (both single and double quotes)
			if (
				(part.startsWith('"') && part.endsWith('"')) ||
				(part.startsWith("'") && part.endsWith("'"))
			) {
				return true;
			}

			// Check for string methods
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
	}

	isArithmeticExpression(value) {
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

	evaluateStringConcatenation(value, vars) {
		// Handle single function calls that aren't part of concatenation
		if (value.startsWith("ASC(") && value.endsWith(")")) {
			const argument = value.slice(4, -1);
			return this.evaluateASCFunction(argument, vars); // Return number, not string
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
				} else if (!isNaN(argument)) {
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

	parseStringConcatenation(value) {
		// Smart parser that handles quotes, parentheses, and function calls
		const parts = [];
		let current = "";
		let inQuotes = false;
		let quoteChar = null; // Track which quote character we're in
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

	evaluateArithmeticExpression(expression, vars) {
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

	getExpressionValue(operand, vars) {
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
					let index;
					// Check if index is a literal number or a variable
					if (/^\d+$/.test(indexStr)) {
						// Literal index like [0], [1], etc.
						index = parseInt(indexStr);
					} else {
						// Variable index like [i], [counter], etc.
						if (vars[indexStr] !== undefined) {
							index = parseInt(vars[indexStr]);
						} else {
							return 0;
						}
					}

					if (index >= 0 && index < vars[arrayName].length) {
						return vars[arrayName][index];
					}
				}
			}
			return 0;
		}

		// Handle regular variables
		if (vars[operand] !== undefined) {
			return parseFloat(vars[operand]);
		}

		// Handle numeric literals
		if (!isNaN(operand)) {
			return parseFloat(operand);
		}

		return 0;
	}

	handleLeftToRightOperators(expression, operators, vars) {
		let changed = true;
		while (changed) {
			changed = false;

			// Find the leftmost operator from our list
			let earliestPos = expression.length;
			let earliestOp = null;
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
					let result;

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

	evaluateCondition(condition, vars) {
		// Enhanced condition evaluation that handles arithmetic expressions

		// Handle AND operator
		if (condition.includes(" AND ")) {
			const parts = condition.split(" AND ");
			let result = true;
			for (const part of parts) {
				if (!this.evaluateCondition(part.trim(), vars)) {
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
				if (this.evaluateCondition(part.trim(), vars)) {
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

				switch (operator) {
					case ">=":
						return leftVal >= rightVal;
					case "<=":
						return leftVal <= rightVal;
					case "==":
						return leftVal === rightVal;
					case "!=":
						return leftVal !== rightVal;
					case ">":
						return leftVal > rightVal;
					case "<":
						return leftVal < rightVal;
				}
			}
		}

		return false;
	}

	evaluateExpressionOrVariable(expression, vars) {
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
		if (!isNaN(expression)) {
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
	 * @param {Array} lines - All lines of code
	 * @param {number} startIndex - Start line index (inclusive)
	 * @param {number} endIndex - End line index (exclusive)
	 */
	executeBlock(lines, startIndex, endIndex) {
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
				const result = this.executeStatement(
					bodyLineCode,
					bodyLineNum,
					this.variables,
				);
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

	handleIfStatement(lines, i) {
		// If-elseif-else statement
		const line = lines[i];
		const condition = line.substring(3, line.indexOf(" then")).trim();

		// Find the structure of the if statement
		let endifIndex = -1;
		const elseifIndices = [];
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
		let conditionMet = this.evaluateCondition(condition, this.variables);
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

				if (this.evaluateCondition(elseifCondition, this.variables)) {
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

	handleWhileLoop(lines, i) {
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

		while (this.evaluateCondition(condition, this.variables)) {
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

	handleDoUntilLoop(lines, i) {
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
			if (this.evaluateCondition(condition, this.variables)) {
				break;
			}
		} while (true);

		// Return the position after until
		return untilIndex + 1;
	}

	handleForLoop(lines, i) {
		// For loop with optional step
		const line = lines[i];

		// Try to match pattern with step first: "for var = start to end step stepValue"
		let forMatch = line.match(
			/for\s+(\w+)\s*=\s*(-?\d+)\s+to\s+(-?\d+)\s+step\s+(-?\d+)/,
		);
		let stepValue = 1; // Default step value

		if (forMatch) {
			// Pattern with step found
			stepValue = parseInt(forMatch[4]);
		} else {
			// Try pattern without step: "for var = start to end"
			forMatch = line.match(/for\s+(\w+)\s*=\s*(-?\d+)\s+to\s+(-?\d+)/);
			if (!forMatch) {
				// If no match, just skip this line
				return i + 1;
			}
		}

		const loopVar = forMatch[1];
		const startVal = parseInt(forMatch[2]);
		const endVal = parseInt(forMatch[3]);

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

		// Determine loop condition based on step direction
		const shouldContinue =
			stepValue > 0 ? () => loopVal <= endVal : () => loopVal >= endVal;

		while (shouldContinue()) {
			// Set the loop variable - trace this as if it's an assignment on the for line
			this.variables[loopVar] = loopVal;
			const forLineChanges = {};
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

	handleSwitchStatement(lines, i) {
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
		const caseIndices = [];
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
