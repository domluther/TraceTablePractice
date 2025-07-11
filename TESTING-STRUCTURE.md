# Testing Structure Documentation

## Overview

The Trace Table Practice application now has a comprehensive testing framework with clear separation of concerns between unit tests and integration tests.

## File Structure

```
/Users/dominicluther/Dev/Web Dev/TraceTablePractice/
├── landing-page.html          # Navigation hub (renamed from test-runner.html)
├── tests.html                 # Unit tests - individual component testing
├── integration-tests.html     # End-to-end integration tests
├── index.html                 # Main application
├── index-legacy.html          # Legacy reference version
└── js/                        # Modular JavaScript components
    ├── app.js
    ├── interpreter.js
    ├── trace-table.js
    ├── ui.js
    ├── programs.js
    └── score-manager.js
```

## Testing Philosophy

### Unit Tests (`tests.html`)
**Purpose**: Test individual interpreter methods and language features in isolation

**Scope**:
- Individual arithmetic operations and operator precedence
- String methods (.upper, .lower, .left, .substring, etc.)
- Array access and indexing
- Type conversions (float, int, bool)
- Basic control structures (for loops, switch/case)
- Language features (comments, constants)
- Edge cases and error conditions
- Expression evaluation and parsing

**What Unit Tests DON'T Cover**:
- Complete program execution flows
- Detailed trace table validation
- Input/output integration scenarios
- Complex real-world program scenarios

### Integration Tests (`integration-tests.html`)
**Purpose**: Test complete programs that students would encounter in GCSE practice

**Scope**:
- Complete program execution with inputs and outputs
- Complex feature interactions (e.g., loops with string operations)
- Real-world GCSE programming scenarios
- Trace table generation for entire programs
- Input validation and error handling in context
- Multi-step calculations and workflows
- Programs with nested control structures
- Full validation of program state changes

**What Integration Tests DON'T Cover**:
- Individual method testing (covered by unit tests)
- Basic operator precedence (covered by unit tests)
- Simple edge cases (covered by unit tests)

## Test Categories

### Unit Test Categories
1. **Basic Arithmetic** - Addition, subtraction, multiplication, division, modulo, exponentiation
2. **Operator Precedence** - Order of operations testing
3. **Parentheses** - Grouping and nested parentheses
4. **Array Access** - Variable and literal indexing
5. **Variable Operations** - Assignment and access
6. **Complex Expressions** - Multi-operator expressions
7. **Edge Cases** - Division by zero, array bounds, etc.
8. **String Methods** - .upper, .lower, .left, .substring, .length
9. **Duck Grouping** - DIV and MOD operators
10. **Type Conversions** - float(), int(), bool() casting
11. **Nested Conditionals** - If/else logic testing
12. **For Loop Execution** - Loop variable tracking
13. **String Methods in Print** - Output testing
14. **Substring with Variables** - Dynamic string operations
15. **Comments** - Comment handling
16. **Bool Casting** - Boolean conversions
17. **Constants** - Constant declaration and protection
18. **For Loop Steps** - Positive/negative step values
19. **Switch/Case** - Case matching and default handling

### Integration Test Categories
1. **Rectangle Calculation Program** - Complete geometry program with inputs
2. **Jump Qualification Program** - Nested conditionals with real scenario
3. **Duck Grouping Program** - DIV/MOD with formatted output
4. **String Operations in Loops** - Substring extraction workflows
5. **Constants with Real Calculations** - Pi and VAT calculations
6. **Switch/Case Grading System** - Grade evaluation program
7. **For Loop with Steps** - Countdown sequences
8. **Complex Validation Program** - Password validation with multiple criteria

## Overlap Elimination

### Previous Overlaps Removed:
1. **Duck Grouping**: Unit tests focus on DIV/MOD operators; Integration tests focus on complete program flow
2. **Nested Conditionals**: Unit tests focus on conditional logic; Integration tests focus on complete program scenarios
3. **String Operations**: Unit tests focus on individual methods; Integration tests focus on complete workflows

### Clear Boundaries:
- **Unit Tests**: Individual features and methods
- **Integration Tests**: Complete programs and workflows

## Test Count Validation

Both test files include validation functions to ensure test counts match display counts:
- `validateTestCounts()` in unit tests
- Proper test name mapping in `testSuites` objects
- Documentation to prevent future mismatches

## Navigation

The `landing-page.html` (previously `test-runner.html`) serves as a central navigation hub with:
- Main application launch
- Unit test access
- Integration test access
- Documentation links
- Legacy version access

## Maintenance Guidelines

### Adding New Unit Tests:
1. Create test function focusing on isolated feature
2. Add function call to `runAllTests()`
3. Add test names to `testSuites` object
4. Ensure names match exactly

### Adding New Integration Tests:
1. Create complete program test scenario
2. Focus on real-world GCSE scenarios
3. Test complete workflows, not isolated features
4. Add to `runAllTests()` and `testSuites`

### Avoiding Overlap:
- Check existing unit tests before adding integration tests
- Unit tests = isolated features
- Integration tests = complete programs
- Document the boundary clearly

## Current Status

✅ **Unit Tests**: 21 test functions covering all individual features
✅ **Integration Tests**: 8 comprehensive program scenarios
✅ **No Overlap**: Clear separation of concerns maintained
✅ **Documentation**: Comprehensive guidance for future development
✅ **Navigation**: Clean landing page for easy access
✅ **Validation**: Test count matching and error detection

The testing framework is now comprehensive, well-organized, and ready for future development.
