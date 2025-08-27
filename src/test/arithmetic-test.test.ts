import { describe, it, expect } from 'vitest';
import { ASTInterpreter } from '../lib/astInterpreter';

describe('Arithmetic and string conversion test', () => {
	it('should handle division and str() conversion correctly', () => {
		const program = `total = 60
num = str(total / 3)
print(num)`;

		const interpreter = new ASTInterpreter();
		const result = interpreter.execute(program);
		
		console.log('Full execution result:', JSON.stringify(result, null, 2));
		
		// Should print "20"
		expect(result.outputs).toHaveLength(1);
		expect(result.outputs[0]).toBe('20');
	});

	it('should handle string concatenation with arithmetic', () => {
		const program = `total = 60
result = "Answer: " + str(total / 3)
print(result)`;

		const interpreter = new ASTInterpreter();
		const result = interpreter.execute(program);
		
		console.log('Concatenation test result:', JSON.stringify(result, null, 2));
		
		// Should print "Answer: 20"
		expect(result.outputs).toHaveLength(1);
		expect(result.outputs[0]).toBe('Answer: 20');
	});
});
