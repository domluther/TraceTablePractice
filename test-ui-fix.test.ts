import { describe, expect, it } from "vitest";
import { ASTInterpreter } from "./src/lib/astInterpreter";

describe("Array Assignment UI Fix", () => {
	it("should correctly identify array element variables as changed", () => {
		const interpreter = new ASTInterpreter();
		const code = `array colours[3]
colours[0] = "Red"
colours[1] = "Blue"
colours[2] = "Green"`;

		const result = interpreter.execute(code);
		
		console.log('Program variables (expanded):', result.variables);
		
		// Check that the program variables include the expanded array elements
		expect(result.variables).toContain('colours[0]');
		expect(result.variables).toContain('colours[1]');
		expect(result.variables).toContain('colours[2]');

		// Check that each assignment step has the correct changedVariables
		const step1 = result.trace[0]; // colours[0] = "Red"
		const step2 = result.trace[1]; // colours[1] = "Blue"
		const step3 = result.trace[2]; // colours[2] = "Green"

		console.log('Step 1 changedVariables:', Object.keys(step1.changedVariables || {}));
		console.log('Step 2 changedVariables:', Object.keys(step2.changedVariables || {}));
		console.log('Step 3 changedVariables:', Object.keys(step3.changedVariables || {}));

		// These should have the correct changed variables
		expect(step1.changedVariables).toHaveProperty('colours[0]', 'Red');
		expect(step2.changedVariables).toHaveProperty('colours[1]', 'Blue');
		expect(step3.changedVariables).toHaveProperty('colours[2]', 'Green');

		// For the UI fix, simulate what the UI logic would do
		result.variables.forEach(varName => {
			console.log(`\nChecking variable: ${varName}`);
			
			// Check step 1 (should only change colours[0])
			const step1Changed = Object.keys(step1.changedVariables || {}).includes(varName);
			console.log(`  Step 1: ${varName} changed = ${step1Changed}`);
			if (varName === 'colours[0]') {
				expect(step1Changed).toBe(true);
			} else {
				expect(step1Changed).toBe(false);
			}
			
			// Check step 2 (should only change colours[1])
			const step2Changed = Object.keys(step2.changedVariables || {}).includes(varName);
			console.log(`  Step 2: ${varName} changed = ${step2Changed}`);
			if (varName === 'colours[1]') {
				expect(step2Changed).toBe(true);
			} else {
				expect(step2Changed).toBe(false);
			}
			
			// Check step 3 (should only change colours[2])
			const step3Changed = Object.keys(step3.changedVariables || {}).includes(varName);
			console.log(`  Step 3: ${varName} changed = ${step3Changed}`);
			if (varName === 'colours[2]') {
				expect(step3Changed).toBe(true);
			} else {
				expect(step3Changed).toBe(false);
			}
		});
	});
});
