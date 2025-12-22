import { v } from "convex/values";
import { mutation, query, internalQuery } from "./_generated/server";

// Get all available news sources
export const listAvailableSources = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("newsSources")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Get user's selected sources
export const getUserSources = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user) return [];

    const userSources = await ctx.db
      .query("userSources")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Fetch full source details
    const sources = await Promise.all(
      userSources.map(async (us) => {
        return await ctx.db.get(us.sourceId);
      })
    );

    return sources.filter((s) => s !== null);
  },
});

// Internal query to get user sources by userId
export const getUserSourcesInternal = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userSources = await ctx.db
      .query("userSources")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Fetch full source details
    const sources = await Promise.all(
      userSources.map(async (us) => {
        return await ctx.db.get(us.sourceId);
      })
    );

    return sources.filter((s) => s !== null);
  },
});

// Add source to user's preferences
export const addUserSource = mutation({
  args: {
    sourceId: v.id("newsSources"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    // Check if already added
    const existing = await ctx.db
      .query("userSources")
      .withIndex("by_user_and_source", (q) =>
        q.eq("userId", user._id).eq("sourceId", args.sourceId)
      )
      .first();

    if (existing) return; // Already added

    await ctx.db.insert("userSources", {
      userId: user._id,
      sourceId: args.sourceId,
      addedAt: Date.now(),
    });

    await ctx.db.insert("auditLog", {
      userId: user._id,
      action: "source_added",
      resource: "userSources",
      resourceId: args.sourceId,
      timestamp: Date.now(),
    });
  },
});

// Remove source from user's preferences
export const removeUserSource = mutation({
  args: {
    sourceId: v.id("newsSources"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    const userSource = await ctx.db
      .query("userSources")
      .withIndex("by_user_and_source", (q) =>
        q.eq("userId", user._id).eq("sourceId", args.sourceId)
      )
      .first();

    if (userSource) {
      await ctx.db.delete(userSource._id);

      await ctx.db.insert("auditLog", {
        userId: user._id,
        action: "source_removed",
        resource: "userSources",
        resourceId: args.sourceId,
        timestamp: Date.now(),
      });
    }
  },
});

// Seed news sources (run once to populate database)
export const seedNewsSources = mutation({
  args: {},
  handler: async (ctx) => {
    const sources = [
      {
        name: "BBC News",
        rssUrl: "https://feeds.bbci.co.uk/news/rss.xml",
        category: "general",
        description: "Breaking news, features and analysis from the world's most trusted news organization",
        isActive: true,
      },
      {
        name: "CNN",
        rssUrl: "http://rss.cnn.com/rss/cnn_topstories.rss",
        category: "general",
        description: "Latest news and headlines from around the world",
        isActive: true,
      },
      {
        name: "TechCrunch",
        rssUrl: "https://techcrunch.com/feed/",
        category: "tech",
        description: "Reporting on the business of technology, startups, and Silicon Valley",
        isActive: true,
      },
      {
        name: "The Verge",
        rssUrl: "https://www.theverge.com/rss/index.xml",
        category: "tech",
        description: "Technology news, reviews, and long-form features",
        isActive: true,
      },
      {
        name: "Hacker News",
        rssUrl: "https://hnrss.org/frontpage",
        category: "tech",
        description: "News and links for tech enthusiasts",
        isActive: true,
      },
      {
        name: "Reuters",
        rssUrl: "https://www.reutersagency.com/feed/",
        category: "general",
        description: "International news and financial information",
        isActive: true,
      },
      {
        name: "Ars Technica",
        rssUrl: "https://feeds.arstechnica.com/arstechnica/index",
        category: "tech",
        description: "Technology lab and science journalism",
        isActive: true,
      },
    ];

    for (const source of sources) {
      // Check if source already exists
      const existing = await ctx.db
        .query("newsSources")
        .filter((q) => q.eq(q.field("rssUrl"), source.rssUrl))
        .first();

      if (!existing) {
        await ctx.db.insert("newsSources", source);
      }
    }

    return { count: sources.length, message: "News sources seeded successfully" };
  },
});
