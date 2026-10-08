import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		react(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src"),
		},
	},
	test: {
		globals: true,
		watch: false,
		environment: "jsdom",
		pool: "vmThreads", // creates jsdom once per worker while keeping per-file isolation
		setupFiles: ["./src/test/setup.ts"],
		css: true,
		testTimeout: 2000, // 2 second timeout for individual tests
		silent: true,
	},
});
