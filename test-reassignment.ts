import { ASTInterpreter, Program } from './src/lib/astInterpreter';

// Test the specific case mentioned: country = "France" in a loop
const interpreter = new ASTInterpreter();
const program: Program = {
    code: `for x = 1 to 3
    country = "France"
    print(country.substring(x, 1))
next x`,
    description: "Test for repeated assignment"
};

const result = interpreter.executeProgram(program.code, program);

console.log("Trace steps:");
result.trace.forEach((step, index) => {
    console.log(`Step ${index + 1}: Line ${step.lineNumber}`);
    console.log(`  Variables:`, step.variables);
    console.log(`  Changed variables:`, step.changedVariables);
    console.log(`  Output:`, step.output);
    console.log("");
});
