import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";

// Process scheduled episode generations
export const processScheduledGenerations = internalAction({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Get all jobs scheduled for now or earlier
    const pendingJobs = await ctx.runQuery(internal.generationQueue.getPendingJobs, {
      beforeTimestamp: now,
    });

    console.log(`Processing ${pendingJobs.length} scheduled generation jobs`);

    for (const job of pendingJobs) {
      try {
        // Mark as processing
        await ctx.runMutation(internal.generationQueue.updateJobStatus, {
          jobId: job._id,
          status: "processing",
        });

        // Generate episode
        const episodeId = await ctx.runAction(internal.episodes.createEpisodeInternal, {
          userId: job.userId,
        });

        // Mark as completed
        await ctx.runMutation(internal.generationQueue.updateJobStatus, {
          jobId: job._id,
          status: "completed",
          episodeId,
        });
      } catch (error) {
        console.error("Failed to generate episode:", error);
        await ctx.runMutation(internal.generationQueue.updateJobStatus, {
          jobId: job._id,
          status: "failed",
          error: String(error),
        });
      }
    }
  },
});
