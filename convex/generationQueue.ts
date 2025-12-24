import { v } from "convex/values";
import { mutation, internalQuery, internalMutation } from "./_generated/server";

// Schedule a generation for a user
export const scheduleGeneration = mutation({
  args: {
    scheduledFor: v.number(), // Unix timestamp
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.insert("generationQueue", {
      userId: user._id,
      scheduledFor: args.scheduledFor,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

// Internal: Get pending jobs
export const getPendingJobs = internalQuery({
  args: {
    beforeTimestamp: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("generationQueue")
      .withIndex("by_status", (q) =>
        q.eq("status", "pending")
      )
      .filter((q) => q.lte(q.field("scheduledFor"), args.beforeTimestamp))
      .collect();
  },
});

// Internal: Update job status
export const updateJobStatus = internalMutation({
  args: {
    jobId: v.id("generationQueue"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    episodeId: v.optional(v.id("episodes")),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: any = {
      status: args.status,
      processedAt: Date.now(),
    };

    if (args.episodeId) updates.episodeId = args.episodeId;
    if (args.error) updates.error = args.error;

    await ctx.db.patch(args.jobId, updates);
  },
});
