// Debug script to find missing tests
// This script will help find which tests are run but not displayed

console.log('=== DEBUGGING TEST COUNT MISMATCH ===');

// First, let's extract all the test names from the actual test functions
// and compare them with what's in testSuites

const actualTestNames = [
    // From testBasicArithmetic()
    'Basic Addition (a + b)',
    'Basic Subtraction (a - b)', 
    'Basic Multiplication (a * b)',
    'Basic Division (a / c)',
    'Basic Modulo (a MOD b)',
    'Basic Exponentiation (c ^ b)',
    
    // From testOperatorPrecedence()
    'Multiplication before Addition (2 + 3 * 4 = 14)',
    'Division before Subtraction (4 / 2 - 3 = -1)',
    'Exponentiation before Multiplication (2 * 3 ^ 2 = 18)',
    'Left-to-right for Addition/Subtraction (2 + 3 - 4 = 1)',
    'Left-to-right for Multiplication/Division (2 * 3 / 2 = 3)',
    
    // From testParentheses()
    'Basic Parentheses ((2 + 3) * 4 = 20)',
    'Nested Parentheses (((2 + 3) * 4) / (2 + 4) = 20/6)',
    'Rectangle Perimeter (2 * (5 + 3) = 16)',
    'Complex Parentheses ((2 + 3) * (4 - 2) = 10)',
    
    // From testArrayAccess()
    'Array Access with Variable Index (nums[1] = 20)',
    'Array Access with Literal Index (nums[0] = 10)',
    'Arithmetic with Array Access (nums[1] + nums[0] = 30)',
    'Array Access in Multiplication (nums[1] * 2 = 40)',
    
    // From testVariableOperations()
    'Variable Access (x = 10)',
    'Variable Access (temp = 5)',
    'Numeric Literal (42)',
    'Numeric Literal (0)',
    
    // From testComplexExpressions()
    'Complex Expression (2 * 3 + 4 * (2 + 3) - 3 = 23)',
    'Multiple Operators (2 ^ 3 + 4 / 2 * 1 = 10)',
    'Deeply Nested (((2 + 3) * (4 - 2)) / ((3 + 2) - 3) = 5)',
    
    // From testEdgeCases()
    'Division by One (10 / 1 = 10)',
    'Multiplication by Zero (10 * 0 = 0)',
    'Power of Zero (10 ^ 0 = 1)',
    'Empty Array Access (should return 0)',
    'Out of Bounds Array Access (should return 0)',
    
    // From testStringMethods()
    'First name .left(1) should return "J"',
    'Last name .left(1) should return "S"',
    'Initials concatenation should return "JS"',
    'Should detect as string concatenation',
    'String .upper method',
    'String .lower method',
    'Numeric Operation with String Variables Present',
    'Addition with String Variables Present',
    
    // From testDuckGrouping() 
    'Duck Grouping DIV (15 DIV 4 = 3)',
    'Duck Grouping MOD (15 MOD 4 = 3)',
    'Duck Grouping DIV (22 DIV 4 = 5)',
    'Duck Grouping MOD (22 MOD 4 = 2)',
    'Duck Grouping DIV (8 DIV 4 = 2)',
    'Duck Grouping MOD (8 MOD 4 = 0)',
    'Duck Grouping DIV (7 DIV 4 = 1)',
    'Duck Grouping MOD (7 MOD 4 = 3)',
    
    // From testTypeConversions()
    'float(input()) should convert "3.14" to 3.14',
    'real(input()) should convert "3.14" to 3.14',
    'jumpLength should be 3.1 as float',
    'yearGroup should be 11 as float',  // This is the correct full name!
    'Comparison 3.1 > 2 should be true',
    
    // From testNestedConditionalExecution()
    'jumpLength should be 2.2',
    'yearGroup should be 8', 
    'Should have exactly 1 output',
    'Should print "You are too young" for yearGroup=8',
    'Line 1 should execute (jumpLength assignment)',
    'Line 2 should execute (yearGroup assignment)',
    'Line 3 should NOT execute (if condition not traced)',
    'Line 4 should NOT execute (if condition not traced)',
    'Line 5 should NOT execute (yearGroup >= 10 is false)',
    'Line 7 should execute (else branch print)'
];

console.log('Actual test count so far:', actualTestNames.length);

// Note: This is just a partial list - would need to continue with all test functions
// But we can already see the issue with 'yearGroup should be 11 as float'
