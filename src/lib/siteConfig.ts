import type { HintItem } from "@/components/HintPanel";
import type { LevelInfo } from "@/lib/scoreManager";

/** Configuration interface for GCSE CS practice sites */
export interface SiteConfig {
	/** Unique site identifier for score tracking */
	siteKey: string;
	/** Site title displayed in header */
	title: string;
	/** Site subtitle/description */
	subtitle: string;
	/** Site icon/emoji */
	icon: string;
	/** Scoring configuration */
	scoring: ScoringConfig;
	/** Site-specific hint content for help sections */
	hints?: HintItem[];
}

export interface ScoringConfig {
	/** Points awarded for correct answers */
	pointsPerCorrect: number;
	/** Points deducted for incorrect answers */
	pointsPerIncorrect: number;
	/** Custom level system (optional, falls back to duck levels) */
	customLevels?: LevelInfo[];
}

export interface Level {
	emoji: string;
	title: string;
	description: string;
	minPoints: number;
	minAccuracy: number;
}

/** Network Address Practice site configuration */
export const SITE_CONFIG: SiteConfig = {
	siteKey: "network-addresses",
	title: "Network Address Practice",
	subtitle: "Master the identification of IPv4, IPv6, and MAC addresses",
	icon: "🦆",
	scoring: {
		pointsPerCorrect: 10,
		pointsPerIncorrect: 0,
		customLevels: [
			{
				emoji: "🥚",
				title: "Network Newbie",
				description: "Just hatched into networking!",
				minPoints: 0,
				minAccuracy: 0,
			},
			{
				emoji: "🐣",
				title: "Address Apprentice",
				description: "Taking your first paddle through IP waters!",
				minPoints: 5,
				minAccuracy: 0,
			},
			{
				emoji: "🐤",
				title: "Protocol Paddler",
				description: "Your address recognition is making waves!",
				minPoints: 12,
				minAccuracy: 60,
			},
			{
				emoji: "🦆",
				title: "Network Navigator",
				description: "Swimming confidently through address formats!",
				minPoints: 25,
				minAccuracy: 70,
			},
			{
				emoji: "🦆✨",
				title: "Packet Pond Master",
				description: "Soaring above the subnet with elegant identification!",
				minPoints: 50,
				minAccuracy: 80,
			},
			{
				emoji: "🪿👑",
				title: "Golden Gateway Guru",
				description: "The legendary address whisperer of the network!",
				minPoints: 75,
				minAccuracy: 90,
			},
		],
	},
	hints: [
		{
			title: "IPv4",
			description: "4 decimal numbers (0-255) separated by dots",
			examples: ["Example: 192.168.1.1"],
			color: "blue",
		},
		{
			title: "IPv6",
			description:
				"8 groups of 4 hex digits separated by colons. Groups can be empty or compressed.",
			examples: [
				"Example: 2001:0db8:85a3:0000:0000:8a2e:0370:7334",
				"Compressed: 2001:db8::8a2e:370:7334",
			],
			color: "purple",
		},
		{
			title: "MAC",
			description: "6 pairs of hex digits separated by colons or dashes",
			examples: ["Example: 00:1A:2B:3C:4D:5E or 00-1A-2B-3C-4D-5E"],
			color: "green",
		},
	],
};
