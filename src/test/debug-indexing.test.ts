import { describe, it } from 'vitest';
import { ASTInterpreter, type Program } from '../lib/astInterpreter';

describe('Debug Indexing Issue', () => {
  it('should show exact array indices', () => {
    const program = `x = 2
if x > 5 then
    y = 1
elseif x > 1 then
    y = 2
else
    y = 3
endif
print("Final y:", y)`;

    console.log('=== ANALYZING ARRAY INDICES ===');
    const lines = program
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    
    console.log('Total lines after filtering:', lines.length);
    lines.forEach((line, index) => {
      console.log(`Index ${index}: "${line}"`);
    });
    
    console.log('\n=== EXPECTED BEHAVIOR ===');
    console.log('1. executeBlock(lines, 0, 9) should execute entire program');
    console.log('2. At index 1 (if statement), call handleIfStatement');
    console.log('3. handleIfStatement should find endif at index 7');
    console.log('4. handleIfStatement should return 7 + 1 = 8');
    console.log('5. Main loop should continue with bodyLine = 8');
    console.log('6. Index 8 is "print(...)", should execute it');
    
    // Find endif index manually
    let endifIndex = -1;
    for (let j = 2; j < lines.length; j++) {
      if (lines[j] === 'endif') {
        endifIndex = j;
        break;
      }
    }
    console.log(`\nActual endif found at index: ${endifIndex}`);
    console.log(`handleIfStatement should return: ${endifIndex + 1}`);
    console.log(`Which is line: "${lines[endifIndex + 1]}"`);
  });
});
