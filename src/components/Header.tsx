import type { ReactNode } from "react";
import { SiteNavigation } from "@/components/SiteNavigation";
import {
	detectCurrentSite,
	GCSE_NAVIGATION_MENU,
} from "@/lib/navigationConfig";

interface HeaderProps {
	scoreButton?: ReactNode;
	title: string;
	subtitle: string;
}

export function Header({ scoreButton, title, subtitle }: HeaderProps) {
	// Auto-detect current site for navigation highlighting
	const currentSiteId = detectCurrentSite();

	return (
		<header className="bg-gradient-to-br from-gray-800 to-gray-900 text-white px-8 py-6 text-center relative">
			<SiteNavigation
				menuItems={GCSE_NAVIGATION_MENU}
				currentSiteId={currentSiteId}
				title="GCSE CS Tools"
				icon="🎓"
			/>
			{scoreButton && (
				<div className="absolute top-4 right-6">{scoreButton}</div>
			)}
			<h1 className="text-4xl font-bold mb-3 drop-shadow-lg">{title}</h1>
			<p className="text-blue-200 text-lg font-light">
				Master tracing OCR ERL algorithms thanks to instant feedback.
			</p>
		</header>
	);
}
