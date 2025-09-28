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
		<nav className="absolute z-50 top-2 left-2 sm:top-3 sm:left-3 xl:top-5 xl:left-8">
			<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						aria-label="Open navigation menu"
						className={cn(
							"flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg",
							"bg-white/10 hover:bg-white/20 backdrop-blur-sm",
							"text-white font-medium transition-all duration-200",
							"border border-white/20 hover:border-white/30",
						)}
					>
						{/* Responsive display */}
						{compact ? (
							<Menu className="w-4 h-4 sm:w-5 sm:h-5" />
						) : (
							<>
								<span className="hidden text-sm lg:block xl:text-base">
									{icon} {title}
								</span>
								<span className="hidden text-sm sm:block lg:hidden">
									{icon}
								</span>
								<Menu className="w-4 h-4 sm:w-5 sm:h-5 lg:hidden" />
							</>
						)}
						<ChevronDown
							className={cn(
								"h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200",
								isOpen && "rotate-180",
							)}
						/>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					className="p-0 w-72 sm:w-80"
					align="start"
					sideOffset={8}
				>
					{/* Header */}
					<div className="p-3 text-xs font-semibold text-center text-white uppercase sm:p-4 sm:text-sm bg-header/90 ">
						Computer Science Practice
					</div>

					{/* Menu Items */}
					<div className="overflow-y-auto">
						{menuItems.map((item) => (
							<DropdownMenuItem key={item.id} asChild className="p-0 m-0">
								<a
									href={item.url}
									className={cn(
										"block p-2 sm:p-3 border-b border-indigo-200 transition-colors",
										"group text-gray-800 cursor-pointer",
										currentSiteId === item.id &&
											"bg-indigo-100 border-l-4 border-l-indigo-500",
									)}
									target="_blank"
									rel="noopener noreferrer"
								>
									<div className="flex flex-col space-y-1">
										<div className="text-base font-bold text-center transition-colors sm:text-lg group-hover:text-indigo-600">
											{item.title}
										</div>
										<div className="text-xs leading-tight text-gray-600 sm:text-sm">
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
