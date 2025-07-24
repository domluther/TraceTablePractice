/**
 * Score Manager for GCSE CS Practice Sites
 * Handles scoring, levels, and progress tracking across all sites
 * Duck-themed level system for consistent branding
 */

class ScoreManager {
    constructor(siteKey = 'template-site') {
        this.siteKey = siteKey; // Unique identifier for this site's scores
        this.storageKey = `gcse-cs-scores-${this.siteKey}`;
        this.scores = this.loadScores();
        
        // Duck-themed level system (points will vary by site)
        this.levels = [
            { emoji: '🥚', title: 'Egg', description: 'Just starting out', minPoints: 0 },
            { emoji: '🐣', title: 'Hatchling', description: 'Taking your first steps', minPoints: 50 },
            { emoji: '🐤', title: 'Duckling', description: 'Learning the basics', minPoints: 150 },
            { emoji: '🦆', title: 'Duck', description: 'Swimming along nicely', minPoints: 300 },
            { emoji: '🦢', title: 'Swan', description: 'Graceful and skilled', minPoints: 500 },
            { emoji: '🦅', title: 'Eagle', description: 'Soaring to new heights', minPoints: 750 },
            { emoji: '👑', title: 'Duck King/Queen', description: 'Master of the pond!', minPoints: 1000 }
        ];
    }

    loadScores() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.warn('Error loading scores:', error);
            return {};
        }
    }

    saveScores() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
        } catch (error) {
            console.warn('Error saving scores:', error);
        }
    }

    recordScore(itemKey, score, maxScore = 100) {
        const percentage = Math.round((score / maxScore) * 100);
        
        if (!this.scores[itemKey]) {
            this.scores[itemKey] = {
                attempts: 0,
                bestScore: 0,
                totalScore: 0
            };
        }

        this.scores[itemKey].attempts++;
        this.scores[itemKey].totalScore += percentage;
        
        if (percentage > this.scores[itemKey].bestScore) {
            this.scores[itemKey].bestScore = percentage;
        }

        this.saveScores();
        this.updateScoreButton();
    }

    getScore(itemKey) {
        return this.scores[itemKey] || { attempts: 0, bestScore: 0, totalScore: 0 };
    }

    getScoreDisplay(itemKey) {
        const score = this.getScore(itemKey);
        if (score.attempts === 0) {
            return { text: 'Not Attempted', className: 'score-na' };
        }

        const best = score.bestScore;
        let className = 'score-poor';
        
        if (best >= 90) className = 'score-excellent';
        else if (best >= 70) className = 'score-good';
        else if (best >= 50) className = 'score-fair';

        return { text: `${best}%`, className };
    }

    getTotalPoints() {
        return Object.values(this.scores).reduce((total, score) => {
            return total + score.bestScore;
        }, 0);
    }

    getCurrentLevel() {
        const points = this.getTotalPoints();
        let currentLevel = this.levels[0];
        
        for (const level of this.levels) {
            if (points >= level.minPoints) {
                currentLevel = level;
            } else {
                break;
            }
        }
        
        return currentLevel;
    }

    getNextLevel() {
        const currentLevel = this.getCurrentLevel();
        const currentIndex = this.levels.indexOf(currentLevel);
        return currentIndex < this.levels.length - 1 ? this.levels[currentIndex + 1] : null;
    }

    updateScoreButton() {
        const button = document.getElementById('scoreButton');
        if (!button) return;

        const totalAttempts = Object.values(this.scores).reduce((sum, score) => sum + score.attempts, 0);
        const totalPoints = this.getTotalPoints();
        const averageScore = totalAttempts > 0 ? Math.round(totalPoints / totalAttempts) : 0;

        button.textContent = `📊 Scores (${averageScore}%)`;

        // Update button class based on performance
        button.className = 'score-button';
        if (averageScore >= 90) button.classList.add('excellent');
        else if (averageScore >= 70) button.classList.add('good');
        else if (averageScore >= 50) button.classList.add('fair');
        else if (totalAttempts > 0) button.classList.add('needs-work');
    }

    showScoreModal() {
        const modal = document.getElementById('scoreModal');
        if (!modal) return;

        this.populateScoreModal();
        modal.style.display = 'flex';
        
        // Add click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideScoreModal();
            }
        });
    }

    hideScoreModal() {
        const modal = document.getElementById('scoreModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    populateScoreModal() {
        this.populateOverallStats();
        this.populateIndividualScores();
    }

    populateOverallStats() {
        const statGrid = document.getElementById('statGrid');
        if (!statGrid) return;

        const totalAttempts = Object.values(this.scores).reduce((sum, score) => sum + score.attempts, 0);
        const totalPoints = this.getTotalPoints();
        const averageScore = totalAttempts > 0 ? Math.round(totalPoints / totalAttempts) : 0;
        const currentLevel = this.getCurrentLevel();

        statGrid.innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${totalAttempts}</div>
                <div class="stat-label">Total Attempts</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${averageScore}%</div>
                <div class="stat-label">Average Score</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${totalPoints}</div>
                <div class="stat-label">Total Points</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${currentLevel.emoji}</div>
                <div class="stat-label">${currentLevel.title}</div>
            </div>
        `;
    }

    populateIndividualScores() {
        const programList = document.getElementById('programList');
        const noScores = document.getElementById('noScores');
        if (!programList || !noScores) return;

        const scoreEntries = Object.entries(this.scores);
        
        if (scoreEntries.length === 0) {
            programList.style.display = 'none';
            noScores.style.display = 'block';
            return;
        }

        programList.style.display = 'block';
        noScores.style.display = 'none';

        programList.innerHTML = scoreEntries.map(([key, score]) => {
            const displayScore = this.getScoreDisplay(key);
            return `
                <div class="program-item">
                    <div class="program-info">
                        <div class="program-name">${this.formatItemName(key)}</div>
                        <div class="program-details">${score.attempts} attempts • Average: ${Math.round(score.totalScore / score.attempts)}%</div>
                    </div>
                    <div class="program-score ${displayScore.className}">${displayScore.text}</div>
                </div>
            `;
        }).join('');
    }

    formatItemName(key) {
        // Convert key to readable name (override in site-specific implementations)
        return key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    resetAllScores() {
        if (confirm('Are you sure you want to reset all scores? This cannot be undone.')) {
            this.scores = {};
            this.saveScores();
            this.updateScoreButton();
            this.populateScoreModal();
        }
    }

    // Method to enable score system display
    enableScoreSystem() {
        const scoreButton = document.querySelector('.score-button');
        const levelInfo = document.querySelector('.level-info');
        
        if (scoreButton) scoreButton.style.display = 'block';
        if (levelInfo) levelInfo.style.display = 'block';
        
        this.updateScoreButton();
    }

    // Method to disable score system display
    disableScoreSystem() {
        const scoreButton = document.querySelector('.score-button');
        const levelInfo = document.querySelector('.level-info');
        
        if (scoreButton) scoreButton.style.display = 'none';
        if (levelInfo) levelInfo.style.display = 'none';
    }
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScoreManager;
}
