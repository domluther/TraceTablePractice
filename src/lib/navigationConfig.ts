/**
 * Global Navigation Configuration for GCSE CS Practice Sites
 *
 * This file contains the navigation menu that appears across all GCSE CS sites.
 * It's separated from siteConfig.ts because navigation is global, not site-specific.
 */

export interface NavMenuItem {
	title: string;
	description: string;
	url: string;
	id: string;
	keywords: string[];
}

/**
 * Global GCSE CS navigation menu
 * This appears in the dropdown navigation across all sites
 */
export const GCSE_NAVIGATION_MENU: NavMenuItem[] = [
	{
		title: "1.2 - Data Units",
		description: "Convert units and calculate file sizes",
		url: "https://convertdataunits.netlify.app/",
		id: "data-units",
		keywords: ["convertdataunits", "data", "units"],
	},
	{
		title: "1.3 - Network Addresses",
		description: "Identify IP addresses and MAC addresses",
		url: "https://ipormac.netlify.app/",
		id: "network-addresses",
		keywords: ["ipormac", "network", "ip", "mac"],
	},
	{
		title: "2.1 - Sorting Algorithms",
		description: "Visualize bubble, merge & insertion sorts",
		url: "https://ocrsortvisualiser.netlify.app/",
		id: "sort-algorithms",
		keywords: ["ocrsortvisualiser", "sort", "algorithm"],
	},
	{
		title: "2.1 - Trace Tables",
		description: "Visualize trace tables for algorithms",
		url: "https://ocrtracetables.netlify.app/",
		id: "trace-tables",
		keywords: ["ocrtracetables", "trace", "table"],
	},
	{
		title: "2.2 - Programming Practice",
		description: "Input/output and basic programming concepts",
		url: "https://input-output-practice.netlify.app/",
		id: "programming-practice",
		keywords: ["input-output-practice", "programming"],
	},
	{
		title: "2.4 - Boolean Algebra",
		description: "Logic gates and Boolean expressions",
		url: "https://booleanalgebrapractice.netlify.app/",
		id: "boolean-algebra",
		keywords: ["booleanalgebrapractice", "boolean", "logic"],
	},
];

/**
 * Detect current site from URL by checking navigation keywords
 */
export function detectCurrentSite(): string {
	const hostname = window.location.hostname.toLowerCase();
	const url = window.location.href.toLowerCase();

	// Check each navigation item's keywords
	for (const navItem of GCSE_NAVIGATION_MENU) {
		for (const keyword of navItem.keywords) {
			if (hostname.includes(keyword) || url.includes(keyword)) {
				return navItem.id;
			}
		}
	}

	return "network-addresses"; // Default fallback
}
