import { describe, it, expect } from 'vitest';
import { ASTInterpreter, type Program } from '../lib/astInterpreter';

describe('Exact Reproduction Test', () => {
  function executeProgram(code: string, inputs: string[]) {
    const interpreter = new ASTInterpreter();
    const program: Program = { code, description: "test", inputs };
    return interpreter.executeProgram(code, program);
  }

  it('should reproduce with minimal athletic logic', () => {
    // Let's gradually build up to the exact failing case
    const code = `x = 2.5
y = 9
if x >= 5.0 then
    score = 3
elseif x >= 3.0 then
    score = 2
else
    score = 1
endif
if y != 10 then
    score = score * 2
endif
print("The score is", score)`;

    console.log('=== MINIMAL ATHLETIC REPRODUCTION ===');
    const result = executeProgram(code, []);
    
    console.log('Executed lines:', result.trace.map(s => s.lineNumber));
    console.log('Outputs:', result.outputs);
    
    const printExecuted = result.trace.some(step => step.lineNumber === 13);
    console.log(`Print executed? ${printExecuted}`);
    
    expect(printExecuted).toBe(true);
  });

  it('should test with exact variable names and float/int', () => {
    // Test with the exact same logic but hardcoded values instead of input
    const code = `longJump = 2.5
yearGroup = 9
if longJump >= 5.0 then
    score = 3
elseif longJump >= 3.0 then
    score = 2
else
    score = 1
endif
if yearGroup != 10 then
    score = score * 2
endif
print("The score is", score)`;

    console.log('=== EXACT VARIABLE NAMES NO INPUT ===');
    const result = executeProgram(code, []);
    
    console.log('Executed lines:', result.trace.map(s => s.lineNumber));
    console.log('Outputs:', result.outputs);
    
    const printExecuted = result.trace.some(step => step.lineNumber === 13);
    console.log(`Print executed? ${printExecuted}`);
    
    expect(printExecuted).toBe(true);
  });

  it('should test with just the input functions', () => {
    // Test with input functions but simplified logic
    const code = `longJump = float(input("Enter distance"))
yearGroup = int(input("Enter year group"))
score = 1
if yearGroup != 10 then
    score = score * 2
endif
print("The score is", score)`;

    console.log('=== INPUT FUNCTIONS WITH SIMPLE LOGIC ===');
    const result = executeProgram(code, ["2.5", "9"]);
    
    console.log('Executed lines:', result.trace.map(s => s.lineNumber));
    console.log('Outputs:', result.outputs);
    
    const printExecuted = result.trace.some(step => step.lineNumber === 7);
    console.log(`Print executed? ${printExecuted}`);
    
    expect(printExecuted).toBe(true);
  });
});
