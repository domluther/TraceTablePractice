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
export function QuizLayout({
	children,
	title,
	subtitle,
	scoreButton,
	titleIcon = "🦆",
}: QuizLayoutProps) {
	return (
		<div
			className="min-h-screen p-5 flex items-center justify-center"
			style={{
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
			}}
		>
			<div
				className="w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden"
				style={{
					borderRadius: "12px",
					boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
				}}
			>
				<Header
					scoreButton={scoreButton}
					title={`${titleIcon} ${title} ${titleIcon}`}
					subtitle={subtitle}
				/>
				<main className="p-8">
					<div className="mx-auto">{children}</div>
				</main>
				<footer
					className="text-center text-sm border-t"
					style={{
						background: "#2d3748",
						color: "#e2e8f0",
						padding: "15px 30px",
						borderTop: "1px solid #4a5568",
					}}
				>
					Copyright{" "}
					<a
						href="https://mrluthercodes.netlify.app/"
						target="_blank"
						rel="noopener noreferrer"
						className="underline transition-colors duration-200 hover:brightness-150"
						style={{
							color: "#90cdf4",
						}}
					>
						Mr Luther
					</a>{" "}
					2025
				</footer>
			</div>
		</div>
	);
}
