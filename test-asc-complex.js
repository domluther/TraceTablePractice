// Test complex ASC and CHR expressions
import { Interpreter } from './js/interpreter.js';

const interpreter = new Interpreter();

console.log('Testing complex ASC and CHR expressions...');

// Test CHR with arithmetic expression
const result1 = interpreter.executeProgram(`ascii_value = 65
result = CHR(ascii_value + 1)`, { inputs: [] });
console.log('CHR(ascii_value + 1):', result1.trace[1]?.changedVariables?.result);
console.log('result variable:', interpreter.variables.result);

// Test CHR with variable addition
const result2 = interpreter.executeProgram(`start = 65
i = 1
letter = CHR(start + i)`, { inputs: [] });
console.log('CHR(start + i):', result2.trace[2]?.changedVariables?.letter);
console.log('letter variable:', interpreter.variables.letter);

// Test ASC with string method call
const result3 = interpreter.executeProgram(`message = "ABC"
code = ASC(message.left(1))`, { inputs: [] });
console.log('ASC(message.left(1)):', interpreter.variables.code);
