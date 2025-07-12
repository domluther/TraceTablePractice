// Simple CHR test
import { Interpreter } from './js/interpreter.js';

const interpreter = new Interpreter();

console.log('Testing simple CHR assignment...');

// Test simple CHR assignment
const result1 = interpreter.executeProgram('letter = CHR(65)', { inputs: [] });
console.log('Simple CHR(65):', interpreter.variables.letter);

// Test if isStringConcatenation recognizes CHR
console.log('isStringConcatenation("CHR(65)"):', interpreter.isStringConcatenation('CHR(65)', {}));
console.log('isStringConcatenation("CHR(ascii_value + 1)"):', interpreter.isStringConcatenation('CHR(ascii_value + 1)', {}));

// Test evaluateStringConcatenation directly
console.log('evaluateStringConcatenation("CHR(65)"):', interpreter.evaluateStringConcatenation('CHR(65)', {}));
console.log('evaluateStringConcatenation("CHR(ascii_value + 1)"):', interpreter.evaluateStringConcatenation('CHR(ascii_value + 1)', {ascii_value: 65}));
