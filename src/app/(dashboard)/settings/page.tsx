"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Check, Sparkles, Loader2, ArrowLeft, Settings as SettingsIcon, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useToast } from "@/components/ui/toast";

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const currentUser = useQuery(api.users.getCurrentUser);
  const availableSources = useQuery(api.sources.listAvailableSources);
  const userSources = useQuery(api.sources.getUserSources);
  const addUserSource = useMutation(api.sources.addUserSource);
  const removeUserSource = useMutation(api.sources.removeUserSource);
  const updatePreferences = useMutation(api.users.updatePreferences);

  // State for preferences
  const [generationTime, setGenerationTime] = useState("");
  const [timezone, setTimezone] = useState("");

  // Initialize preferences from current user
  useEffect(() => {
    if (currentUser) {
      setGenerationTime(currentUser.dailyGenerationTime || "09:00");
      setTimezone(currentUser.timezone || "America/New_York");
    }
  }, [currentUser]);

  // Initialize selected sources from user's current sources
  const currentSourceIds = userSources?.map((s: any) => s._id) || [];

  const handleSourceToggle = (sourceId: string) => {
    if (selectedSources.includes(sourceId)) {
      setSelectedSources(selectedSources.filter((id) => id !== sourceId));
    } else {
      setSelectedSources([...selectedSources, sourceId]);
    }
  };

  const handleSavePreferences = async () => {
    if (!currentUser) return;

    // Check if Pro user
    if (currentUser.subscriptionTier !== "pro") {
      showToast("Custom time scheduling is a Pro feature. Upgrade to Pro!", "warning");
      return;
    }

    setIsSaving(true);
    try {
      await updatePreferences({
        dailyGenerationTime: generationTime,
        timezone: timezone,
      });
      showToast("Preferences saved successfully!", "success");
    } catch (error) {
      console.error("Error saving preferences:", error);
      showToast("Failed to save preferences. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Find sources to add (in selectedSources but not in currentSourceIds)
      const sourcesToAdd = selectedSources.filter(
        (id) => !currentSourceIds.includes(id)
      );

      // Find sources to remove (in currentSourceIds but not in selectedSources)
      const sourcesToRemove = currentSourceIds.filter(
        (id) => !selectedSources.includes(id)
      );

      // Add new sources
      for (const sourceId of sourcesToAdd) {
        await addUserSource({ sourceId: sourceId as any });
      }

      // Remove deselected sources
      for (const sourceId of sourcesToRemove) {
        await removeUserSource({ sourceId: sourceId as any });
      }

      showToast("Settings saved successfully!", "success");
      setSelectedSources([]);
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast("Failed to save settings. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser || !availableSources || !userSources) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  // If no sources selected for changes, use current sources
  const displayedSources =
    selectedSources.length > 0 ? selectedSources : currentSourceIds;
  const hasChanges =
    selectedSources.length > 0 &&
    JSON.stringify([...selectedSources].sort()) !==
      JSON.stringify([...currentSourceIds].sort());

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 shadow-2xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                  <SettingsIcon className="w-8 h-8" />
                  Settings
                </h1>
                <p className="text-purple-200 mt-1">
                  Manage your news sources and preferences
                </p>
              </div>
            </div>

            {/* User Button */}
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Current Subscription Info */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Account Information
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Current Plan</p>
              <p className="text-xl font-bold text-purple-700 flex items-center gap-2 mt-1">
                {currentUser.subscriptionTier === "pro" ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Pro
                  </>
                ) : (
                  "Free"
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Episodes Today</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {currentUser.subscriptionTier === "pro"
                  ? "Unlimited"
                  : `${currentUser.episodesGeneratedToday}/1`}
              </p>
            </div>
          </div>
        </div>

        {/* Scheduled Generation Section - Pro Only */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-6 h-6 text-purple-600" />
                Scheduled Generation
              </h2>
              {currentUser.subscriptionTier !== "pro" && (
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full">
                  Pro Only
                </span>
              )}
            </div>
            <p className="text-gray-600">
              {currentUser.subscriptionTier === "pro"
                ? "Customize when your daily podcast is automatically generated"
                : "Upgrade to Pro to customize your daily generation time"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Time Picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Generation Time
              </label>
              <input
                type="time"
                value={generationTime}
                onChange={(e) => setGenerationTime(e.target.value)}
                disabled={currentUser.subscriptionTier !== "pro"}
                className={`
                  w-full px-4 py-3 rounded-xl border-2 text-gray-900 font-medium
                  ${
                    currentUser.subscriptionTier === "pro"
                      ? "border-purple-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                      : "border-gray-200 bg-gray-100 cursor-not-allowed"
                  }
                  outline-none transition-all
                `}
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {currentUser.dailyGenerationTime || "09:00"}
              </p>
            </div>

            {/* Timezone Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                disabled={currentUser.subscriptionTier !== "pro"}
                className={`
                  w-full px-4 py-3 rounded-xl border-2 text-gray-900 font-medium
                  ${
                    currentUser.subscriptionTier === "pro"
                      ? "border-purple-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                      : "border-gray-200 bg-gray-100 cursor-not-allowed"
                  }
                  outline-none transition-all
                `}
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Asia/Shanghai">Shanghai (CST)</option>
                <option value="Australia/Sydney">Sydney (AEDT)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Current: {currentUser.timezone || "America/New_York"}
              </p>
            </div>
          </div>

          {/* Save Preferences Button */}
          {currentUser.subscriptionTier === "pro" && (
            <div className="flex justify-end">
              <Button
                variant="gradient"
                onClick={handleSavePreferences}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Upgrade CTA for Free Users */}
          {currentUser.subscriptionTier !== "pro" && (
            <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Unlock Custom Scheduling
              </h3>
              <p className="text-gray-600 mb-4">
                Choose exactly when your podcast is generated each day
              </p>
              <Button variant="gradient" size="lg">
                Upgrade to Pro
              </Button>
            </div>
          )}
        </div>

        {/* News Sources Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              News Sources
            </h2>
            <p className="text-gray-600">
              Select the news outlets you want to include in your daily podcast
            </p>
            <p className="text-sm text-purple-600 mt-2">
              Currently selected: {displayedSources.length} source
              {displayedSources.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Source Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {availableSources.map((source: any) => {
              const isSelected =
                displayedSources.includes(source._id) ||
                (selectedSources.length === 0 &&
                  currentSourceIds.includes(source._id));

              return (
                <SourceCard
                  key={source._id}
                  source={source}
                  selected={isSelected}
                  onToggle={() => {
                    // Initialize selectedSources with current if not yet changed
                    if (selectedSources.length === 0) {
                      const newSelection = currentSourceIds.includes(source._id)
                        ? currentSourceIds.filter((id) => id !== source._id)
                        : [...currentSourceIds, source._id];
                      setSelectedSources(newSelection);
                    } else {
                      handleSourceToggle(source._id);
                    }
                  }}
                />
              );
            })}
          </div>

          {/* Save Button */}
          {hasChanges && (
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedSources([])}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="gradient"
                onClick={handleSaveChanges}
                disabled={isSaving || displayedSources.length === 0}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}

          {displayedSources.length === 0 && (
            <div className="text-center py-8 text-amber-600 bg-amber-50 rounded-lg">
              ⚠️ Please select at least one news source
            </div>
          )}
        </div>
      </main>
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
        relative p-4 rounded-xl border-2 transition-all duration-300
        hover:scale-105 hover:shadow-lg group
        ${
          selected
            ? "border-purple-600 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md scale-105"
            : "border-gray-200 bg-white hover:border-purple-300"
        }
      `}
    >
      {/* Selection Indicator */}
      {selected && (
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Source Icon/Logo Placeholder */}
      <div
        className={`
          w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center text-xl font-bold
          bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700
          group-hover:scale-110 transition-transform
        `}
      >
        {source.name.charAt(0)}
      </div>

      <h3 className="font-bold text-sm mb-2 text-gray-900 group-hover:text-purple-700 transition-colors">
        {source.name}
      </h3>

      {/* Category Badge */}
      <span
        className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryGradient}`}
      >
        {source.category}
      </span>
    </button>
  );
}
