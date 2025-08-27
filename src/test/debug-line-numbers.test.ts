import { describe, it, expect } from 'vitest';
import { ASTInterpreter, type Program } from '../lib/astInterpreter';

describe('Debug If Statement Line Numbers', () => {
  function executeProgram(code: string, inputs: string[]) {
    const interpreter = new ASTInterpreter();
    const program: Program = { code, description: "test", inputs };
    return interpreter.executeProgram(code, program);
  }

  it('should show exact line numbers for if-elseif-else', () => {
    const program = `x = 2
if x > 5 then
    y = 1
elseif x > 1 then
    y = 2
else
    y = 3
endif
print("Final y:", y)`;

    console.log('=== DEBUG LINE NUMBERS ===');
    const lines = program.split('\n');
    lines.forEach((line, index) => {
      console.log(`Line ${index + 1}: ${line}`);
    });
    
    const result = executeProgram(program, []);
    
    console.log('\n=== TRACE ANALYSIS ===');
    console.log('Number of trace steps:', result.trace.length);
    result.trace.forEach((step, index) => {
      console.log(`Step ${index + 1}: Line ${step.lineNumber} - "${lines[step.lineNumber - 1]}"`);
      console.log(`  Variables:`, step.variables);
      console.log(`  Output: "${step.output}"`);
    });
    
    console.log('\n=== EXPECTED vs ACTUAL ===');
    console.log('Expected: Line 1 (x=2), Line 5 (y=2), Line 9 (print)');
    console.log('Actual lines executed:', result.trace.map(s => s.lineNumber));
    
    const printExecuted = result.trace.some(step => step.lineNumber === 9);
    console.log(`\nLine 9 (print) executed? ${printExecuted}`);
    
    // Let's also check what variables exist at the end
    const finalStep = result.trace[result.trace.length - 1];
    console.log('Final variables:', finalStep?.variables);
    console.log('Final outputs:', result.outputs);
    
    expect(printExecuted).toBe(true);
  });
});
