// Score management for trace table practice
// Based on the legacy score manager but adapted for the new architecture

export interface ScoreAttempt {
	correct: number;
	total: number;
	percentage: number;
	timestamp: string;
}

export interface ScoreDisplay {
	text: string;
	className: string;
}

export class TraceTableScoreManager {
	private storageKey = "traceTableScores";

	// Get all scores from localStorage
	getAllScores(): Record<string, ScoreAttempt[]> {
		try {
			const scores = localStorage.getItem(this.storageKey);
			return scores ? JSON.parse(scores) : {};
		} catch (error) {
			console.error("Error reading scores from localStorage:", error);
			return {};
		}
	}

	// Save a score for a specific program
	saveScore(
		difficulty: string,
		programIndex: number,
		correct: number,
		total: number,
	): boolean {
		try {
			const scores = this.getAllScores();
			const key = `${difficulty}-${programIndex}`;

			if (!scores[key]) {
				scores[key] = [];
			}

			// Add the new score with timestamp
			scores[key].push({
				correct,
				total,
				percentage: Math.round((correct / total) * 100),
				timestamp: new Date().toISOString(),
			});

			// Keep only the last 5 attempts
			if (scores[key].length > 5) {
				scores[key] = scores[key].slice(-5);
			}

			localStorage.setItem(this.storageKey, JSON.stringify(scores));
			return true;
		} catch (error) {
			console.error("Error saving score to localStorage:", error);
			return false;
		}
	}

	// Get display text and styling for a program's score
	getScoreDisplay(difficulty: string, programIndex: number): ScoreDisplay {
		const scores = this.getAllScores();
		const key = `${difficulty}-${programIndex}`;
		const attempts = scores[key];

		if (!attempts || attempts.length === 0) {
			return {
				text: "Not attempted",
				className: "score-none",
			};
		}

		// Get the best attempt
		const bestAttempt = attempts.reduce((best, current) =>
			current.percentage > best.percentage ? current : best,
		);

		const percentage = bestAttempt.percentage;
		let className = "";
		let text = "";

		if (percentage === 100) {
			className = "score-perfect";
			text = `${percentage}% ⭐`;
		} else if (percentage >= 80) {
			className = "score-good";
			text = `${percentage}% 👍`;
		} else if (percentage >= 60) {
			className = "score-okay";
			text = `${percentage}% 👌`;
		} else if (percentage >= 40) {
			className = "score-poor";
			text = `${percentage}% 😐`;
		} else {
			className = "score-bad";
			text = `${percentage}% 😞`;
		}

		return { text, className };
	}

	// Get the best score for a program
	getBestScore(difficulty: string, programIndex: number): ScoreAttempt | null {
		const scores = this.getAllScores();
		const key = `${difficulty}-${programIndex}`;
		const attempts = scores[key];

		if (!attempts || attempts.length === 0) {
			return null;
		}

		return attempts.reduce((best, current) =>
			current.percentage > best.percentage ? current : best,
		);
	}

	// Get overall statistics calculated from best scores
	getOverallStats() {
		const allScores = this.getAllScores();
		let totalBestPoints = 0;
		let totalPossiblePoints = 0;
		let programsAttempted = 0;

		for (const [_, attempts] of Object.entries(allScores)) {
			if (attempts.length > 0) {
				programsAttempted++;
				// Find the best attempt for this program
				const bestAttempt = attempts.reduce((best, current) =>
					current.correct > best.correct ? current : best,
				);
				totalBestPoints += bestAttempt.correct;
				totalPossiblePoints += bestAttempt.total;
			}
		}

		return {
			totalCorrect: totalBestPoints,
			totalQuestions: totalPossiblePoints,
			totalAttempts: programsAttempted,
			percentage:
				totalPossiblePoints > 0
					? Math.round((totalBestPoints / totalPossiblePoints) * 100)
					: 0,
		};
	}

	// Clear all scores
	clearAllScores(): void {
		try {
			localStorage.removeItem(this.storageKey);
		} catch (error) {
			console.error("Error clearing scores:", error);
		}
	}

	// Get recent attempts (for showing history)
	getRecentAttempts(limit = 10): Array<ScoreAttempt & { programKey: string }> {
		const allScores = this.getAllScores();
		const recentAttempts: Array<ScoreAttempt & { programKey: string }> = [];

		for (const [programKey, attempts] of Object.entries(allScores)) {
			attempts.forEach((attempt) => {
				recentAttempts.push({ ...attempt, programKey });
			});
		}

		// Sort by timestamp (newest first) and limit
		return recentAttempts
			.sort(
				(a, b) =>
					new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
			)
			.slice(0, limit);
	}
}
