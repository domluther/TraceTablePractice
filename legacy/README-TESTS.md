# Trace Table Practice - Test Suite

This project now includes comprehensive unit and integration tests to ensure that new features don't break existing functionality.

## Test Structure

### 🔬 Unit Tests (`tests.html`)
Tests individual functions and components in isolation:

- **Basic Arithmetic**: Addition, subtraction, multiplication, division, modulo, exponentiation
- **Operator Precedence**: Ensures operations are performed in the correct order
- **Parentheses Handling**: Tests complex expressions with nested parentheses
- **Array Access**: Variable and literal array indexing
- **Variable Operations**: Variable assignment and retrieval
- **Complex Expressions**: Multi-operator expressions with arrays and variables
- **Edge Cases**: Division by zero, empty arrays, boundary conditions

### 🔗 Integration Tests (`integration-tests.html`)
Tests complete program execution with real GCSE examples:

- **Rectangle Calculation**: The previously broken program with parentheses
- **Simple Arithmetic**: Basic variable operations
- **Variable Swapping**: Temporary variable usage
- **Input/Output**: User input processing and output generation
- **Complex Arithmetic**: Multi-step calculations
- **Discount Calculation**: Real-world percentage calculations
- **String Operations**: Concatenation and type conversion
- **Multiple Inputs**: Programs requiring several user inputs
- **Regression Tests**: Ensures fixed bugs stay fixed

## Running Tests

### Option 1: Test Runner (Recommended)
Open `test-runner.html` in your browser for a comprehensive overview and easy access to all test suites.

### Option 2: Individual Test Files
- Open `tests.html` for unit tests
- Open `integration-tests.html` for integration tests

## Test Coverage

The test suite covers the critical functionality that was recently fixed:

### ✅ Fixed Issues Tested
1. **Parentheses in Arithmetic**: `perimeter = 2 * (length + width)` now works
2. **Operator Precedence**: `2 + 3 * 4` correctly equals 14, not 20
3. **Complex Expressions**: `((a + b) * c) / (a + c)` handles nested parentheses
4. **Array Integration**: Arithmetic operations with array access work properly

### 🎯 Key Test Cases
- Rectangle perimeter calculation with multiple input sets
- Operator precedence in various combinations
- Deeply nested parentheses expressions
- Array access in arithmetic operations
- String concatenation vs. numeric addition
- Edge cases like division by zero and empty arrays

## Test Results

Each test provides:
- ✅ **PASS/FAIL** status
- **Expected vs. Actual** values for failed tests
- **Detailed explanations** of what each test verifies
- **Summary statistics** showing pass rate

## Adding New Tests

When adding new features, follow this pattern:

### For Unit Tests (in `tests.html`)
```javascript
function testNewFeature() {
    const vars = { /* test variables */ };
    const result = yourFunction(input, vars);
    assertEqual(result, expectedValue, 'Test Name', 'Description');
}
```

### For Integration Tests (in `integration-tests.html`)
```javascript
function testNewProgram() {
    const code = `/* your program code */`;
    const inputs = ["input1", "input2"];
    const result = executeTestProgram(code, inputs);
    
    assertEqual(result.variables.someVar, expectedValue, 'Test Name');
    assertArrayEqual(result.outputs, expectedOutputs, 'Output Test');
}
```

## Continuous Testing

Run tests after:
- Adding new arithmetic operators
- Modifying the expression evaluator
- Adding new GCSE program examples
- Changing interpreter logic
- Updating string method handling

## Test Philosophy

These tests follow the principle that **working code should stay working**. When you add new features:

1. Run existing tests to ensure no regressions
2. Add new tests for the new functionality
3. Verify edge cases and error conditions
4. Test with real GCSE Computer Science examples

The goal is to catch problems early and maintain confidence in the application's reliability for students practicing trace tables.
