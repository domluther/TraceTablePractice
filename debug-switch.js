import { Interpreter } from './js/interpreter.js';

const interpreter = new Interpreter();

const switchCode = `day = input("Enter day abbreviation")
switch day:
case "Mon":
    print("Monday")
case "Tue":
    print("Tuesday")
case "Wed":
    print("Wednesday")
default:
    print("Not a weekday")
endswitch`;

const program = { inputs: ["Wed"], randomValue: undefined };

console.log("Testing switch statement with 'Wed' input...");
const result = interpreter.executeProgram(switchCode, program);

console.log("Variables:", interpreter.variables);
console.log("day variable type:", typeof interpreter.variables.day);
console.log("day variable value:", interpreter.variables.day);
console.log("Outputs:", interpreter.outputs);
console.log("Trace entries:", interpreter.trace.length);
console.log("Trace details:");
interpreter.trace.forEach((entry, index) => {
    console.log(`${index + 1}. Line ${entry.lineNumber}: ${JSON.stringify(entry.changedVariables)} -> Output: "${entry.output}"`);
});
