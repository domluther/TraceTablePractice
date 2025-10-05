import type React from "react";

type PanelType = "success" | "warning" | "error" | "info" | "default";

interface PanelProps {
	children: React.ReactNode;
	type?: PanelType;
	className?: string;
}

export function Panel({
	children,
	type = "default",
	className = "",
}: PanelProps) {
	const getBorderColor = (type: PanelType): string => {
		switch (type) {
			case "success":
				return "border-l-stats-accuracy-high";
			case "warning":
				return "border-l-stats-accuracy-medium";
			case "error":
				return "border-l-stats-accuracy-low";
			case "info":
				return "border-l-hint-card-border";
			default:
				return "border-l-stats-accuracy-high";
		}
	};

	return (
		<div
			className={`max-w-full bg-hint-card-code-bg rounded-lg border-l-4 p-4 ${getBorderColor(type)} ${className}`}
		>
			{children}
		</div>
	);
}
