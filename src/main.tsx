import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance with error handling
const router = createRouter({
	routeTree,
	defaultErrorComponent: ({ error }: { error: Error }) => (
		<div className="flex items-center justify-center min-h-screen p-4">
			<div className="max-w-md p-6 text-center rounded-lg shadow-lg bg-card">
				<h2 className="mb-4 text-2xl font-bold text-destructive">
					Oops! Something went wrong
				</h2>
				<p className="mb-4 text-muted-foreground">
					{error instanceof Error
						? error.message
						: "An unexpected error occurred"}
				</p>
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="px-6 py-2 font-semibold rounded-lg text-action-button-text bg-action-button-bg hover:bg-action-button-bg-hover"
				>
					Reload Page
				</button>
			</div>
		</div>
	),
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
