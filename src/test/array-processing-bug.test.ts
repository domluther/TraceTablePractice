import { describe, expect, it } from "vitest";
import type { Program } from "@/lib/astInterpreter";
import { ASTInterpreter } from "@/lib/astInterpreter";

/**
 * Array Processing Bug Test
 *
 * Testing the specific program that has issues with array processing
 * and running totals calculation.
 */

function runProgram(code: string, inputs: string[] = []) {
	const interpreter = new ASTInterpreter();
	const program: Program = {
		code: code,
		description: "Array processing test",
		inputs: inputs,
	};

	try {
		const result = interpreter.executeProgram(code, program);
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

describe("Array Processing Bug Test", () => {
	it("should correctly process array with running totals", () => {
		const code = `array nums[3]
nums[0] = 10
nums[1] = 20
nums[2] = 30
total = 0
for i = 0 to 2
    total = total + nums[i]
    print("Sum so far: " + str(total))
next i
print("Average: " + str(total / 3))`;

		const result = runProgram(code);

		console.log("Program execution result:", result);
		console.log("Outputs:", result.outputs);
		console.log("Variables:", result.variables);
		
		if (result.trace) {
			console.log("Trace (last 5 steps):");
			result.trace.slice(-5).forEach((step, idx) => {
				console.log(`Step ${result.trace.length - 5 + idx}:`, {
					lineNumber: step.lineNumber,
					variables: step.variables,
					output: step.output
				});
			});
		}

		expect(result.success).toBe(true);
		
		// Expected outputs
		const expectedOutputs = [
			"Sum so far: 10",
			"Sum so far: 30", 
			"Sum so far: 60",
			"Average: 20"
		];
		
		expect(result.outputs).toEqual(expectedOutputs);
		if (result.success) {
			expect((result.variables as any).total).toBe(60);
			expect((result.variables as any).nums).toEqual([10, 20, 30]);
		}
	});
});
