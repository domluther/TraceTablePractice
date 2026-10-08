export type Difficulty = "easy" | "medium" | "hard" | "alevel";

export const DIFFICULTY_ORDER: Difficulty[] = [
	"easy",
	"medium",
	"hard",
	"alevel",
];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
	easy: "Easy",
	medium: "Medium",
	hard: "Hard",
	alevel: "A-Level",
};

export function isDifficulty(value: unknown): value is Difficulty {
	return DIFFICULTY_ORDER.includes(value as Difficulty);
}

export interface HintItem {
	title: string;
	description: string;
	examples: string[];
	color: "blue" | "purple" | "green" | "yellow" | "red";
}
