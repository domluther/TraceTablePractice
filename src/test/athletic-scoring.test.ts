import { describe, it, expect } from 'vitest';
import { ASTInterpreter, type Program } from '../lib/astInterpreter';

describe('Athletic Performance Scoring System', () => {
  const athleticScoringProgram = `longJump = float(input("Enter distance"))
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

  function executeProgram(code: string, inputs: string[]) {
    const interpreter = new ASTInterpreter();
    const program: Program = { code, description: "test", inputs };
    return interpreter.executeProgram(code, program);
  }

  it('should trace through the program with input 2.5, 9 correctly', () => {
    console.log('=== DEBUGGING ATHLETIC SCORING PROGRAM ===');
    console.log('Code:');
    console.log(athleticScoringProgram);
    console.log('\nInputs: ["2.5", "9"]');
    
    const result = executeProgram(athleticScoringProgram, ["2.5", "9"]);
    
    console.log('\nTrace steps:');
    result.trace.forEach((step, index) => {
      console.log(`Step ${index + 1}: Line ${step.lineNumber}`);
      console.log(`  Variables:`, step.variables);
      console.log(`  Changed variables:`, step.changedVariables);
      console.log(`  Output: ${step.output}`);
      console.log('');
    });
    
    console.log('Final variables:', result.trace[result.trace.length - 1]?.variables);
    console.log('Final outputs:', result.outputs);
    
    const finalVars = result.trace[result.trace.length - 1]?.variables || {};
    expect(finalVars.longJump).toBe(2.5);
    expect(finalVars.yearGroup).toBe(9);
    expect(finalVars.score).toBe(2); // score = 1 * 2 = 2
    expect(result.outputs).toEqual(["The score is 2"]);
  });

  it('should trace through the program with input 5.2, 10 correctly', () => {
    console.log('=== DEBUGGING ATHLETIC SCORING PROGRAM (Case 2) ===');
    console.log('Inputs: ["5.2", "10"]');
    
    const result = executeProgram(athleticScoringProgram, ["5.2", "10"]);
    
    console.log('\nTrace steps:');
    result.trace.forEach((step, index) => {
      console.log(`Step ${index + 1}: Line ${step.lineNumber}`);
      console.log(`  Variables:`, step.variables);
      console.log(`  Changed variables:`, step.changedVariables);
      console.log(`  Output: ${step.output}`);
      console.log('');
    });
    
    console.log('Final variables:', result.trace[result.trace.length - 1]?.variables);
    console.log('Final outputs:', result.outputs);
    
    const finalVars = result.trace[result.trace.length - 1]?.variables || {};
    expect(finalVars.longJump).toBe(5.2);
    expect(finalVars.yearGroup).toBe(10);
    expect(finalVars.score).toBe(3); // score = 3 (no multiplication because yearGroup == 10)
    expect(result.outputs).toEqual(["The score is 3"]);
  });

  it('should count the exact number of trace steps and identify line 13', () => {
    console.log('=== ANALYZING LINE NUMBERS ===');
    
    // Let's break down the program line by line
    const lines = athleticScoringProgram.split('\n');
    lines.forEach((line, index) => {
      console.log(`Line ${index + 1}: ${line}`);
    });
    
    const result = executeProgram(athleticScoringProgram, ["2.5", "9"]);
    
    console.log('\nNumber of trace steps:', result.trace.length);
    console.log('Lines that are executed:');
    result.trace.forEach((step, index) => {
      console.log(`  Step ${index + 1} executes line ${step.lineNumber}`);
    });
    
    // Check if line 13 (the print statement) is executed
    const line13Executed = result.trace.some(step => step.lineNumber === 13);
    console.log(`\nIs line 13 (print statement) executed? ${line13Executed}`);
    
    expect(line13Executed).toBe(true);
  });
});
