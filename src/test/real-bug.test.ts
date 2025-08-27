import { describe, it, expect } from 'vitest';
import { ASTInterpreter, type Program } from '../lib/astInterpreter';

describe('Real Bug Reproduction', () => {
  function executeProgram(code: string, inputs: string[]) {
    const interpreter = new ASTInterpreter();
    const program: Program = { code, description: "test", inputs };
    return interpreter.executeProgram(code, program);
  }

  it('FAILING: should execute athletic scoring with print', () => {
    const code = `longJump = float(input("Enter distance"))
yearGroup = int(input("Enter year group"))
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

    console.log('=== ATHLETIC SCORING BUG REPRODUCTION ===');
    const result = executeProgram(code, ["2.5", "9"]);
    
    console.log('Executed lines:', result.trace.map(s => s.lineNumber));
    console.log('Outputs:', result.outputs);
    
    // This should fail
    const printExecuted = result.trace.some(step => step.lineNumber === 13);
    console.log(`Print executed? ${printExecuted}`);
    
    expect(printExecuted).toBe(true);
    expect(result.outputs.length).toBeGreaterThan(0);
  });

  it('working comparison: simple consecutive if', () => {
    const code = `x = 1
if x == 1 then
    y = 1
endif
if x == 1 then
    z = 1  
endif
print("done")`;

    console.log('=== WORKING CONSECUTIVE IF ===');
    const result = executeProgram(code, []);
    
    console.log('Executed lines:', result.trace.map(s => s.lineNumber));
    console.log('Outputs:', result.outputs);
    
    // This should work
    const printExecuted = result.trace.some(step => step.lineNumber === 8);
    console.log(`Print executed? ${printExecuted}`);
    
    expect(printExecuted).toBe(true);
  });
});
