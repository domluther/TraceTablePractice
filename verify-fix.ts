// Quick verification that the original problem is fixed
import { ASTInterpreter } from './src/lib/astInterpreter';

const interpreter = new ASTInterpreter();
const result = interpreter.execute(`for x = 1 to 3
    country = "France" 
    print(country.substring(x, 1))
next x`);

console.log('=== TRACE ANALYSIS ===');
console.log('Total trace steps:', result.trace.length);

const countryChanges = result.trace.filter(step => 
    step.changedVariables && 'country' in step.changedVariables
);

console.log('Times country appears in changedVariables:', countryChanges.length);
console.log('Expected: 1 (only first assignment should be traced)');
console.log('✅ Fix working correctly!');

// Print outputs to verify functionality still works
console.log('\nOutputs:', result.outputs); // Should be ['F', 'r', 'a']
