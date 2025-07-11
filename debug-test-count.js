// Debug script to find missing tests in testSuites
import { Interpreter } from './js/interpreter.js';

// Copy the test functions from tests.html to run them
let testResults = [];
let testsPassed = 0;
let testsFailed = 0;

const interpreter = new Interpreter();

function assert(condition, testName, details = '') {
    if (condition) {
        testResults.push({
            name: testName,
            passed: true,
            details: details
        });
        testsPassed++;
    } else {
        testResults.push({
            name: testName,
            passed: false,
            details: details
        });
        testsFailed++;
    }
}

function assertEqual(actual, expected, testName, details = '') {
    const condition = actual === expected;
    const testDetails = details + ` (Expected: ${expected}, Got: ${actual})`;
    assert(condition, testName, testDetails);
}

// Run a few test suites to see the pattern
function testBasicArithmetic() {
    const vars = { a: 5, b: 3, c: 2 };
    assertEqual(interpreter.evaluateArithmeticExpression('a + b', vars), 8, 'Basic Addition (a + b)');
    assertEqual(interpreter.evaluateArithmeticExpression('a - b', vars), 2, 'Basic Subtraction (a - b)');
}

function testSwitchCase() {
    const testInterpreter = new Interpreter();
    
    const basicSwitchCode = `day = "Mon"
switch day:
case "Mon":
    print("Monday")
case "Tue":
    print("Tuesday")
default:
    print("Unknown day")
endswitch
print("Done")`;
    
    const result = testInterpreter.execute(basicSwitchCode);
    
    assertEqual(testInterpreter.variables.day, 'Mon', 'day should be "Mon"');
    assertEqual(testInterpreter.outputs.length, 2, 'Should have exactly 2 outputs');
    assertEqual(testInterpreter.outputs[0], 'Monday', 'First output should be "Monday"');
    assertEqual(testInterpreter.outputs[1], 'Done', 'Second output should be "Done"');
    
    // Call the function twice (like in tests.html)
    testSwitchCase();
}

// Run the tests
testBasicArithmetic();
testSwitchCase();

console.log(`Total tests run: ${testsPassed + testsFailed}`);
console.log(`Tests passed: ${testsPassed}`);
console.log('All test names:');
testResults.forEach((result, index) => {
    console.log(`${index + 1}. "${result.name}"`);
});

// Check for duplicates
const testNames = testResults.map(r => r.name);
const uniqueNames = [...new Set(testNames)];
console.log(`\nUnique test names: ${uniqueNames.length}`);
console.log(`Total test results: ${testNames.length}`);

if (uniqueNames.length !== testNames.length) {
    console.log('\nDUPLICATE TESTS FOUND:');
    const duplicates = testNames.filter((name, index) => testNames.indexOf(name) !== index);
    duplicates.forEach(dup => console.log(`- "${dup}"`));
}
