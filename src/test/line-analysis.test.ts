import { describe, it } from 'vitest';
import { ASTInterpreter, type Program } from '../lib/astInterpreter';

describe('Line Number Analysis', () => {
  function executeProgram(code: string, inputs: string[]) {
    const interpreter = new ASTInterpreter();
    const program: Program = { code, description: "test", inputs };
    return interpreter.executeProgram(code, program);
  }

  it('should show exact line mappings', () => {
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

    console.log('=== EXACT LINE ANALYSIS ===');
    
    // Show raw lines
    const rawLines = code.split('\n');
    console.log('\nRaw lines:');
    rawLines.forEach((line, index) => {
      console.log(`Raw ${index + 1}: "${line}"`);
    });
    
    // Show processed lines (how the interpreter sees them)
    const processedLines = code
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
      
    console.log('\nProcessed lines (interpreter input):');
    processedLines.forEach((line, index) => {
      console.log(`Processed ${index}: "${line}"`);
    });
    
    const result = executeProgram(code, ["2.5", "9"]);
    
    console.log('\nTrace results:');
    result.trace.forEach((step, index) => {
      const processedLineContent = processedLines[step.lineNumber - 1];
      console.log(`Trace ${index + 1}: Line ${step.lineNumber} = "${processedLineContent}"`);
      console.log(`  Variables: ${JSON.stringify(step.variables)}`);
      console.log(`  Output: "${step.output}"`);
    });
    
    console.log('\nExpected next line after trace:');
    const lastTraceLineNum = result.trace[result.trace.length - 1]?.lineNumber || 0;
    const nextLineNum = lastTraceLineNum + 1;
    if (nextLineNum <= processedLines.length) {
      console.log(`Should execute line ${nextLineNum}: "${processedLines[nextLineNum - 1]}"`);
    } else {
      console.log(`No more lines to execute (last was ${lastTraceLineNum})`);
    }
  });
});
