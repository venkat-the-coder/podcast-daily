import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import {
  Mic2,
  Sparkles,
  Calendar,
  Check,
  Newspaper,
  Zap,
  TrendingUp,
  FileText,
  Headphones,
  Clock,
  Settings as SettingsIcon,
  Users
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Hero Section with Gradient Mesh Background */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-700 to-blue-900 animate-gradient">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(at_40%_20%,rgb(102,126,234)_0px,transparent_50%),radial-gradient(at_80%_0%,rgb(118,75,162)_0px,transparent_50%),radial-gradient(at_0%_50%,rgb(240,147,251)_0px,transparent_50%)]"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 container mx-auto px-4 py-6 flex justify-between items-center">
          <Logo size="md" />
          <div className="flex gap-4 items-center">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-white hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-white text-purple-700 hover:bg-gray-100 hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-fadeIn">
            Your Daily News,
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              As a Podcast
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto animate-fadeIn delay-200">
            Get a personalized 5-minute podcast every day from your favorite
            news sources. Powered by AI, delivered to your ears.
          </p>

          <Link href="/sign-up">
            <button className="group relative px-12 py-5 text-lg font-semibold rounded-full bg-white text-purple-900 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 animate-fadeIn delay-300">
              <span className="relative z-10 flex items-center gap-2">
                Start Free Today
                <Sparkles className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
          </Link>

          {/* Feature Cards */}
          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Mic2 className="w-8 h-8" />}
              title="Choose Your Sources"
              description="Select from top news outlets like BBC, CNN, TechCrunch, and more"
              delay="delay-100"
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="AI-Generated"
              description="Our AI creates a natural, professional podcast script just for you"
              delay="delay-200"
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8" />}
              title="Daily Delivery"
              description="Schedule your podcast for any time that fits your routine"
              delay="delay-300"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-32 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Section Header */}
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

          {/* How It Works Steps */}
          <div className="space-y-8 mb-20">
            <HowItWorksStep
              number="1"
              icon={<Newspaper className="w-8 h-8" />}
              title="Select Your News Sources"
              description="Choose from premium news outlets like BBC, CNN, TechCrunch, The Verge, and more. You decide what goes into your podcast!"
              gradient="from-blue-500 to-cyan-500"
              details={[
                "7+ premium news sources available",
                "Mix and match categories (Tech, General, Business)",
                "Update your sources anytime",
              ]}
            />

            <HowItWorksStep
              number="2"
              icon={<Zap className="w-8 h-8" />}
              title="Click 'Generate Episode'"
              description="With one click, our AI springs into action. It's time to create your personalized news podcast!"
              gradient="from-purple-500 to-pink-500"
              details={[
                "Takes 1-3 minutes to complete",
                "Free tier: 1 episode per day",
                "Pro tier: Unlimited episodes",
              ]}
            />

            <HowItWorksStep
              number="3"
              icon={<TrendingUp className="w-8 h-8" />}
              title="AI Fetches Latest Articles"
              description="Our system reads RSS feeds from your selected sources and gathers the most recent and relevant articles."
              gradient="from-green-500 to-emerald-500"
              details={[
                "Real-time RSS feed parsing",
                "Smart article prioritization",
                "Global news coverage",
              ]}
            />

            <HowItWorksStep
              number="4"
              icon={<FileText className="w-8 h-8" />}
              title="AI Writes Your Podcast Script"
              description="OpenAI's advanced language model analyzes the articles and crafts a compelling podcast script, just like a professional news anchor would deliver."
              gradient="from-orange-500 to-red-500"
              details={[
                "Powered by OpenAI GPT",
                "Professional news anchor style",
                "Natural conversational tone",
              ]}
            />

            <HowItWorksStep
              number="5"
              icon={<Mic2 className="w-8 h-8" />}
              title="AI Generates Voice Audio"
              description="ElevenLabs text-to-speech technology converts the script into crystal-clear, natural-sounding audio narration."
              gradient="from-pink-500 to-purple-500"
              details={[
                "High-quality AI voice",
                "Natural human-like speech",
                "Professional podcast quality",
              ]}
            />

            <HowItWorksStep
              number="6"
              icon={<Headphones className="w-8 h-8" />}
              title="Listen to Your Podcast!"
              description="Your personalized podcast is ready! Stream it directly in your browser or download it for offline listening."
              gradient="from-indigo-500 to-blue-500"
              details={[
                "Built-in audio player",
                "Mobile-friendly playback",
                "View source articles",
              ]}
            />
          </div>

          {/* Why Users Love It */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
              ✨ Why Users Love PodcastDaily
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              <BenefitCard
                icon={<Clock className="w-10 h-10" />}
                title="Save Time"
                description="Stay informed in minutes instead of hours of reading"
                gradient="from-purple-100 to-pink-100"
                iconGradient="from-purple-600 to-pink-600"
              />

              <BenefitCard
                icon={<Sparkles className="w-10 h-10" />}
                title="AI-Powered"
                description="Cutting-edge technology delivers premium quality"
                gradient="from-blue-100 to-cyan-100"
                iconGradient="from-blue-600 to-cyan-600"
              />

              <BenefitCard
                icon={<SettingsIcon className="w-10 h-10" />}
                title="Personalized"
                description="You control the sources and topics that matter"
                gradient="from-green-100 to-emerald-100"
                iconGradient="from-green-600 to-emerald-600"
              />

              <BenefitCard
                icon={<Calendar className="w-10 h-10" />}
                title="Daily Updates"
                description="Fresh content delivered automatically every day"
                gradient="from-orange-100 to-red-100"
                iconGradient="from-orange-600 to-red-600"
              />

              <BenefitCard
                icon={<Users className="w-10 h-10" />}
                title="Multi-Source"
                description="Aggregate news from multiple trusted outlets"
                gradient="from-pink-100 to-purple-100"
                iconGradient="from-pink-600 to-purple-600"
              />

              <BenefitCard
                icon={<Zap className="w-10 h-10" />}
                title="Fast & Easy"
                description="One-click generation, instant results"
                gradient="from-indigo-100 to-blue-100"
                iconGradient="from-indigo-600 to-blue-600"
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl animate-scaleIn">
            <h3 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started? 🚀
            </h3>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who stay informed in minutes, not hours!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-white text-purple-700 hover:bg-purple-50 font-bold text-lg px-8 py-6 shadow-xl"
                >
                  <Sparkles className="w-6 h-6 mr-2" />
                  Start Free Today
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-purple-700 font-bold text-lg px-8 py-6 shadow-xl transition-all"
                >
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="text-purple-100 mt-6 text-sm">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-32 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fadeIn">
            <h3 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Simple Pricing
              </span>
            </h3>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <PricingCard
              tier="Free"
              price="$0"
              features={[
                "1 episode per day",
                "Choose from 7 news sources",
                "5-minute episodes",
                "AI-powered generation",
              ]}
            />
            <PricingCard
              tier="Pro"
              price="$9.99"
              features={[
                "Unlimited episodes",
                "All news sources",
                "Priority generation",
                "Early access to features",
                "Custom scheduling",
              ]}
              highlighted
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className={`glass rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group animate-slideUp ${delay}`}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform text-white">
        {icon}
      </div>
      <h4 className="text-2xl font-bold text-white mb-3">{title}</h4>
      <p className="text-purple-200">{description}</p>
    </div>
  );
}

