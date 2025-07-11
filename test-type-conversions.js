import { Interpreter } from './js/interpreter.js';

console.log("=== Testing type conversion functions in assignments ===");

// Test 1: int() function
console.log("\n1. Testing int() function:");
const interpreter1 = new Interpreter();
const test1 = `x = 3.7
y = int(x)
print(y)`;
interpreter1.executeProgram(test1, { inputs: [], randomValue: undefined });
console.log("Variables:", interpreter1.variables);
console.log("Outputs:", interpreter1.outputs);

// Test 2: float() function
console.log("\n2. Testing float() function:");
const interpreter2 = new Interpreter();
const test2 = `x = "3.14"
y = float(x)
print(y)`;
interpreter2.executeProgram(test2, { inputs: [], randomValue: undefined });
console.log("Variables:", interpreter2.variables);
console.log("Outputs:", interpreter2.outputs);

// Test 3: real() function  
console.log("\n3. Testing real() function:");
const interpreter3 = new Interpreter();
const test3 = `x = "2.5"
y = real(x)
print(y)`;
interpreter3.executeProgram(test3, { inputs: [], randomValue: undefined });
console.log("Variables:", interpreter3.variables);
console.log("Outputs:", interpreter3.outputs);

// Test 4: bool() function (this should work)
console.log("\n4. Testing bool() function:");
const interpreter4 = new Interpreter();
const test4 = `x = 1
y = bool(x)
print(y)`;
interpreter4.executeProgram(test4, { inputs: [], randomValue: undefined });
console.log("Variables:", interpreter4.variables);
console.log("Outputs:", interpreter4.outputs);

// Test 5: Type conversions in loops (similar to the original str() bug)
console.log("\n5. Testing type conversions in loops:");
const interpreter5 = new Interpreter();
const test5 = `for i = 1 to 3
    x = int(i)
    y = float(i)
    z = str(i)
    print(x)
    print(y) 
    print(z)
next i`;
interpreter5.executeProgram(test5, { inputs: [], randomValue: undefined });
console.log("Variables:", interpreter5.variables);
console.log("Outputs:", interpreter5.outputs);
console.log("Expected: ['1', '1', '1', '2', '2', '2', '3', '3', '3']");

// Test 6: Type conversions in switch statements
console.log("\n6. Testing type conversions in switch statements:");
const interpreter6 = new Interpreter();
const test6 = `x = 1.9
y = int(x)
switch y:
case "1":
    print("One")
case "2":
    print("Two")
endswitch`;
interpreter6.executeProgram(test6, { inputs: [], randomValue: undefined });
console.log("Variables:", interpreter6.variables);
console.log("Outputs:", interpreter6.outputs);
console.log("Expected: ['One']");
