"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const availableSources = useQuery(api.sources.listAvailableSources);
  const addUserSource = useMutation(api.sources.addUserSource);
  const createEpisode = useMutation(api.episodes.createEpisode);

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleFinishOnboarding = async () => {
    if (selectedSources.length === 0) {
      alert("Please select at least one news source");
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
      alert("Failed to complete onboarding. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!availableSources) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Welcome to PodcastDaily!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Choose your favorite news sources to get started
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {availableSources.map((source) => (
            <SourceCard
              key={source._id}
              source={source}
              selected={selectedSources.includes(source._id)}
              onToggle={() => handleSourceToggle(source._id)}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {selectedSources.length} source(s) selected
          </p>
          <Button
            size="lg"
            onClick={handleFinishOnboarding}
            disabled={isGenerating || selectedSources.length === 0}
          >
            {isGenerating ? "Generating First Episode..." : "Continue"}
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
}: {
  source: any;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`p-4 rounded-lg border-2 transition ${
        selected
          ? "border-blue-600 bg-blue-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <h3 className="font-semibold mb-1">{source.name}</h3>
      <p className="text-sm text-gray-600">{source.category}</p>
    </button>
  );
}
