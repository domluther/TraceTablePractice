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
				return "border-l-green-500";
			case "warning":
				return "border-l-yellow-500";
			case "error":
				return "border-l-red-500";
			case "info":
				return "border-l-blue-500";
			default:
				return "border-l-green-500";
		}
	};

	return (
		<div
			className={`max-w-full bg-gray-100 rounded-lg border-l-4 p-4 ${getBorderColor(type)} ${className}`}
		>
			{children}
		</div>
	);
}
