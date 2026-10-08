import { describe, expect, it } from "vitest";
import { ASTInterpreter } from "@/lib/astInterpreter";
import { programs } from "@/lib/programs";

/**
 * Golden snapshots for the GCSE programs (easy, medium, hard).
 * The snapshots were generated with the interpreter before A-Level support was
 * added, so any change to the full trace of these programs fails here.
 */
describe("GCSE programs golden traces", () => {
	for (const difficulty of ["easy", "medium", "hard"] as const) {
		programs[difficulty].forEach((program, index) => {
			const inputSets = program.inputSets ?? [program.inputs];
			const randomValues = program.randomValues ?? [program.randomValue ?? 7];

			inputSets.forEach((inputs, setIndex) => {
				randomValues.forEach((randomValue, randomIndex) => {
					it(`${difficulty}#${index} inputs=${setIndex} random=${randomIndex}`, () => {
						const result = new ASTInterpreter().executeProgram(program.code, {
							code: program.code,
							description: program.description,
							inputs,
							randomValue,
						});
						expect(result).toMatchSnapshot();
					});
				});
			});
		});
	}
});
