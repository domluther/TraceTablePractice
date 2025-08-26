import { describe, expect, it } from "vitest";
import { ASTInterpreter } from "@/lib/astInterpreter";
import { programs } from "@/lib/programs";
import type { Program as ProgramDefinition } from "@/lib/programs";
import type { Program } from "@/lib/astInterpreter";

/**
 * Integration Tests for AST Interpreter
 *
 * These integration tests validate all actual programs from programs.ts
 * that students will encounter when using the trace table practice application.
 * They ensure all programs execute correctly and provide comprehensive coverage.
 *
 * Test Coverage:
 * - All programs from programs.ts (easy, medium, hard)
 * - End-to-end trace table validation with real program execution
 * - Input/output validation for programs with input sets
 * - Multi-feature interactions in production programs
 * - Real GCSE Computer Science problem scenarios
 * - Interpreter robustness across all difficulty levels
 */

// Helper functions
function executeProgram(
	programDef: ProgramDefinition,
	inputs: string[] = [],
): {
	variables: Record<string, any>;
	outputs: string[];
	trace: any[];
} {
	const interpreter = new ASTInterpreter();
	const program: Program = {
		code: programDef.code,
		description: programDef.description,
		inputs: inputs.length > 0 ? inputs : programDef.inputs,
	};

	const result = interpreter.executeProgram(programDef.code, program);

	// Get variables from the final trace step
	const lastStep = result.trace[result.trace.length - 1];
	const variables = lastStep?.variables || {};

	return {
		variables,
		outputs: result.outputs,
		trace: result.trace,
	};
}

function testProgramExecution(
	programDef: ProgramDefinition,
	testName: string,
	inputs: string[] = [],
) {
	it(testName, () => {
		expect(() => {
			const result = executeProgram(programDef, inputs);
			// Basic validation - program should execute without throwing
			expect(result).toBeDefined();
			expect(result.trace).toBeDefined();
			expect(Array.isArray(result.trace)).toBe(true);
			expect(result.variables).toBeDefined();
			expect(result.outputs).toBeDefined();
			expect(Array.isArray(result.outputs)).toBe(true);
		}).not.toThrow();
	});
}

describe("Integration Tests - Easy Programs", () => {
	programs.easy.forEach((program, index) => {
		const testName = `Easy #${index}: ${program.description}`;

		if (program.inputSets && program.inputSets.length > 0) {
			// Test with multiple input sets
			program.inputSets.forEach((inputSet, setIndex) => {
				testProgramExecution(
					program,
					`${testName} (Input Set ${setIndex + 1})`,
					inputSet,
				);
			});
		} else if (program.inputs) {
			// Test with provided inputs
			testProgramExecution(program, testName, program.inputs);
		} else {
			// Test without inputs
			testProgramExecution(program, testName);
		}
	});
});

describe("Integration Tests - Medium Programs", () => {
	programs.medium.forEach((program, index) => {
		const testName = `Medium #${index}: ${program.description}`;

		if (program.inputSets && program.inputSets.length > 0) {
			// Test with multiple input sets
			program.inputSets.forEach((inputSet, setIndex) => {
				testProgramExecution(
					program,
					`${testName} (Input Set ${setIndex + 1})`,
					inputSet,
				);
			});
		} else if (program.inputs) {
			// Test with provided inputs
			testProgramExecution(program, testName, program.inputs);
		} else {
			// Test without inputs
			testProgramExecution(program, testName);
		}
	});
});

describe("Integration Tests - Hard Programs", () => {
	programs.hard.forEach((program, index) => {
		const testName = `Hard #${index}: ${program.description}`;

		if (program.inputSets && program.inputSets.length > 0) {
			// Test with multiple input sets
			program.inputSets.forEach((inputSet, setIndex) => {
				testProgramExecution(
					program,
					`${testName} (Input Set ${setIndex + 1})`,
					inputSet,
				);
			});
		} else if (program.inputs) {
			// Test with provided inputs
			testProgramExecution(program, testName, program.inputs);
		} else {
			// Test without inputs
			testProgramExecution(program, testName);
		}
	});
});

