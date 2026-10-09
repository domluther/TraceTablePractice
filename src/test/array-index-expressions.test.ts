import { describe, expect, it } from "vitest";
import { ASTInterpreter } from "@/lib/astInterpreter";

function run(code: string) {
	const result = new ASTInterpreter().executeProgram(code, {
		code,
		description: "",
	});
	const last = result.trace[result.trace.length - 1];
	return { outputs: result.outputs, vars: last?.variables ?? {}, trace: result.trace };
}

describe("Array index expressions", () => {
	it("reads an element using an arithmetic index", () => {
		const { outputs } = run(`array a = [5, 2, 9, 4]
i = 1
print(a[i + 1])
print(a[i - 1])
print(a[i * 2])`);
		expect(outputs).toEqual(["9", "5", "9"]);
	});

	it("assigns to an element using an arithmetic index", () => {
		const { vars, trace } = run(`array a = [1, 2, 3, 4]
i = 1
a[i + 1] = 99`);
		expect(vars.a).toEqual([1, 2, 99, 4]);
		expect(trace[trace.length - 1].changedVariables).toEqual({ "a[2]": 99 });
	});

	it("uses expression-indexed elements in comparisons and arithmetic", () => {
		const { outputs } = run(`array a = [5, 2, 9, 4]
i = 0
if a[i] > a[i + 1] then
    print("greater")
endif
total = a[i + 1] + a[i + 2] * 2
print(total)`);
		expect(outputs).toEqual(["greater", "20"]);
	});

	it("keeps simple literal and variable indexes working", () => {
		const { outputs } = run(`array a = [5, 2, 9, 4]
i = 3
print(a[0])
print(a[i])
print(a[0] + a[i])`);
		expect(outputs).toEqual(["5", "4", "9"]);
	});

	it("handles two array accesses in one expression", () => {
		const { outputs } = run(`array a = [5, 2, 9, 4]
i = 1
x = a[i] + a[i + 1]
print(x)`);
		expect(outputs).toEqual(["11"]);
	});

	it("returns 0 for out of range expression indexes like plain indexes", () => {
		const { outputs } = run(`array a = [5, 2]
i = 5
print(a[i + 1])`);
		expect(outputs).toEqual(["0"]);
	});

	it("does not treat text inside string literals as an array access", () => {
		const { outputs } = run(`array a = [5, 2, 9, 4]
i = 1
print("a[i + 1]")
label = "a[i + 1]"
print(label)`);
		expect(outputs).toEqual(["a[i + 1]", "a[i + 1]"]);
	});

	it("works with string arrays", () => {
		const { outputs } = run(`array names = ["Ann", "Bob", "Cy"]
i = 0
print(names[i + 1])`);
		expect(outputs).toEqual(["Bob"]);
	});
});

describe("Bubble sort", () => {
	it("sorts an array and traces each swap", () => {
		const { outputs, vars, trace } = run(`array nums = [5, 2, 4, 1]
swapped = true
while swapped == true
    swapped = false
    for i = 0 to 2
        if nums[i] > nums[i + 1] then
            temp = nums[i]
            nums[i] = nums[i + 1]
            nums[i + 1] = temp
            swapped = true
        endif
    next i
endwhile
for j = 0 to 3
    print(nums[j])
next j`);
		expect(vars.nums).toEqual([1, 2, 4, 5]);
		expect(outputs).toEqual(["1", "2", "4", "5"]);
		const firstPass = trace
			.filter((t) => t.lineNumber === 8 || t.lineNumber === 9)
			.slice(0, 2)
			.map((t) => t.changedVariables);
		expect(firstPass).toEqual([{ "nums[0]": 2 }, { "nums[1]": 5 }]);
	});
});

