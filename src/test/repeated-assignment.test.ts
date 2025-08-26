import { describe, it, expect } from "vitest";
import { ASTInterpreter, type Program } from "../lib/astInterpreter";

describe("Repeated Assignment Issue", () => {
	// Helper function
	function executeAndGetTrace(code: string, inputs: string[] = []) {
		const interpreter = new ASTInterpreter();
		const program: Program = { code, description: "test", inputs };
		const result = interpreter.executeProgram(code, program);
		return result.trace;
	}

	it("should handle repeated assignment of same value correctly in loop", () => {
		const code = `for x = 1 to 3
    country = "France"
    print(country.substring(x, 1))
next x`;

		const trace = executeAndGetTrace(code);

		console.log("Trace steps for repeated assignment:");
		trace.forEach((step, index) => {
			console.log(`Step ${index + 1}: Line ${step.lineNumber}`);
			console.log(`  Variables:`, step.variables);
			console.log(`  Changed variables:`, step.changedVariables);
			console.log(`  Output:`, step.output);
			console.log("");
		});

		// The issue: currently country = "France" appears in changedVariables
		// for every iteration, but it should only appear once since the value doesn't change
		const countryAssignmentSteps = trace.filter(
			(step) => step.changedVariables && "country" in step.changedVariables,
		);

		console.log(
			`Number of times 'country' appears in changedVariables: ${countryAssignmentSteps.length}`,
		);

		// After the fix: only one entry for country since value doesn't actually change
		expect(countryAssignmentSteps.length).toBe(1); // Fixed behavior

		// Verify the trace has the correct number of steps
		// Should be: x=1, country="France", print, x=2, print, x=3, print = 7 steps
		expect(trace.length).toBe(7);
	});

	it("should handle repeated assignment where value actually changes", () => {
		const code = `for i = 1 to 3
    value = i * 2
    print(value)
next i`;

		const trace = executeAndGetTrace(code);

		const valueAssignmentSteps = trace.filter(
			(step) => step.changedVariables && "value" in step.changedVariables,
		);

		// This should correctly show 3 changes since the value actually changes
		expect(valueAssignmentSteps.length).toBe(3);
		expect(valueAssignmentSteps[0].changedVariables.value).toBe(2);
		expect(valueAssignmentSteps[1].changedVariables.value).toBe(4);
		expect(valueAssignmentSteps[2].changedVariables.value).toBe(6);
	});
});
