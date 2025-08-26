import { describe, expect, it } from "vitest";
import { ASTInterpreter } from "../lib/astInterpreter";
import type { Program } from "../lib/astInterpreter";

/**
 * Minimal Unit Tests for AST Interpreter - Debugging Version
 */

// Helper functions
function executeAndGetVariable(
	code: string,
	varName: string,
	inputs: string[] = [],
): any {
	console.log("executeAndGetVariable starting with code:", code);
	const interpreter = new ASTInterpreter();
	const program: Program = { code, description: "test", inputs };
	console.log("About to execute program");
	const result = interpreter.executeProgram(code, program);
	console.log("Program execution completed");

	// Find the variable in the final trace step
	const lastStep = result.trace[result.trace.length - 1];
	return lastStep?.variables[varName];
}

function executeAndGetVariables(
	code: string,
	inputs: string[] = [],
): Record<string, any> {
	const interpreter = new ASTInterpreter();
	const program: Program = { code, description: "test", inputs };
	const result = interpreter.executeProgram(code, program);

	// Return variables from the final trace step
	const lastStep = result.trace[result.trace.length - 1];
	return lastStep?.variables || {};
}

function executeAndGetOutputs(code: string, inputs: string[] = []): string[] {
	const interpreter = new ASTInterpreter();
	const program: Program = { code, description: "test", inputs };
	const result = interpreter.executeProgram(code, program);
	return result.outputs;
}

describe("AST Interpreter - Basic Arithmetic", () => {
	it("should handle basic addition", () => {
		const result = executeAndGetVariable(
			`
			a = 5
			b = 3
			result = a + b
		`,
			"result",
		);
		expect(result).toBe(8);
	});

	it("should handle basic subtraction", () => {
		const result = executeAndGetVariable(
			`
			a = 5
			b = 3
			result = a - b
		`,
			"result",
		);
		expect(result).toBe(2);
	});

	it("should handle basic multiplication", () => {
		const result = executeAndGetVariable(
			`
			a = 5
			b = 3
			result = a * b
		`,
			"result",
		);
		expect(result).toBe(15);
	});

	it("should handle basic division", () => {
		const result = executeAndGetVariable(
			`
			a = 5
			c = 2
			result = a / c
		`,
			"result",
		);
		expect(result).toBe(2.5);
	});

	it("should handle modulo operation", () => {
		const result = executeAndGetVariable(
			`
			a = 5
			b = 3
			result = a MOD b
		`,
			"result",
		);
		expect(result).toBe(2);
	});

	it("should handle integer division", () => {
		const result = executeAndGetVariable(
			`
			a = 5
			b = 3
			result = a DIV b
		`,
			"result",
		);
		expect(result).toBe(1);
	});

	it("should handle exponentiation", () => {
		const result = executeAndGetVariable(
			`
			b = 3
			c = 2
			result = b ^ c
		`,
			"result",
		);
		expect(result).toBe(9);
	});
});

describe("AST Interpreter - Operator Precedence", () => {
	it("should handle multiplication before addition", () => {
		const result = executeAndGetVariable(
			`
			result = 2 + 3 * 4
		`,
			"result",
		);
		expect(result).toBe(14); // Not 20
	});

	it("should handle division before subtraction", () => {
		const result = executeAndGetVariable(
			`
			result = 10 - 6 / 2
		`,
			"result",
		);
		expect(result).toBe(7); // Not 2
	});

	it("should handle exponentiation before multiplication", () => {
		const result = executeAndGetVariable(
			`
			result = 2 * 3 ^ 2
		`,
			"result",
		);
		expect(result).toBe(18); // Not 36
	});

	it("should handle complex precedence", () => {
		const result = executeAndGetVariable(
			`
			result = 2 + 3 * 4 - 6 / 2
		`,
			"result",
		);
		expect(result).toBe(11); // 2 + 12 - 3 = 11
	});
});

describe("AST Interpreter - Parentheses", () => {
	it("should handle simple parentheses", () => {
		const result = executeAndGetVariable(
			`
			result = (2 + 3) * 4
		`,
			"result",
		);
		expect(result).toBe(20);
	});

	it("should handle nested parentheses", () => {
		const result = executeAndGetVariable(
			`
			a = 5
			b = 3
			c = 2
			result = ((a + b) * c) / (a - c)
		`,
			"result",
		);
		expect(result).toBe(16 / 3); // ((5+3)*2)/(5-2) = 16/3
	});

	it("should handle complex parentheses expression", () => {
		const result = executeAndGetVariable(
			`
			length = 10
			width = 5
			perimeter = 2 * (length + width)
		`,
			"perimeter",
		);
		expect(result).toBe(30);
	});
});

describe("AST Interpreter - Variable Operations", () => {
	it("should handle variable assignment", () => {
		const vars = executeAndGetVariables(`
			x = 42
			y = "hello"
			z = true
		`);
		expect(vars.x).toBe(42);
		expect(vars.y).toBe("hello");
		expect(vars.z).toBe(true);
	});

	it("should handle variable reassignment", () => {
		const result = executeAndGetVariable(
			`
			x = 10
			x = x + 5
			x = x * 2
		`,
			"x",
		);
		expect(result).toBe(30);
	});

	it("should handle variable swapping", () => {
		const vars = executeAndGetVariables(`
			a = 10
			b = 20
			temp = a
			a = b
			b = temp
		`);
		expect(vars.a).toBe(20);
		expect(vars.b).toBe(10);
	});
});

