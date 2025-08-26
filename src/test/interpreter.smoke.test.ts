import { describe, expect, it } from "vitest";
import { ASTInterpreter } from "@/lib/astInterpreter";
import type { Program } from "@/lib/astInterpreter";

/**
 * Basic Smoke Tests for AST Interpreter
 *
 * These are simple tests to verify the interpreter works for basic cases
 * without getting stuck in infinite loops or complex scenarios.
 */

function executeSimpleProgram(code: string, inputs: string[] = []): any {
	const interpreter = new ASTInterpreter();
	const program: Program = { code, description: "test", inputs };

	try {
		const result = interpreter.executeProgram(code, program);
		const lastStep = result.trace[result.trace.length - 1];
		return {
			variables: lastStep?.variables || {},
			outputs: result.outputs,
			trace: result.trace,
			success: true,
		};
	} catch (error) {
		return {
			variables: {},
			outputs: [],
			trace: [],
			success: false,
			error: error,
		};
	}
}

describe("AST Interpreter - Smoke Tests", () => {
	it("should handle basic variable assignment", () => {
		const result = executeSimpleProgram("a = 5");
		expect(result.success).toBe(true);
		expect(result.variables.a).toBe(5);
	});

	it("should handle simple arithmetic", () => {
		const result = executeSimpleProgram(`
			a = 5
			b = 3
			c = a + b
		`);
		expect(result.success).toBe(true);
		expect(result.variables.c).toBe(8);
	});

	it("should handle print statements", () => {
		const result = executeSimpleProgram(`
			a = 42
			print(a)
		`);
		expect(result.success).toBe(true);
		expect(result.outputs).toContain("42");
	});

	it("should handle string operations", () => {
		const result = executeSimpleProgram(`
			name = "World"
			message = "Hello " + name
			print(message)
		`);
		expect(result.success).toBe(true);
		expect(result.outputs).toContain("Hello World");
	});

	it("should handle input operations", () => {
		const result = executeSimpleProgram(
			`
			name = input("Name?")
			print("Hello " + name)
		`,
			["Alice"],
		);
		expect(result.success).toBe(true);
		expect(result.outputs).toContain("Hello Alice");
	});

	it("should handle basic multiplication", () => {
		const result = executeSimpleProgram(`
			a = 6
			b = 7
			result = a * b
		`);
		expect(result.success).toBe(true);
		expect(result.variables.result).toBe(42);
	});

	it("should handle operator precedence", () => {
		const result = executeSimpleProgram(`
			result = 2 + 3 * 4
		`);
		expect(result.success).toBe(true);
		expect(result.variables.result).toBe(14);
	});

	it("should handle parentheses", () => {
		const result = executeSimpleProgram(`
			result = (2 + 3) * 4
		`);
		expect(result.success).toBe(true);
		expect(result.variables.result).toBe(20);
	});

	it("should handle type conversions", () => {
		const result = executeSimpleProgram(`
			text = "42"
			number = int(text)
			back = str(number)
		`);
		expect(result.success).toBe(true);
		expect(result.variables.number).toBe(42);
		expect(result.variables.back).toBe("42");
	});

	it("should generate trace steps", () => {
		const result = executeSimpleProgram(`
			a = 1
			b = 2
			c = a + b
		`);
		expect(result.success).toBe(true);
		expect(result.trace.length).toBeGreaterThan(0);
		expect(result.trace[0].lineNumber).toBeGreaterThan(0);
	});
});

describe("AST Interpreter - Error Handling", () => {
	it("should not crash on empty code", () => {
		const result = executeSimpleProgram("");
		expect(result.success).toBe(true);
		expect(result.trace.length).toBe(0);
	});

	it("should not crash on comments only", () => {
		const result = executeSimpleProgram(`
			// This is a comment
			// Another comment
		`);
		expect(result.success).toBe(true);
	});

	it("should handle single variable assignment", () => {
		const result = executeSimpleProgram("x = 100");
		expect(result.success).toBe(true);
		expect(result.variables.x).toBe(100);
	});
});
