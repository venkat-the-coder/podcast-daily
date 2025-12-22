import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export const generateAudio = internalAction({
  args: {
    script: v.string(),
    episodeId: v.id("episodes"),
  },
  handler: async (ctx, args) => {
    const elevenlabs = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });

    const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";

    try {
      // Generate audio stream
      const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
        text: args.script,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      });

      // Convert stream to buffer
      const chunks: Uint8Array[] = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }

      const audioBuffer = Buffer.concat(chunks);

      // Store in Convex file storage
      const storageId = await ctx.storage.store(
        new Blob([audioBuffer], { type: "audio/mpeg" })
      );

      // Update episode with audio file
      await ctx.runMutation(internal.episodes.updateEpisodeAudio, {
        episodeId: args.episodeId,
        audioFileId: storageId,
      });

      return { storageId };
    } catch (error) {
      console.error("ElevenLabs error:", error);
      throw new Error("Failed to generate audio");
    }
  },
});
