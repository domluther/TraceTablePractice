export function Footer() {
	return (
		<footer className="p-4 text-sm text-center text-header-text bg-header/80">
			<div>
				Copyright{" "}
				<a
					href="https://mrluthercodes.netlify.app/"
					target="_blank"
					rel="noopener noreferrer"
					className="underline text-link hover:text-link-hover"
				>
					Mr Luther
				</a>{" "}
				2026
			</div>
			<div className="opacity-70">
				Anonymous usage data is collected to help improve this site. No personal
				information is stored.
			</div>
		</footer>
	);
}
