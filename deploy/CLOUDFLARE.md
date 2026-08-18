# Deploying to Cloudflare

The site is a fully static export: `npm run build` writes plain HTML, CSS and JS
to `out/`. There is no Node process to run, no database, and no environment
variable to configure.

## Workers or Pages?

**Use Workers.** Cloudflare's own guidance is that new projects should start on
Workers: Pages keeps working, but all new investment, optimisation and feature
work goes to Workers static assets. For a purely static site both platforms
serve the same files at the same edge, so this is a choice about which product
will still be getting attention in two years, not about capability today.

Everything this site needs works on both, including the `_redirects` file.

## Workers setup

[`wrangler.jsonc`](../wrangler.jsonc) is already configured:

```jsonc
{
  "name": "ffb-guide",
  "compatibility_date": "2026-08-18",
  "assets": {
    "directory": "./out",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
```

`html_handling: auto-trailing-slash` matches `trailingSlash: true` in
[`next.config.ts`](../next.config.ts): the export writes `path/index.html` and
Cloudflare serves it at `/path/`. `not_found_handling: 404-page` serves
`out/404.html` with a real 404 status.

### Deploy from your machine

```bash
npm run build
npx wrangler@latest deploy
```

The first run asks you to log in and creates the Worker. Consider pinning
wrangler as a devDependency (`npm i -D wrangler`) if you want reproducible
deploys rather than whatever `@latest` resolves to.

### Deploy on git push (Workers Builds)

In the dashboard: **Workers & Pages → your Worker → Settings → Builds → Connect**,
then point it at the repository and set:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

The Worker name in the dashboard must match `name` in `wrangler.jsonc`
(`ffb-guide`), or the build fails. If the repo had no wrangler config, Cloudflare
would try to autodetect the framework and open a PR with one — it does not need
to, since the config is committed.

`npm run build` runs `check:content` first, so malformed frontmatter or a
dangling reference fails the deploy instead of publishing a broken page.

## Redirects

[`public/_redirects`](../public/_redirects) is copied verbatim into `out/` and
handles the old URL structure (`/vendors/*` → `/manufacturers/*`,
`/tools/glossary` → `/glossary`). Add new rules there, most specific first; the
first match wins. The limit is 2,000 static and 100 dynamic rules. A
`_headers` file works the same way if you need custom headers, and redirects are
evaluated before headers.

## Custom domain

Add `ffbguide.com` under the Worker's **Domains & Routes**. If the zone is
already on Cloudflare the DNS record and certificate are handled for you.

## If you would rather use Pages

Same build, different product: build command `npm run build`, build output
directory `out`, no environment variables. `_redirects` behaves identically.
`wrangler.jsonc` is ignored by Pages, so it can stay in the repo.

## Local preview of the real output

`npm run dev` is the fast loop for writing content. To check what actually gets
deployed:

```bash
npm run build
npx wrangler@latest dev      # serves ./out exactly as Workers will
```

## What cannot be added without leaving static hosting

Route handlers (`app/api/*`), proxy/middleware, server actions, image
optimisation, and incremental revalidation. Publishing is a git push: Cloudflare
rebuilds and the new HTML is live.

Note that Workers *can* run server-side code — that is its whole point — so if
you later want an API route or server rendering, the move is to add a `main`
entry point to `wrangler.jsonc` and drop `output: "export"`, rather than to
change platforms.
