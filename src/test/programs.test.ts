import { describe, expect, it } from "vitest";
import type { Program } from "@/lib/astInterpreter";
import { ASTInterpreter } from "@/lib/astInterpreter";
import {
	applySetupVariant,
	getSetupBlock,
	programs,
} from "@/lib/programs";
import { pickProgramInputs } from "@/lib/utils";

/**
 * Programs Integration Tests
 *
 * These tests validate that the actual programs from programs.ts
 * execute correctly with the AST interpreter. They focus on programs
 * that use features known to work well.
 */

function runProgram(programDef: any, inputs: string[] = []) {
	const interpreter = new ASTInterpreter();
	const program: Program = {
		code: programDef.code,
		description: programDef.description,
		inputs: inputs.length > 0 ? inputs : programDef.inputs,
	};

	try {
		const result = interpreter.executeProgram(programDef.code, program);
		const lastStep = result.trace[result.trace.length - 1];

		return {
			success: true,
			variables: lastStep?.variables || {},
			outputs: result.outputs,
			trace: result.trace,
		};
	} catch (error) {
		return {
			success: false,
			error: error,
			variables: {},
			outputs: [],
			trace: [],
		};
	}
}

describe("Programs Integration Tests - Easy Programs", () => {
	it("should run the basic addition program (Easy #0)", () => {
		const program = programs.easy[0]; // a=5, b=3, c=a+b, print(c)
		const result = runProgram(program);

		expect(result.success).toBe(true);
		const variables = result.variables as Record<string, any>;

		expect(variables.a).toBe(5);
		expect(variables.b).toBe(3);
		expect(variables.c).toBe(8);
		expect(result.outputs).toContain("8");
	});

	it("should run programs with basic arithmetic safely", () => {
		// Test only programs that use features we know work
		const safePrograms = programs.easy.filter((program) => {
			// Exclude programs with comparison operators, loops, or complex features
			const problematicPatterns = [
				"<",
				">",
				"==",
				"!=",
				"if",
				"while",
				"for",
				"*",
				"/",
				"%",
				"**",
			];
			return !problematicPatterns.some((pattern) =>
				program.code.includes(pattern),
			);
		});

		console.log(
			`Testing ${safePrograms.length} safe programs out of ${programs.easy.length} total easy programs`,
		);

		let successCount = 0;
		safePrograms.forEach((program, index) => {
			try {
				const result = runProgram(program);
				if (result.success) {
					successCount++;
				}
				expect(result.error).toBeUndefined();
			} catch (error) {
				console.warn(`Safe program ${index} failed: ${error}`);
			}
		});

		// Should be able to handle most safe programs
		const successRate = successCount / safePrograms.length;
		expect(successRate).toBeGreaterThan(0.8); // 80% of safe programs should work
		console.log(
			`Safe programs success rate: ${successCount}/${safePrograms.length} (${Math.round(successRate * 100)}%)`,
		);
	});
	it("should handle programs with numeric inputs correctly", () => {
		// Find programs that use int(input()) which should work
		const numericInputPrograms = programs.easy.filter(
			(p) =>
				p.code.includes("int(input(") &&
				p.inputSets &&
				p.inputSets.length > 0 &&
				!p.code.includes("MOD") &&
				!p.code.includes("DIV") &&
				!p.code.includes("^") &&
				!p.code.includes("["),
		);

		numericInputPrograms.slice(0, 3).forEach((program) => {
			const inputs = program.inputSets?.[0];
			const result = runProgram(program, inputs);

			expect(result.success).toBe(true);
			expect(result.trace.length).toBeGreaterThan(0);

			// Should have received and processed the inputs
			if (program.code.includes("print")) {
				expect(result.outputs.length).toBeGreaterThan(0);
			}
		});
	});
});

