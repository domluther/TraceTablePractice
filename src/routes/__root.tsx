import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Footer } from "@/components";
import { SimpleThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/theme-provider";

export const Route = createRootRoute({
	component: () => (
		<ThemeProvider defaultTheme="system" storageKey="ui-theme">
			<div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-5 bg-background">
				<div className="fixed z-50 top-2 right-2 sm:top-4 sm:right-4">
					<SimpleThemeToggle />
				</div>
				<div className="w-full max-w-6xl overflow-hidden shadow-2xl bg-background rounded-xl">
					<main className="p-0">
						<Outlet />
					</main>
					<Footer />
				</div>
			</div>
			<TanStackRouterDevtools />
			<Toaster />
		</ThemeProvider>
	),
});
