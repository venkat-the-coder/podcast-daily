"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Newspaper,
  FileText,
  Mic,
  Headphones,
  Clock,
  Zap,
  Settings,
  Calendar,
  Users,
  TrendingUp,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function HowItWorksPage() {
  const router = useRouter();

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
                  <Sparkles className="w-8 h-8" />
                  How It Works
                </h1>
                <p className="text-purple-200 mt-1">
                  Your AI-powered daily news podcast explained
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
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-float">
            <Headphones className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              From News to Podcast in Minutes
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PodcastDaily transforms the latest news from your favorite sources
            into a personalized audio podcast using cutting-edge AI technology
          </p>
        </div>

        {/* The Process - Step by Step */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            🎯 The Magic Behind Your Daily Podcast
          </h3>

          <div className="space-y-8">
            {/* Step 1 */}
            <StepCard
              number="1"
              icon={<Newspaper className="w-8 h-8" />}
              title="Select Your News Sources"
              description="Choose from premium news outlets like BBC, CNN, TechCrunch, The Verge, and more. You decide what goes into your podcast!"
              emoji="📰"
              gradient="from-blue-500 to-cyan-500"
              details={[
                "✅ 7+ premium news sources available",
                "✅ Mix and match categories (Tech, General, Business)",
                "✅ Update your sources anytime in Settings",
              ]}
            />

            {/* Step 2 */}
            <StepCard
              number="2"
              icon={<Zap className="w-8 h-8" />}
              title="Click 'Generate Episode'"
              description="With one click, our AI springs into action. It's time to create your personalized news podcast!"
              emoji="⚡"
              gradient="from-purple-500 to-pink-500"
              details={[
                "⏱️ Takes 1-3 minutes to complete",
                "🎯 Free tier: 1 episode per day",
                "🚀 Pro tier: Unlimited episodes",
              ]}
            />

            {/* Step 3 */}
            <StepCard
              number="3"
              icon={<TrendingUp className="w-8 h-8" />}
              title="AI Fetches Latest Articles"
              description="Our system reads RSS feeds from your selected sources and gathers the most recent and relevant articles."
              emoji="🔍"
              gradient="from-green-500 to-emerald-500"
              details={[
                "📡 Real-time RSS feed parsing",
                "📊 Smart article prioritization",
                "🌍 Global news coverage",
              ]}
            />

            {/* Step 4 */}
            <StepCard
              number="4"
              icon={<FileText className="w-8 h-8" />}
              title="AI Writes Your Podcast Script"
              description="OpenAI's advanced language model analyzes the articles and crafts a compelling podcast script, just like a professional news anchor would deliver."
              emoji="✍️"
              gradient="from-orange-500 to-red-500"
              details={[
                "🤖 Powered by OpenAI GPT",
                "📝 Professional news anchor style",
                "🎭 Natural conversational tone",
              ]}
            />

            {/* Step 5 */}
            <StepCard
              number="5"
              icon={<Mic className="w-8 h-8" />}
              title="AI Generates Voice Audio"
              description="ElevenLabs text-to-speech technology converts the script into crystal-clear, natural-sounding audio narration."
              emoji="🎙️"
              gradient="from-pink-500 to-purple-500"
              details={[
                "🎵 High-quality AI voice",
                "🗣️ Natural human-like speech",
                "⚡ Professional podcast quality",
              ]}
            />

            {/* Step 6 */}
            <StepCard
              number="6"
              icon={<Headphones className="w-8 h-8" />}
              title="Listen to Your Podcast!"
              description="Your personalized podcast is ready! Stream it directly in your browser or download it for offline listening."
              emoji="🎧"
              gradient="from-indigo-500 to-blue-500"
              details={[
                "▶️ Built-in audio player",
                "📱 Mobile-friendly playback",
                "🔗 View source articles",
              ]}
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            ✨ Why Users Love PodcastDaily
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Clock className="w-10 h-10" />}
              title="Save Time"
              description="Stay informed in minutes instead of hours of reading"
              gradient="from-purple-100 to-pink-100"
              iconGradient="from-purple-600 to-pink-600"
            />

            <FeatureCard
              icon={<Sparkles className="w-10 h-10" />}
              title="AI-Powered"
              description="Cutting-edge technology delivers premium quality"
              gradient="from-blue-100 to-cyan-100"
              iconGradient="from-blue-600 to-cyan-600"
            />

            <FeatureCard
              icon={<Settings className="w-10 h-10" />}
              title="Personalized"
              description="You control the sources and topics that matter"
              gradient="from-green-100 to-emerald-100"
              iconGradient="from-green-600 to-emerald-600"
            />

            <FeatureCard
              icon={<Calendar className="w-10 h-10" />}
              title="Daily Updates"
              description="Fresh content delivered automatically every day"
              gradient="from-orange-100 to-red-100"
              iconGradient="from-orange-600 to-red-600"
            />

            <FeatureCard
              icon={<Users className="w-10 h-10" />}
              title="Multi-Source"
              description="Aggregate news from multiple trusted outlets"
              gradient="from-pink-100 to-purple-100"
              iconGradient="from-pink-600 to-purple-600"
            />

            <FeatureCard
              icon={<Zap className="w-10 h-10" />}
              title="Fast & Easy"
              description="One-click generation, instant results"
              gradient="from-indigo-100 to-blue-100"
              iconGradient="from-indigo-600 to-blue-600"
            />
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            💎 Free vs Pro Tier
          </h3>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-lg font-bold">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-bold">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-bold">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    Episodes per day
                  </td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium">1</td>
                  <td className="px-6 py-4 text-center text-purple-700 font-bold">
                    ♾️ Unlimited
                  </td>
                </tr>
                <tr className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">News sources</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium">✅ All</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium">✅ All</td>
                </tr>
                <tr className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">Audio quality</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium">✅ High</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium">✅ High</td>
                </tr>
                <tr className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    Scheduled generation
                  </td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium">✅ Daily 9 AM</td>
                  <td className="px-6 py-4 text-center text-purple-700 font-bold">
                    ✅ Custom time
                  </td>
                </tr>
                <tr className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">Priority support</td>
                  <td className="px-6 py-4 text-center text-gray-900 font-medium">-</td>
                  <td className="px-6 py-4 text-center text-purple-700 font-bold">
                    ✅
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl animate-scaleIn">
          <h3 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started? 🚀
          </h3>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Create your first personalized news podcast in just a few clicks!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/dashboard")}
              size="lg"
              className="bg-white text-purple-700 hover:bg-purple-50 font-bold text-lg px-8 py-6 shadow-xl"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Go to Dashboard
            </Button>
            <Button
              onClick={() => router.push("/settings")}
              size="lg"
              className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-purple-700 font-bold text-lg px-8 py-6 shadow-xl transition-all"
            >
              <Settings className="w-6 h-6 mr-2" />
              Manage Sources
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
  emoji,
  gradient,
  details,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  emoji: string;
  gradient: string;
  details: string[];
}) {
  return (
    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-scaleIn">
      {/* Gradient Top Border */}
      <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>

      <div className="p-8">
        <div className="flex items-start gap-6">
          {/* Step Number */}
          <div
            className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0`}
          >
            {number}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-md`}
              >
                {icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-2xl font-bold text-gray-900">{title}</h4>
                  <span className="text-3xl">{emoji}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              {description}
            </p>

            {/* Details */}
            <div className="space-y-2">
              {details.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-gray-600"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient}`}
                  ></div>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
  iconGradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconGradient: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      <div
        className={`w-16 h-16 bg-gradient-to-br ${iconGradient} rounded-xl flex items-center justify-center text-white mb-4 shadow-md`}
      >
        {icon}
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}