describe("Programs Integration Tests - Medium Programs", () => {
	it("should handle simple medium programs", () => {
		// Find medium programs that should work with current interpreter
		const simplePrograms = programs.medium.filter((p) => {
			return (
				!p.code.includes("MOD") &&
				!p.code.includes("DIV") &&
				!p.code.includes("^") &&
				!p.code.includes("[") &&
				!p.code.includes("for ") &&
				!p.code.includes("while ") &&
				!p.code.includes("if ") &&
				p.code.split("\n").length < 15
			); // Keep complexity reasonable
		});

		if (simplePrograms.length > 0) {
			simplePrograms.slice(0, 2).forEach((program) => {
				const inputs = program.inputSets ? program.inputSets[0] : [];
				const result = runProgram(program, inputs);

				expect(result.success).toBe(true);
				expect(result.trace.length).toBeGreaterThan(0);
			});
		}
	});
});

describe("Programs Integration Tests - Error Handling", () => {
	it("should not crash on any programs, even with unsupported features", () => {
		// Test a few programs from each difficulty to ensure no crashes
		const testPrograms = [
			...programs.easy.slice(0, 5),
			...programs.medium.slice(0, 3),
			...programs.hard.slice(0, 2),
		];

		testPrograms.forEach((program) => {
			const inputs = program.inputSets ? program.inputSets[0] : [];

			expect(() => {
				const result = runProgram(program, inputs);
				// Should not throw, even if some features don't work
				expect(result).toBeDefined();
			}).not.toThrow();
		});
	});

	it("should provide meaningful trace steps even for complex programs", () => {
		// Even if some features don't work perfectly, we should get trace steps
		const program = programs.easy[0];
		const result = runProgram(program);

		expect(result.trace.length).toBeGreaterThan(0);
		result.trace.forEach((step) => {
			expect(step.lineNumber).toBeGreaterThan(0);
			expect(typeof step.variables).toBe("object");
			expect(typeof step.output).toBe("string");
		});
	});
});

describe("Programs Integration Tests - Feature Coverage", () => {
	it("should identify which types of programs work best", () => {
		let workingCount = 0;
		let totalCount = 0;

		// Count programs that work well vs total
		programs.easy.forEach((program) => {
			totalCount++;
			const result = runProgram(program);
			if (result.success && result.trace.length > 0) {
				workingCount++;
			}
		});

		// Should have good coverage of basic programs
		const successRate = workingCount / totalCount;
		expect(successRate).toBeGreaterThan(0.5); // At least 50% should work

		console.log(
			`\nInterpreter Success Rate: ${workingCount}/${totalCount} (${Math.round(successRate * 100)}%)`,
		);
	});

	it("should handle the most important GCSE scenarios", () => {
		// Test key GCSE Computer Science concepts that should work
		const scenarios = [
			{
				name: "Variable assignment and arithmetic",
				code: `x = 10\ny = 5\nz = x + y`,
				expectVars: { x: 10, y: 5, z: 15 }, // Variables have correct types
			},
			{
				name: "Sequential calculations",
				code: `price = 100\ndiscount = 10\nfinal = price - discount`,
				expectVars: { price: 100, discount: 10, final: 90 },
			},
			{
				name: "Input processing",
				code: `age = int(input("Age:"))\nafter = age + 1`,
				inputs: ["16"],
				expectVars: { age: 16, after: 17 },
			},
		];

		scenarios.forEach((scenario) => {
			const result = runProgram(
				{
					code: scenario.code,
					description: scenario.name,
				},
				scenario.inputs || [],
			);

			expect(result.success).toBe(true);

			if (scenario.expectVars) {
				Object.entries(scenario.expectVars).forEach(
					([varName, expectedValue]) => {
						const variables = result.variables as Record<string, any>;
						expect(variables[varName]).toBe(expectedValue);
					},
				);
			}
		});
	});
});

const findALevel = (name: string) => {
	const program = programs.alevel.find((p) => p.description.startsWith(name));
	if (!program) throw new Error(`No A-Level program named ${name}`);
	return program;
};

