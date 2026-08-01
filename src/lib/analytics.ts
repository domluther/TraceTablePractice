const ANALYTICS_URL =
	"https://mrluthercodes-analytics.netlify.app/.netlify/functions/log-event";

function getSessionId(): string {
	let id = sessionStorage.getItem("session_id");
	if (!id) {
		id = crypto.randomUUID();
		sessionStorage.setItem("session_id", id);
	}
	return id;
}

interface LogEventPayload {
	site: string;
	game: string;
	[key: string]: unknown;
}

export async function logEvent(payload: LogEventPayload): Promise<void> {
	try {
		await fetch(ANALYTICS_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...payload, sessionId: getSessionId() }),
		});
	} catch {
		// Silent fail — analytics must never break the site
	}
}
