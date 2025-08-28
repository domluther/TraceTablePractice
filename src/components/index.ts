/**
 * GCSE CS Reusable Component Library
 * Export all reusable components for easy importing
 */

export { Footer } from "./Footer";
export { Header } from "./Header";
export type { HintItem } from "./HintPanel";
export { HintPanel } from "./HintPanel";
export { ProgramSelector } from "./ProgramSelector";
export type {
	QuizButtonProps,
	QuizButtonSize,
	QuizButtonVariant,
} from "./QuizButton";
export { QuizButton } from "./QuizButton";
// Layout Components
export { QuizLayout } from "./QuizLayout";
// Utility Components
export { ScoreButton } from "./ScoreButton";
export type { QuizAnswer } from "./SimpleQuizBody";
// Quiz Body Components
export { SiteNavigation } from "./SiteNavigation";
// Modal Components
export { StatsModal } from "./StatsModal";
export { TraceTableBody } from "./TraceTableBody";

/**
 * Usage Example:
 *
 * import {
 *   QuizLayout,
 *   SimpleQuizBody,
 *   StatsModal,
 *   QuizButton,
 *   ScoreButton,
 *   HintPanel,
 *   Header,
 *   Footer
 * } from "@/components";
 */
