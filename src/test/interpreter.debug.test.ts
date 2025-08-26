import { describe, expect, it } from "vitest";
import { ASTInterpreter } from "@/lib/astInterpreter";
import type { Program } from "@/lib/astInterpreter";

/**
 * Debug Tests for AST Interpreter
 *
 * These tests help debug specific issues with the interpreter
 */

function debugProgram(code: string, inputs: string[] = []): any {
	const interpreter = new ASTInterpreter();
	const program: Program = { code, description: "debug", inputs };

	console.log("=== DEBUG PROGRAM ===");
	console.log("Code:", code);
	console.log("Inputs:", inputs);

	try {
		const result = interpreter.executeProgram(code, program);
		console.log("Result:", result);

		const lastStep = result.trace[result.trace.length - 1];
		console.log("Final variables:", lastStep?.variables);
		console.log("Outputs:", result.outputs);

		return {
			variables: lastStep?.variables || {},
			outputs: result.outputs,
			trace: result.trace,
			success: true,
		};
	} catch (error) {
		console.log("Error:", error);
		return {
			variables: {},
			outputs: [],
			trace: [],
			success: false,
			error: error,
		};
	}
}

describe("AST Interpreter - Debug Tests", () => {
	it("should debug string concatenation", () => {
		const result = debugProgram(`
			name = "World"
			message = "Hello " + name
			print(message)
		`);

		// Let's see what actually happens
		console.log("Variables:", result.variables);
		console.log("Outputs:", result.outputs);
	});

	it("should debug input handling", () => {
		const result = debugProgram(
			`
			name = input("Name?")
			print("Hello " + name)
		`,
			["Alice"],
		);

		console.log("Variables:", result.variables);
		console.log("Outputs:", result.outputs);
	});

	it("should debug simple variable replacement", () => {
		const result = debugProgram(`
			x = 5
			y = x + 3
		`);

		console.log("Variables:", result.variables);
	});
});
