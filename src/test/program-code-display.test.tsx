import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgramCode } from "@/components/ProgramCode";
import { type Program, programs } from "@/lib/programs";

const find = (name: string) => {
	const program = programs.alevel.find((p) => p.description === name);
	if (!program) throw new Error(`No program named ${name}`);
	return program;
};

const lineCount = (container: HTMLElement) =>
	container.querySelectorAll("pre > div").length;

const shownCode = (container: HTMLElement) =>
	Array.from(container.querySelectorAll("pre > div")).map(
		(row) => row.lastElementChild?.textContent?.trim() ?? "",
	);

function renderCode(program: Program) {
	return (
		<ProgramCode
			currentProgram={program}
			difficulty="alevel"
			programIndex={0}
			programCodeId="code"
		/>
	);
}

describe("Program code display", () => {
	const mergeSort = find("Merge sort algorithm");
	const linearSearch = find("Linear search algorithm");

	it("shows exactly the lines of a program that repeats lines", () => {
		const { container } = render(renderCode(mergeSort));
		expect(shownCode(container)).toEqual(
			mergeSort.code.split("\n").map((l) => l.trim() || ""),
		);
	});

	it("leaves no lines behind when switching from a longer program", () => {
		const { container, rerender } = render(renderCode(mergeSort));
		expect(lineCount(container)).toBe(mergeSort.code.split("\n").length);

		rerender(renderCode(linearSearch));
		expect(lineCount(container)).toBe(linearSearch.code.split("\n").length);
		expect(shownCode(container)).toEqual(
			linearSearch.code.split("\n").map((l) => l.trim() || ""),
		);
	});

	it("shows every program correctly after switching between all of them", () => {
		const all: Program[] = Object.values(programs).flat();
		const { container, rerender } = render(renderCode(all[0]));
		for (const program of [...all, ...[...all].reverse()]) {
			rerender(renderCode(program));
			expect(shownCode(container)).toEqual(
				program.code.split("\n").map((l) => l.trim() || ""),
			);
		}
	});

	it("limits the code height and lets screenshots show all of it", () => {
		const { container } = render(renderCode(mergeSort));
		const scrollArea = container.querySelector("[data-capture-expand]");
		expect(scrollArea).not.toBeNull();
		expect(scrollArea?.className).toContain("max-h-[26rem]");
		expect(scrollArea?.className).toContain("overflow-auto");
		expect(scrollArea?.querySelectorAll("pre > div")).toHaveLength(
			mergeSort.code.split("\n").length,
		);
	});
});
