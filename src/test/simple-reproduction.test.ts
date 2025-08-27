import { describe, it, expect } from 'vitest';
import { ASTInterpreter, type Program } from '../lib/astInterpreter';

describe('Simple Reproduction', () => {
  function executeProgram(code: string, inputs: string[]) {
    const interpreter = new ASTInterpreter();
    const program: Program = { code, description: "test", inputs };
    return interpreter.executeProgram(code, program);
  }

  it('should execute all statements in sequential program', () => {
    const program = `x = 1
y = 2
print("test")`;

    console.log('=== SIMPLE SEQUENTIAL PROGRAM ===');
    const result = executeProgram(program, []);
    
    console.log('Executed lines:', result.trace.map(s => s.lineNumber));
    console.log('Outputs:', result.outputs);
    
    expect(result.outputs).toEqual(["test"]);
  });

  it('should execute statements after simple if', () => {
    const program = `x = 1
if x == 1 then
    y = 2
endif
print("after if")`;

    console.log('=== SIMPLE IF PROGRAM ===');
    const result = executeProgram(program, []);
    
    console.log('Executed lines:', result.trace.map(s => s.lineNumber));
    console.log('Outputs:', result.outputs);
    
    const printExecuted = result.trace.some(step => step.lineNumber === 5);
    console.log('Print executed?', printExecuted);
    
    expect(result.outputs).toEqual(["after if"]);
  });

  it('should execute statements after if-elseif', () => {
    const program = `x = 1
if x == 2 then
    y = 2
elseif x == 1 then
    y = 1
endif
print("after elseif")`;

    console.log('=== IF-ELSEIF PROGRAM ===');
    const result = executeProgram(program, []);
    
    console.log('Executed lines:', result.trace.map(s => s.lineNumber));
    console.log('Outputs:', result.outputs);
    
    const printExecuted = result.trace.some(step => step.lineNumber === 7);
    console.log('Print executed?', printExecuted);
    
    // This should work according to my simple test earlier
    expect(printExecuted).toBe(true);
  });

  it('should execute statements after if-elseif-else', () => {
    const program = `x = 3
if x == 1 then
    y = 1
elseif x == 2 then
    y = 2
else
    y = 3
endif
print("after else")`;

    console.log('=== IF-ELSEIF-ELSE PROGRAM ===');
    const result = executeProgram(program, []);
    
    console.log('Executed lines:', result.trace.map(s => s.lineNumber));
    console.log('Outputs:', result.outputs);
    
    const printExecuted = result.trace.some(step => step.lineNumber === 9);
    console.log('Print executed?', printExecuted);
    
    // This is the failing case
    expect(printExecuted).toBe(true);
  });
});