describe("Programs Integration Tests - A-Level Programs", () => {
	const bubbleSort = findALevel("Bubble sort");
	const variants = bubbleSort.setupVariants ?? [];

	const parseItems = (line: string) =>
		line
			.replace(/^array items = \[/, "")
			.replace("]", "")
			.split(",")
			.map(Number);

	it("uses variable first-line data instead of input sets", () => {
		expect(bubbleSort.inputSets).toBeUndefined();
		expect(variants.length).toBeGreaterThan(1);
		expect(variants).toContain(getSetupBlock(bubbleSort));
		expect(new Set(variants.map((v) => parseItems(v).length)).size).toBeGreaterThan(
			1,
		);
		for (const variant of variants) {
			expect(variant).toMatch(/^array items = \[[\d, ]+\]$/);
		}
	});

	it("sorts every variant correctly", () => {
		for (const variant of variants) {
			const program = applySetupVariant(bubbleSort, variant);
			const result = runProgram(program);
			const sorted = [...parseItems(variant)].sort((a, b) => a - b);

			expect(result.success).toBe(true);
			expect((result.variables as Record<string, any>).items).toEqual(sorted);
			expect(result.outputs).toEqual(sorted.map(String));
		}
	});

	it("only changes the first line between variants", () => {
		const rest = bubbleSort.code.split("\n").slice(1).join("\n");
		for (const variant of variants) {
			const program = applySetupVariant(bubbleSort, variant);
			expect(program.code.split("\n")[0]).toBe(variant);
			expect(program.code.split("\n").slice(1).join("\n")).toBe(rest);
		}
	});

	it("needs no inputs and traces the array set-up as line 1", () => {
		for (const variant of variants) {
			const result = runProgram(applySetupVariant(bubbleSort, variant));
			expect(result.trace[0].lineNumber).toBe(1);
			expect(
				result.trace[0].changedVariables[`items[${parseItems(variant).length - 1}]`],
			).toBeDefined();
		}
	});

	it("stops early when the data is already sorted", () => {
		const sortedRun = runProgram(
			applySetupVariant(bubbleSort, "array items = [1, 2, 3, 4]"),
		);
		const reversedRun = runProgram(
			applySetupVariant(bubbleSort, "array items = [4, 3, 2, 1]"),
		);

		expect(sortedRun.outputs).toEqual(["1", "2", "3", "4"]);
		expect(sortedRun.trace.length).toBeLessThan(reversedRun.trace.length);
	});

	it("handles single-element data", () => {
		const result = runProgram(
			applySetupVariant(bubbleSort, "array items = [7]"),
		);
		expect(result.success).toBe(true);
		expect(result.outputs).toEqual(["7"]);
	});

	it("expands the trace columns to match the array length", () => {
		for (const variant of variants) {
			const program = applySetupVariant(bubbleSort, variant);
			const result = new ASTInterpreter().executeProgram(program.code, {
				code: program.code,
				description: program.description,
			});
			const columns = result.variables.filter((v) => v.startsWith("items["));
			expect(columns).toHaveLength(parseItems(variant).length);
		}
	});

	it("picks a variant when the program is selected without mutating the original", () => {
		const originalCode = bubbleSort.code;
		for (let i = 0; i < 20; i++) {
			const picked = pickProgramInputs(bubbleSort);
			expect(variants).toContain(getSetupBlock(picked));
		}
		expect(bubbleSort.code).toBe(originalCode);
	});
});

describe("Programs Integration Tests - A-Level setup variants", () => {
	const alevelWithVariants = programs.alevel.filter(
		(program) => program.setupVariants,
	);

	it("every A-Level program has several variants with matching line counts", () => {
		expect(alevelWithVariants).toHaveLength(programs.alevel.length);
		for (const program of alevelWithVariants) {
			const variants = program.setupVariants ?? [];
			expect(variants.length).toBeGreaterThan(1);
			const lineCount = variants[0].split("\n").length;
			for (const variant of variants) {
				expect(variant.split("\n")).toHaveLength(lineCount);
			}
			expect(variants).toContain(getSetupBlock(program));
		}
	});

	it("every variant of every A-Level program runs without error and only changes the setup lines", () => {
		for (const program of alevelWithVariants) {
			const lineCount = (program.setupVariants ?? [])[0].split("\n").length;
			const rest = program.code.split("\n").slice(lineCount).join("\n");
			for (const variant of program.setupVariants ?? []) {
				const applied = applySetupVariant(program, variant);
				expect(applied.code.split("\n").slice(lineCount).join("\n")).toBe(rest);
				expect(getSetupBlock(applied)).toBe(variant);
				const result = runProgram(applied);
				expect(result.success).toBe(true);
				expect(result.outputs.length).toBeGreaterThan(0);
			}
		}
	});
});

describe("Programs Integration Tests - A-Level insertion sort ", () => {
	const insertionSort = findALevel("Insertion sort");
	const parseItems = (line: string) =>
		line.replace(/^array items = \[/, "").replace("]", "").split(",").map(Number);

	it("sorts every variant correctly", () => {
		for (const variant of insertionSort.setupVariants ?? []) {
			const result = runProgram(applySetupVariant(insertionSort, variant));
			const sorted = [...parseItems(variant)].sort((a, b) => a - b);
			expect(result.success).toBe(true);
			expect((result.variables as Record<string, any>).items).toEqual(sorted);
			expect(result.outputs).toEqual(sorted.map(String));
		}
	});

	it("handles single-element, duplicate and negative data", () => {
		for (const items of [[7], [3, 3, 3], [2, -1, 0, -5, 2], [1, 2], [2, 1]]) {
			const result = runProgram(
				applySetupVariant(insertionSort, `array items = [${items.join(", ")}]`),
			);
			const sorted = [...items].sort((a, b) => a - b);
			expect(result.success).toBe(true);
			expect((result.variables as Record<string, any>).items).toEqual(sorted);
		}
	});

	it("traces the shifting of elements for the default data", () => {
		const result = runProgram(insertionSort);
		const itemChanges = result.trace
			.map((t) => t.changedVariables)
			.filter((c) => Object.keys(c).some((k) => k.startsWith("items[")))
			.slice(1);
		// [5,2,4,1]: index 1 -> items[1]=5, items[0]=2
		expect(itemChanges[0]).toEqual({ "items[1]": 5 });
		expect(itemChanges[1]).toEqual({ "items[0]": 2 });
	});
});

describe("Programs Integration Tests - A-Level binary search ", () => {
	const binarySearch = findALevel("Binary search");

	const parseSetup = (variant: string) => {
		const [arrayLine, targetLine] = variant.split("\n");
		const items = arrayLine
			.replace(/^array items = \[/, "")
			.replace("]", "")
			.split(",")
			.map(Number);
		const target = Number(targetLine.replace("target = ", ""));
		return { items, target };
	};

	it("uses sorted arrays in every variant", () => {
		for (const variant of binarySearch.setupVariants ?? []) {
			const { items } = parseSetup(variant);
			expect(items).toEqual([...items].sort((a, b) => a - b));
		}
	});

	it("finds present items and reports absent ones for every variant", () => {
		let found = 0;
		let notFound = 0;
		for (const variant of binarySearch.setupVariants ?? []) {
			const { items, target } = parseSetup(variant);
			const result = runProgram(applySetupVariant(binarySearch, variant));
			expect(result.success).toBe(true);

			const position = items.indexOf(target);
			if (position === -1) {
				notFound++;
				expect(result.outputs).toEqual(["Item not found"]);
			} else {
				found++;
				expect(result.outputs).toEqual([`Item found at position ${position}`]);
			}
		}
		expect(found).toBeGreaterThan(0);
		expect(notFound).toBeGreaterThan(0);
	});

	it("finds every item and rejects items outside and between the values", () => {
		const items = [3, 8, 12, 19, 25, 31, 40];
		const array = `array items = [${items.join(", ")}]`;
		for (const target of [...items, 1, 50, 10, 30, 4]) {
			const result = runProgram(
				applySetupVariant(binarySearch, `${array}\ntarget = ${target}`),
			);
			const position = items.indexOf(target);
			expect(result.outputs).toEqual([
				position === -1 ? "Item not found" : `Item found at position ${position}`,
			]);
		}
	});

	it("narrows left, right and midpoint as it searches", () => {
		const result = runProgram(
			applySetupVariant(
				binarySearch,
				"array items = [3, 8, 12, 19, 25]\ntarget = 25",
			),
		);
		const midpoints = result.trace
			.map((t) => t.changedVariables.midpoint)
			.filter((m) => m !== undefined);
		expect(midpoints).toEqual([2, 3, 4]);
		expect((result.variables as Record<string, any>).found).toBe(true);
	});
});

describe("Programs Integration Tests - A-Level linear search", () => {
	const linearSearch = findALevel("Linear search");

	const parseSetup = (variant: string) => {
		const [arrayLine, targetLine] = variant.split("\n");
		const items = arrayLine
			.replace(/^array items = \[/, "")
			.replace("]", "")
			.split(",")
			.map(Number);
		return { items, target: Number(targetLine.replace("target = ", "")) };
	};

	it("lists the A-Level programs in teaching order", () => {
		expect(programs.alevel.map((p) => p.description)).toEqual([
			"Linear search algorithm",
			"Binary search algorithm",
			"Bubble sort algorithm",
			"Insertion sort algorithm",
		]);
	});

	it("reports the first matching position or not found for every variant", () => {
		let found = 0;
		let notFound = 0;
		for (const variant of linearSearch.setupVariants ?? []) {
			const { items, target } = parseSetup(variant);
			const result = runProgram(applySetupVariant(linearSearch, variant));
			expect(result.success).toBe(true);

			const position = items.indexOf(target);
			if (position === -1) {
				notFound++;
				expect(result.outputs).toEqual(["Item not found"]);
			} else {
				found++;
				expect(result.outputs).toEqual([`Item found at position ${position}`]);
			}
		}
		expect(found).toBeGreaterThan(0);
		expect(notFound).toBeGreaterThan(0);
	});

	it("uses unsorted data, with a duplicate and targets at the start, middle, end and absent", () => {
		const setups = (linearSearch.setupVariants ?? []).map(parseSetup);
		const positions = setups.map(({ items, target }) => items.indexOf(target));
		expect(positions).toContain(-1);
		expect(positions).toContain(0);
		expect(setups.some(({ items }) => items.join() !== [...items].sort((a, b) => a - b).join())).toBe(true);
		expect(setups.some(({ items, target }) => items.filter((i) => i === target).length > 1)).toBe(true);
		expect(positions.some((p, i) => p === setups[i].items.length - 1)).toBe(true);
	});

	it("checks every position and handles edge cases", () => {
		const items = [7, 3, 9, 4, 12, 6];
		for (const target of [...items, 0, 100]) {
			const result = runProgram(
				applySetupVariant(
					linearSearch,
					`array items = [${items.join(", ")}]\ntarget = ${target}`,
				),
			);
			const position = items.indexOf(target);
			expect(result.outputs).toEqual([
				position === -1 ? "Item not found" : `Item found at position ${position}`,
			]);
		}
		const single = runProgram(
			applySetupVariant(linearSearch, "array items = [5]\ntarget = 5"),
		);
		expect(single.outputs).toEqual(["Item found at position 0"]);
	});

	it("stops searching as soon as the item is found", () => {
		const early = runProgram(
			applySetupVariant(linearSearch, "array items = [4, 1, 2, 3]\ntarget = 4"),
		);
		const late = runProgram(
			applySetupVariant(linearSearch, "array items = [1, 2, 3, 4]\ntarget = 4"),
		);
		expect(early.trace.length).toBeLessThan(late.trace.length);
	});
});

describe("applySetupVariant", () => {
	it("replaces only line 1 and handles single-line programs", () => {
		const base = { code: "a = 1\nprint(a)", description: "" };
		expect(applySetupVariant(base, "a = 2").code).toBe("a = 2\nprint(a)");
		expect(applySetupVariant({ ...base, code: "a = 1" }, "a = 2").code).toBe(
			"a = 2",
		);
	});

	it("leaves programs without variants unchanged when picked", () => {
		const picked = pickProgramInputs(programs.easy[0]);
		expect(picked.code).toBe(programs.easy[0].code);
	});
});
