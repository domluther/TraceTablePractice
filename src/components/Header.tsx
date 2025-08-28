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
		<header className="relative px-8 py-6 text-center text-white bg-gradient-to-br from-gray-800 to-gray-900">
			<SiteNavigation
				menuItems={GCSE_NAVIGATION_MENU}
				currentSiteId={currentSiteId}
				title="GCSE CS Tools"
				icon="🎓"
			/>
			{scoreButton && (
				<div className="absolute z-50 top-4 right-6">{scoreButton}</div>
			)}
			<h1 className="mb-3 text-4xl font-bold drop-shadow-lg">{title}</h1>
			<p className="text-lg font-light text-blue-200">{subtitle}</p>
		</header>
	);
}
