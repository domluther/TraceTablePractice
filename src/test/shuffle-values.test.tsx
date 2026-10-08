import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TraceTableBody } from "@/components/TraceTableBody";
import { ASTInterpreter } from "@/lib/astInterpreter";
import { getSetupBlock, type Program, programs } from "@/lib/programs";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { pickProgramInputs } from "@/lib/utils";

function renderBody(program: ReturnType<typeof pickProgramInputs>, difficulty: "alevel" | "hard") {
	return render(
		<TraceTableBody
			currentProgram={program}
			interpreter={new ASTInterpreter()}
			onScoreUpdate={vi.fn()}
			difficulty={difficulty}
			programIndex={0}
			siteConfig={SITE_CONFIG}
		/>,
	);
}

const findALevel = (name: string) =>
	programs.alevel.find((p) => p.description.startsWith(name)) as Program;
const bubbleSort = findALevel("Bubble sort");
const binarySearch = findALevel("Binary search");

describe("Shuffle button", () => {
	it("changes the first line of the displayed code for A-Level bubble sort", () => {
		const program = pickProgramInputs(bubbleSort);
		renderBody(program, "alevel");

		const shown = () =>
			screen.getAllByText(/^array items = \[/).map((el) => el.textContent);
		const before = getSetupBlock(program);
		expect(shown()).toContain(before);

		const button = screen.getByRole("button", { name: /Shuffle Values/ });
		for (let i = 0; i < 5; i++) {
			const previous = getSetupBlock(program);
			fireEvent.click(button);
			const current = getSetupBlock(program);
			expect(current).not.toBe(previous);
			expect(bubbleSort.setupVariants).toContain(current);
			expect(shown()).toContain(current);
		}
		expect(bubbleSort.code.split("\n")[0]).toBe("array items = [5, 2, 4, 1]");
	});

	it("shuffles multi-line setup blocks for the binary search", () => {
		const base = binarySearch;
		const program = pickProgramInputs(base);
		renderBody(program, "alevel");

		const button = screen.getByRole("button", { name: /Shuffle Values/ });
		for (let i = 0; i < 6; i++) {
			const previous = getSetupBlock(program);
			fireEvent.click(button);
			const current = getSetupBlock(program);
			const [arrayLine, targetLine] = current.split("\n");

			expect(current).not.toBe(previous);
			expect(base.setupVariants).toContain(current);
			expect(program.code.split("\n")[0]).toBe(arrayLine);
			expect(program.code.split("\n")[1]).toBe(targetLine);
			expect(program.code).toContain("found = false");
			expect(screen.getAllByText(targetLine).length).toBeGreaterThan(0);
		}
		expect(base.code.split("\n")[1]).toBe("target = 19");
	});

	it("still labels the button 'Shuffle Inputs' for input-set programs", () => {
		const withInputs = programs.hard.find((p) => (p.inputSets?.length ?? 0) > 1);
		expect(withInputs).toBeDefined();
		renderBody(pickProgramInputs(withInputs!), "hard");
		expect(screen.getByRole("button", { name: /Shuffle Inputs/ })).toBeTruthy();
	});
});
