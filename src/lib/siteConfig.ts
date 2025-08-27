import type { HintItem } from "@/components/HintPanel";
import type { LevelInfo } from "@/lib/scoreManager";

/** Configuration interface for GCSE CS practice sites */
export interface SiteConfig {
	/** Unique site identifier for score tracking */
	siteKey: string;
	/** Site title displayed in header */
	title: string;
	/** Site subtitle/description */
	subtitle: string;
	/** Site icon/emoji */
	icon: string;
	/** Scoring configuration */
	scoring: ScoringConfig;
	/** Site-specific hint content for help sections */
	hints?: HintItem[];
}

export interface ScoringConfig {
	/** Points awarded for correct answers */
	pointsPerCorrect: number;
	/** Points deducted for incorrect answers */
	pointsPerIncorrect: number;
	/** Custom level system (optional, falls back to duck levels) */
	customLevels?: LevelInfo[];
}

export interface Level {
	emoji: string;
	title: string;
	description: string;
	minPoints: number;
	minAccuracy: number;
}

/** OCR ERL Trace Table Practice site configuration */
export const SITE_CONFIG: SiteConfig = {
	siteKey: "trace-table",
	title: "OCR ERL Trace Tables",
	subtitle: "Master tracing OCR ERL algorithms thanks to instant feedback",
	icon: "🦆",
	scoring: {
		pointsPerCorrect: 1,
		pointsPerIncorrect: 0,
		customLevels: [
			{
				emoji: "🥚",
				title: "Trace Trainee",
				description: "Just started learning how to trace!",
				minPoints: 0,
				minAccuracy: 0,
			},
			{
				emoji: "🐣",
				title: "Variable Voyager",
				description: "Getting comfortable with variables!",
				minPoints: 10,
				minAccuracy: 50,
			},
			{
				emoji: "🐤",
				title: "Loop Learner",
				description: "Navigating through loops with ease!",
				minPoints: 25,
				minAccuracy: 65,
			},
			{
				emoji: "🦆",
				title: "Condition Captain",
				description: "Mastering conditionals and branches!",
				minPoints: 50,
				minAccuracy: 75,
			},
			{
				emoji: "🦆✨",
				title: "Algorithm Ace",
				description: "Tracing through complex algorithms effortlessly!",
				minPoints: 100,
				minAccuracy: 85,
			},
			{
				emoji: "🪿👑",
				title: "Trace Table Master",
				description: "The ultimate trace table expert!",
				minPoints: 200,
				minAccuracy: 95,
			},
		],
	},
	hints: [
		{
			title: "Variables",
			description:
				"Track the values of variables as they change during execution",
			examples: ["a = 5", "name = 'Alice'", "result = a + b"],
			color: "blue",
		},
		{
			title: "Line Numbers",
			description: "Record which line of code is being executed for each step",
			examples: [
				"Start with line 1",
				"Skip lines with no execution",
				"Track conditional jumps",
			],
			color: "green",
		},
		{
			title: "Output",
			description: "Record what gets printed during program execution",
			examples: [
				"print('Hello')",
				"print(result)",
				"print('Age: ' + str(age))",
			],
			color: "purple",
		},
		{
			title: "Arrays",
			description: "Track changes to array elements and their indices",
			examples: ["myArray[0] = 5", "myArray[1] = myArray[0] + 2"],
			color: "yellow",
		},
		{
			title: "Conditionals",
			description: "Follow the correct path based on true/false conditions",
			examples: ["if age >= 18 then", "else", "endif"],
			color: "red",
		},
		{
			title: "Loops",
			description: "Understand how loops repeat and when they terminate",
			examples: [
				"for i = 1 to 10",
				"while count < 5",
				"do...until done = true",
			],
			color: "purple",
		},
	],
};
