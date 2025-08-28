import { type ClassValue, clsx } from "clsx";
import { toBlob, toPng } from "html-to-image";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const captureElement = async (
	elementRef: React.RefObject<HTMLDivElement | HTMLTableElement | null>,
	fileName: string,
	mode: "clipboard" | "screenshot" = "clipboard",
) => {
	const node = elementRef.current;
	if (!node) return;

	// Optional: reset scroll position for horizontally scrollable content
	node
		.querySelectorAll<HTMLElement>("[class*='overflow-x-auto']")
		.forEach((el) => {
			el.scrollLeft = 0;
		});

	try {
		if (mode === "clipboard") {
			console.log("Attempting to copy image to clipboard...");
			const blob = await toBlob(node, {
				pixelRatio: Math.max(2, window.devicePixelRatio || 1),
				cacheBust: true,
			});

			if (!blob) throw new Error("Failed to generate image blob");

			const clipboardItem = new ClipboardItem({ "image/png": blob });
			await navigator.clipboard.write([clipboardItem]);

			console.log("Image copied to clipboard!");
		} else {
			const dataUrl = await toPng(node, {
				pixelRatio: Math.max(2, window.devicePixelRatio || 1),
				cacheBust: true,
			});

			const a = document.createElement("a");
			a.href = dataUrl;
			a.download = `${fileName.replace(/\s+/g, "_")}.png`;
			a.click();
		}
	} catch (err) {
		console.error("Failed to capture element:", err);
	}
};
