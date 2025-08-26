import type { ReactNode } from "react";
import { Header } from "@/components/Header";

interface QuizLayoutProps {
	/** The main content area of the quiz */
	children: ReactNode;
	/** Title displayed in the header */
	title: string;
	/** Subtitle/description displayed in the header */
	subtitle: string;
	/** Optional score button component for header */
	scoreButton?: ReactNode;
	/** Optional icon/emoji for the title */
	titleIcon?: string;
}

/**
 * Reusable layout component for GCSE CS practice sites
 * Provides consistent header, navigation, and content structure
 */
export function QuizLayout({
	children,
	title,
	subtitle,
	scoreButton,
	titleIcon = "🦆",
}: QuizLayoutProps) {
	return (
		<>
			<Header
				scoreButton={scoreButton}
				title={`${titleIcon} ${title} ${titleIcon}`}
				subtitle={subtitle}
			/>
			<main className="bg-white p-6">
				<div className="mx-auto">{children}</div>
			</main>
		</>
	);
}
