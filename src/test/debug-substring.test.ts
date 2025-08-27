import { describe, it } from 'vitest';
import { ASTInterpreter } from '../lib/astInterpreter';

const interpreter = new ASTInterpreter();

function executeAndGetOutputs(code: string): string[] {
  const result = interpreter.execute(code);
  return result.outputs;
}

describe('Debug Substring Issue', () => {
  it('should debug what happens with substring in print', () => {
    console.log("=== DEBUGGING SUBSTRING PRINT ===");
    
    // Test the exact failing case
    const code = `
      for x = 1 to 3
        country = "France"
        print(country.substring(x, 1))
      next x
    `;
    
    console.log("Code:");
    console.log(code);
    
    const result = interpreter.execute(code);
    console.log("Result:", result);
    console.log("Outputs:", result.outputs);
    
    // Test each iteration manually
    
    console.log("\n=== MANUAL TEST ===");
    const manual1 = executeAndGetOutputs(`
      x = 1
      country = "France" 
      print(country.substring(x, 1))
    `);
    console.log("Manual x=1:", manual1);
    
    const manual2 = executeAndGetOutputs(`
      x = 2
      country = "France" 
      print(country.substring(x, 1))
    `);
    console.log("Manual x=2:", manual2);
    
    const manual3 = executeAndGetOutputs(`
      x = 3
      country = "France" 
      print(country.substring(x, 1))
    `);
    console.log("Manual x=3:", manual3);
  });
  
  it('should test what substring actually returns', () => {
    console.log("=== TESTING SUBSTRING DIRECTLY ===");
    
    const result = interpreter.execute(`
      country = "France"
      result1 = country.substring(1, 1)
      result2 = country.substring(2, 1) 
      result3 = country.substring(3, 1)
      print("substring(1,1):", result1)
      print("substring(2,1):", result2)
      print("substring(3,1):", result3)
    `);    console.log("Substring results:", result.outputs);
  });
});
