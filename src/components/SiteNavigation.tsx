import { ChevronDown, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NavMenuItem } from "@/lib/navigationConfig";
import { cn } from "@/lib/utils";

interface SiteNavigationProps {
	/** Navigation menu items */
	menuItems: NavMenuItem[];
	/** Current site identifier */
	currentSiteId?: string;
	/** Navigation title */
	title?: string;
	/** Navigation icon */
	icon?: string;
	/** Compact mode for smaller screens */
	compact?: boolean;
}

/**
 * Reusable site navigation component for GCSE CS practice sites
 * Uses shadcn/ui dropdown menu with responsive design
 */
export function SiteNavigation({
	menuItems,
	currentSiteId,
	title = "GCSE CS Tools",
	icon = "🎓",
	compact = false,
}: SiteNavigationProps) {
	const [isOpen, setIsOpen] = useState(false);

	// Close dropdown when clicking outside or on Escape
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setIsOpen(false);
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, []);

	return (
		<nav className="absolute top-3 left-3 xl:top-5 xl:left-8 z-50">
			<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className={cn(
							"flex items-center gap-2 px-4 py-2 rounded-lg",
							"bg-white/10 hover:bg-white/20 backdrop-blur-sm",
							"text-white font-medium transition-all duration-200",
							"border border-white/20 hover:border-white/30",
						)}
					>
						{/* Responsive display */}
						{compact ? (
							<Menu className="h-5 w-5" />
						) : (
							<>
								<span className="hidden xl:block">
									{icon} {title}
								</span>
								<Menu className="xl:hidden h-5 w-5" />
							</>
						)}
						<ChevronDown
							className={cn(
								"h-4 w-4 transition-transform duration-200",
								isOpen && "rotate-180",
							)}
						/>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent className="w-80 p-0" align="start" sideOffset={8}>
					{/* Header */}
					<div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-3 font-semibold uppercase text-sm">
						Computer Science Practice
					</div>

					{/* Menu Items */}
					<div className="max-h-96 overflow-y-auto">
						{menuItems.map((item) => (
							<DropdownMenuItem key={item.id} asChild className="p-0 m-0">
								<a
									href={item.url}
									className={cn(
										"block px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors",
										"group text-gray-800 cursor-pointer",
										currentSiteId === item.id &&
											"bg-indigo-50 border-l-4 border-l-indigo-500",
									)}
									target="_blank"
									rel="noopener noreferrer"
								>
									<div className="flex flex-col space-y-1">
										<div className="font-bold text-lg text-center group-hover:text-indigo-600 transition-colors">
											{item.title}
										</div>
										<div className="text-sm text-gray-600">
											{item.description}
										</div>
									</div>
								</a>
							</DropdownMenuItem>
						))}
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</nav>
	);
}
