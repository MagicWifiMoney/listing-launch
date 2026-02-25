# ListingLaunch

AI-powered real estate listing content pack generator. Enter your listing details once, get 6 pieces of marketing content instantly.

## Content Types Generated

- **Instagram Carousel** — 5-slide copy + caption + hashtags
- **Facebook Post** — Long-form with emojis
- **Email to Past Clients** — Just Listed announcement
- **Open House Announcement** — Ready-to-share flyer
- **SMS Follow-up Sequence** — 3 texts over 7 days
- **Video Script** — 30s walkthrough with shot directions

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + SQLite
- NextAuth.js (credentials)
- Stripe (subscription + pay-per-use)
- Claude API (Anthropic)
- jsPDF (PDF export)

## Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Add your API keys to `.env`:

- `ANTHROPIC_API_KEY` — Required for content generation
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` — Required for payments
- `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with pricing |
| `/login` | Sign in |
| `/register` | Create account |
| `/generate` | Input listing details, generate content pack |
| `/history` | View past listings and content |
| `/settings` | Agent profile, tone, billing |

## Database Models

- **User** — Auth and profile
- **AgentProfile** — Name, brokerage, tone preference
- **Listing** — Property details
- **Generation** — Generated content per listing
- **Subscription** — Stripe subscription tracking
- **UsageCredit** — Pay-per-listing credits

## Pricing

- **$29/month** — Unlimited listings (subscription)
- **$9/listing** — Pay as you go (credits)
