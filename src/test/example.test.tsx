import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Simple example component for testing
function Button({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick?: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className="px-4 py-2 text-white bg-blue-500 rounded"
			type="button"
		>
			{children}
		</button>
	);
}

describe("Button Component", () => {
	it("renders button with text", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText("Click me")).toBeInTheDocument();
	});

	it("calls onClick when clicked", () => {
		const mockFn = vi.fn();
		render(<Button onClick={mockFn}>Click me</Button>);

		screen.getByText("Click me").click();
		expect(mockFn).toHaveBeenCalledOnce();
	});
});

// Basic utility function test
describe("Math utilities", () => {
	it("should add numbers correctly", () => {
		expect(2 + 2).toBe(4);
	});
});
