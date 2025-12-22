import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run every hour to check for scheduled generations
crons.hourly(
  "check scheduled episode generation",
  { minuteUTC: 0 }, // Run at the top of each hour
  internal.scheduled.generateDailyEpisodes.processScheduledGenerations
);

export default crons;
