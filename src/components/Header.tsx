import type { ReactNode } from "react";
import {
	detectCurrentSite,
	GCSE_NAVIGATION_MENU,
} from "@/lib/navigationConfig";
import { SiteNavigation } from "./SiteNavigation";

interface HeaderProps {
	scoreButton?: ReactNode;
	title: string;
	subtitle: string;
}

export function Header({ scoreButton, title, subtitle }: HeaderProps) {
	// Auto-detect current site for navigation highlighting
	const currentSiteId = detectCurrentSite();

	return (
		<header className="relative p-4 text-center text-header-text sm:p-6 bg-header/80">
			<SiteNavigation
				menuItems={GCSE_NAVIGATION_MENU}
				currentSiteId={currentSiteId}
				title="GCSE CS Tools"
				icon="🎓"
			/>
			{scoreButton && (
				<div className="absolute top-2 right-2 sm:top-3 sm:right-3 xl:top-5 xl:right-8">
					{scoreButton}
				</div>
			)}
			<h1 className="px-4 mb-2 text-xl font-bold sm:text-2xl lg:text-3xl xl:text-4xl text-shadow">
				{title}
			</h1>
			<p className="px-4 text-sm text-header-subtitle sm:text-base xl:text-lg">
				{subtitle}
			</p>
		</header>
	);
}