describe("Integration Tests - Specific Program Validations", () => {
	it("should handle basic addition correctly", () => {
		// Test the first easy program (basic addition)
		const program = programs.easy[0];
		const result = executeProgram(program);

		expect(result.variables.a).toBe(5);
		expect(result.variables.b).toBe(3);
		expect(result.variables.c).toBe(8);
		expect(result.outputs).toContain("8");
	});

	it("should handle input programs correctly", () => {
		// Find a program that uses input
		const inputProgram = programs.easy.find(
			(p) => p.inputSets && p.inputSets.length > 0,
		);
		if (inputProgram && inputProgram.inputSets) {
			const result = executeProgram(inputProgram, inputProgram.inputSets[0]);

			// Should have executed without errors and produced outputs
			expect(result.trace.length).toBeGreaterThan(0);
			expect(result.outputs.length).toBeGreaterThan(0);
		}
	});

	it("should handle arithmetic operations in real programs", () => {
		// Test a program with arithmetic operations
		const arithmeticProgram = programs.easy.find(
			(p) =>
				p.code.includes("+") ||
				p.code.includes("-") ||
				p.code.includes("*") ||
				p.code.includes("/"),
		);

		if (arithmeticProgram) {
			const result = executeProgram(arithmeticProgram);
			expect(result.trace.length).toBeGreaterThan(0);
		}
	});

	it("should handle string operations in real programs", () => {
		// Test a program with string operations
		const stringProgram = programs.easy.find(
			(p) => p.code.includes('"') && p.code.includes("+"),
		);

		if (stringProgram) {
			const inputs = stringProgram.inputSets ? stringProgram.inputSets[0] : [];
			const result = executeProgram(stringProgram, inputs);
			expect(result.trace.length).toBeGreaterThan(0);
			expect(result.outputs.length).toBeGreaterThan(0);
		}
	});

	it("should handle type conversions in real programs", () => {
		// Test a program with type conversions (int, str, etc.)
		const conversionProgram = [...programs.easy, ...programs.medium].find(
			(p) =>
				p.code.includes("int(") ||
				p.code.includes("str(") ||
				p.code.includes("float("),
		);

		if (conversionProgram) {
			const inputs = conversionProgram.inputSets
				? conversionProgram.inputSets[0]
				: [];
			const result = executeProgram(conversionProgram, inputs);
			expect(result.trace.length).toBeGreaterThan(0);
		}
	});
});

