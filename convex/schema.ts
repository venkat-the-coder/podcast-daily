import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - synced from Clerk
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),

    // Subscription info
    subscriptionTier: v.union(v.literal("free"), v.literal("pro")),
    subscriptionStatus: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due"),
      v.literal("trialing")
    ),
    polarCustomerId: v.optional(v.string()),
    polarSubscriptionId: v.optional(v.string()),

    // Preferences
    dailyGenerationTime: v.string(), // HH:MM format in user's timezone
    timezone: v.string(), // IANA timezone (e.g., "America/New_York")

    // Rate limiting
    episodesGeneratedToday: v.number(),
    lastEpisodeGeneratedAt: v.optional(v.number()),
    lastDailyResetAt: v.number(),
  })
    .index("by_clerk_id", ["clerkUserId"])
    .index("by_polar_customer_id", ["polarCustomerId"])
    .index("by_generation_time", ["dailyGenerationTime"]),

  // News sources (curated list)
  newsSources: defineTable({
    name: v.string(),
    rssUrl: v.string(),
    category: v.string(), // "general", "tech", "business", "sports", etc.
    description: v.string(),
    iconUrl: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index("by_category", ["category"])
    .index("by_active", ["isActive"]),

  // User's selected news sources
  userSources: defineTable({
    userId: v.id("users"),
    sourceId: v.id("newsSources"),
    addedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_source", ["userId", "sourceId"]),

  // Podcast episodes
  episodes: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),

    // Script & audio
    script: v.string(),
    audioFileId: v.optional(v.id("_storage")), // Convex file storage
    audioUrl: v.optional(v.string()), // Generated URL
    durationSeconds: v.optional(v.number()),

    // Metadata
    generatedAt: v.number(),
    sourceArticles: v.array(
      v.object({
        title: v.string(),
        url: v.string(),
        source: v.string(),
        publishedAt: v.optional(v.string()),
      })
    ),

    // Processing status
    status: v.union(
      v.literal("pending"),
      v.literal("generating_script"),
      v.literal("generating_audio"),
      v.literal("completed"),
      v.literal("failed")
    ),
    error: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "generatedAt"])
    .index("by_status", ["status"]),

  // Generation queue for scheduled jobs
  generationQueue: defineTable({
    userId: v.id("users"),
    scheduledFor: v.number(), // Unix timestamp
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    episodeId: v.optional(v.id("episodes")),
    error: v.optional(v.string()),
    createdAt: v.number(),
    processedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_scheduled_time", ["scheduledFor", "status"])
    .index("by_status", ["status"]),

  // Audit log for security
  auditLog: defineTable({
    userId: v.optional(v.id("users")),
    action: v.string(),
    resource: v.string(),
    resourceId: v.optional(v.string()),
    metadata: v.optional(v.any()),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"]),
});
