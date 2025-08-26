// Quick debug script to test array assignment issue
const code = `array colours[3]
colours[0] = "Red"
colours[1] = "Blue"
colours[2] = "Green"
print("First colour: " + colours[0])
print("Last colour: " + colours[2])`;

// Import the interpreter
import { ASTInterpreter } from './src/lib/astInterpreter.ts';

const interpreter = new ASTInterpreter();
const result = interpreter.execute(code);

console.log('Trace results:');
result.trace.forEach((step, index) => {
    console.log(`Step ${index + 1} (Line ${step.lineNumber}):`);
    console.log('  Changed variables:', step.changedVariables);
    console.log('  Output:', step.output);
    console.log('  All variables:', step.variables);
    console.log('---');
});
