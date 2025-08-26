import { describe, expect, it } from "vitest";
import type { Program } from "@/lib/astInterpreter";
import { ASTInterpreter } from "@/lib/astInterpreter";
import { programs } from "@/lib/programs";

/**
 * Simple Program Tests
 *
 * These tests run a few basic programs from programs.ts to verify
 * the interpreter works for the actual programs students will use.
 * We start with simple programs to avoid infinite loops.
 */

function runProgram(programDef: any, inputs: string[] = []) {
	const interpreter = new ASTInterpreter();
	const program: Program = {
		code: programDef.code,
		description: programDef.description,
		inputs: inputs.length > 0 ? inputs : programDef.inputs,
	};

	try {
		const result = interpreter.executeProgram(programDef.code, program);
		const lastStep = result.trace[result.trace.length - 1];

		return {
			success: true,
			variables: lastStep?.variables || {},
			outputs: result.outputs,
			trace: result.trace,
		};
	} catch (error) {
		return {
			success: false,
			error: error,
			variables: {},
			outputs: [],
			trace: [],
		};
	}
}

describe("Simple Program Tests", () => {
	it("should run the first easy program (basic addition)", () => {
		const program = programs.easy[0]; // Basic addition: a=5, b=3, c=a+b, print(c)
		const result = runProgram(program);

		expect(result.success).toBe(true);
		expect(result.variables.a).toBe(5);
		expect(result.variables.b).toBe(3);
		expect(result.variables.c).toBe(8);
		expect(result.outputs).toContain("8");
	});

	it("should run a simple text display program", () => {
		// Find a program that doesn't use input but displays text
		const textProgram = programs.easy.find(
			(p) =>
				p.code.includes("print") &&
				!p.code.includes("input") &&
				p.code.includes('"'),
		);

		if (textProgram) {
			const result = runProgram(textProgram);
			expect(result.success).toBe(true);
			expect(result.outputs.length).toBeGreaterThan(0);
		}
	});

	it("should run a name input program with test data", () => {
		// Find the name input program
		const nameProgram = programs.easy.find(
			(p) => p.code.includes("input") && p.code.includes("name"),
		);

		if (nameProgram?.inputSets) {
			const result = runProgram(nameProgram, nameProgram.inputSets[0]);
			expect(result.success).toBe(true);
			expect(result.outputs.length).toBeGreaterThan(0);
			// Check if the input was used in the output
			const inputName = nameProgram.inputSets[0][0];
			const hasInputInOutput = result.outputs.some((output) =>
				output.includes(inputName),
			);
			expect(hasInputInOutput).toBe(true);
		}
	});

	it("should handle programs without loops or complex control structures", () => {
		// Test several easy programs that should be straightforward
		const simplePrograms = programs.easy.filter(
			(p) =>
				!p.code.includes("for ") &&
				!p.code.includes("while ") &&
				!p.code.includes("if "),
		);

		simplePrograms.slice(0, 3).forEach((program) => {
			const result = runProgram(program, program.inputSets?.[0] || []);
			expect(result.success).toBe(true);
			expect(result.trace.length).toBeGreaterThan(0);
		});
	});

	it("should handle arithmetic programs correctly", () => {
		// Test programs with arithmetic operations
		const arithmeticPrograms = programs.easy.filter(
			(p) =>
				(p.code.includes("+") ||
					p.code.includes("*") ||
					p.code.includes("-")) &&
				!p.code.includes("for ") &&
				!p.code.includes("while "),
		);

		arithmeticPrograms.slice(0, 2).forEach((program) => {
			const result = runProgram(program, program.inputSets?.[0] || []);
			expect(result.success).toBe(true);
			if (program.code.includes("print")) {
				expect(result.outputs.length).toBeGreaterThan(0);
			}
		});
	});

	it("should handle type conversion programs", () => {
		// Test programs with int() or str() conversions
		const conversionPrograms = programs.easy.filter(
			(p) =>
				(p.code.includes("int(") || p.code.includes("str(")) &&
				!p.code.includes("for ") &&
				!p.code.includes("while "),
		);

		conversionPrograms.slice(0, 2).forEach((program) => {
			const inputs = program.inputSets?.[0] || [];
			const result = runProgram(program, inputs);
			expect(result.success).toBe(true);
			expect(result.trace.length).toBeGreaterThan(0);
		});
	});
});
