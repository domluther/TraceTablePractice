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
				minPoints: 30,
				minAccuracy: 50,
			},
			{
				emoji: "🐤",
				title: "Loop Learner",
				description: "Navigating through loops with ease!",
				minPoints: 90,
				minAccuracy: 65,
			},
			{
				emoji: "🦆",
				title: "Condition Captain",
				description: "Mastering conditionals and branches!",
				minPoints: 150,
				minAccuracy: 70,
			},
			{
				emoji: "🦆✨",
				title: "Algorithm Ace",
				description: "Tracing through complex algorithms effortlessly!",
				minPoints: 400,
				minAccuracy: 80,
			},
			{
				emoji: "🪿👑",
				title: "Trace Table Master",
				description: "The ultimate trace table expert!",
				minPoints: 750,
				minAccuracy: 90,
			},
		],
	},
	hints: [
		{
			title: "Line Numbers",
			description: "Record which line of code is being executed for each step",
			examples: [
				"Start with line 1",
				"Skip lines with no execution or changing variables",
				"Track conditional jumps",
			],
			color: "green",
		},
		{
			title: "Variables",
			description:
				"Track the values of variables as they change during execution",
			examples: ["a = 5", "name = 'Alice'", "result = a + b"],
			color: "blue",
		},
		{
			title: "Output",
			description: "Record what gets output during program execution",
			examples: [
				"print('Hello')",
				"print(result)",
				"print('Age: ' + str(age))",
			],
			color: "purple",
		},
		{
			title: "Conditionals",
			description: "Follow the correct path based on true/false conditions",
			examples: ["if age >= 18 then", "else", "endif"],
			color: "red",
		},
		{
			title: "Loops",
			description:
				"Focus on the condition, especially updating the loop variable",
			examples: [
				"for i = 1 to 10",
				"while count < 5",
				"do...until done == true",
			],
			color: "purple",
		},
		{
			title: "Arrays",
			description: "Track assigning values to elements",
			examples: ['array colours = ["Blue", "Pink", "Green"]', "myArray[0] = 5"],
			color: "yellow",
		},
	],
};
