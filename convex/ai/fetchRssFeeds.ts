"use node";

import { v } from "convex/values";
import { action, internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import Parser from "rss-parser";

interface Article {
  title: string;
  url: string;
  content: string;
  publishedAt: string;
  source: string;
}

// Fetch RSS feed (runs on Convex backend)
export const fetchRssFeed = internalAction({
  args: {
    rssUrl: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<Article[]> => {
    const parser = new Parser({
      timeout: 10000, // 10 second timeout
      headers: {
        "User-Agent": "PodcastDaily/1.0",
      },
    });

    try {
      const feed = await parser.parseURL(args.rssUrl);
      const limit = args.limit || 5;

      return feed.items.slice(0, limit).map((item) => ({
        title: item.title || "Untitled",
        url: item.link || "",
        content: item.contentSnippet || item.content || "",
        publishedAt: item.pubDate || new Date().toISOString(),
        source: feed.title || "Unknown Source",
      }));
    } catch (error) {
      console.error("RSS fetch error:", error);
      return [];
    }
  },
});

// Fetch all user's RSS feeds
export const fetchUserFeeds = internalAction({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<Article[]> => {
    // Get user's sources
    const userSources = await ctx.runQuery(internal.sources.getUserSourcesInternal, {
      userId: args.userId,
    });

    const allArticles: Article[] = [];

    // Fetch each RSS feed
    for (const source of userSources) {
      if (!source) continue;

      const articles: Article[] = await ctx.runAction(internal.ai.fetchRssFeeds.fetchRssFeed, {
        rssUrl: source.rssUrl,
        limit: 3,
      });

      allArticles.push(...articles);
    }

    // Sort by published date (newest first)
    allArticles.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });

    // Return top 10 most recent
    return allArticles.slice(0, 10);
  },
});
