import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { QuizLayout, SimpleQuizBody } from "@/components";
import { HintPanel } from "@/components/HintPanel";
import { QuizButton } from "@/components/QuizButton";
import { ScoreButton } from "@/components/ScoreButton";
import { StatsModal } from "@/components/StatsModal";
import { useQuizLogic } from "@/hooks/useQuizLogic";
import type { AddressType } from "@/lib/addressGenerator";
import { generateRandomAddress } from "@/lib/addressGenerator";
import { ScoreManager } from "@/lib/scoreManager";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const Route = createFileRoute("/")({
	component: Index,
});

// Define question type for our quiz
interface NetworkAddressQuestion {
	address: string;
	type: AddressType;
	invalidType?: string;
	invalidReason?: string;
}

// Quiz answer options
const QUIZ_ANSWERS = [
	{ id: 1, text: "IPv4", shortcut: "1" },
	{ id: 2, text: "IPv6", shortcut: "2" },
	{ id: 3, text: "MAC", shortcut: "3" },
	{ id: 4, text: "None", shortcut: "4" },
];

// Map answer IDs to address types
const ANSWER_TO_TYPE: Record<number, AddressType> = {
	1: "IPv4",
	2: "IPv6",
	3: "MAC",
	4: "none",
};

function Index() {
	// Site configuration
	const siteConfig = SITE_CONFIG;

	// Score manager
	const [scoreManager] = useState(
		() => new ScoreManager(siteConfig.siteKey, siteConfig.scoring.customLevels),
	);

	// Quiz state - Network Address specific
	const [currentQuestion, setCurrentQuestion] =
		useState<NetworkAddressQuestion | null>(null);
	const [showStatsModal, setShowStatsModal] = useState(false);
	const [showHints, setShowHints] = useState(false);

	// Quiz state management using reusable hook
	const quizLogic = useQuizLogic({
		scoreManager,
		onQuestionGenerate: () => {
			// Generate new Network Address question when needed
			const addressData = generateRandomAddress();
			setCurrentQuestion({
				address: addressData.address,
				type: addressData.type,
				invalidType: addressData.invalidType,
				invalidReason: addressData.invalidReason,
			});
		},
		// Network Address scoring: 100 points per correct answer
		correctPoints: 100,
		maxPoints: 100,
	});

	// Extract state for UI components
	const { overallStats } = quizLogic;

	/**
	 * Site-specific customization functions for Network Address Practice
	 * These functions define the unique behavior for this quiz type
	 */

	// Generate initial question (hook handles subsequent ones via onQuestionGenerate)
	const generateNewQuestion = useCallback(() => {
		const addressData = generateRandomAddress();
		setCurrentQuestion({
			address: addressData.address,
			type: addressData.type,
			invalidType: addressData.invalidType,
			invalidReason: addressData.invalidReason,
		});
	}, []);

	/**
	 * Renders a network address question with distinctive styling
	 * Uses monospace font and gradient background for address visibility
	 */
	const questionRenderer = useCallback(
		(question: NetworkAddressQuestion) => (
			<div className="font-mono text-2xl sm:text-3xl text-center p-6 sm:p-8 bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 text-white rounded-xl border-3 border-indigo-600 shadow-lg font-semibold tracking-wider break-all">
				{question.address}
			</div>
		),
		[],
	);

	/**
	 * Determines if the selected answer matches the correct address type
	 * Maps answer IDs to address types for validation
	 */
	const isCorrectAnswer = useCallback(
		(answerId: number, question: NetworkAddressQuestion) => {
			const selectedType = ANSWER_TO_TYPE[answerId];
			return selectedType === question.type;
		},
		[],
	);

	/**
	 * Generates contextual feedback messages based on answer correctness
	 * Provides specific explanations for each address type and invalid addresses
	 */
	const generateFeedback = useCallback(
		(
			isCorrect: boolean,
			_answerId: number, // Unused in Network Address logic
			question: NetworkAddressQuestion,
		) => {
			let message: string;
			let explanation: string | undefined;

			if (isCorrect) {
				if (question.type === "none") {
					message = "Correct! This is an invalid address. 🎉";
					explanation = question.invalidReason
						? `This ${question.invalidType || "address"} ${question.invalidReason}.`
						: `This is an invalid ${question.invalidType || "address"}.`;
				} else {
					const article =
						question.type === "IPv4" || question.type === "IPv6" ? "an" : "a";
					message = `Correct! This is ${article} ${question.type} address. 🎉`;
					explanation = `Great job identifying the ${question.type} format!`;
				}
			} else {
				message = "Incorrect. Try again! ❌";
				if (question.type === "none") {
					explanation = question.invalidReason
						? `This is actually an invalid ${question.invalidType || "address"}. It ${question.invalidReason}.`
						: `This is actually an invalid ${question.invalidType || "address"}.`;
				} else {
					const article =
						question.type === "IPv4" || question.type === "IPv6" ? "an" : "a";
					explanation = `This is actually ${article} ${question.type} address.`;
				}
			}

			return { message, explanation };
		},
		[],
	);

	// Initialize first question when component mounts
	useEffect(() => {
		generateNewQuestion();
	}, [generateNewQuestion]);

	// Help section with toggleable address format reference
	const helpSection = (
		<div className="bg-gray-50 rounded-lg p-6 border-l-4 border-green-500">
			<h2 className="text-xl font-semibold mb-4 text-gray-800">Need Help?</h2>
			<QuizButton variant="secondary" onClick={() => setShowHints(!showHints)}>
				{showHints ? "Hide" : "Show"} Address Format Rules
			</QuizButton>
			<HintPanel
				isVisible={showHints}
				title="📝 Address Format Rules:"
				items={siteConfig.hints || []}
			/>
		</div>
	);

	return (
		<QuizLayout
			title={siteConfig.title}
			subtitle={siteConfig.subtitle}
			titleIcon={siteConfig.icon}
			scoreButton={
				<ScoreButton
					levelEmoji={overallStats.level.emoji}
					levelTitle={overallStats.level.title}
					points={overallStats.totalPoints}
					onClick={() => setShowStatsModal(true)}
				/>
			}
		>
			{/* Network Address Practice Quiz Interface */}
			<SimpleQuizBody
				quizLogic={quizLogic}
				currentQuestion={currentQuestion}
				answers={QUIZ_ANSWERS}
				questionRenderer={questionRenderer}
				isCorrectAnswer={isCorrectAnswer}
				generateFeedback={generateFeedback}
				title="IP or MAC?"
				showStreakEmojis={true}
				helpSection={helpSection}
			/>

			<StatsModal
				isOpen={showStatsModal}
				onClose={() => setShowStatsModal(false)}
				scoreManager={scoreManager}
				title="Your Network Mastery"
			/>
		</QuizLayout>
	);
}
