import { describe, expect, it } from "vitest";
import { ASTInterpreter } from "@/lib/astInterpreter";

function run(code: string) {
	const result = new ASTInterpreter().executeProgram(code, {
		code,
		description: "",
	});
	const last = result.trace[result.trace.length - 1];
	return {
		outputs: result.outputs,
		columns: result.variables,
		trace: result.trace,
		vars: last?.variables ?? {},
	};
}

const changes = (trace: ReturnType<typeof run>["trace"]) =>
	trace.map((t) => [t.lineNumber, t.changedVariables, t.output]);

describe("Procedures", () => {
	it("calls a procedure with a string argument", () => {
		const { outputs, trace, columns } = run(`procedure sayHi(name)
    print(name)
endprocedure
sayHi('bob')`);
		expect(outputs).toEqual(["bob"]);
		expect(columns).toEqual(["name"]);
		expect(changes(trace)).toEqual([
			[1, { name: "bob" }, ""],
			[2, {}, "bob"],
		]);
	});

	it("does not run the body when the procedure is only defined", () => {
		const { outputs, trace } = run(`procedure sayHi(name)
    print(name)
endprocedure
x = 1`);
		expect(outputs).toEqual([]);
		expect(changes(trace)).toEqual([[4, { x: 1 }, ""]]);
	});

	it("supports several calls, several parameters and expression arguments", () => {
		const { outputs } = run(`procedure show(a, b)
    print(a + b)
endprocedure
x = 2
show(x, 3)
show(x * 5, x + 1)
show("a", "b")`);
		expect(outputs).toEqual(["5", "13", "ab"]);
	});

	it("supports a recursive procedure", () => {
		const { outputs } = run(`procedure countdown(n)
    if n == 0 then
        print("Go")
    else
        print(n)
        countdown(n - 1)
    endif
endprocedure
countdown(3)`);
		expect(outputs).toEqual(["3", "2", "1", "Go"]);
	});
});

describe("Functions", () => {
	it("returns a value into an assignment and traces the return", () => {
		const { vars, columns, trace } = run(`function double(x)
    return x * 2
endfunction
y = double(4)`);
		expect(vars.y).toBe(8);
		expect(columns).toEqual(["y", "x", "return"]);
		expect(changes(trace)).toEqual([
			[1, { x: 4 }, ""],
			[2, { return: 8 }, ""],
			[4, { y: 8 }, ""],
		]);
	});

	it("uses a call inside print, concatenation and conditions", () => {
		const { outputs } = run(`function double(x)
    return x * 2
endfunction
function greet(who)
    return "Hello " + who
endfunction
print(double(3))
print("Total:", double(2) + 1)
print(greet("Sam"))
print("Say: " + greet("Al"))
if double(2) == 4 then
    print("yes")
endif
n = 0
while double(n) < 6
    n = n + 1
endwhile
print(n)`);
		expect(outputs).toEqual(["6", "Total: 5", "Hello Sam", "Say: Hello Al", "yes", "3"]);
	});

	it("returns early from inside loops and ifs", () => {
		const { vars } = run(`function firstOver(limit)
    for i = 1 to 10
        if i * i > limit then
            return i
        endif
    next i
    return 0
endfunction
a = firstOver(20)
b = firstOver(1000)`);
		expect(vars.a).toBe(5);
		expect(vars.b).toBe(0);
	});

	it("passes arrays into functions", () => {
		const { vars } = run(`array nums = [4, 9, 2]
function biggest(list)
    best = list[0]
    for i = 1 to list.length - 1
        if list[i] > best then
            best = list[i]
        endif
    next i
    return best
endfunction
top = biggest(nums)`);
		expect(vars.top).toBe(9);
	});

	it("nests calls as arguments", () => {
		const { vars } = run(`function double(x)
    return x * 2
endfunction
y = double(double(3))`);
		expect(vars.y).toBe(12);
	});

	it("does not touch text inside strings", () => {
		const { outputs } = run(`function double(x)
    return x * 2
endfunction
print("double(3)")`);
		expect(outputs).toEqual(["double(3)"]);
	});

	it("reads constants inside functions", () => {
		const { vars } = run(`const rate = 3
function triple(x)
    return x * rate
endfunction
y = triple(2)`);
		expect(vars.y).toBe(6);
	});
});