describe("Variable array sizes, array length and for-loop bounds", () => {
	it("declares an array with a variable or expression size", () => {
		const { vars } = run(`size = 3
array a[size]
array b[size + 1]
a[2] = 7`);
		expect(vars.a).toEqual([0, 0, 7]);
		expect(vars.b).toEqual([0, 0, 0, 0]);
	});

	it("still declares arrays with a literal size", () => {
		const { vars } = run(`array a[4]
x = 1`);
		expect(vars.a).toEqual([0, 0, 0, 0]);
	});

	it("returns the length of an array in expressions, conditions and print", () => {
		const { outputs, vars } = run(`array a = [5, 2, 9, 4]
n = a.length
print(n)
print(a.length - 1)
if a.length > 3 then
    print("long")
endif
last = a[a.length - 1]`);
		expect(outputs).toEqual(["4", "3", "long"]);
		expect(vars.last).toBe(4);
	});

	it("keeps string length behaviour unchanged", () => {
		const { outputs } = run(`word = "hello"
print(word.length)
n = word.length
print(n)`);
		expect(outputs).toEqual(["5", "5"]);
	});

	it("loops with variable and expression bounds", () => {
		const { outputs } = run(`n = 4
for i = 0 to n - 1
    print(i)
next i
for j = n to 2 step -1
    print(j)
next j`);
		expect(outputs).toEqual(["0", "1", "2", "3", "4", "3", "2"]);
	});

	it("supports a variable step", () => {
		const { outputs } = run(`s = 2
for i = 0 to 6 step s
    print(i)
next i`);
		expect(outputs).toEqual(["0", "2", "4", "6"]);
	});

	it("does not run a loop whose end is below its start", () => {
		const { outputs } = run(`n = 0
for i = 0 to n - 1
    print(i)
next i
print("done")`);
		expect(outputs).toEqual(["done"]);
	});

	it("re-evaluates inner loop bounds each time the inner loop starts", () => {
		const { outputs } = run(`for i = 1 to 3
    for j = 1 to i
        print(i * 10 + j)
    next j
next i`);
		expect(outputs).toEqual(["11", "21", "22", "31", "32", "33"]);
	});

	it("keeps literal loops with and without step unchanged", () => {
		const { outputs } = run(`for i = 1 to 3
    print(i)
next i
for j = 10 to 4 step -3
    print(j)
next j`);
		expect(outputs).toEqual(["1", "2", "3", "10", "7", "4"]);
	});
});

describe("Comparing text with < and >", () => {
	it("orders text alphabetically", () => {
		const { outputs } = run(`a = "Alaska"
b = "Texas"
if a < b then
    print("a first")
endif
if b > a then
    print("b after")
endif
if a >= b then
    print("wrong")
endif
if a <= a then
    print("equal ok")
endif
if a == "Alaska" then
    print("same")
endif`);
		expect(outputs).toEqual(["a first", "b after", "equal ok", "same"]);
	});

	it("compares array elements with text", () => {
		const { outputs } = run(`array names = ["Ann", "Bob", "Cy"]
target = "Bz"
if names[1] < target then
    print("Bob before Bz")
endif
if names[2] < target then
    print("wrong")
endif`);
		expect(outputs).toEqual(["Bob before Bz"]);
	});

	it("still compares numeric strings and numbers numerically", () => {
		const { outputs } = run(`a = "10"
b = "9"
if a > b then
    print("numeric")
endif
x = 10
y = 9
if x > y then
    print("numbers")
endif`);
		expect(outputs).toEqual(["numeric", "numbers"]);
	});
});

describe("Printing whole arrays", () => {
	it("prints an array as [1, 2, 4, 5]", () => {
		const { outputs } = run(`array items = [1, 2, 4, 5]
print(items)`);
		expect(outputs).toEqual(["[1, 2, 4, 5]"]);
	});

	it("prints the current contents after changes", () => {
		const { outputs } = run(`array items = [3, 1, 2]
items[0] = 9
print(items)`);
		expect(outputs).toEqual(["[9, 1, 2]"]);
	});

	it("prints a one-element array and a declared array", () => {
		const { outputs } = run(`array one = [7]
array blank[3]
print(one)
print(blank)`);
		expect(outputs).toEqual(["[7]", "[0, 0, 0]"]);
	});

	it("prints text arrays and arrays alongside text", () => {
		const { outputs } = run(`array names = ["Ann", "Bob"]
print(names)
print("Names:", names)`);
		expect(outputs).toEqual(["[Ann, Bob]", "Names: [Ann, Bob]"]);
	});

	it("still prints elements and plain variables as before", () => {
		const { outputs } = run(`array items = [4, 5, 6]
x = 3
print(items[1])
print(x)
print("items")`);
		expect(outputs).toEqual(["5", "3", "items"]);
	});
});
