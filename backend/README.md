# SDC AI — production backend

Secure server-side API for the SDC website's AI assistant.

## What is included

- OpenAI Responses API through the official `openai` JavaScript SDK.
- Server-only `OPENAI_API_KEY`.
- SDC-only grounding using `knowledge/sdc.json`.
- Prompt-injection resistance: user content is treated as untrusted input.
- Optional OpenAI moderation (`omni-moderation-latest`).
- Request validation and bounded conversation history.
- Per-instance rate limiting and origin allowlisting.
- 25-second upstream timeout.
- Request IDs for support/debugging without logging user prompts.
- `store: false` on Responses API requests.
- Versioned SDC knowledge and official source links.


## Deploy on Vercel

1. Create a Vercel project from this `backend/` directory.
2. In **Project → Settings → Environment Variables**, add `OPENAI_API_KEY` as a server-side secret.
3. Add `ALLOWED_ORIGINS` with the exact browser origin(s), comma-separated. For the current GitHub Pages site this is typically:

   `https://josh-ruben.github.io`

4. Optional variables are documented in `.env.example`.
5. Deploy/redeploy after saving environment variables.
6. Your endpoint will be:

   `https://YOUR-PROJECT.vercel.app/api/chat`

7. Put that endpoint in the website root `ai-config.js`.

## Security notes

Never commit `.env`, a real API key, or any `NEXT_PUBLIC_*` secret.

The included in-memory rate limiter is intentionally dependency-free, but serverless instances do not share memory. For high traffic, put a shared rate limiter/WAF in front of this endpoint.

## Knowledge updates

Edit only `knowledge/sdc.json`, update its `version` and `last_verified`, verify every changed fact against an official SDC source, and redeploy.
