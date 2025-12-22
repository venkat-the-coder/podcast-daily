import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const updateSubscription = internalMutation({
  args: {
    clerkUserId: v.string(),
    polarCustomerId: v.string(),
    polarSubscriptionId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due"),
      v.literal("trialing")
    ),
    tier: v.union(v.literal("free"), v.literal("pro")),
  },
  handler: async (ctx, args) => {
    // Find user by Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!user) {
      throw new Error("User not found for Clerk user ID");
    }

    await ctx.db.patch(user._id, {
      polarCustomerId: args.polarCustomerId,
      polarSubscriptionId: args.polarSubscriptionId,
      subscriptionStatus: args.status,
      subscriptionTier: args.tier,
    });

    await ctx.db.insert("auditLog", {
      userId: user._id,
      action: "subscription_updated",
      resource: "users",
      resourceId: user._id,
      metadata: {
        status: args.status,
        tier: args.tier,
      },
      timestamp: Date.now(),
    });
  },
});