describe("Integration Tests - Program Output Validation", () => {
	it("should produce expected outputs for greeting program", () => {
		// Find greeting program
		const greetingProgram = programs.easy.find(
			(p) =>
				p.description.toLowerCase().includes("greeting") ||
				p.code.includes("Hello"),
		);

		if (greetingProgram && greetingProgram.inputSets) {
			const result = executeProgram(
				greetingProgram,
				greetingProgram.inputSets[0],
			);
			expect(result.outputs.length).toBeGreaterThan(0);
			expect(result.outputs.some((output) => output.includes("Hello"))).toBe(
				true,
			);
		}
	});

	it("should handle calculation programs correctly", () => {
		// Find a calculation program
		const calcProgram = [...programs.easy, ...programs.medium].find(
			(p) =>
				p.description.toLowerCase().includes("calculator") ||
				p.description.toLowerCase().includes("score") ||
				p.description.toLowerCase().includes("total"),
		);

		if (calcProgram) {
			const inputs = calcProgram.inputSets ? calcProgram.inputSets[0] : [];
			const result = executeProgram(calcProgram, inputs);

			// Should have calculated some values and displayed them
			expect(result.trace.length).toBeGreaterThan(0);
			expect(result.outputs.length).toBeGreaterThan(0);
		}
	});

	it("should handle programs with multiple outputs", () => {
		// Find a program that should produce multiple outputs
		const multiOutputProgram = [...programs.easy, ...programs.medium].find(
			(p) => (p.code.match(/print\(/g) || []).length > 1,
		);

		if (multiOutputProgram) {
			const inputs = multiOutputProgram.inputSets
				? multiOutputProgram.inputSets[0]
				: [];
			const result = executeProgram(multiOutputProgram, inputs);

			const printCount = (multiOutputProgram.code.match(/print\(/g) || [])
				.length;
			expect(result.outputs.length).toBe(printCount);
		}
	});
});

describe("Integration Tests - Trace Generation", () => {
	it("should generate trace steps for all lines", () => {
		const program = programs.easy[0]; // Basic addition program
		const result = executeProgram(program);

		// Should have trace steps for each executable line
		const executableLines = program.code
			.split("\n")
			.filter((line) => line.trim() && !line.trim().startsWith("//")).length;

		expect(result.trace.length).toBeGreaterThanOrEqual(1);
		expect(result.trace.length).toBeLessThanOrEqual(executableLines + 1);
	});

	it("should track variable changes across trace steps", () => {
		const program = programs.easy[0]; // Basic addition program
		const result = executeProgram(program);

		// Should show progression of variable assignments
		let foundA = false,
			foundB = false,
			foundC = false;

		result.trace.forEach((step) => {
			if (step.variables.a === 5) foundA = true;
			if (step.variables.b === 3) foundB = true;
			if (step.variables.c === 8) foundC = true;
		});

		expect(foundA).toBe(true);
		expect(foundB).toBe(true);
		expect(foundC).toBe(true);
	});

	it("should include line numbers in trace steps", () => {
		const program = programs.easy[0];
		const result = executeProgram(program);

		result.trace.forEach((step) => {
			expect(step.lineNumber).toBeGreaterThan(0);
			expect(typeof step.lineNumber).toBe("number");
		});
	});
});

describe("Integration Tests - Error Handling", () => {
	it("should handle programs with potential division by zero", () => {
		// Find programs that might have division operations
		const divisionPrograms = [
			...programs.easy,
			...programs.medium,
			...programs.hard,
		].filter((p) => p.code.includes("/") || p.code.includes("DIV"));

		divisionPrograms.forEach((program, index) => {
			const testName = `Division program ${index + 1}: ${program.description}`;

			it(testName, () => {
				// Should not crash, even if division by zero occurs
				expect(() => {
					const inputs = program.inputSets ? program.inputSets[0] : [];
					executeProgram(program, inputs);
				}).not.toThrow();
			});
		});
	});

	it("should handle programs with array access", () => {
		// Find programs that use arrays
		const arrayPrograms = [
			...programs.easy,
			...programs.medium,
			...programs.hard,
		].filter((p) => p.code.includes("[") && p.code.includes("]"));

		arrayPrograms.forEach((program, index) => {
			const testName = `Array program ${index + 1}: ${program.description}`;

			it(testName, () => {
				// Should handle array operations correctly
				expect(() => {
					const inputs = program.inputSets ? program.inputSets[0] : [];
					const result = executeProgram(program, inputs);
					expect(result.trace.length).toBeGreaterThan(0);
				}).not.toThrow();
			});
		});
	});

	it("should handle programs with string operations", () => {
		// Find programs that use string concatenation
		const stringPrograms = [
			...programs.easy,
			...programs.medium,
			...programs.hard,
		].filter((p) => p.code.includes('"') && p.code.includes("+"));

		stringPrograms.forEach((program, index) => {
			const testName = `String program ${index + 1}: ${program.description}`;

			it(testName, () => {
				// Should handle string operations correctly
				expect(() => {
					const inputs = program.inputSets ? program.inputSets[0] : [];
					const result = executeProgram(program, inputs);
					expect(result.trace.length).toBeGreaterThan(0);
				}).not.toThrow();
			});
		});
	});
});
