import { describe, it, expect } from 'vitest';
import { ASTInterpreter } from '../lib/astInterpreter';

describe('String concatenation bug diagnosis', () => {
	it('should identify string concatenation correctly with arithmetic in str()', () => {
		const interpreter = new ASTInterpreter() as any; // Type assertion to access private methods
		
		const testExpression = '"Answer: " + str(total / 3)';
		const vars = { total: 60 };
		
		// Test the isStringConcatenation method directly
		const isStringConcat = interpreter.isStringConcatenation(testExpression, vars);
		console.log('isStringConcatenation result:', isStringConcat);
		
		// This should return true but currently returns false due to the "/" check
		expect(isStringConcat).toBe(true);
	});
	
	it('should not break real arithmetic expressions', () => {
		const interpreter = new ASTInterpreter() as any;
		
		const testExpression = 'total / 3';
		const vars = { total: 60 };
		
		const isStringConcat = interpreter.isStringConcatenation(testExpression, vars);
		console.log('Pure arithmetic isStringConcatenation result:', isStringConcat);
		
		// This should correctly return false
		expect(isStringConcat).toBe(false);
	});
});
