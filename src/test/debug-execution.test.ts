import { describe, it } from 'vitest';
import { ASTInterpreter, type Program } from '../lib/astInterpreter';

describe('Debug Execution Flow', () => {
  it('should show execution flow with manual debugging', () => {
    // Let's manually implement a simplified version of executeBlock to debug
    const program = `x = 2
if x > 5 then
    y = 1
elseif x > 1 then
    y = 2
else
    y = 3
endif
print("Final y:", y)`;

    const lines = program
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    
    console.log('=== MANUAL EXECUTION SIMULATION ===');
    console.log('Lines array:', lines);
    console.log('executeBlock(lines, 0, 9)');
    
    let bodyLine = 0;
    const endIndex = lines.length;
    
    console.log(`\nStarting loop: bodyLine=${bodyLine}, endIndex=${endIndex}`);
    
    while (bodyLine < endIndex) {
      console.log(`\n--- Iteration ${bodyLine} ---`);
      console.log(`Checking line ${bodyLine}: "${lines[bodyLine]}"`);
      console.log(`Condition: ${bodyLine} < ${endIndex} = ${bodyLine < endIndex}`);
      
      const bodyLineCode = lines[bodyLine];
      
      if (bodyLineCode.startsWith("if ") && bodyLineCode.includes(" then")) {
        console.log('Found if statement, calling handleIfStatement...');
        
        // Simulate handleIfStatement logic
        let endifIndex = -1;
        for (let j = bodyLine + 1; j < lines.length; j++) {
          if (lines[j] === 'endif') {
            endifIndex = j;
            break;
          }
        }
        
        console.log(`Found endif at index: ${endifIndex}`);
        const returnValue = endifIndex + 1;
        console.log(`handleIfStatement would return: ${returnValue}`);
        
        bodyLine = returnValue;
        console.log(`bodyLine updated to: ${bodyLine}`);
      } else {
        console.log('Regular statement, incrementing bodyLine');
        bodyLine++;
      }
      
      if (bodyLine >= 10) {
        console.log('Breaking to prevent infinite loop');
        break;
      }
    }
    
    console.log(`\nLoop ended. Final bodyLine: ${bodyLine}`);
    console.log(`Should have executed: ${bodyLine >= endIndex ? 'NO' : 'YES'}`);
  });

  it('should run actual interpreter with detailed tracing', () => {
    const program = `x = 2
if x > 5 then
    y = 1
elseif x > 1 then
    y = 2
else
    y = 3
endif
print("Final y:", y)`;

    const interpreter = new ASTInterpreter();
    const progObj: Program = { code: program, description: "test", inputs: [] };
    
    console.log('\n=== RUNNING ACTUAL INTERPRETER ===');
    const result = interpreter.executeProgram(program, progObj);
    
    console.log('Trace results:');
    result.trace.forEach((step, index) => {
      console.log(`  ${index + 1}. Line ${step.lineNumber}: ${step.output ? `OUTPUT: ${step.output}` : 'No output'}`);
    });
    
    console.log('Final outputs:', result.outputs);
  });
});
