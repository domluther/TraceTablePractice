export type Difficulty = "easy" | "medium" | "hard";

export interface HintItem {
	title: string;
	description: string;
	examples: string[];
	color: "blue" | "purple" | "green" | "yellow" | "red";
}
