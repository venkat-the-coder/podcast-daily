"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useToast } from "@/components/ui/toast";

export default function OnboardingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const availableSources = useQuery(api.sources.listAvailableSources);
  const userSources = useQuery(api.sources.getUserSources);
  const addUserSource = useMutation(api.sources.addUserSource);
  const createEpisode = useAction(api.episodes.createEpisode);

  // Redirect to dashboard if user has already completed onboarding
  useEffect(() => {
    if (userSources && userSources.length > 0) {
      router.push("/dashboard");
    }
  }, [userSources, router]);

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleFinishOnboarding = async () => {
    if (selectedSources.length === 0) {
      showToast("Please select at least one news source", "warning");
      return;
    }

    setIsGenerating(true);

    try {
      // Add selected sources
      for (const sourceId of selectedSources) {
        await addUserSource({ sourceId: sourceId as any });
      }

      // Generate first episode
      await createEpisode();

      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      showToast("Failed to complete onboarding. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!availableSources) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading news sources...</p>
        </div>
      </div>
    );
  }

  const progress = (selectedSources.length / Math.max(availableSources.length, 1)) * 100;
  const minSelected = selectedSources.length >= 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* User Button in Top Right */}
        <div className="flex justify-end mb-6 animate-fadeIn">
          <div className="bg-white rounded-full p-2 shadow-lg border border-purple-100">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 animate-fadeIn">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(progress, 10)}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-500 text-right">
            {selectedSources.length} of {availableSources.length} sources selected
          </div>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-12 animate-fadeIn delay-200">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl animate-float">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to PodcastDaily!
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your favorite news sources to personalize your daily podcast
          </p>
        </div>

        {/* Source Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {availableSources.map((source, idx) => (
            <SourceCard
              key={source._id}
              source={source}
              selected={selectedSources.includes(source._id)}
              onToggle={() => handleSourceToggle(source._id)}
              delay={`delay-${Math.min(idx * 100, 500)}`}
            />
          ))}
        </div>

        {/* Bottom Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-6 bg-white rounded-2xl shadow-lg animate-scaleIn">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-gray-900 mb-1">
              {selectedSources.length > 0
                ? `Great! ${selectedSources.length} source${selectedSources.length > 1 ? "s" : ""} selected`
                : "Select at least one source to continue"}
            </p>
            <p className="text-sm text-gray-600">
              {minSelected
                ? "Click continue to generate your first podcast"
                : "Pick your favorite news outlets"}
            </p>
          </div>

          <Button
            size="lg"
            variant="gradient"
            onClick={handleFinishOnboarding}
            disabled={isGenerating || !minSelected}
            className="w-full sm:w-auto"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Generating First Episode...
              </>
            ) : (
              <>
                Continue
                <Sparkles className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SourceCard({
  source,
  selected,
  onToggle,
  delay,
}: {
  source: any;
  selected: boolean;
  onToggle: () => void;
  delay: string;
}) {
  const categoryColors: Record<string, string> = {
    general: "from-blue-100 to-blue-200 text-blue-700",
    tech: "from-purple-100 to-purple-200 text-purple-700",
    business: "from-green-100 to-green-200 text-green-700",
    sports: "from-orange-100 to-orange-200 text-orange-700",
  };

  const categoryGradient =
    categoryColors[source.category] ||
    "from-gray-100 to-gray-200 text-gray-700";

  return (
    <button
      onClick={onToggle}
      className={`
        relative p-6 rounded-2xl border-2 transition-all duration-300
        hover:scale-105 hover:shadow-xl group
        ${
          selected
            ? "border-purple-600 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105"
            : "border-gray-200 bg-white hover:border-purple-300"
        }
        animate-scaleIn ${delay}
      `}
    >
      {/* Selection Indicator */}
      {selected && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center animate-scaleIn shadow-lg">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Source Icon/Logo Placeholder */}
      <div
        className={`
          w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center text-2xl font-bold
          bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700
          group-hover:scale-110 transition-transform
        `}
      >
        {source.name.charAt(0)}
      </div>

      <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-purple-700 transition-colors">
        {source.name}
      </h3>

      {/* Category Badge */}
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryGradient}`}
      >
        {source.category}
      </span>

      {source.description && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
          {source.description}
        </p>
      )}
    </button>
  );
}
