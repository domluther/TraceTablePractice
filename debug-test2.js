import { Interpreter } from './js/interpreter.js';

console.log('=== Testing Nested Quotes Issue ===');
const test1 = new Interpreter();
const result1 = test1.executeProgram(`quote = '"Success"'
print("He said: " + quote)`, { inputs: [], randomValue: undefined });

console.log('Variables:', test1.variables);
console.log('quote variable:', test1.variables.quote);
console.log('quote type:', typeof test1.variables.quote);
console.log('Outputs:', test1.outputs);
console.log('Expected: He said: "Success"');
console.log('Actual:', test1.outputs[0]);

console.log('\n=== Testing String Concatenation Detection ===');
const expression = '"He said: " + quote';
console.log('Expression:', expression);
console.log('Is string concat?', test1.isStringConcatenation(expression, test1.variables));
const parts = test1.parseStringConcatenation(expression);
console.log('Parsed parts:', parts);

console.log('\n=== Testing Conditional Function Call Issue ===');
const test2 = new Interpreter();
test2.executeWithoutReset('score = 85.7');
console.log('score variable:', test2.variables.score);

test2.executeWithoutReset(`if score > 80 then
    finalScore = int(score)
else
    finalScore = 0
endif`);

console.log('Variables after if:', test2.variables);
console.log('finalScore:', test2.variables.finalScore);
console.log('Expected: 85');

console.log('\n=== Testing Conditional Function Call with executeProgram ===');
const test4 = new Interpreter();
const result4 = test4.executeProgram(`score = 85.7
if score > 80 then
    finalScore = int(score)
else
    finalScore = 0
endif`, { inputs: [], randomValue: undefined });

console.log('Variables after executeProgram:', test4.variables);
console.log('finalScore with executeProgram:', test4.variables.finalScore);
