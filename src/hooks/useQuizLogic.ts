import { useCallback, useState } from "react";
import type { ScoreManager } from "@/lib/scoreManager";

export interface UseQuizLogicProps {
	scoreManager: ScoreManager;
	onQuestionGenerate: () => void;
	/** Points awarded for correct answers (default: 100) */
	correctPoints?: number;
	/** Maximum possible points per question (default: 100) */
	maxPoints?: number;
}

export interface QuizFeedback {
	isCorrect: boolean;
	message: string;
	explanation?: string;
}

/**
 * Shared quiz logic hook for all GCSE CS practice sites
 * Handles common functionality like streaks, feedback, keyboard shortcuts
 */
export function useQuizLogic({
	scoreManager,
	onQuestionGenerate,
	correctPoints = 100,
	maxPoints = 100,
}: UseQuizLogicProps) {
	// Core quiz state
	const [streak, setStreak] = useState(() => scoreManager.getStreak());
	const [overallStats, setOverallStats] = useState(() =>
		scoreManager.getOverallStats(),
	);
	const [feedback, setFeedback] = useState<QuizFeedback | null>(null);
	const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);

	// Update overall stats when they change
	const refreshStats = useCallback(() => {
		setOverallStats(scoreManager.getOverallStats());
	}, [scoreManager]);

	// Handle answer selection with scoring
	const handleAnswerSelect = useCallback(
		(answerId: number, isCorrect: boolean, questionData?: unknown) => {
			// Record score with configurable points
			const questionKey = `quiz-${Date.now()}`;
			const earnedPoints = isCorrect ? correctPoints : 0;
			scoreManager.recordScore(
				questionKey,
				earnedPoints,
				maxPoints,
				// Type assertion for questionData properties (safe since it's optional)
				(questionData as { type?: string; address?: string } | undefined)?.type,
				(questionData as { type?: string; address?: string } | undefined)
					?.address,
			);

			// Update streak
			const newStreak = isCorrect ? streak + 1 : 0;
			setStreak(newStreak);
			scoreManager.updateStreak(isCorrect);

			// Update stats
			refreshStats();

			// Store selected answer for UI feedback
			setSelectedAnswerId(answerId);
		},
		[scoreManager, streak, refreshStats, correctPoints, maxPoints],
	);

	// Handle moving to next question
	const handleNextQuestion = useCallback(() => {
		setFeedback(null);
		setSelectedAnswerId(null);
		onQuestionGenerate();
	}, [onQuestionGenerate]);

	// Set feedback (called by parent component with specific feedback)
	const setQuizFeedback = useCallback((newFeedback: QuizFeedback) => {
		setFeedback(newFeedback);
	}, []);

	return {
		// State
		streak,
		overallStats,
		feedback,
		selectedAnswerId,

		// Actions
		handleAnswerSelect,
		handleNextQuestion,
		setFeedback: setQuizFeedback,
		refreshStats,

		// Utilities
		scoreManager,
	};
}
