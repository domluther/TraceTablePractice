// Debug CHR arithmetic
import { Interpreter } from './js/interpreter.js';

const interpreter = new Interpreter();

console.log('Debugging CHR arithmetic...');

// Test arithmetic expression evaluation directly
const vars = {ascii_value: 65};
console.log('vars:', vars);
console.log('evaluateArithmeticExpression("ascii_value + 1"):', interpreter.evaluateArithmeticExpression('ascii_value + 1', vars));

// Test step by step
const chrExpression = 'CHR(ascii_value + 1)';
console.log('Full expression:', chrExpression);

// Extract the argument
const argument = chrExpression.slice(4, -1).trim(); // Remove CHR( and )
console.log('Extracted argument:', argument);

// Test if it's a number
console.log('isNaN(argument):', isNaN(argument));

// Test if variable exists
console.log('vars[argument]:', vars[argument]);

// Test arithmetic evaluation
console.log('evaluateArithmeticExpression(argument):', interpreter.evaluateArithmeticExpression(argument, vars));
