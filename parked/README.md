# Parked code

Nothing here is built or served. These files were moved out of the way when the
site became a fully static markdown wiki hosted on Cloudflare Pages; they are
kept in the repository because the work is finished and reusable, not abandoned.

`parked/` is excluded from `tsconfig.json`, so it is not typechecked and not
compiled. Dependencies it needs (`@supabase/*`, `next-sanity`, `sanity`,
`react-dropzone`, some Radix packages) are still listed in `package.json` —
delete them only if you decide this code is never coming back.

## What is here and why it was parked

| Path | Why |
|---|---|
| `app/account`, `app/admin`, `app/profiles` | Need Supabase auth, cookies and server rendering. A static export has no server, so they cannot run at all. |
| `lib/supabase`, `proxy.ts`, `supabase/migration.sql` | The Supabase client, the session-refresh proxy, and the full schema with RLS policies for the community features. |
| `app/studio`, `app/api/revalidate`, `sanity/` | The Sanity CMS layer: embedded Studio, revalidation webhook, 9 document schemas and the GROQ queries. Replaced by `content/` markdown. |
| `app/games`, `app/learn`, `app/vendors`, `app/tools`, `app/search` | Sanity-backed routes. They have no content and no `generateStaticParams`, so they would break the static export. Their concepts return on the markdown model — see below. |
| `components/game`, `components/vendor`, `components/profiles`, `components/content` | Only used by the routes above. `components/vendor/SettingExplainer.tsx` is worth reading before writing the game-settings UI. |
| `types-sanity-supabase.ts` | The old `src/types/index.ts`. Content types now live in `src/lib/content/loader.ts`; the Supabase interfaces are still accurate for the parked tables. |
| `deploy-linode/` | Linode + Apache + PM2 deployment for the standalone Node build. Superseded by `deploy/CLOUDFLARE-PAGES.md`. |

## Bringing something back

**Games and hardware pages (planned).** Both were kept in scope deliberately, but
they belong on the same markdown model rather than on Sanity. That means new
content types under `content/` (`games/`, `wheelbases/`, and per-game in-game
settings), plus routes at `/games/[game]` and
`/manufacturers/[manufacturer]/hardware/[wheelbase]`. Note the extra `hardware`
segment: `/manufacturers/[manufacturer]/[setting]` already occupies that level,
and two sibling dynamic segments cannot coexist.

**Learn articles.** The smallest migration: frontmatter markdown in
`content/articles/` and a route that renders the body with the existing
`.content-prose` styles.

**Community features.** These cannot return to a static site. They need their own
deployment — a separate app on a subdomain, with `migration.sql` applied to a
fresh Supabase project. The wiki stays static either way.
