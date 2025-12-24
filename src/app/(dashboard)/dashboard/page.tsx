"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Calendar, Sparkles, Check, Loader2, ExternalLink, Settings, HelpCircle, Trash2 } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const currentUser = useQuery(api.users.getCurrentUser);
  const episodes = useQuery(api.episodes.getUserEpisodes, { limit: 10 });
  const createEpisode = useAction(api.episodes.createEpisode);
  const deleteEpisode = useMutation(api.episodes.deleteEpisode);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleGenerateEpisode = async () => {
    setIsGenerating(true);
    try {
      await createEpisode();
      showToast("Episode generation started! Check back in a few minutes.", "success");
    } catch (error: any) {
      showToast(error.message || "Failed to generate episode", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    try {
      await deleteEpisode({ episodeId: episodeId as any });
      showToast("Episode deleted successfully!", "success");
      setDeleteConfirmId(null);
    } catch (error: any) {
      showToast(error.message || "Failed to delete episode", "error");
    }
  };

  if (!currentUser || !episodes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your podcasts...</p>
        </div>
      </div>
    );
  }

  const canGenerate =
    currentUser.subscriptionTier === "pro" ||
    currentUser.episodesGeneratedToday < 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header with Gradient Background */}
      <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 shadow-2xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="animate-fadeIn">
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                My Podcasts
              </h1>
              <p className="text-purple-200">
                Your personalized audio news feed
              </p>
            </div>

            {/* User Info & Generate Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fadeIn delay-200">
              {/* Glassmorphic Badge */}
              <div className="glass rounded-2xl px-6 py-3 border border-white/30">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-purple-100">Plan:</div>
                  <div className="font-bold text-white flex items-center gap-2">
                    {currentUser.subscriptionTier === "pro" ? (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Pro
                      </>
                    ) : (
                      "Free"
                    )}
                  </div>
                </div>
                {currentUser.subscriptionTier === "free" && (
                  <div className="mt-1 text-xs text-purple-200">
                    {currentUser.episodesGeneratedToday}/1 episodes today
                  </div>
                )}
              </div>

              <Button
                onClick={handleGenerateEpisode}
                disabled={!canGenerate || isGenerating}
                variant="gradient"
                size="lg"
                className="relative group"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Episode
                  </>
                )}
              </Button>

              {/* How It Works Button */}
              <Button
                onClick={() => router.push("/how-it-works")}
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                How It Works
              </Button>

              {/* Settings Button */}
              <Button
                onClick={() => router.push("/settings")}
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </Button>

              {/* User Menu with Logout */}
              <div className="glass rounded-full p-1 border border-white/30">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Limit Warning */}
        {!canGenerate && (
          <div className="mb-8 rounded-2xl p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 shadow-lg animate-scaleIn">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900 mb-1">
                  Daily Limit Reached
                </h3>
                <p className="text-amber-800">
                  You've generated your free episode for today. Upgrade to Pro
                  for unlimited episodes!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Episodes Grid */}
        <div className="space-y-6">
          {episodes.length === 0 ? (
            <div className="text-center py-20 animate-fadeIn">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Episodes Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Click "Generate Episode" to create your first podcast!
              </p>
            </div>
          ) : (
            episodes.map((episode, idx) => (
              <EpisodeCard
                key={episode._id}
                episode={episode}
                delay={`delay-${Math.min(idx * 100, 500)}`}
                onDelete={() => setDeleteConfirmId(episode._id)}
              />
            ))
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scaleIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Delete Episode?
              </h3>
              <p className="text-gray-600">
                This action cannot be undone. The episode and its audio will be permanently deleted.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteEpisode(deleteConfirmId)}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EpisodeCard({
  episode,
  delay,
  onDelete,
}: {
  episode: any;
  delay: string;
  onDelete: () => void;
}) {
  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-scaleIn ${delay}`}
    >
      {/* Gradient Top Border */}
      <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>

      <div className="p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
              {episode.title}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(episode.generatedAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Status Badge and Delete Button */}
          <div className="flex items-center gap-3">
            <StatusBadge status={episode.status} />
            <button
              onClick={onDelete}
              className="w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all hover:scale-110 group/delete"
              title="Delete episode"
            >
              <Trash2 className="w-5 h-5 text-red-600 group-hover/delete:text-red-700" />
            </button>
          </div>
        </div>

        {/* Error Message for Failed Episodes */}
        {episode.status === "failed" && episode.error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border-2 border-red-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl">✗</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-1">Generation Failed</h4>
                <p className="text-sm text-red-700">{episode.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Audio Player with Gradient Styling */}
        {episode.status === "completed" && episode.audioUrl && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
            <audio
              controls
              className="w-full"
              controlsList="nodownload"
            >
              <source src={episode.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Source Links */}
        {episode.sourceArticles && episode.sourceArticles.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-purple-600 to-blue-600 rounded"></div>
              Sources
            </h4>
            <ul className="space-y-2">
              {episode.sourceArticles
                .slice(0, 3)
                .map((article: any, idx: number) => (
                  <li key={idx}>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-purple-600 transition-all hover:translate-x-1 transform duration-200 flex items-center gap-2 group/link"
                    >
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      <span className="line-clamp-1">{article.title}</span>
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<
    string,
    {
      bg: string;
      text: string;
      icon: React.ReactNode;
      animate: boolean;
    }
  > = {
    pending: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: <Loader2 className="w-4 h-4" />,
      animate: false,
    },
    generating_script: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      animate: true,
    },
    generating_audio: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      animate: true,
    },
    completed: {
      bg: "bg-gradient-to-r from-green-400 to-emerald-500",
      text: "text-white",
      icon: <Check className="w-4 h-4" />,
      animate: false,
    },
    failed: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: <span>✗</span>,
      animate: false,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`
        px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2
        ${config.bg} ${config.text}
        ${config.animate ? "animate-pulse-glow" : ""}
        shadow-md transition-all duration-300
      `}
    >
      {config.icon}
      <span className="capitalize">{status.replace(/_/g, " ")}</span>
    </span>
  );
}
