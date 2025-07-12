// Test ASC and CHR functions
import { Interpreter } from './js/interpreter.js';

const interpreter = new Interpreter();

console.log('Testing ASC function...');
const vars = { letter: 'A', ascii_val: 65 };

// Test ASC with string literals
console.log('ASC("A"):', interpreter.evaluateStringConcatenation('ASC("A")', vars));
console.log('ASC("Z"):', interpreter.evaluateStringConcatenation('ASC("Z")', vars));
console.log('ASC("a"):', interpreter.evaluateStringConcatenation('ASC("a")', vars));

// Test ASC with variables
console.log('ASC(letter):', interpreter.evaluateStringConcatenation('ASC(letter)', vars));

// Test ASC in expressions
console.log('ASC("B") in expression:', interpreter.evaluateExpressionOrVariable('ASC("B")', vars));

console.log('\nTesting CHR function...');
// Test CHR with numeric literals
console.log('CHR(65):', interpreter.evaluateStringConcatenation('CHR(65)', vars));
console.log('CHR(90):', interpreter.evaluateStringConcatenation('CHR(90)', vars));
console.log('CHR(97):', interpreter.evaluateStringConcatenation('CHR(97)', vars));

// Test CHR with variables
console.log('CHR(ascii_val):', interpreter.evaluateStringConcatenation('CHR(ascii_val)', vars));

// Test CHR in expressions
console.log('CHR(66) in expression:', interpreter.evaluateExpressionOrVariable('CHR(66)', vars));
