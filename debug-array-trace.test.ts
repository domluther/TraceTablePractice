import { describe, expect, it } from "vitest";
import { ASTInterpreter } from "./src/lib/astInterpreter";

describe("Array Assignment Trace Issue", () => {
	it("should properly track array assignments in trace", () => {
		const interpreter = new ASTInterpreter();
		const code = `array colours[3]
colours[0] = "Red"
colours[1] = "Blue"
colours[2] = "Green"
print("First colour: " + colours[0])
print("Last colour: " + colours[2])`;

		const result = interpreter.execute(code);
		
		console.log('Full trace:');
		result.trace.forEach((step, index) => {
			console.log(`Step ${index + 1} (Line ${step.lineNumber}):`);
			console.log('  Changed variables:', step.changedVariables);
			console.log('  Output:', step.output);
			console.log('  All variables:', step.variables);
			console.log('---');
		});

		// Check that each array assignment creates a trace step with changed variables
		const line2Trace = result.trace.find(step => step.lineNumber === 2);
		const line3Trace = result.trace.find(step => step.lineNumber === 3);
		const line4Trace = result.trace.find(step => step.lineNumber === 4);

		expect(line2Trace).toBeDefined();
		expect(line3Trace).toBeDefined();
		expect(line4Trace).toBeDefined();

		// These should have changed variables since we're assigning array elements
		expect(Object.keys(line2Trace.changedVariables || {}).length).toBeGreaterThan(0);
		expect(Object.keys(line3Trace.changedVariables || {}).length).toBeGreaterThan(0);
		expect(Object.keys(line4Trace.changedVariables || {}).length).toBeGreaterThan(0);

		// Check that the changed variables contain the array assignments
		expect(line2Trace.changedVariables).toHaveProperty('colours[0]', 'Red');
		expect(line3Trace.changedVariables).toHaveProperty('colours[1]', 'Blue');
		expect(line4Trace.changedVariables).toHaveProperty('colours[2]', 'Green');
	});
});
