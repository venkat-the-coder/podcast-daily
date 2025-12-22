import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import OpenAI from "openai";

export const generatePodcastScript = internalAction({
  args: {
    articles: v.array(
      v.object({
        title: v.string(),
        url: v.string(),
        content: v.string(),
        source: v.string(),
        publishedAt: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prepare article summaries for context
    const articleSummaries = args.articles
      .map((article, idx) => {
        return `Article ${idx + 1}:
Title: ${article.title}
Source: ${article.source}
Content: ${article.content.substring(0, 500)}...
`;
      })
      .join("\n\n");

    const systemPrompt = `You are a professional podcast scriptwriter. Create an engaging, conversational 5-minute podcast script that summarizes today's news.

Guidelines:
- Write in a natural, conversational tone as if a single narrator is speaking
- Opening: Start with a warm greeting and brief intro
- Body: Cover 3-5 key stories, providing context and insights
- Transitions: Use smooth transitions between stories
- Closing: End with a brief summary and sign-off
- Target length: ~750-900 words (approximately 5 minutes when spoken)
- Avoid: Lists, bullet points, or overly formal language
- Style: Informative yet accessible, professional yet friendly

DO NOT include any stage directions, speaker labels, or formatting markers. Just write the spoken script.`;

    const userPrompt = `Based on these news articles from today, create a 5-minute podcast script:

${articleSummaries}

Remember: This is a single-narrator podcast. Write natural, flowing speech that sounds good when read aloud.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const script = completion.choices[0]?.message?.content || "";

      return {
        script,
        tokensUsed: completion.usage?.total_tokens || 0,
      };
    } catch (error) {
      console.error("OpenAI error:", error);
      throw new Error("Failed to generate podcast script");
    }
  },
});
