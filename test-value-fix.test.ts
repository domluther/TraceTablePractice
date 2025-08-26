import { describe, expect, it } from "vitest";
import { ASTInterpreter } from "./src/lib/astInterpreter";

describe("Array Assignment Value Fix", () => {
	it("should correctly get expected values for array assignments", () => {
		const interpreter = new ASTInterpreter();
		const code = `array colours[3]
colours[0] = "Red"
colours[1] = "Blue"
colours[2] = "Green"`;

		const result = interpreter.execute(code);
		
		// Simulate what the UI does for each step
		result.trace.forEach((step, index) => {
			console.log(`\nStep ${index + 1} (Line ${step.lineNumber}):`);
			console.log('  changedVariables:', step.changedVariables);
			console.log('  variables:', step.variables);
			
			// Check each program variable
			result.variables.forEach(varName => {
				const isChanged = step.changedVariables && Object.keys(step.changedVariables).includes(varName);
				console.log(`  ${varName}: changed=${isChanged}`);
				
				if (isChanged && step.changedVariables) {
					const expectedValue = step.changedVariables[varName];
					console.log(`    expectedValue from changedVariables: "${expectedValue}"`);
				}
			});
		});

		// Verify the specific expected values
		const step1 = result.trace[0]; // colours[0] = "Red"
		const step2 = result.trace[1]; // colours[1] = "Blue"
		const step3 = result.trace[2]; // colours[2] = "Green"

		// For step 1, colours[0] should be "Red"
		expect(step1.changedVariables?.['colours[0]']).toBe('Red');
		
		// For step 2, colours[1] should be "Blue"
		expect(step2.changedVariables?.['colours[1]']).toBe('Blue');
		
		// For step 3, colours[2] should be "Green"
		expect(step3.changedVariables?.['colours[2]']).toBe('Green');
	});
});