describe("Sharing the main program's variables", () => {
	it("lets a procedure read and change the main program's array", () => {
		const { vars, trace } = run(`array items = [1, 2, 3]
procedure doubleAt(index)
    items[index] = items[index] * 2
endprocedure
doubleAt(1)
doubleAt(2)`);
		expect(vars.items).toEqual([1, 4, 6]);
		expect(trace.some((t) => t.changedVariables["items[1]"] === 4)).toBe(true);
	});

	it("keeps plain variables assigned in a call local to that call", () => {
		const { vars, columns } = run(`procedure work(n)
    inner = n + 1
endprocedure
work(1)
outer = 5`);
		expect(vars.inner).toBeUndefined();
		expect(vars.outer).toBe(5);
		expect(columns).toEqual(["outer", "n", "inner"]);
	});

	it("gives each recursive call its own local variables", () => {
		const { outputs } = run(`procedure down(n)
    half = n DIV 2
    if n > 0 then
        down(half)
    endif
    print(half)
endprocedure
down(8)`);
		expect(outputs).toEqual(["0", "0", "1", "2", "4"]);
	});

	it("lets a function read a global variable", () => {
		const { vars } = run(`limit = 10
function check(x)
    if x > limit then
        return "over"
    endif
    return "within"
endfunction
a = check(12)
b = check(3)`);
		expect([vars.a, vars.b]).toEqual(["over", "within"]);
	});
});

describe("Recursion", () => {
	const factorial = `function factorial(n)
    if n <= 1 then
        return 1
    endif
    return n * factorial(n - 1)
endfunction
result = factorial(4)
print(result)`;

	it("computes factorial", () => {
		const { outputs, vars } = run(factorial);
		expect(vars.result).toBe(24);
		expect(outputs).toEqual(["24"]);
	});

	it("traces each call and each return in order", () => {
		const { trace, columns } = run(factorial);
		expect(columns).toEqual(["result", "n", "return"]);
		expect(changes(trace)).toEqual([
			[1, { n: 4 }, ""],
			[1, { n: 3 }, ""],
			[1, { n: 2 }, ""],
			[1, { n: 1 }, ""],
			[3, { return: 1 }, ""],
			[5, { return: 2 }, ""],
			[5, { return: 6 }, ""],
			[5, { return: 24 }, ""],
			[7, { result: 24 }, ""],
			[8, {}, "24"],
		]);
	});

	it("computes fibonacci with two recursive calls", () => {
		const { vars } = run(`function fib(n)
    if n < 2 then
        return n
    endif
    return fib(n - 1) + fib(n - 2)
endfunction
a = fib(0)
b = fib(1)
c = fib(7)`);
		expect([vars.a, vars.b, vars.c]).toEqual([0, 1, 13]);
	});

	it("computes a recursive sum", () => {
		const { vars } = run(`function total(n)
    if n == 0 then
        return 0
    endif
    return n + total(n - 1)
endfunction
s = total(10)`);
		expect(vars.s).toBe(55);
	});

	it("reports missing base cases instead of overflowing the stack", () => {
		expect(() =>
			run(`function forever(n)
    return forever(n + 1)
endfunction
x = forever(1)`),
		).toThrow(/recursion depth/);
	});
});

describe("Errors and unchanged behaviour", () => {
	it("rejects the wrong number of arguments", () => {
		expect(() =>
			run(`function f(a, b)
    return a + b
endfunction
x = f(1)`),
		).toThrow(/expects 2/);
	});

	it("rejects a missing end keyword", () => {
		expect(() => run(`function f(a)\n    return a`)).toThrow(/endfunction/);
	});

	it("rejects return outside a function", () => {
		expect(() => run(`return 1`)).toThrow(/inside a function/);
	});

	it("leaves programs without functions alone", () => {
		const { outputs, columns } = run(`a = 2
b = a * 3
print(b)`);
		expect(outputs).toEqual(["6"]);
		expect(columns).toEqual(["a", "b"]);
	});
});

describe("Printing numeric literals", () => {
	it("prints a number and an array length", () => {
		const { outputs } = run(`array items = [4, 5, 6]
print(3)
print(items.length)`);
		expect(outputs).toEqual(["3", "3"]);
	});
});
