# RoastGit

Tasteful, minimal GitHub profile roasts with a premium, calm UI. Built to feel intentional, not gimmicky.

## Product Decisions (Aligned to Vision)
- Minimal layout with generous whitespace, soft shadows, and a neutral palette.
- One primary action per screen.
- AI calls happen once per roast; everything else is deterministic.
- GitHub data collection is paginated and aggressively trimmed.

## Folder Structure
```
.
├── src
│   ├── ai
│   │   ├── AIClient.ts
│   │   ├── MockAIClient.ts
│   │   ├── OpenAIClient.ts
│   │   ├── PerplexityClient.ts
│   │   └── index.ts
│   ├── app
│   │   ├── api
│   │   │   └── roast
│   │   │       └── route.ts
│   │   ├── roast
│   │   │   └── [username]
│   │   │       ├── loading.tsx
│   │   │       └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── LandingHero.tsx
│   │   ├── RoastFlow.tsx
│   │   ├── RoastSummaryCard.tsx
│   │   └── UsernameForm.tsx
│   └── lib
│       ├── cache.ts
│       ├── github.ts
│       ├── pagination.ts
│       ├── rateLimit.ts
│       ├── roast.ts
│       ├── roastSummary.ts
│       ├── types.ts
│       └── utils.ts
├── .env.example
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Architecture Overview
### Frontend
- Landing page (`/`) presents a single input and CTA.
- Roast page (`/roast/[username]`) loads the roast and runs a short, button-driven conversation.
- After the final reply, the chat fades out and a premium summary card fades in.

### Backend
- GitHub REST API calls are server-side only.
- Rate limiting is applied in the roast API route.
- A short-lived in-memory cache prevents repeat AI calls for the same username.

### AI Abstraction
All AI provider logic lives in `/src/ai`.
- `AIClient` defines the interface.
- `OpenAIClient` and `MockAIClient` implement it.
- `getAIClient()` is the only place that chooses the provider.

Switching providers is a **one-line change**:
```
AI_PROVIDER=openai
```
or
```
AI_PROVIDER=perplexity
```

## Backend API Routes
- `POST /api/roast`
  - Body: `{ "username": "octocat" }`
  - Returns: `RoastOutput` (messages + summary)
  - Rate limit: 6 requests / minute per IP

## GitHub Data Collection (REST + Pagination)
- Profile summary: `/users/{username}`
- Top 5 recent repos: `/users/{username}/repos?sort=updated&per_page=5`
- Up to 10 commits: per-repo `/commits?author={username}` with paginated early exits
- Up to 5 comments: `/users/{username}/events/public` filtered to comment events

Pagination is centralized in `src/lib/pagination.ts` and always exits early once limits are reached.

## Performance Rules
- 1 AI call per roast.
- GitHub data trimmed and capped.
- Cached roasts expire after ~7 minutes.

## Example Roast Output
```
Your commit history reads like a minimalist novel—short, intentional, and a little quiet.
The repo names suggest you iterate fast, which is efficient, if not always memorable.
Still, your code cadence is clean and steady, and that discipline shows.
```

## Local Development
```
npm install
npm run dev
```

Set environment variables from `.env.example`.
