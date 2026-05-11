import { CronJob } from "cron";

const baseUrl = process.env.URL;
const authHeader = process.env.AUTH_HEADER;
const authHeaderValue = process.env.AUTH_HEADER_VALUE;
const isDev = process.env.NODE_ENV === "development";

// Validate required environment variables
if (!baseUrl) throw new Error("URL environment variable is required");
if (!authHeader)
	throw new Error("AUTH_HEADER environment variable is required");
if (!authHeaderValue)
	throw new Error("AUTH_HEADER_VALUE environment variable is required");

// Helper to create fetch handler for cron jobs
const createCronHandler = (endpoint, label) => async () => {
	const url = endpoint ? `${baseUrl.replace(/\/$/, "")}/${endpoint}` : baseUrl;
	const response = await fetch(url, {
		method: "GET",
		headers: { [authHeader]: authHeaderValue },
	});
	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}
	let data;
	try {
		data = await response.json();
	} catch {
		throw new Error(`Invalid JSON response from ${url}`);
	}
	console.log(`${label} @`, response.status, response.statusText, data.status);
};

// Job configurations
const jobConfigs = [
	{
		name: "5min",
		cronTime: isDev ? "*/10 * * * * *" : "*/5 * * * *",
		endpoint: "5min",
		label: "5MIN CRON",
	},
	{
		name: "30min",
		cronTime: isDev ? "*/10 * * * * *" : "*/30 * * * *",
		endpoint: "30min",
		label: "30MIN CRON",
	},
	{
		name: "2hour",
		cronTime: isDev ? "*/10 * * * * *" : "0 */2 * * *",
		endpoint: "2hour",
		label: "2HOUR CRON",
	},
	{
		name: "daily",
		cronTime: isDev ? "*/10 * * * * *" : "0 0 * * *",
		endpoint: "daily",
		label: "DAILY CRON @ 12AM ET",
	},
];

// Create all cron jobs using CronJob.from() syntax
const cronJobs = jobConfigs.map(({ name, cronTime, endpoint, label }) =>
	CronJob.from({
		name,
		cronTime,
		onTick: createCronHandler(endpoint, label),
		timeZone: "America/New_York",
		waitForCompletion: true, // Prevents overlapping executions
		errorHandler: (err) => console.error(`[${name}] Error:`, err.message),
	}),
);

if (process.env.ENABLED === "true") {
	console.log("Cron jobs starting:", process.env.URL, process.env.NODE_ENV);
	for (const job of cronJobs) job.start();
	console.log("Jobs started:", jobConfigs.map((j) => j.name).join(", "));
} else {
	console.log("Cron jobs disabled");
}
