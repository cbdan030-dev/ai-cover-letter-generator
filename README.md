# AI Cover Letter Generator

An AI-powered cover letter generator built with Next.js 15, Tailwind CSS, and the Google Gemini API. Paste a job description and a short bio, and get a tailored cover letter in seconds.

**Live demo:** [ai-cover-letter-generator-sandy.vercel.app](https://ai-cover-letter-generator-sandy.vercel.app/)

## Features

- Tailored cover letters generated from job description + candidate background
- 4 tone options: Professional, Friendly, Enthusiastic, Concise & Direct
- Multi-model fallback chain (2.5-flash → 2.5-flash-lite → 2.0-flash → 2.0-flash-lite) for reliability when upstream models are unavailable
- One-click copy to clipboard
- Responsive UI built with Tailwind CSS
- Serverless deployment on Vercel

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini API (@google/generative-ai)
- **Deployment:** Vercel
- **Development:** Claude Code + Cursor (AI-assisted)

## How It Works

1. User pastes a job description and a short resume / background summary
2. User selects the desired tone
3. Frontend sends a POST request to `/api/generate`
4. API route builds a structured prompt (with XML tags for clarity) and calls Gemini
5. If the primary model is rate-limited or unavailable, the fallback chain automatically tries the next model
6. The generated cover letter is returned and displayed in the UI

## Running Locally

```bash
# Clone the repo
git clone https://github.com/cbdan030-dev/ai-cover-letter-generator.git
cd ai-cover-letter-generator

# Install dependencies
npm install

# Add your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com).

## Prompt Engineering Notes

The prompt uses a few techniques from the Anthropic prompt engineering toolkit:

- **XML structuring** — `<job_description>`, `<candidate_background>`, `<tone>`, `<instructions>` tags separate the different parts of the prompt cleanly
- **Clear role** — "You are an expert career coach..."
- **Explicit constraints** — length, opening hook, forbidden clichés, no placeholder text
- **Output control** — "Return ONLY the cover letter text, no preamble, no markdown"

## Architecture Decisions

- **Fallback chain over single-model calls.** LLM APIs go down, get rate-limited, or deprecate models without notice. A fallback chain turns a brittle single-point-of-failure into graceful degradation.
- **Server-side API key.** The Gemini key lives in a server environment variable; the browser never sees it.
- **Stateless API.** No database, no auth — simpler to reason about, cheaper to run, easy to port.

## Roadmap

- [ ] Streaming responses (word-by-word output like Claude.ai)
- [ ] Save & edit generated letters
- [ ] Multi-language support (Romanian, Russian, others)
- [ ] Automated evals on a test suite of 30+ job/resume pairs

## Author

**Dan Ceban** — Full-Stack Vibe Coder  
[GitHub](https://github.com/cbdan030-dev) · Chișinău, Moldova

Built as a portfolio project to demonstrate AI-assisted full-stack development. Certified across the Anthropic Academy developer track.

## License

MIT
