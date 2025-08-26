// Quick debug test to understand the array arithmetic issue

console.log("Debug test for array arithmetic");

// Test simple arithmetic: 10 + 20 * 30
const a = 10;
const b = 20;
const c = 30;
const result1 = a + b * c;
console.log(`${a} + ${b} * ${c} = ${result1}`); // Should be 610

// Test array arithmetic: nums[0] + nums[1] * nums[2]
const nums = [10, 20, 30];
const result2 = nums[0] + nums[1] * nums[2];
console.log(`${nums[0]} + ${nums[1]} * ${nums[2]} = ${result2}`); // Should be 610

// Test if order of operations is working
console.log(`Order test: 10 + 20 * 30 = ${10 + 20 * 30}`); // Should be 610, not 900

// Check if the issue is evaluation order
console.log("Step by step:");
console.log(`nums[1] * nums[2] = ${nums[1] * nums[2]}`); // Should be 600
console.log(`nums[0] + 600 = ${nums[0] + 600}`); // Should be 610
