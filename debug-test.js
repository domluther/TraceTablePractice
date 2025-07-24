import { Interpreter } from './js/interpreter.js';

const test = new Interpreter();

// Test 1: Mixed quotes
console.log('=== Testing Mixed Quotes ===');
test.executeWithoutReset('name = "John"');
console.log('Variable name:', test.variables.name);

const mixedQuoteExpression = "'Hello ' + name + \"!\"";
console.log('Expression:', mixedQuoteExpression);
console.log('Is string concat?', test.isStringConcatenation(mixedQuoteExpression, test.variables));

const parts = test.parseStringConcatenation(mixedQuoteExpression);
console.log('Parsed parts:', parts);

test.executeWithoutReset(`greeting = 'Hello ' + name + "!"`);
console.log('Result greeting:', test.variables.greeting);
console.log('Expected: Hello John!');
console.log('Match?', test.variables.greeting === 'Hello John!');

// Test 2: String vs Numeric
console.log('\n=== Testing String vs Numeric ===');
const test2 = new Interpreter();
test2.executeWithoutReset('a = "10"');
test2.executeWithoutReset('b = "20"');
console.log('a:', test2.variables.a, 'type:', typeof test2.variables.a);
console.log('b:', test2.variables.b, 'type:', typeof test2.variables.b);

const expression = 'a + b';
console.log('Expression:', expression);
console.log('Is string concat?', test2.isStringConcatenation(expression, test2.variables));

test2.executeWithoutReset('stringMath = a + b');
console.log('Result stringMath:', test2.variables.stringMath);
console.log('Expected: 1020');
console.log('Match?', test2.variables.stringMath === '1020');

// Test 3: Complex function call
console.log('\n=== Testing Complex Function Call ===');
const test3 = new Interpreter();
test3.executeWithoutReset('a = 5');
test3.executeWithoutReset('b = 7');
console.log('a:', test3.variables.a);
console.log('b:', test3.variables.b);

test3.executeWithoutReset('complexInt = int(a + b + 0.5)');
console.log('Result complexInt:', test3.variables.complexInt);
console.log('Expected: 12');
console.log('Match?', test3.variables.complexInt === 12);