function HowItWorksStep({
  number,
  icon,
  title,
  description,
  gradient,
  details,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
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
              <h4 className="text-2xl font-bold text-gray-900">{title}</h4>
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

function BenefitCard({
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

function PricingCard({
  tier,
  price,
  features,
  highlighted,
}: {
  tier: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div className="relative group animate-scaleIn">
      {/* Glowing border effect for Pro */}
      {highlighted && (
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition animate-pulse-glow"></div>
      )}

      <div
        className={`relative rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
          highlighted
            ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
            : "bg-white"
        }`}
      >
        {highlighted && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
            Most Popular
          </div>
        )}

        <h4 className="text-3xl font-bold mb-2">{tier}</h4>
        <p className="text-5xl font-bold mb-8">
          {price}
          <span className="text-lg font-normal opacity-80">/month</span>
        </p>

        <ul className="space-y-4 mb-10">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  highlighted
                    ? "bg-white/20"
                    : "bg-gradient-to-br from-purple-100 to-blue-100"
                }`}
              >
                <Check
                  className={`w-4 h-4 ${
                    highlighted ? "text-white" : "text-purple-600"
                  }`}
                />
              </div>
              <span className={highlighted ? "text-white" : "text-gray-700"}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <Link href="/sign-up">
          <Button
            variant={highlighted ? "outline" : "default"}
            className={`w-full ${
              highlighted ? "bg-white text-purple-700 hover:bg-gray-100 border-white" : ""
            }`}
            size="lg"
          >
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}
