"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DashboardPage() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const episodes = useQuery(api.episodes.getUserEpisodes, { limit: 10 });
  const createEpisode = useMutation(api.episodes.createEpisode);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateEpisode = async () => {
    setIsGenerating(true);
    try {
      await createEpisode();
    } catch (error: any) {
      alert(error.message || "Failed to generate episode");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!currentUser || !episodes) {
    return <div>Loading...</div>;
  }

  const canGenerate =
    currentUser.subscriptionTier === "pro" ||
    currentUser.episodesGeneratedToday < 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">My Podcasts</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-semibold">
                  {currentUser.subscriptionTier === "pro" ? "Pro" : "Free"}
                </span>
                {currentUser.subscriptionTier === "free" && (
                  <span className="text-gray-600 ml-2">
                    ({currentUser.episodesGeneratedToday}/1 today)
                  </span>
                )}
              </div>
              <Button
                onClick={handleGenerateEpisode}
                disabled={!canGenerate || isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Episode"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!canGenerate && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              You've reached your daily limit. Upgrade to Pro for unlimited
              episodes!
            </p>
          </div>
        )}

        <div className="space-y-4">
          {episodes.map((episode) => (
            <EpisodeCard key={episode._id} episode={episode} />
          ))}
        </div>
      </main>
    </div>
  );
}

function EpisodeCard({ episode }: { episode: any }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{episode.title}</h3>
          <p className="text-sm text-gray-600">
            {new Date(episode.generatedAt).toLocaleDateString()}
          </p>
        </div>
        <StatusBadge status={episode.status} />
      </div>

      {episode.status === "completed" && episode.audioUrl && (
        <audio controls className="w-full mb-4">
          <source src={episode.audioUrl} type="audio/mpeg" />
        </audio>
      )}

      {episode.sourceArticles && episode.sourceArticles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Sources:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {episode.sourceArticles.slice(0, 3).map((article: any, idx: number) => (
              <li key={idx}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  {article.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    pending: "bg-gray-200 text-gray-800",
    generating_script: "bg-blue-200 text-blue-800",
    generating_audio: "bg-purple-200 text-purple-800",
    completed: "bg-green-200 text-green-800",
    failed: "bg-red-200 text-red-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        colors[status as keyof typeof colors]
      }`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
