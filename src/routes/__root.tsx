import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Footer } from "@/components/Footer";

export const Route = createRootRoute({
	component: () => (
		<>
			<div className="min-h-screen bg-gradient-to-br from-indigo-400 to-purple-600 p-5 flex flex-col justify-center items-center">
				<div className="max-w-6xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
					<main className="p-0">
						<Outlet />
					</main>
					<Footer />
				</div>
			</div>
			<TanStackRouterDevtools />
		</>
	),
});
