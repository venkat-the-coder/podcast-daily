# PodcastDaily - AI News Podcast Generator

A Next.js web application that generates daily podcast episodes from RSS news feeds using AI.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router) with TypeScript & Tailwind CSS
- **Backend**: Convex (database + backend logic)
- **Auth**: Clerk
- **Payments**: Polar
- **AI Services**:
  - OpenAI GPT-4 (script generation)
  - ElevenLabs (text-to-speech)
- **Storage**: Convex File Storage

## Getting Started

### Prerequisites

1. Node.js 20+ installed
2. Accounts created for:
   - [Clerk](https://clerk.com) - Authentication
   - [Convex](https://convex.dev) - Backend
   - [OpenAI](https://platform.openai.com) - AI script generation
   - [ElevenLabs](https://elevenlabs.io) - Text-to-speech
   - [Polar](https://polar.sh) - Payments (optional)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Initialize Convex:
```bash
npx convex dev
```

This will:
- Prompt you to log in to Convex
- Create a new Convex project
- Generate `.env.local` with Convex environment variables

3. Configure Clerk:
   - Create a Clerk application
   - Create a JWT template for Convex in Clerk Dashboard
   - Copy your publishable and secret keys to `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

4. Set up AI service keys (via Convex environment):
```bash
npx convex env set OPENAI_API_KEY sk-...
npx convex env set ELEVENLABS_API_KEY el_...
npx convex env set ELEVENLABS_VOICE_ID <voice-id>
```

5. Seed the news sources:
   - Go to your Convex dashboard
   - Run the `sources.seedNewsSources` mutation

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

The Convex backend runs automatically when you use `npx convex dev`.

## Features

- User authentication with Clerk
- Select from curated news sources (BBC, CNN, TechCrunch, etc.)
- AI-generated 5-minute podcast scripts
- Professional text-to-speech audio generation
- User-configurable daily podcast scheduling
- Rate limiting (Free: 1/day, Pro: unlimited)
- Subscription management with Polar

## Project Structure

```
podcast-daily/
├── convex/                     # Convex backend
│   ├── ai/                    # AI integration functions
│   ├── scheduled/             # Cron jobs
│   ├── schema.ts              # Database schema
│   ├── users.ts               # User management
│   ├── sources.ts             # News sources
│   ├── episodes.ts            # Episode generation
│   ├── http.ts                # Webhooks
│   └── crons.ts               # Cron configuration
├── src/
│   ├── app/                   # Next.js pages
│   ├── components/            # React components
│   └── lib/                   # Utilities
└── public/                    # Static assets
```

## Deployment

### Deploy Convex

```bash
npx convex deploy --prod
```

### Deploy Next.js (Vercel)

```bash
vercel --prod
```

### Configure Webhooks

After deployment, set up webhooks:

1. **Clerk Webhook**:
   - URL: `https://[your-convex-deployment].convex.site/clerk-webhook`
   - Events: `user.created`, `user.updated`

2. **Polar Webhook**:
   - URL: `https://[your-convex-deployment].convex.site/polar-webhook`
   - Events: `subscription.created`, `subscription.updated`

## License

MIT
