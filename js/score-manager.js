// Score management module for tracking user progress

export class ScoreManager {
	constructor() {
		this.storageKey = "traceTableScores";
		this.overallKey = "traceTableOverallStats";
		this.init();
	}

	init() {
		// Overall stats are now calculated from individual program scores
		this.updateScoreDisplay();
	}

	// Get overall statistics - now calculated from best scores
	getOverallStats() {
		return this.calculateOverallStats();
	}

	// Calculate overall statistics from best scores of each program
	calculateOverallStats() {
		try {
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
			};
		} catch (error) {
			console.error("Error calculating overall stats:", error);
			return { totalCorrect: 0, totalQuestions: 0, totalAttempts: 0 };
		}
	}

	// Reset overall statistics (no longer needed since we calculate from best scores)
	resetOverallStats() {
		// No longer needed - overall stats are calculated from individual program scores
		this.updateScoreDisplay();
	}

	// Get all scores from localStorage (persists across browser sessions)
	getAllScores() {
		try {
			const scores = localStorage.getItem(this.storageKey);
			return scores ? JSON.parse(scores) : {};
		} catch (error) {
			console.error("Error reading scores from localStorage:", error);
			return {};
		}
	}

	// Save a score for a specific program
	saveScore(difficulty, programIndex, correct, total) {
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

			this.updateScoreDisplay();

			return true;
		} catch (error) {
			console.error("Error saving score to localStorage:", error);
			return false;
		}
	}

	// Get the latest score for a specific program
	getLatestScore(difficulty, programIndex) {
		const scores = this.getAllScores();
		const key = `${difficulty}-${programIndex}`;

		if (scores[key] && scores[key].length > 0) {
			return scores[key][scores[key].length - 1];
		}

		return null;
	}

	// Get formatted score display text
	getScoreDisplay(difficulty, programIndex) {
		const score = this.getLatestScore(difficulty, programIndex);

		if (!score) {
			return { text: "N/A", className: "score-na" };
		}

		const { correct, total, percentage } = score;
		const text = `${correct}/${total}`;

		let className;
		if (percentage >= 80) {
			className = "score-excellent";
		} else if (percentage >= 60) {
			className = "score-good";
		} else {
			className = "score-poor";
		}

		return { text, className };
	}

	// Clear all scores (for testing or reset)
	clearAllScores() {
		if (
			confirm(
				"Are you sure you want to reset ALL scores? This cannot be undone.",
			)
		) {
			try {
				localStorage.removeItem(this.storageKey);
				// No need to reset overall stats since they're calculated from individual scores
				alert("All scores have been reset!");
				this.updateScoreDisplay();

				// If modal is open, refresh its content
				const modal = document.querySelector(".score-modal-overlay");
				if (modal) {
					this.closeModal();
					setTimeout(() => this.showScoreModal(), 100); // Small delay to ensure smooth transition
				}

				return true;
			} catch (error) {
				console.error("Error clearing scores from localStorage:", error);
				return false;
			}
		}
		return false;
	}

	// Update the score display in the UI
	updateScoreDisplay() {
		const scoreButton = document.getElementById("scoreButton");
		if (scoreButton) {
			const stats = this.getOverallStats();
			const levelInfo = this.getLevelInfo(stats.totalCorrect);

			// Show level and points
			scoreButton.innerHTML = `${levelInfo.current.emoji} ${levelInfo.current.title} (${stats.totalCorrect} pts)`;

			// Add color coding based on level
			scoreButton.className = "score-button";
			switch (levelInfo.levelNumber) {
				case 0:
					scoreButton.classList.add("level-newcomer");
					break;
				case 1:
					scoreButton.classList.add("level-duckling");
					break;
				case 2:
					scoreButton.classList.add("level-quack");
					break;
				case 3:
					scoreButton.classList.add("level-dynasty");
					break;
				case 4:
					scoreButton.classList.add("level-mallard");
					break;
				case 5:
					scoreButton.classList.add("level-golden");
					break;
			}
		}
	}

	// Close the score modal
	closeModal() {
		const modal = document.querySelector(".score-modal-overlay");
		if (modal) {
			modal.remove();
		}
	}

	// Show the score modal
	showScoreModal() {
		const modal = this.createScoreModal();
		document.body.appendChild(modal);
	}

	// Create the score modal
	createScoreModal() {
		const modal = document.createElement("div");
		modal.className = "score-modal-overlay";
		modal.innerHTML = `
            <div class="score-modal">
                <div class="score-modal-header">
                    <h2>🏆 Your Progress</h2>
                    <button class="close-modal" onclick="window.scoreManager.closeModal()">×</button>
                </div>
                <div class="score-modal-content">
                    ${this.generateScoreHTML()}
                </div>
                <div class="score-modal-footer">
                    <button class="reset-scores-btn" onclick="window.scoreManager.clearAllScores()">🔄 Reset All Scores</button>
                    <button class="close-modal-btn" onclick="window.scoreManager.closeModal()">Close</button>
                </div>
            </div>
        `;

		// Close on background click
		modal.addEventListener("click", (e) => {
			if (e.target === modal) {
				this.closeModal();
			}
		});

		return modal;
	}

	// Generate HTML for the score modal
	generateScoreHTML() {
		const overall = this.getOverallStats();
		const levelInfo = this.getLevelInfo(overall.totalCorrect);
		const percentage =
			overall.totalQuestions > 0
				? Math.round((overall.totalCorrect / overall.totalQuestions) * 100)
				: 0;

		let html = `
            <div class="level-info">
                <div class="current-level">
                    <div class="level-display">
                        <div class="level-emoji">${levelInfo.current.emoji}</div>
                        <div class="level-details">
                            <div class="level-title">${levelInfo.current.title}</div>
                            <div class="level-description">${levelInfo.current.description}</div>
                        </div>
                    </div>
                </div>
        `;

		if (levelInfo.next) {
			const pointsNeeded = Math.max(
				levelInfo.next.threshold - overall.totalCorrect,
				0,
			);
			html += `
                <div class="level-progress">
                    <div class="progress-info">
                        <span>Progress to ${levelInfo.next.emoji} ${levelInfo.next.title}</span>
                        <span>${pointsNeeded} points needed</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${levelInfo.progress}%"></div>
                    </div>
                </div>
            `;
		} else {
			html += `
                <div class="level-maxed">
                    <div class="max-level-message">🎉 Maximum level achieved! You are the master of the pond! 🎉</div>
                </div>
            `;
		}

		html += `</div>`;

		html += `
            <div class="overall-stats">
                <h3>📈 Overall Statistics</h3>
                <div class="stat-grid">
                    <div class="stat-item">
                        <div class="stat-value">${overall.totalCorrect}</div>
                        <div class="stat-label">Best Points Total</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${overall.totalAttempts}</div>
                        <div class="stat-label">Programs Attempted</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${percentage}%</div>
                        <div class="stat-label">Overall Accuracy</div>
                    </div>
                </div>
            </div>
        `;

		// Get individual program scores
		const allScores = this.getAllScores();
		const programStats = [];

		for (const [key, attempts] of Object.entries(allScores)) {
			if (attempts.length > 0) {
				const [difficulty, programIndex] = key.split("-");
				// Find the best attempt for this program
				const bestAttempt = attempts.reduce((best, current) =>
					current.correct > best.correct ? current : best,
				);
				const lastAttempt = attempts[attempts.length - 1];
				const firstAttempt = attempts[0]; // Get first attempt for sorting

				programStats.push({
					key,
					difficulty,
					programIndex: parseInt(programIndex),
					bestCorrect: bestAttempt.correct,
					bestTotal: bestAttempt.total,
					bestPercentage: bestAttempt.percentage,
					attempts: attempts.length,
					lastAttempt: new Date(lastAttempt.timestamp).toLocaleDateString(),
					firstAttemptTime: new Date(firstAttempt.timestamp).getTime(), // For sorting
				});
			}
		}

		if (programStats.length > 0) {
			// Sort by attempt order - first attempted at the top
			programStats.sort((a, b) => a.firstAttemptTime - b.firstAttemptTime);

			html += `
                <div class="program-stats">
                    <h3>📋 Program Scores</h3>
                    <div class="program-list">
            `;

			programStats.forEach((program) => {
				const scoreClass = this.getScoreClass(program.bestPercentage);
				html += `
                    <div class="program-item">
                        <div class="program-info">
                            <div class="program-name">${program.difficulty.charAt(0).toUpperCase() + program.difficulty.slice(1)} Program ${parseInt(program.programIndex) + 1}</div>
                            <div class="program-details">
                                Attempts: ${program.attempts} • Last: ${program.lastAttempt}
                            </div>
                        </div>
                        <div class="program-score ${scoreClass}">${program.bestCorrect}/${program.bestTotal}</div>
                    </div>
                `;
			});

			html += `
                    </div>
                </div>
            `;
		} else {
			html += `
                <div class="no-scores">
                    <p>🎯 No programs completed yet! Start practicing to see your progress here.</p>
                </div>
            `;
		}

		return html;
	}

	// Get CSS class based on score percentage
	getScoreClass(percentage) {
		if (percentage >= 80) return "excellent";
		if (percentage >= 60) return "good";
		if (percentage >= 40) return "fair";
		return "needs-work";
	}

	// Duck-themed level system
	getLevelInfo(points) {
		const levels = [
			{
				threshold: 0,
				title: "Newcomer",
				emoji: "🥚",
				description: "Just hatched!",
			},
			{
				threshold: 10,
				title: "Duckling Debugger",
				emoji: "🐣",
				description: "Taking your first waddle into coding!",
			},
			{
				threshold: 75,
				title: "Quack Coder",
				emoji: "🐤",
				description: "Your code is starting to make some noise!",
			},
			{
				threshold: 200,
				title: "Duck Dynasty Developer",
				emoji: "🦆",
				description: "Swimming confidently through algorithms!",
			},
			{
				threshold: 500,
				title: "Mallard Master",
				emoji: "🦆✨",
				description: "Soaring above the rest with elegant solutions!",
			},
			{
				threshold: 1000,
				title: "Golden Goose Guru",
				emoji: "🪿👑",
				description: "The legendary coder of the pond!",
			},
		];

		// Find the highest level achieved
		let currentLevel = levels[0];
		for (let i = levels.length - 1; i >= 0; i--) {
			if (points >= levels[i].threshold) {
				currentLevel = levels[i];
				break;
			}
		}

		// Calculate progress to next level
		const nextLevelIndex = levels.findIndex(
			(level) => level.threshold > points,
		);
		const nextLevel = nextLevelIndex !== -1 ? levels[nextLevelIndex] : null;
		const progressPercentage = nextLevel
			? Math.round(
					((points - currentLevel.threshold) /
						(nextLevel.threshold - currentLevel.threshold)) *
						100,
				)
			: 100;

		return {
			current: currentLevel,
			next: nextLevel,
			progress: progressPercentage,
			levelNumber: levels.indexOf(currentLevel),
		};
	}

	// Get statistics for a program
	getStats(difficulty, programIndex) {
		const scores = this.getAllScores();
		const key = `${difficulty}-${programIndex}`;

		if (!scores[key] || scores[key].length === 0) {
			return null;
		}

		const attempts = scores[key];
		const totalAttempts = attempts.length;
		const bestScore = Math.max(...attempts.map((a) => a.percentage));
		const averageScore = Math.round(
			attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts,
		);

		return {
			totalAttempts,
			bestScore,
			averageScore,
			lastAttempt: attempts[attempts.length - 1],
		};
	}
}
