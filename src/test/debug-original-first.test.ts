import { describe, expect, it } from "vitest";
import { ASTInterpreter } from "../lib/astInterpreter";
import type { Program } from "../lib/astInterpreter";

/**
 * Copy of the first test from the original unit test file to debug the issue
 */

// Helper functions - exact copy from original
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
});
