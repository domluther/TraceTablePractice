// Debug string concatenation splitting
import { Interpreter } from './js/interpreter.js';

const interpreter = new Interpreter();

console.log('Debugging string concatenation splitting...');

const value = 'CHR(ascii_value + 1)';
const parts = value.split('+').map(p => p.trim());
console.log('Split parts:', parts);
console.log('Number of parts:', parts.length);

// The issue is that CHR(ascii_value + 1) gets split into:
// ["CHR(ascii_value ", " 1)"]
// This breaks the CHR function parsing!