describe("AST Interpreter - String Operations", () => {
	it("should handle string concatenation", () => {
		const result = executeAndGetVariable(
			`
			first = "Hello"
			second = "World"
			result = first + " " + second
		`,
			"result",
		);
		expect(result).toBe("Hello World");
	});

	it("should handle mixed string and number concatenation", () => {
		const result = executeAndGetVariable(
			`
			name = "Alice"
			age = 16
			result = "Hello " + name + ", you are " + str(age)
		`,
			"result",
		);
		expect(result).toBe("Hello Alice, you are 16");
	});
});

describe("AST Interpreter - Type Conversions", () => {
	it("should handle int() conversion", () => {
		const result = executeAndGetVariable(
			`
			text = "42"
			result = int(text)
		`,
			"result",
		);
		expect(result).toBe(42);
	});

	it("should handle float() conversion", () => {
		const result = executeAndGetVariable(
			`
			text = "3.14"
			result = float(text)
		`,
			"result",
		);
		expect(result).toBe(3.14);
	});

	it("should handle str() conversion", () => {
		const result = executeAndGetVariable(
			`
			number = 42
			result = str(number)
		`,
			"result",
		);
		expect(result).toBe("42");
	});

	it("should handle bool() conversion", () => {
		const result1 = executeAndGetVariable(`result = bool(1)`, "result");
		const result2 = executeAndGetVariable(`result = bool(0)`, "result");
		const result3 = executeAndGetVariable(`result = bool("")`, "result");

		expect(result1).toBe(true);
		expect(result2).toBe(false);
		expect(result3).toBe(false);
	});
});


describe("AST Interpreter - Array Operations", () => {
	it("should handle array creation and access", () => {
		const vars = executeAndGetVariables(`
			arr = [1, 2, 3, 4, 5]
			first = arr[0]
			third = arr[2]
		`);
		expect(vars.first).toBe(1);
		expect(vars.third).toBe(3);
	});

	it("should handle array access with variables", () => {
		const result = executeAndGetVariable(
			`
			arr = [10, 20, 30, 40, 50]
			index = 3
			result = arr[index]
		`,
			"result",
		);
		expect(result).toBe(40);
	});

	it("should handle array in arithmetic operations", () => {
		const result = executeAndGetVariable(
			`
			numbers = [5, 10, 15]
			result = numbers[0] + numbers[1] * numbers[2]
		`,
			"result",
		);
		expect(result).toBe(155); // 5 + (10 * 15) = 155
	});
});

describe("AST Interpreter - Input/Output", () => {
	it("should handle input() function", () => {
		const vars = executeAndGetVariables(
			`
			name = input("What's your name?")
			age = int(input("How old are you?"))
		`,
			["Alice", "25"],
		);

		expect(vars.name).toBe("Alice");
		expect(vars.age).toBe(25);
	});

	it("should handle print() function", () => {
		const outputs = executeAndGetOutputs(`
			name = "Alice"
			age = 25
			print("Hello " + name)
			print("You are " + str(age) + " years old")
		`);

		expect(outputs).toEqual(["Hello Alice", "You are 25 years old"]);
	});

	it("should handle print with expressions", () => {
		const outputs = executeAndGetOutputs(`
			a = 5
			b = 3
			print(a + b)
			print("Result: " + str(a * b))
		`);

		expect(outputs).toEqual(["8", "Result: 15"]);
	});
});

describe("AST Interpreter - Complex Expressions", () => {
	it("should handle complex arithmetic with variables and arrays", () => {
		const result = executeAndGetVariable(
			`
			values = [2, 4, 6]
			x = 3
			y = 5
			result = (values[0] + x) * (values[1] - y) + values[2] ^ 2
		`,
			"result",
		);
		expect(result).toBe(35); // (2+3) * (4-5) + 6^2 = 5*(-1) + 36 = 31... wait let me recalculate
		// (2+3) * (4-5) + 6^2 = 5 * (-1) + 36 = -5 + 36 = 31
		expect(result).toBe(31);
	});

	// it("should handle nested function calls", () => {
	// 	const result = executeAndGetVariable(
	// 		`
	// 		text = "123"
	// 		result = int(text) + int("456")
	// 	`,
	// 		"result",
	// 	);
	// 	expect(result).toBe(579);
	// });
});

describe("AST Interpreter - Edge Cases", () => {
	it("should handle division by zero gracefully", () => {
		// This should either throw an error or return a special value
		// The behavior depends on the interpreter implementation
		expect(() => {
			executeAndGetVariable(
				`
				a = 5
				b = 0
				result = a / b
			`,
				"result",
			);
		}).not.toThrow(); // Adjust based on actual behavior
	});

	it("should handle empty strings", () => {
		const result = executeAndGetVariable(
			`
			empty = ""
			result = empty + "hello"
		`,
			"result",
		);
		expect(result).toBe("hello");
	});

	it("should handle zero values in expressions", () => {
		const result = executeAndGetVariable(
			`
			a = 0
			b = 5
			result = a + b * 2
		`,
			"result",
		);
		expect(result).toBe(10);
	});
});

describe("AST Interpreter - Comments", () => {
	it("should ignore single-line comments", () => {
		const result = executeAndGetVariable(
			`
			// This is a comment
			a = 5
			// Another comment
			b = 3
			result = a + b // Inline comment
		`,
			"result",
		);
		expect(result).toBe(8);
	});
});
