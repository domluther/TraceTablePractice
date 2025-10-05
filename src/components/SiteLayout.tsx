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
 * Updated to match legacy visual styling
 */
export function SiteLayout({
	children,
	title,
	subtitle,
	scoreButton,
	titleIcon = "🦆",
}: QuizLayoutProps) {
	return (
		<>
			<div className="w-full overflow-hidden bg-white shadow-2xl max-w-7xl rounded-xl">
				<Header
					scoreButton={scoreButton}
					title={`${titleIcon} ${title} ${titleIcon}`}
					subtitle={subtitle}
				/>
				<main className="p-4 bg-muted sm:p-6">
					<div className="mx-auto">{children}</div>
				</main>
			</div>
		</>
	);
}
