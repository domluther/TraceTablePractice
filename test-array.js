// Test script for array functionality
import { Interpreter } from './js/interpreter.js';

const interpreter = new Interpreter();

// Test array declaration with size
console.log('Testing array declaration with size...');
const result1 = interpreter.executeProgram(`array colours[3]
colours[0] = "Red"
colours[1] = "Blue"
colours[2] = "Green"`, { inputs: [] });

console.log('Variables:', result1.variables);
console.log('colours array:', interpreter.variables.colours);

// Test array initialization with values
console.log('\nTesting array initialization with values...');
const result2 = interpreter.executeProgram(`array scores = [85, 92, 78, 90]
highest = scores[1]`, { inputs: [] });

console.log('Variables:', result2.variables);
console.log('scores array:', interpreter.variables.scores);
console.log('highest:', interpreter.variables.highest);
