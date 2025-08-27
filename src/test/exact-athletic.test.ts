import { describe, it, expect } from 'vitest';
import { ASTInterpreter, type Program } from '../lib/astInterpreter';

describe('Exact Athletic Case', () => {
  function executeProgram(code: string, inputs: string[]) {
    const interpreter = new ASTInterpreter();
    const program: Program = { code, description: "test", inputs };
    return interpreter.executeProgram(code, program);
  }

  it('should reproduce exact athletic scoring issue', () => {
    // This is the exact problematic code from your program
    const exactCode = `longJump = float(input("Enter distance"))
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

    console.log('=== EXACT ATHLETIC SCORING CASE ===');
    const result = executeProgram(exactCode, ["2.5", "9"]);
    
    const lines = exactCode.split('\n');
    console.log('\nLine analysis:');
    lines.forEach((line, index) => {
      console.log(`${index + 1}: ${line}`);
    });
    
    console.log('\nExecuted lines:', result.trace.map(s => s.lineNumber));
    console.log('Outputs:', result.outputs);
    
    console.log('\nDetailed trace:');
    result.trace.forEach((step, index) => {
      const lineContent = lines[step.lineNumber - 1];
      console.log(`Step ${index + 1}: Line ${step.lineNumber} - "${lineContent}"`);
      console.log(`  Variables: ${JSON.stringify(step.variables)}`);
      console.log(`  Output: "${step.output}"`);
    });
    
    const printExecuted = result.trace.some(step => step.lineNumber === 13);
    console.log(`\nLine 13 (print) executed? ${printExecuted}`);
    
    expect(printExecuted).toBe(true);
  });

  it('should test with different input that matches elseif condition', () => {
    const exactCode = `longJump = float(input("Enter distance"))
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

    console.log('\n=== TESTING WITH 3.5, 11 (elseif path) ===');
    const result = executeProgram(exactCode, ["3.5", "11"]);
    
    console.log('Executed lines:', result.trace.map(s => s.lineNumber));
    console.log('Outputs:', result.outputs);
    
    const printExecuted = result.trace.some(step => step.lineNumber === 13);
    console.log(`Line 13 (print) executed? ${printExecuted}`);
    
    expect(printExecuted).toBe(true);
  });
});
