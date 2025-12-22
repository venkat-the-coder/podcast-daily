import { v } from "convex/values";
import { mutation, query, action, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

// Create new episode (orchestrator)
export const createEpisode = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get user
    const user = await ctx.runQuery(internal.users.getUserByClerkId, {
      clerkUserId: identity.subject,
    });

    if (!user) throw new Error("User not found");

    // Check rate limits
    await ctx.runMutation(internal.episodes.checkRateLimit, {
      userId: user._id,
    });

    // 1. Create pending episode
    const episodeId = await ctx.runMutation(internal.episodes.createPendingEpisode, {
      userId: user._id,
    });

    try {
      // 2. Fetch RSS feeds
      const articles = await ctx.runAction(internal.ai.fetchRssFeeds.fetchUserFeeds, {
        userId: user._id,
      });

      if (articles.length === 0) {
        await ctx.runMutation(internal.episodes.updateEpisodeStatus, {
          episodeId,
          status: "failed",
          error: "No articles found from your selected sources",
        });
        throw new Error("No articles found from your selected sources");
      }

      // 3. Generate script
      await ctx.runMutation(internal.episodes.updateEpisodeStatus, {
        episodeId,
        status: "generating_script",
      });

      const { script } = await ctx.runAction(internal.ai.generateScript.generatePodcastScript, {
        articles,
      });

      // 4. Update episode with script
      await ctx.runMutation(internal.episodes.updateEpisodeScript, {
        episodeId,
        script,
        sourceArticles: articles.map((a) => ({
          title: a.title,
          url: a.url,
          source: a.source,
          publishedAt: a.publishedAt,
        })),
      });

      // 5. Generate audio
      await ctx.runMutation(internal.episodes.updateEpisodeStatus, {
        episodeId,
        status: "generating_audio",
      });

      await ctx.runAction(internal.ai.generateAudio.generateAudio, {
        script,
        episodeId,
      });

      // 6. Mark complete
      await ctx.runMutation(internal.episodes.updateEpisodeStatus, {
        episodeId,
        status: "completed",
      });

      // 7. Increment user's daily counter
      await ctx.runMutation(internal.users.incrementDailyEpisodeCount, {
        userId: user._id,
      });

      return episodeId;
    } catch (error) {
      // Update episode status to failed
      await ctx.runMutation(internal.episodes.updateEpisodeStatus, {
        episodeId,
        status: "failed",
        error: String(error),
      });
      throw error;
    }
  },
});

// Internal: Check rate limits
export const checkRateLimit = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    // Reset counter if it's a new day
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (now - user.lastDailyResetAt > oneDayMs) {
      await ctx.db.patch(user._id, {
        episodesGeneratedToday: 0,
        lastDailyResetAt: now,
      });
      return; // Limit reset, can proceed
    }

    // Check if user exceeded limit
    if (user.subscriptionTier === "free" && user.episodesGeneratedToday >= 1) {
      throw new Error(
        "Daily episode limit reached. Upgrade to Pro for unlimited episodes."
      );
    }

    // Pro users have no limit
  },
});

// Get user's episodes
export const getUserEpisodes = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", identity.subject))
      .first();

    if (!user) return [];

    const limit = args.limit || 10;

    const episodes = await ctx.db
      .query("episodes")
      .withIndex("by_user_and_date", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(limit);

    // Generate signed URLs for audio files
    const episodesWithUrls = await Promise.all(
      episodes.map(async (episode) => {
        if (episode.audioFileId) {
          const audioUrl = await ctx.storage.getUrl(episode.audioFileId);
          return { ...episode, audioUrl };
        }
        return episode;
      })
    );

    return episodesWithUrls;
  },
});

// Internal mutations for episode workflow
export const createPendingEpisode = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.insert("episodes", {
      userId: args.userId,
      title: "Generating your daily podcast...",
      description: "",
      script: "",
      sourceArticles: [],
      generatedAt: Date.now(),
      status: "pending",
    });
  },
});

export const updateEpisodeStatus = internalMutation({
  args: {
    episodeId: v.id("episodes"),
    status: v.union(
      v.literal("pending"),
      v.literal("generating_script"),
      v.literal("generating_audio"),
      v.literal("completed"),
      v.literal("failed")
    ),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.episodeId, {
      status: args.status,
      error: args.error,
    });
  },
});

export const updateEpisodeScript = internalMutation({
  args: {
    episodeId: v.id("episodes"),
    script: v.string(),
    sourceArticles: v.array(
      v.object({
        title: v.string(),
        url: v.string(),
        source: v.string(),
        publishedAt: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Extract title from first 100 chars of script
    const title = args.script.substring(0, 100).trim() + "...";
    // Generate description from source articles
    const description = `Podcast episode covering ${args.sourceArticles.length} stories from ${new Set(args.sourceArticles.map((a) => a.source)).size} sources`;

    await ctx.db.patch(args.episodeId, {
      title,
      description,
      script: args.script,
      sourceArticles: args.sourceArticles,
    });
  },
});

export const updateEpisodeAudio = internalMutation({
  args: {
    episodeId: v.id("episodes"),
    audioFileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.episodeId, {
      audioFileId: args.audioFileId,
    });
  },
});
