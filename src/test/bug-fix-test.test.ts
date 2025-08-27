import { describe, it, expect } from 'vitest';
import { ASTInterpreter, type Program } from '../lib/astInterpreter';

describe('Bug Fix for Consecutive If Statements', () => {
  function executeProgram(code: string, inputs: string[]) {
    const interpreter = new ASTInterpreter();
    const program: Program = { code, description: "test", inputs };
    return interpreter.executeProgram(code, program);
  }

  it('FAILING: should execute statements after two consecutive if blocks', () => {
    const code = `x = 1
if x == 1 then
    y = 1
endif
if x == 1 then
    z = 1
endif
w = 1
print("final")`;

    console.log('=== SIMPLE CONSECUTIVE IF TEST ===');
    const result = executeProgram(code, []);
    
    const lines = code.split('\n');
    console.log('\nAll lines:');
    lines.forEach((line, index) => {
      console.log(`${index + 1}: ${line}`);
    });
    
    console.log('\nExecuted lines:', result.trace.map(s => s.lineNumber));
    console.log('Outputs:', result.outputs);
    
    // Line 8: w = 1 should execute
    // Line 9: print("final") should execute  
    const line8Executed = result.trace.some(step => step.lineNumber === 8);
    const line9Executed = result.trace.some(step => step.lineNumber === 9);
    
    console.log(`Line 8 (w = 1) executed? ${line8Executed}`);
    console.log(`Line 9 (print) executed? ${line9Executed}`);
    
    expect(line8Executed).toBe(true);
    expect(line9Executed).toBe(true);
    expect(result.outputs).toEqual(["final"]);
  });
});
