import { describe, it, expect } from 'vitest';
import { ASTInterpreter, type Program } from './src/lib/astInterpreter';

// Debug the specific test case that's failing
const interpreter = new ASTInterpreter();
const result = interpreter.execute(`
	x = 10
	y = 5
	z = x + y * 2
	x = z - x
	result = x / y
	print(result)
`);

console.log("Variables array:", result.variables);
console.log("Final trace step variables:", result.trace[result.trace.length - 1]?.variables);
console.log("Trace length:", result.trace.length);

result.trace.forEach((step, index) => {
	console.log(`Step ${index + 1}: Line ${step.lineNumber}`);
	console.log(`  Variables:`, step.variables);
	console.log(`  Changed variables:`, step.changedVariables);
	console.log(`  Output:`, step.output);
	console.log('');
});
