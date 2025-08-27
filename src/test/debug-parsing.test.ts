import { describe, it, expect } from 'vitest';
import { ASTInterpreter } from '../lib/astInterpreter';

describe('Debug string concatenation parsing', () => {
	it('should debug the parsing issue', () => {
		const program = `total = 60
result = "Answer: " + str(total / 3)`;

		const interpreter = new ASTInterpreter();
		
		// Let's examine what happens step by step
		console.log('Program to execute:', program);
		
		const result = interpreter.execute(program);
		
		console.log('Variables after execution:', result.variables);
		console.log('Variable values in trace:');
		result.trace.forEach((step, index) => {
			console.log(`Step ${index + 1} (line ${step.lineNumber}):`, step.variables);
		});
		
		// The problem is likely in the assignment parsing/evaluation
		expect(result.variables).toContain('total');
		expect(result.variables).toContain('result');
	});
});
