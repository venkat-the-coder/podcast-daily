import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

// Create or update user from Clerk webhook
export const syncUserFromClerk = internalMutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
      });
      return existingUser._id;
    }

    // Create new user with defaults
    const userId = await ctx.db.insert("users", {
      clerkUserId: args.clerkUserId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
      subscriptionTier: "free",
      subscriptionStatus: "active",
      dailyGenerationTime: "09:00", // Default 9 AM
      timezone: "America/New_York", // Default timezone
      episodesGeneratedToday: 0,
      lastDailyResetAt: Date.now(),
    });

    // Audit log
    await ctx.db.insert("auditLog", {
      userId,
      action: "user_created",
      resource: "users",
      resourceId: userId,
      timestamp: Date.now(),
    });

    return userId;
  },
});

// Get current user (authenticated)
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    return user;
  },
});

// Internal query to get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();
  },
});

// Update user preferences
export const updatePreferences = mutation({
  args: {
    dailyGenerationTime: v.optional(v.string()),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    const updates: any = {};
    if (args.dailyGenerationTime)
      updates.dailyGenerationTime = args.dailyGenerationTime;
    if (args.timezone) updates.timezone = args.timezone;

    await ctx.db.patch(user._id, updates);

    await ctx.db.insert("auditLog", {
      userId: user._id,
      action: "preferences_updated",
      resource: "users",
      resourceId: user._id,
      metadata: updates,
      timestamp: Date.now(),
    });
  },
});

// Internal mutation to increment daily episode count
export const incrementDailyEpisodeCount = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      episodesGeneratedToday: user.episodesGeneratedToday + 1,
      lastEpisodeGeneratedAt: Date.now(),
    });
  },
});
