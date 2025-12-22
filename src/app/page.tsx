import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">PodcastDaily</h1>
        <div className="space-x-4">
          <Link href="/sign-in">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Your Daily News,
          <br />
          <span className="text-blue-600">As a Podcast</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Get a personalized 5-minute podcast every day from your favorite news
          sources. Powered by AI, delivered to your ears.
        </p>
        <Link href="/sign-up">
          <Button size="lg" className="text-lg px-8 py-6">
            Start Free Today
          </Button>
        </Link>

        <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <FeatureCard
            title="Choose Your Sources"
            description="Select from top news outlets like BBC, CNN, TechCrunch, and more"
          />
          <FeatureCard
            title="AI-Generated"
            description="Our AI creates a natural, professional podcast script just for you"
          />
          <FeatureCard
            title="Daily Delivery"
            description="Schedule your podcast for any time that fits your routine"
          />
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 bg-white">
        <h3 className="text-3xl font-bold text-center mb-12">Simple Pricing</h3>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingCard
            tier="Free"
            price="$0"
            features={[
              "1 episode per day",
              "Choose from 7 news sources",
              "5-minute episodes",
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
            ]}
            highlighted
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
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
    <div
      className={`p-8 rounded-lg ${
        highlighted ? "bg-blue-600 text-white" : "bg-gray-50"
      }`}
    >
      <h4 className="text-2xl font-bold mb-2">{tier}</h4>
      <p className="text-4xl font-bold mb-6">
        {price}
        <span className="text-lg font-normal">/month</span>
      </p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center">
            <CheckIcon />
            <span className="ml-2">{feature}</span>
          </li>
        ))}
      </ul>
      <Link href="/sign-up">
        <Button
          variant={highlighted ? "secondary" : "default"}
          className="w-full"
          size="lg"
        >
          Get Started
        </Button>
      </Link>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
