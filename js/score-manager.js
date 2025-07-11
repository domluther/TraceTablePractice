// Score management module for tracking user progress

export class ScoreManager {
    constructor() {
        this.storageKey = 'traceTableScores';
    }

    // Get all scores from localStorage (persists across browser sessions)
    getAllScores() {
        try {
            const scores = localStorage.getItem(this.storageKey);
            return scores ? JSON.parse(scores) : {};
        } catch (error) {
            console.error('Error reading scores from localStorage:', error);
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
                timestamp: new Date().toISOString()
            });
            
            // Keep only the last 5 attempts
            if (scores[key].length > 5) {
                scores[key] = scores[key].slice(-5);
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(scores));
            return true;
        } catch (error) {
            console.error('Error saving score to localStorage:', error);
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
            return { text: 'N/A', className: 'score-na' };
        }
        
        const { correct, total, percentage } = score;
        const text = `${correct}/${total}`;
        
        let className;
        if (percentage >= 80) {
            className = 'score-excellent';
        } else if (percentage >= 60) {
            className = 'score-good';
        } else {
            className = 'score-poor';
        }
        
        return { text, className };
    }

    // Clear all scores (for testing or reset)
    clearAllScores() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing scores from localStorage:', error);
            return false;
        }
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
        const bestScore = Math.max(...attempts.map(a => a.percentage));
        const averageScore = Math.round(
            attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts
        );
        
        return {
            totalAttempts,
            bestScore,
            averageScore,
            lastAttempt: attempts[attempts.length - 1]
        };
    }
}
