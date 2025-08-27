import { describe, it, expect } from 'vitest';
import { ASTInterpreter } from '../lib/astInterpreter';

describe('Numeric addition vs string concatenation', () => {
	it('should treat total + nums[i] as numeric addition', () => {
		const program = `array nums[3]
nums[0] = 10
nums[1] = 20
nums[2] = 30
total = 0
total = total + nums[0]
print(str(total))`;

		const interpreter = new ASTInterpreter();
		const result = interpreter.execute(program);
		
		console.log('Variables:', result.variables);
		console.log('Variable values in trace:');
		result.trace.forEach((step, index) => {
			console.log(`Step ${index + 1} (line ${step.lineNumber}):`, step.variables);
		});
		
		// total should be 10, not "010"
		expect(result.outputs[0]).toBe('10');
	});
	
	it('should test isStringConcatenation directly for numeric addition', () => {
		const interpreter = new ASTInterpreter() as any;
		const vars = { total: 0, nums: [10, 20, 30] };
		
		const isStringConcat = interpreter.isStringConcatenation('total + nums[0]', vars);
		console.log('isStringConcatenation for "total + nums[0]":', isStringConcat);
		
		// This should be false (numeric addition)
		expect(isStringConcat).toBe(false);
	});
});
