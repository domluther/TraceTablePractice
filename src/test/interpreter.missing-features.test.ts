import { describe, expect, it } from "vitest";
import { ASTInterpreter } from "@/lib/astInterpreter";
import type { Program } from "@/lib/astInterpreter";

/**
 * Tests for Missing Features from Legacy Implementation
 *
 * This test suite identifies key features from the legacy tests that are missing
 * or not working correctly in the new interpreter. Based on the legacy tests,
 * these features should be implemented to match the expected behavior.
 */

// Helper functions
function executeAndGetVariable(
	code: string,
	varName: string,
	inputs: string[] = [],
): any {
	const interpreter = new ASTInterpreter();
	const program: Program = { code, description: "test", inputs };
	const result = interpreter.executeProgram(code, program);

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

describe("Missing Features - String Methods", () => {
	it("should handle .upper() string method", () => {
		const result = executeAndGetVariable(
			`
			name = "john"
			result = name.upper()
		`,
			"result",
		);
		expect(result).toBe("JOHN");
	});

	it("should handle .lower() string method", () => {
		const result = executeAndGetVariable(
			`
			name = "JOHN"
			result = name.lower()
		`,
			"result",
		);
		expect(result).toBe("john");
	});

	it("should handle .left() string method", () => {
		const result = executeAndGetVariable(
			`
			name = "John"
			result = name.left(1)
		`,
			"result",
		);
		expect(result).toBe("J");
	});

	it("should handle .left() with larger lengths", () => {
		const result = executeAndGetVariable(
			`
			name = "Hello"
			result = name.left(3)
		`,
			"result",
		);
		expect(result).toBe("Hel");
	});

	it("should handle .substring() method", () => {
		const result = executeAndGetVariable(
			`
			country = "France"
			result = country.substring(1, 1)
		`,
			"result",
		);
		expect(result).toBe("r");
	});

	it("should handle .substring() with variable parameters", () => {
		const result = executeAndGetVariable(
			`
			text = "Hello"
			start = 2
			length = 2
			result = text.substring(start, length)
		`,
			"result",
		);
		expect(result).toBe("ll");
	});

	it("should handle .length property", () => {
		const result = executeAndGetVariable(
			`
			text = "Hello"
			result = text.length
		`,
			"result",
		);
		expect(result).toBe(5);
	});
});

describe("Missing Features - ASC and CHR Functions", () => {
	it("should handle ASC() function with string literals", () => {
		const result = executeAndGetVariable(
			`
			result = ASC("A")
		`,
			"result",
		);
		expect(result).toBe(65);
	});

	it("should handle ASC() function with variables", () => {
		const result = executeAndGetVariable(
			`
			letter = "A"
			result = ASC(letter)
		`,
			"result",
		);
		expect(result).toBe(65);
	});

	it("should handle ASC() with different characters", () => {
		const tests = [
			{ char: "Z", expected: 90 },
			{ char: "a", expected: 97 },
			{ char: "0", expected: 48 },
			{ char: " ", expected: 32 },
		];

		tests.forEach((test) => {
			const result = executeAndGetVariable(
				`
				result = ASC("${test.char}")
			`,
				"result",
			);
			expect(result).toBe(test.expected);
		});
	});

	it("should handle CHR() function with numeric literals", () => {
		const result = executeAndGetVariable(
			`
			result = CHR(65)
		`,
			"result",
		);
		expect(result).toBe("A");
	});

	it("should handle CHR() function with variables", () => {
		const result = executeAndGetVariable(
			`
			ascii_val = 65
			result = CHR(ascii_val)
		`,
			"result",
		);
		expect(result).toBe("A");
	});

	it("should handle CHR() with different ASCII values", () => {
		const tests = [
			{ ascii: 90, expected: "Z" },
			{ ascii: 97, expected: "a" },
			{ ascii: 48, expected: "0" },
			{ ascii: 32, expected: " " },
		];

		tests.forEach((test) => {
			const result = executeAndGetVariable(
				`
				result = CHR(${test.ascii})
			`,
				"result",
			);
			expect(result).toBe(test.expected);
		});
	});
});

describe("Missing Features - Boolean Operators", () => {
	it("should handle AND operator in conditions", () => {
		const result = executeAndGetVariable(
			`
			x = 5
			y = 10
			if x < 10 AND y > 5 then
				result = true
			else
				result = false
			endif
		`,
			"result",
		);
		expect(result).toBe(true);
	});

	it("should handle AND operator with false conditions", () => {
		const result = executeAndGetVariable(
			`
			x = 5
			y = 10
			if x < 3 AND y > 5 then
				result = true
			else
				result = false
			endif
		`,
			"result",
		);
		expect(result).toBe(false);
	});

	it("should handle OR operator in conditions", () => {
		const result = executeAndGetVariable(
			`
			x = 5
			y = 10
			if x < 10 OR y > 15 then
				result = true
			else
				result = false
			endif
		`,
			"result",
		);
		expect(result).toBe(true);
	});

	it("should handle OR operator with both false conditions", () => {
		const result = executeAndGetVariable(
			`
			x = 5
			y = 10
			if x > 10 OR y < 5 then
				result = true
			else
				result = false
			endif
		`,
			"result",
		);
		expect(result).toBe(false);
	});

	it("should handle complex boolean expressions with ASCII functions", () => {
		const result = executeAndGetVariable(
			`
			char = "A"
			if ASC(char) >= 65 AND ASC(char) <= 90 then
				result = true
			else
				result = false
			endif
		`,
			"result",
		);
		expect(result).toBe(true);
	});
});

describe("Missing Features - Array Functionality", () => {
	it("should handle array declaration with size", () => {
		const vars = executeAndGetVariables(`
			array colours[3]
			colours[0] = "Red"
			colours[1] = "Blue"
			colours[2] = "Green"
		`);
		expect(vars.colours[0]).toBe("Red");
		expect(vars.colours[1]).toBe("Blue");
		expect(vars.colours[2]).toBe("Green");
	});

	it("should handle array initialization with values", () => {
		const vars = executeAndGetVariables(`
			array scores = [85, 92, 78, 90]
			highest = scores[1]
		`);
		expect(vars.scores[0]).toBe(85);
		expect(vars.scores[1]).toBe(92);
		expect(vars.scores[2]).toBe(78);
		expect(vars.scores[3]).toBe(90);
		expect(vars.highest).toBe(92);
	});

	it("should handle array access with variable indices", () => {
		const result = executeAndGetVariable(
			`
			array names = ["Alice", "Bob", "Charlie"]
			index = 1
			result = names[index]
		`,
			"result",
		);
		expect(result).toBe("Bob");
	});

	it("should handle array arithmetic operations", () => {
		const result = executeAndGetVariable(
			`
			array nums = [10, 20, 30]
			result = nums[0] + nums[1] * nums[2]
		`,
			"result",
		);
		expect(result).toBe(610); // 10 + (20 * 30)
	});
});

describe("Missing Features - For Loop with Step", () => {
	it("should handle for loops with positive step values", () => {
		const outputs = executeAndGetOutputs(`
			for i = 2 to 10 step 2
				print(str(i))
			next i
		`);

		expect(outputs.length).toBe(5);
		expect(outputs[0]).toBe("2");
		expect(outputs[1]).toBe("4");
		expect(outputs[4]).toBe("10");
	});

	it("should handle for loops with negative step values", () => {
		const outputs = executeAndGetOutputs(`
			for i = 10 to 0 step -1
				print(str(i))
			next i
		`);

		expect(outputs.length).toBe(11);
		expect(outputs[0]).toBe("10");
		expect(outputs[10]).toBe("0");
	});

	it("should handle for loops with step in complex expressions", () => {
		const result = executeAndGetVariable(
			`
			total = 0
			for i = 1 to 10 step 2
				total = total + i
			next i
		`,
			"total",
		);
		expect(result).toBe(25); // 1 + 3 + 5 + 7 + 9 = 25
	});
});

describe("Missing Features - Switch/Case Statements", () => {
	it("should handle basic switch/case statements", () => {
		const outputs = executeAndGetOutputs(`
			day = "Mon"
			switch day:
			case "Mon":
				print("Monday")
			case "Tue":
				print("Tuesday")
			default:
				print("Unknown day")
			endswitch
		`);

		expect(outputs.length).toBe(1);
		expect(outputs[0]).toBe("Monday");
	});

	it("should handle switch/case with default case", () => {
		const outputs = executeAndGetOutputs(`
			day = "Wed"
			switch day:
			case "Mon":
				print("Monday")
			case "Tue":
				print("Tuesday")
			default:
				print("Unknown day")
			endswitch
		`);

		expect(outputs.length).toBe(1);
		expect(outputs[0]).toBe("Unknown day");
	});

	it("should handle switch/case with variables", () => {
		const result = executeAndGetVariable(
			`
			grade = "A"
			switch grade:
			case "A":
				result = "Excellent"
			case "B":
				result = "Good"
			default:
				result = "Average"
			endswitch
		`,
			"result",
		);
		expect(result).toBe("Excellent");
	});
});

describe("Missing Features - Constants", () => {
	it("should handle constant declarations", () => {
		const vars = executeAndGetVariables(`
			const PI = 3.14159
			const VAT = 0.2
			price = 100
			total = price * (1 + VAT)
		`);

		expect(vars.PI).toBe(3.14159);
		expect(vars.VAT).toBe(0.2);
		expect(vars.total).toBe(120);
	});

	it("should prevent constant reassignment", () => {
		expect(() => {
			executeAndGetVariable(
				`
				const PI = 3.14159
				PI = 2.71828
			`,
				"PI",
			);
		}).toThrow();
	});
});

describe("Missing Features - Complex String Operations", () => {
	it("should handle string methods in print statements", () => {
		const outputs = executeAndGetOutputs(`
			name = "hello"
			city = "WORLD"
			print(name.upper())
			print(city.lower())
			print(str(name.length))
		`);

		expect(outputs.length).toBe(3);
		expect(outputs[0]).toBe("HELLO");
		expect(outputs[1]).toBe("world");
		expect(outputs[2]).toBe("5");
	});

	it("should handle substring with variable loop indices", () => {
		const outputs = executeAndGetOutputs(`
			for x = 1 to 3
				country = "France"
				print(country.substring(x, 1))
			next x
		`);

		expect(outputs.length).toBe(3);
		expect(outputs[0]).toBe("r");
		expect(outputs[1]).toBe("a");
		expect(outputs[2]).toBe("n");
	});

	it("should handle string concatenation with initials", () => {
		const result = executeAndGetVariable(
			`
			first_name = "John"
			last_name = "Smith"
			result = first_name.left(1) + last_name.left(1)
		`,
			"result",
		);
		expect(result).toBe("JS");
	});
});

describe("Missing Features - float() Conversion", () => {
	it("should handle float() conversion from strings", () => {
		const result = executeAndGetVariable(
			`
			result = float("3.14")
		`,
			"result",
		);
		expect(result).toBe(3.14);
	});

	it("should handle float() conversion from variables", () => {
		const result = executeAndGetVariable(
			`
			numValue = 7
			result = float(numValue)
		`,
			"result",
		);
		expect(result).toBe(7.0);
	});
});

describe("Missing Features - Error Handling", () => {
	it("should handle reserved keyword errors", () => {
		expect(() => {
			executeAndGetVariable(`if = 5`, "if");
		}).toThrow(/reserved keyword/i);
	});

	it("should handle out of bounds array access gracefully", () => {
		const result = executeAndGetVariable(
			`
			array smallArray = [42]
			result = smallArray[5]
		`,
			"result",
		);
		expect(result).toBe(0); // Should return 0 for out of bounds
	});

	it("should handle empty array access gracefully", () => {
		const result = executeAndGetVariable(
			`
			array emptyArray = []
			result = emptyArray[0]
		`,
			"result",
		);
		expect(result).toBe(0); // Should return 0 for empty array
	});
});

describe("Missing Features - Nested Conditionals with Complex Expressions", () => {
	it("should handle nested if statements", () => {
		const vars = executeAndGetVariables(`
			jumpLength = 3.5
			yearGroup = 12
			if jumpLength > 2 then
				if yearGroup >= 10 then
					result = "qualify"
				else
					result = "too young"
				endif
			else
				result = "not long enough"
			endif
		`);

		expect(vars.jumpLength).toBe(3.5);
		expect(vars.yearGroup).toBe(12);
		expect(vars.result).toBe("qualify");
	});

	it("should handle MOD operator in for loop conditions", () => {
		const result = executeAndGetVariable(
			`
			total = 0
			for i = 1 to 5
				if i MOD 2 == 0 then
					total = total + i
				endif
			next i
		`,
			"total",
		);
		expect(result).toBe(6); // 2 + 4 = 6
	});
});
