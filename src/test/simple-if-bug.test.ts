import { describe, it, expect } from 'vitest';
import { ASTInterpreter, type Program } from '../lib/astInterpreter';

describe('Simple If Statement Bug', () => {
  function executeProgram(code: string, inputs: string[]) {
    const interpreter = new ASTInterpreter();
    const program: Program = { code, description: "test", inputs };
    return interpreter.executeProgram(code, program);
  }

  it('should execute statements after a simple if block', () => {
    const simpleProgram = `x = 5
if x > 3 then
    y = 10
endif
print("After if")`;

    console.log('=== TESTING SIMPLE IF STATEMENT ===');
    console.log('Code:');
    console.log(simpleProgram);
    
    const result = executeProgram(simpleProgram, []);
    
    console.log('\nTrace steps:');
    result.trace.forEach((step, index) => {
      console.log(`Step ${index + 1}: Line ${step.lineNumber}`);
      console.log(`  Code: ${simpleProgram.split('\n')[step.lineNumber - 1]}`);
      console.log(`  Variables:`, step.variables);
      console.log(`  Changed variables:`, step.changedVariables);
      console.log(`  Output: ${step.output}`);
      console.log('');
    });
    
    console.log('Final outputs:', result.outputs);
    
    // The bug: print statement should execute but doesn't
    const printExecuted = result.trace.some(step => step.lineNumber === 5);
    console.log(`Print statement executed? ${printExecuted}`);
    
    expect(printExecuted).toBe(true);
    expect(result.outputs).toEqual(["After if"]);
  });

  it('should execute statements after nested if-elseif-else', () => {
    const program = `x = 2
if x > 5 then
    y = 1
elseif x > 1 then
    y = 2
else
    y = 3
endif
print("Final y:", y)`;

    console.log('=== TESTING NESTED IF-ELSEIF-ELSE ===');
    
    const result = executeProgram(program, []);
    
    console.log('\nTrace steps:');
    result.trace.forEach((step, index) => {
      console.log(`Step ${index + 1}: Line ${step.lineNumber}`);
      console.log(`  Variables:`, step.variables);
      console.log(`  Output: ${step.output}`);
    });
    
    const printExecuted = result.trace.some(step => step.lineNumber === 9);
    console.log(`Print statement executed? ${printExecuted}`);
    
    expect(printExecuted).toBe(true);
    expect(result.outputs.length).toBeGreaterThan(0);
  });
});
