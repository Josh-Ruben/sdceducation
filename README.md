# Shree Devi Group of Colleges — MIT-style institutional website

Static GitHub Pages frontend for SDC, with a separate secure SDC AI backend.

## SDC AI
The frontend calls the endpoint configured in `ai-config.js`. The production backend is in `backend/` and is designed for Vercel serverless deployment using the OpenAI Responses API.

### Important
GitHub Pages is static hosting. It cannot safely run the server-side OpenAI API call or hold a private API key. Deploy `backend/` to a serverless runtime, set `OPENAI_API_KEY` there, then set the public endpoint in `ai-config.js`.

The backend includes a curated SDC knowledge layer in `backend/knowledge/sdc.json` and instructs the model not to invent unsupported college facts.
