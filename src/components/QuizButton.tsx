import { forwardRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type QuizButtonVariant =
	| "answer" // Multiple choice answer buttons
	| "answer-selected" // Selected answer (feedback state)
	| "answer-correct" // Correct answer highlight
	| "answer-incorrect" // Incorrect answer highlight
	| "action" // Next Question, Show Hints, etc.
	| "mode" // Tab/mode selection buttons
	| "mode-active" // Active tab/mode
	| "selection" // Program/item selection buttons
	| "primary" // Main call-to-action
	| "secondary" // Secondary actions
	| "destructive" // Destructive actions
	| "menu"; // Menu actions

export type QuizButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface QuizButtonProps {
	variant?: QuizButtonVariant;
	size?: QuizButtonSize;
	children: ReactNode;
	shortcut?: string | number;
	disabled?: boolean;
	className?: string;
	onClick?: () => void;
}

export type { QuizButtonProps };

const buttonVariants = {
	// Answer buttons - core quiz interaction
	answer: `
    relative py-3 sm:py-4 px-6 sm:px-12 text-base sm:text-lg font-semibold rounded-lg border-2 
    bg-gray-50 text-gray-800 border-gray-300
    hover:bg-button-primary hover:text-white hover:border-button-primary
    hover:transform hover:-translate-y-1 hover:shadow-md
    transition-all duration-200 shadow-sm
  `,
	"answer-selected": `
    relative py-3 sm:py-4 px-6 sm:px-12 text-base sm:text-lg font-semibold rounded-lg border-2 
    bg-button-primary text-white border-button-primary shadow-lg
    transition-all duration-200
  `,
	"answer-correct": `
    relative py-3 sm:py-4 px-6 sm:px-12 text-base sm:text-lg font-semibold rounded-lg border-2 
    bg-green-500 text-white border-green-600 shadow-lg
    transition-all duration-200
  `,
	"answer-incorrect": `
    relative py-3 sm:py-4 px-6 sm:px-12 text-base sm:text-lg font-semibold rounded-lg border-2 
    bg-red-500 text-white border-red-600 shadow-lg
    transition-all duration-200
  `,

	// Action buttons - Next Question, hints, etc.
	action: `
    px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 shadow-lg
    bg-action-button-bg hover:bg-action-button-bg-hover
    text-action-button-text hover:shadow-xl transform hover:-translate-y-1
  `,

	// Mode/Tab buttons
	mode: `
    px-6 py-2 font-medium rounded-md transition-all duration-200
    bg-gray-100 text-gray-700 border border-gray-300
    hover:bg-gray-200 hover:text-gray-900
  `,
	"mode-active": `
    px-6 py-2 font-medium rounded-md transition-all duration-200
    bg-button-primary text-white border border-button-primary shadow-sm
  `,

	// Selection buttons - for program selection, etc.
	selection: `
    px-4 py-2 font-medium rounded-md transition-all duration-200
    bg-button-primary hover:bg-button-primary-hover
    text-white shadow-sm hover:shadow-md
  `,

	// Standard buttons
	primary: `
    px-6 py-3 font-semibold rounded-lg transition-all duration-200
    bg-button-primary hover:bg-button-primary-hover
    text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1
  `,
	secondary: `
    px-6 py-3 font-medium rounded-lg transition-all duration-200
    bg-orange-500 hover:bg-orange-600
    text-white shadow-md hover:shadow-lg
  `,
	destructive: `
    px-6 py-3 font-medium rounded-lg transition-all duration-200
    bg-red-500 hover:bg-red-600
    text-white shadow-md hover:shadow-lg
  `,
	menu: `
    px-3 sm:px-6 py-3 sm:py-6 text-sm sm:text-base font-semibold rounded-lg transition-all duration-200
    bg-gray-100 hover:bg-gray-200
    text-gray-800 shadow-md hover:shadow-lg
  `,
};

const sizeVariants = {
	xs: "min-h-[30px] text-xs",
	sm: "min-h-[40px] text-sm",
	md: "min-h-[48px] text-base",
	lg: "min-h-[60px] text-lg",
	xl: "min-h-[72px] text-xl",
};

const shortcutVariants: Partial<Record<QuizButtonVariant, string>> = {
	answer:
		"absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-sm bg-button-primary text-white",
	"answer-selected":
		"absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-sm bg-white text-button-primary",
	"answer-correct":
		"absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-sm bg-white text-green-600",
	"answer-incorrect":
		"absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-sm bg-white text-red-600",
};

export const QuizButton = forwardRef<HTMLButtonElement, QuizButtonProps>(
	(
		{
			variant = "primary",
			size = "md",
			children,
			shortcut,
			disabled,
			className,
			onClick,
			...props
		},
		ref,
	) => {
		const baseClasses = buttonVariants[variant];
		const sizeClasses = sizeVariants[size];
		const showShortcut = shortcut && variant.startsWith("answer");
		const shortcutClasses = showShortcut
			? shortcutVariants[variant] || shortcutVariants.answer || ""
			: "";

		return (
			<Button
				ref={ref}
				className={cn(
					baseClasses,
					sizeClasses,
					disabled && "cursor-not-allowed opacity-60",
					showShortcut && "flex items-center justify-center",
					className,
				)}
				disabled={disabled}
				onClick={onClick}
				{...props}
			>
				{showShortcut && <span className={shortcutClasses}>{shortcut}</span>}
				{children}
			</Button>
		);
	},
);

QuizButton.displayName = "QuizButton";
