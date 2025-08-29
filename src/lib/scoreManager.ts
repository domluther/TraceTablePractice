import type { Difficulty } from "./types";

export interface LevelInfo {
	emoji: string;
	title: string;
	description: string;
	minPoints: number;
	minAccuracy: number;
}

export interface ScoreDisplay {
	text: string;
	className: string;
}

export interface ProgramScore {
	programName: string;
	attempts: number;
	bestScore: string;
	lastAttempt: string;
	accuracy: number;
}

export interface ScoreData {
	attempts: number;
	bestScore: number;
	outOf: number;
	history: Array<{
		timestamp: number;
		perfect: boolean;
		address: string;
	}>;
}

export class ScoreManager {
	private siteKey: string;
	private storageKey: string;
	private scores: Record<string, ScoreData> = {};
	private levels: LevelInfo[];

	// Default generic levels that can be used as fallback
	private static readonly DEFAULT_LEVELS: LevelInfo[] = [
		{
			emoji: "🥚",
			title: "Beginner",
			description: "Just getting started!",
			minPoints: 0,
			minAccuracy: 0,
		},
		{
			emoji: "🐣",
			title: "Novice",
			description: "Making progress!",
			minPoints: 5,
			minAccuracy: 0,
		},
		{
			emoji: "🐤",
			title: "Learner",
			description: "Building confidence!",
			minPoints: 12,
			minAccuracy: 60,
		},
		{
			emoji: "🦆",
			title: "Skilled",
			description: "Getting the hang of it!",
			minPoints: 25,
			minAccuracy: 70,
		},
		{
			emoji: "🦆✨",
			title: "Expert",
			description: "Impressive skills!",
			minPoints: 50,
			minAccuracy: 80,
		},
		{
			emoji: "🪿👑",
			title: "Master",
			description: "Absolute mastery achieved!",
			minPoints: 75,
			minAccuracy: 90,
		},
	];

	constructor(siteKey: string, customLevels?: LevelInfo[]) {
		this.siteKey = siteKey;
		this.storageKey = `gcse-cs-scores-${this.siteKey}`;
		this.levels = customLevels || ScoreManager.DEFAULT_LEVELS;
		this.scores = this.loadScores();
	}

	private loadScores(): Record<string, ScoreData> {
		try {
			const stored = localStorage.getItem(this.storageKey);
			return stored ? JSON.parse(stored) : {};
		} catch (error) {
			console.warn("Error loading scores:", error);
			return {};
		}
	}

	private saveScores(): void {
		try {
			localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
		} catch (error) {
			console.warn("Error saving scores:", error);
		}
	}

	saveScore(
		difficulty: Difficulty,
		programIndex: number,
		attemptScore: number,
		total: number,
	): boolean {
		console.log("saving score", {
			difficulty,
			programIndex,
			attemptScore,
			total,
		});

		try {
			const itemKey = `${difficulty}-${programIndex}`;

			if (!this.scores[itemKey]) {
				this.scores[itemKey] = {
					attempts: 0,
					bestScore: 0,
					// Only needs setting the first time
					outOf: total,
					history: [],
				};
			}

			const scoreData = this.scores[itemKey];
			scoreData.attempts++;

			if (attemptScore > scoreData.bestScore) {
				scoreData.bestScore = attemptScore;
			}

			// Add to history (keep last 10 entries)
			scoreData.history.unshift({
				timestamp: Date.now(),
				perfect: attemptScore === total, // Only mark as fully correct if perfect
				address: `${attemptScore}/${total}`,
			});

			if (scoreData.history.length > 10) {
				scoreData.history = scoreData.history.slice(0, 10);
			}

			this.saveScores();
			return true;
		} catch (error) {
			console.error("Error saving score:", error);
			return false;
		}
	}

