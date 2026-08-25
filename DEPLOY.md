# Deploying the NRB JIC Landing Page to Staging

The production build is already in `landing-page/dist/` (self-contained static files — no server needed).

## Option A — Netlify Drop (fastest, ~5 minutes)

1. Open https://app.netlify.com/drop in your browser (free account or sign in with Google/GitHub).
2. Drag the `landing-page/dist` folder onto the drop zone.
3. Netlify assigns an instant URL like `https://random-name.netlify.app` → share that with NRB.
4. Optionally rename the site: Site settings → Change site name → `nrb-jic-staging` → `https://nrb-jic-staging.netlify.app`.

## Option B — Vercel CLI (~10 minutes)

```bash
cd landing-page
npx vercel login        # one-time
npx vercel --prod       # accept defaults; prints the staging URL
```

## Option C — Give ZCode a token (fully automated)

Create a Netlify personal access token (User settings → Applications) or Vercel token and provide it in the session — the deploy can then be driven end-to-end without any manual steps.

## After staging is live

- Share the URL with NRB for review.
- Collect: thread-data confirmation (SAE J514 assumptions are flagged on-page), brand asset feedback (blues extracted from their own banner: azure #1188F8, navy #283858), and any commercial-claim wording changes.
- Custom domain later: point `jic.nrbhydro.com` (or similar) at the host — free on both platforms.
