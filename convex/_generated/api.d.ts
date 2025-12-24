/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai_fetchRssFeeds from "../ai/fetchRssFeeds.js";
import type * as ai_generateAudio from "../ai/generateAudio.js";
import type * as ai_generateScript from "../ai/generateScript.js";
import type * as crons from "../crons.js";
import type * as episodes from "../episodes.js";
import type * as generationQueue from "../generationQueue.js";
import type * as http from "../http.js";
import type * as scheduled_generateDailyEpisodes from "../scheduled/generateDailyEpisodes.js";
import type * as sources from "../sources.js";
import type * as subscriptions from "../subscriptions.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "ai/fetchRssFeeds": typeof ai_fetchRssFeeds;
  "ai/generateAudio": typeof ai_generateAudio;
  "ai/generateScript": typeof ai_generateScript;
  crons: typeof crons;
  episodes: typeof episodes;
  generationQueue: typeof generationQueue;
  http: typeof http;
  "scheduled/generateDailyEpisodes": typeof scheduled_generateDailyEpisodes;
  sources: typeof sources;
  subscriptions: typeof subscriptions;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