	// Overall stats adapted for trace table scoring system
	getOverallStats(): {
		totalAttempts: number;
		accuracy: number;
		totalPoints: number;
		totalPossiblePoints: number;
		programsAttempted: number;
		level: LevelInfo;
		progress: number;
		nextLevel: LevelInfo | null;
	} {
		// For trace tables, we need to calculate accuracy differently since 'correct' is points, not binary
		let totalAttempts = 0;
		let totalPoints = 0;
		let totalPossiblePoints = 0;
		let programsAttempted = 0;

		for (const [, scoreData] of Object.entries(this.scores)) {
			totalAttempts += scoreData.attempts;

			// All data is trace table programs - correct field is best score achieved
			totalPoints += scoreData.bestScore;
			totalPossiblePoints += scoreData.outOf;

			// Count programs that have been attempted
			if (scoreData.attempts > 0) {
				programsAttempted++;
			}
		}

		// Calculate accuracy based on points earned vs possible points
		const accuracy =
			totalPossiblePoints > 0 ? (totalPoints / totalPossiblePoints) * 100 : 0;

		// Use total best points as the points for leveling

		// Find current level
		let currentLevel = this.levels[0];
		for (let i = this.levels.length - 1; i >= 0; i--) {
			const level = this.levels[i];
			if (totalPoints >= level.minPoints && accuracy >= level.minAccuracy) {
				currentLevel = level;
				break;
			}
		}

		// Find next level
		const currentLevelIndex = this.levels.indexOf(currentLevel);
		const nextLevel =
			currentLevelIndex < this.levels.length - 1
				? this.levels[currentLevelIndex + 1]
				: null;

		// Calculate progress to next level
		let progress = 100;
		if (nextLevel) {
			const pointsProgress = Math.min(
				100,
				(totalPoints / nextLevel.minPoints) * 100,
			);
			const accuracyProgress = Math.min(
				100,
				(accuracy / nextLevel.minAccuracy) * 100,
			);
			progress = Math.min(pointsProgress, accuracyProgress);
		}

		return {
			totalAttempts,
			accuracy,
			totalPoints,
			totalPossiblePoints,
			programsAttempted,
			level: currentLevel,
			progress,
			nextLevel,
		};
	}

	// Simplified score display - uses stored best score and gets total from most recent attempt
	getScoreDisplay(difficulty: Difficulty, programIndex: number): ScoreDisplay {
		const key = `${difficulty}-${programIndex}`;
		const scoreData = this.scores[key];
		console.log(scoreData);
		if (!scoreData || scoreData.attempts === 0) {
			return {
				text: "N/A",
				className: "score-none",
			};
		}

		// Use stored best score and get total from most recent attempt
		const bestScore = scoreData.bestScore;
		let totalQuestions = 0;

		if (scoreData.history.length > 0) {
			const recentAttempt = scoreData.history[0]; // Most recent is first
			const [, totalStr] = recentAttempt.address.split("/");
			totalQuestions = parseInt(totalStr, 10) || 0;
		}

		const percentage =
			totalQuestions > 0 ? Math.round((bestScore / totalQuestions) * 100) : 0;

		let className = "";
		let text = "";

		if (percentage === 100) {
			className = "score-perfect";
			text = `${bestScore}/${totalQuestions} ⭐`;
		} else if (percentage >= 80) {
			className = "score-good";
			text = `${bestScore}/${totalQuestions} 👍`;
		} else if (percentage >= 60) {
			className = "score-okay";
			text = `${bestScore}/${totalQuestions} 👌`;
		} else if (percentage >= 40) {
			className = "score-poor";
			text = `${bestScore}/${totalQuestions} 😐`;
		} else {
			className = "score-bad";
			text = `${bestScore}/${totalQuestions} 😞`;
		}

		return { text, className };
	}

	// Simplified program scores - uses stored data more efficiently
	getProgramScores(): ProgramScore[] {
		const programScores: ProgramScore[] = [];

		for (const [key, scoreData] of Object.entries(this.scores)) {
			if (scoreData.attempts > 0) {
				const [difficulty, indexStr] = key.split("-");
				const programIndex = parseInt(indexStr, 10);
				const programName = `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Program ${programIndex + 1}`;

				// Use stored best score and get total from most recent attempt
				const bestScore = scoreData.bestScore;
				let totalQuestions = 0;
				let lastAttemptDate = "";

				if (scoreData.history.length > 0) {
					// Get total from most recent attempt (all attempts should have same total for a program)
					const recentAttempt = scoreData.history[0]; // Most recent is first
					const [, totalStr] = recentAttempt.address.split("/");
					totalQuestions = parseInt(totalStr, 10) || 0;

					// Get the most recent attempt date for display
					lastAttemptDate = new Date(
						recentAttempt.timestamp,
					).toLocaleDateString("en-GB");
				}

				const accuracy =
					totalQuestions > 0 ? (bestScore / totalQuestions) * 100 : 0;

				programScores.push({
					programName,
					attempts: scoreData.attempts,
					bestScore: `${bestScore}/${totalQuestions}`,
					lastAttempt: lastAttemptDate,
					accuracy: Math.round(accuracy),
				});
			}
		}

		// Sort by difficulty and then by program number
		programScores.sort((a, b) => {
			const difficultyOrder = ["Easy", "Medium", "Hard"];
			const aDifficulty = a.programName.split(" ")[0];
			const bDifficulty = b.programName.split(" ")[0];

			const diffCompare =
				difficultyOrder.indexOf(aDifficulty) -
				difficultyOrder.indexOf(bDifficulty);
			if (diffCompare !== 0) return diffCompare;

			// If same difficulty, sort by program number
			const aNumber = parseInt(a.programName.split(" ")[2], 10);
			const bNumber = parseInt(b.programName.split(" ")[2], 10);
			return aNumber - bNumber;
		});

		return programScores;
	}

	resetAllScores(): void {
		this.scores = {};
		this.saveScores();
	}
}
