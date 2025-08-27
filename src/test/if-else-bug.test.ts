import { describe, it, expect } from 'vitest';
import { ASTInterpreter, type Program } from '../lib/astInterpreter';

describe('If with Else Bug', () => {
  function executeProgram(code: string, inputs: string[]) {
    const interpreter = new ASTInterpreter();
    const program: Program = { code, description: "test", inputs };
    return interpreter.executeProgram(code, program);
  }

  it('should handle if-elseif-else followed by another if', () => {
    const code = `x = 1
if x == 2 then
    y = 2
elseif x == 3 then
    y = 3
else
    y = 1
endif
if x == 1 then
    z = 1
endif
print("done")`;

    console.log('=== IF-ELSEIF-ELSE FOLLOWED BY IF ===');
    const result = executeProgram(code, []);
    
    console.log('Executed lines:', result.trace.map(s => s.lineNumber));
    console.log('Outputs:', result.outputs);
    
    const printExecuted = result.trace.some(step => step.lineNumber === 12);
    console.log(`Print executed? ${printExecuted}`);
    
    // This should reveal the bug!
    expect(printExecuted).toBe(true);
  });

  it('should handle simple else case', () => {
    const code = `x = 1
if x == 2 then
    y = 2
else
    y = 1
endif
print("done")`;

    console.log('=== SIMPLE IF-ELSE ===');
    const result = executeProgram(code, []);
    
    console.log('Executed lines:', result.trace.map(s => s.lineNumber));
    console.log('Outputs:', result.outputs);
    
    const printExecuted = result.trace.some(step => step.lineNumber === 7);
    console.log(`Print executed? ${printExecuted}`);
    
    expect(printExecuted).toBe(true);
  });
});
