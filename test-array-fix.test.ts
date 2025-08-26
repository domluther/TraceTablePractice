import { describe, expect, it } from "vitest";
import { ASTInterpreter } from "./src/lib/astInterpreter";

describe("Array Assignment Trace Fix", () => {
	it("should correctly identify changed variables for array assignments", () => {
		const interpreter = new ASTInterpreter();
		const code = `array colours[3]
colours[0] = "Red"
colours[1] = "Blue"
colours[2] = "Green"
print("First colour: " + colours[0])
print("Last colour: " + colours[2])`;

		const result = interpreter.execute(code);
		
		// Check the specific lines that should show variable changes
		const line2Trace = result.trace.find(step => step.lineNumber === 2);
		const line3Trace = result.trace.find(step => step.lineNumber === 3);
		const line4Trace = result.trace.find(step => step.lineNumber === 4);

		console.log('Line 2 trace:', line2Trace);
		console.log('Line 3 trace:', line3Trace);  
		console.log('Line 4 trace:', line4Trace);

		// Verify that changedVariables correctly identifies the array element changes
		expect(line2Trace?.changedVariables).toEqual({ 'colours[0]': 'Red' });
		expect(line3Trace?.changedVariables).toEqual({ 'colours[1]': 'Blue' });
		expect(line4Trace?.changedVariables).toEqual({ 'colours[2]': 'Green' });
	});
});
