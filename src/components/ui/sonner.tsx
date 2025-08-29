import { useTheme } from "next-themes";
import type { ToasterProps } from "sonner";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			style={
				{
					"--normal-bg":
						"color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
					"--normal-text":
						"light-dark(var(--color-green-600), var(--color-green-400))",
					"--normal-border":
						"light-dark(var(--color-green-600), var(--color-green-400))",
					"--width": "300px",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
