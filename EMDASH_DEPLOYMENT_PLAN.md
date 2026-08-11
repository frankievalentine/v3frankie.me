# Emdash Deployment Plan: v3frankie.me

## Target Architecture

```
Internet
  |
  v
Cloudflare DNS (v3frankie.me CNAME -> Tunnel UUID)
  |
  v
Cloudflare Tunnel (cloudflared, quic)     <-- no public ports on the box
  |
  v
127.0.0.1:3000
  |
  +-- Node 22.12+ (node ./dist/server/entry.mjs)
        |
        +-- Astro SSR (output: server, adapter: @astrojs/node, mode: standalone)
        |     |
        |     +-- Public routes: /, /posts, /projects, /photography, /uses,
        |     |                   /newsletter, /homelab, /rss.xml, /sitemap-index.xml
        |     +-- Admin: /_emdash/admin
        |     +-- API:   /_emdash/api/*
        |     +-- Preview: signed _preview query parameter on content URLs
        |
        +-- Emdash CMS (Astro integration, runs in-process)
        |     |
        |     +-- SQLite (better-sqlite3) or libSQL (spike required)
        |     +-- Built-in collection search (replaces Pagefind for CMS content)
        |
        +-- Media files: /var/lib/v3frankie/media/ (local disk, served via Emdash API)
        |
        +-- Backup agent (rclone -> Cloudflare R2, client-side encrypted)
```

**No reverse proxy in front of Node initially.** Cloudflare Tunnel connects directly to the Node process on 127.0.0.1:3000. Angie/nginx can be added later if needed for multiple services on the same box.

---

## Scope

### In Scope

- Migrate from static Astro (output: static, @astrojs/cloudflare on Cloudflare Workers) to Astro SSR (output: server, @astrojs/node).
- Install and configure Emdash as the CMS integration.
- Stage 1: run Emdash alongside existing Astro content collections. Stage 2: migrate content into Emdash collections.
- Replace Pagefind with Emdash built-in runtime search for CMS-managed content, with parity testing before Pagefind removal.
- Deploy to a low-powered Linux box behind Cloudflare Tunnel.
- Store media locally on the Linux box, served via Emdash's media API.
- Back up database + media to Cloudflare R2 (client-side encrypted, off-host).
- Migrate navigation from static `src/navigation.ts` to Emdash-managed navigation, contingent on schema mapping validation.
- Migrate RSS feed from `@astrojs/rss` + `getCollection("posts")` to Emdash data source.
- Add a runtime sitemap endpoint for dynamic SSR routes.
- Remove Cloudflare Workers adapter, wrangler, @astrojs/cloudflare, astro-pagefind dependencies after cutover.

### Non-Goals

- No reverse proxy (Angie/nginx/caddy) in front of Node at launch. Tunnel -> Node directly.
- No database clustering, replication, or high-availability setup.
- No CI/CD pipeline -- deployment is manual. Future CI is optional and not planned.
- No photography CMS migration yet -- photography page remains hardcoded static data.
- No newsletter form backend migration -- the existing Turnstile + external API endpoint stays.
- No homelab canvas migration -- the React Flow component stays as-is.
- No Docker or container orchestration -- process managed by systemd directly.

---

## Database: Rationale and Trade-offs

### Recommended: Local SQLite via better-sqlite3

Emdash supports SQLite (better-sqlite3), libSQL, and PostgreSQL. The default recommendation is a local SQLite adapter because it is the simplest embedded option with no server process, no network dependency, and the widest native addon compatibility on Linux ARM/x86.

**Pros:**
- Zero operational overhead -- no separate database server to install, configure, or monitor.
- Backup via `.backup` command or VACUUM INTO (safe online backup without copying WAL/SHM independently).
- Performance is excellent for a single-user/single-process CMS on a low-powered box.
- No network dependency -- the site works even if an external database is unreachable.
- better-sqlite3 is a synchronous, native addon -- no thread pool contention, simple to reason about.

**Cons:**
- Single-writer -- concurrent write access from multiple processes is not supported (irrelevant for a single Astro server).
- No built-in replication or failover.
- Database file lives on the same disk as the application -- disk failure means data loss without backups.
- Native addon (better-sqlite3) must compile against the target host's Node ABI. Validate on the target Linux box before committing.
- Not suitable if you later need multiple app servers or read replicas.

### Alternative: Local libSQL (spike required)

libSQL is SQLite-compatible with additional features (remote replication, Turso compatibility). Emdash supports it, but it is not the only or best-tested path.

**Requires validation:**
- Confirm libSQL serverless mode works in-process on the target host (ARM64 if applicable).
- Confirm the libSQL client library is available or buildable on the target OS.
- Measure startup time and memory overhead vs better-sqlite3.
- If validation passes and there is a concrete need for Turso migration later, libSQL is a reasonable choice.

### Alternative: Remote libSQL / Turso

**Pros:**
- Database is off-host -- survives the Linux box dying.
- Built-in replication and lower read latency from edge locations.
- No local disk space consumed by the database.

**Cons:**
- Adds network latency for every query.
- Adds a dependency on an external service -- if Turso is down, the CMS is down.
- Adds cost (Turso has a free tier but it is limited).
- Overkill for a single-user personal site.

### Alternative: PostgreSQL

**Pros:**
- Robust, well-understood, excellent tooling.
- Could serve other services on the same box.

**Cons:**
- Heavy for a personal site CMS -- requires a dedicated server process, memory, and maintenance.
- Adds significant complexity for no tangible benefit at this scale.
- Requires a separate PostgreSQL adapter configuration in Emdash.

### Why Not D1 for Backup Storage

Cloudflare D1 is a serverless SQLite database, not an object store. It is not designed for storing binary media files, large-volume blob storage, or point-in-time recovery of database snapshots. Backup storage requires an object store (R2). This plan uses R2 for backup artifacts.

---

## Data Model

### Posts

| Field        | Type     | Notes                                   |
|--------------|----------|-----------------------------------------|
| id           | string   | UUID, auto-generated                    |
| title        | string   |                                         |
| slug         | string   | URL-safe, unique; preserve existing     |
| description  | string   |                                         |
| body         | json     | Portable Text (rich text JSON)          |
| tags         | taxonomy | Emdash taxonomy for filtering/indexing  |
| publishedAt  | datetime | mapped from existing `date` field       |
| createdAt    | datetime | auto                                    |
| updatedAt    | datetime | auto                                    |
| status       | enum     | draft / published / archived            |

**Tags as taxonomy:** Emdash uses a taxonomy system rather than a simple string array. Tags will be modelled as a flat taxonomy with no hierarchy. Existing `tags` values become taxonomy terms during migration.

### Projects

| Field        | Type     | Notes                                   |
|--------------|----------|-----------------------------------------|
| id           | string   | UUID                                    |
| title        | string   |                                         |
| slug         | string   | URL-safe, unique; preserve existing     |
| description  | string   |                                         |
| body         | json     | Portable Text (rich text JSON)          |
| kind         | string   |                                         |
| projectState | string   | Renamed from `status` to avoid collision with Emdash lifecycle `status` field |
| featured     | boolean  |                                         |
| order        | number   |                                         |
| stack        | string[] |                                         |
| links        | json     | { website?: string, repository?: string } |
| publishedAt  | datetime |                                         |
| createdAt    | datetime | auto                                    |
| updatedAt    | datetime | auto                                    |

### Site Settings (contingent on schema mapping)

| Field        | Type     | Notes                                   |
|--------------|----------|-----------------------------------------|
| key          | string   | e.g. "site_title", "site_description"   |
| value        | text     | JSON-encoded                            |

### Navigation (contingent on schema mapping)

| Field        | Type     | Notes                                   |
|--------------|----------|-----------------------------------------|
| id           | string   | UUID                                    |
| label        | string   |                                         |
| href         | string   |                                         |
| icon         | string?  | Requires schema mapping validation      |
| match        | enum?    | Requires schema mapping validation      |
| parentId     | string?  | UUID of parent nav item                 |
| order        | number   |                                         |
| collapsible  | boolean? | Requires schema mapping validation      |

Navigation migration is contingent on demonstrating that Emdash's menu schema can represent the custom `icon`, `match`, and `collapsible` fields used by the existing sidebar. If the schema mapping fails, retain static navigation.

### Pages (optional, later)

| Field        | Type     | Notes                                   |
|--------------|----------|-----------------------------------------|
| id           | string   | UUID                                    |
| title        | string   |                                         |
| slug         | string   |                                         |
| body         | json     | Portable Text                           |
| layout       | string?  |                                         |
| publishedAt  | datetime |                                         |
| createdAt    | datetime |                                         |
| updatedAt    | datetime |                                         |

### Photography (optional, later)

| Field        | Type     | Notes                                   |
|--------------|----------|-----------------------------------------|
| id           | string   | UUID                                    |
| title        | string   |                                         |
| slug         | string   |                                         |
| image        | string   | path or URL                             |
| alt          | string   |                                         |
| link         | string?  |                                         |
| camera       | string?  |                                         |
| film         | string?  |                                         |
| takenAt      | datetime?|                                         |
| publishedAt  | datetime |                                         |

---

## Phases

Each phase contains validation gates. Do not proceed to the next phase until the current phase's gates pass.

### Phase 0: Provision the Linux Box

- Install Debian or Ubuntu Server LTS.
- Install Node.js 22.12+ (via nvm or nodesource). Do not use Bun for production runtime. Resolve the actual Node executable path after installation (e.g. `which node` or `readlink -f $(which node)`) for the systemd service file.
- Install cloudflared.
- Install rclone.
- Install `sqlite3` CLI (for backup and integrity checks).
- Configure SSH key access, firewall (UFW: allow 22, deny everything else).
- Create system user `v3frankie` with home at `/home/v3frankie`.
- Create application directory `/var/www/v3frankie.me` (git checkout). Owned by `v3frankie`, mode `755`.
- Create persistent data directory `/var/lib/v3frankie/` (database, media, env, backups). Owned by `v3frankie`, mode `750`.
- Create media directory `/var/lib/v3frankie/media`. Owned by `v3frankie`, mode `750`.
- Create backup staging directory `/var/lib/v3frankie/backups/staging`. Owned by `v3frankie`, mode `750`.
- Create secrets environment file `/var/lib/v3frankie/.env`. Owned by `v3frankie`, mode `600` (service-readable only).
- Validate better-sqlite3 native addon compiles on target architecture: `npm install better-sqlite3` in a temp directory.

**Gate:** Node 22.12+ confirmed, better-sqlite3 compiles, cloudflared authenticates, sqlite3 CLI available.

### Phase 1: Local Node + Emdash Spike

- Clone repository to `/var/www/v3frankie.me`.
- Install Emdash at a pinned beta version (e.g. `npm install emdash@<exact-beta-version>`). Pin the version in `package.json` and test migration to subsequent versions before upgrading.
- Create `src/live.config.ts` with the documented shape:

```ts
import { defineLiveCollection } from "astro:content";
import { emdashLoader } from "emdash/runtime";

export const collections = {
  _emdash: defineLiveCollection({ loader: emdashLoader() }),
};
```

  Validate the exact import paths and API shape against the pinned Emdash version's documentation. The `_emdash` collection key is the documented convention; confirm it is not configurable.

- Configure Emdash in `astro.config.mjs` with:
  - SQLite adapter (better-sqlite3) pointing to `/var/lib/v3frankie/data/emdash.db`.
  - Admin route: `/_emdash/admin` (Emdash default, not configurable).
  - API route: `/_emdash/api/*` (Emdash default, not configurable).
  - Preview: signed `_preview` query parameter (Emdash default, not configurable).
  - Media storage path: `/var/lib/v3frankie/media`.
  - Media base URL: `/_emdash/api/media/file` (Emdash default media serving endpoint). Do not claim `/media` directly exposes the filesystem path.
  - Authentication: passkey-first (Emdash default). No email/password configuration.
  - `siteUrl`: `https://v3frankie.me` (production). For staging, a separate `siteUrl` is required (see Phase 8).
  - Astro `security.allowedDomains`: an array of `RemotePattern` objects, not plain strings. For example:
    ```js
    security: {
      allowedDomains: [{ hostname: "v3frankie.me" }],
    },
    ```
  - Proxy client IP: `trustedProxyHeaders: ["cf-connecting-ip"]` in `astro.config.mjs`, or `EMDASH_TRUSTED_PROXY_HEADERS` as a comma-separated string (e.g. `cf-connecting-ip`), not JSON array syntax.
- Keep existing `src/content.config.ts` intact during staged migration.
- Verify: `node ./dist/server/entry.mjs` starts and listens on 127.0.0.1:3000.
- Verify: `/_emdash/admin` loads (passkey registration is deferred to final-domain cutover in Phase 9).

**Gate:** Emdash admin loads, media API responds, database initialises.

### Phase 2: Schema and Content Conversion Proof

- Build a conversion script that reads existing Markdown/MDX frontmatter and body from `src/content/posts/` and `src/content/projects/`.
- Convert body content to Portable Text JSON. **This is the highest-risk item in the plan and a gated phase.** Options:
  - Use Emdash's import API if it accepts Markdown and converts internally (validate against pinned version docs).
  - Use a Markdown-to-Portable-Text converter (e.g. `@portabletext/md` or similar -- validate availability).
  - If no reliable converter exists, the conversion phase fails. Do not proceed to route cutover. Content stays in local Astro collections and the site remains static on Workers. A future phase can revisit with a different approach.
- Map existing frontmatter fields to Emdash collection fields:
  - `date` -> `publishedAt`.
  - `tags` -> Emdash taxonomy terms.
  - `status` (projects) -> `projectState` to avoid collision with Emdash lifecycle `status`.
  - Preserve existing slugs exactly.
- Validate slug uniqueness, date parsing, and taxonomy term creation.
- Run `PRAGMA integrity_check` on the resulting database and confirm output is exactly `ok`.
- Document the conversion script and run it in a staging database before production.

**Impact on existing components:**

| Component | Impact |
|---|---|
| `render()` from `astro:content` | Does not work with Emdash Portable Text. Replace with Emdash's render function or a Portable Text renderer (e.g. `@portabletext/react`). |
| `CollectionEntry<"posts">` types | No longer valid. Replace with Emdash collection entry types. |
| `post.body` (raw Markdown string) | Not available for Portable Text. Reading time must be computed from the plain-text extraction of Portable Text content. |
| `ProjectCard.astro`, `PostsPage.astro` | Props change from `CollectionEntry` to Emdash entry types. The card/list rendering logic stays the same; only the type and data-access pattern changes. |

**Gate:** All existing content converts to Portable Text with verified integrity. If conversion fails, stop; do not proceed to Phase 3. After this gate passes, both the migrated existing content and all new content authored in Emdash use Portable Text exclusively. No future content will be authored in Markdown/MDX within Emdash collections.

### Phase 3: Page Migration to Emdash Runtime APIs

**Routes that must not be prerendered:**

All routes serving Emdash-managed content must be dynamic (SSR). In Astro SSR mode, pages are server-rendered by default. Remove `getStaticPaths` from the following files and use Emdash runtime APIs instead.

**Status filtering for public routes:** `getEmDashEntry()` does not accept a `status` filter parameter. Public list queries (`getEmDashCollection()`) must specify `status: "published"`. For detail routes, the returned entry's lifecycle state must be checked explicitly. Authenticated preview contexts (signed `_preview` URL) bypass the published-state check. Test for zero draft leakage on all public routes.

| Current file | Emdash API to use |
|---|---|
| `src/pages/posts/[slug].astro` | `getEmDashEntry("posts", slug)` with explicit lifecycle-state check |
| `src/pages/posts/index.astro` | `getEmDashCollection("posts")` with pagination, status: published |
| `src/pages/posts/page/[page].astro` | `getEmDashCollection("posts")` with pagination, status: published |
| `src/pages/projects/[slug].astro` | `getEmDashEntry("projects", slug)` with explicit lifecycle-state check |
| `src/pages/projects/index.astro` | `getEmDashCollection("projects")` sorted by order, status: published |
| `src/pages/index.astro` | `getEmDashCollection("projects")` filtered by featured, status: published |
| `src/pages/rss.xml.ts` | `getEmDashCollection("posts")` sorted by publishedAt, status: published |

**Files to create:**

| File | Purpose |
|---|---|
| `src/live.config.ts` | Emdash live collection configuration (see Phase 1) |

**Files to modify:**

| File | Changes |
|---|---|
| `src/posts.ts` | Rewrite helpers to use `getEmDashCollection()` instead of `getCollection()`. Pagination logic stays the same. |
| `src/pages/posts/[slug].astro` | Remove `getStaticPaths`; use `getEmDashEntry("posts", Astro.params.slug)`. Replace `render()` with Portable Text renderer. Replace `post.body` with plain-text extraction for reading time. |
| `src/pages/posts/index.astro` | Remove `getCollection`; use `getEmDashCollection("posts")`. |
| `src/pages/posts/page/[page].astro` | Remove `getStaticPaths`; use `getEmDashCollection("posts")` with offset/limit. |
| `src/pages/projects/[slug].astro` | Remove `getStaticPaths`; use `getEmDashEntry("projects", Astro.params.slug)`. Replace `render()` with Portable Text renderer. |
| `src/pages/projects/index.astro` | Remove `getCollection`; use `getEmDashCollection("projects")`. |
| `src/pages/index.astro` | Remove `getCollection`; use `getEmDashCollection("projects")` filtered by featured. |
| `src/pages/rss.xml.ts` | Remove `getCollection`; use `getEmDashCollection("posts")`. |
| `src/env.d.ts` | Remove Pagefind type declarations after search migration is complete. |
| `src/components/ProjectCard.astro` | Update props type from `CollectionEntry<"projects">` to Emdash entry type. |
| `src/components/PostsPage.astro` | Update props type from `Post[]` (CollectionEntry) to Emdash entry array. |
| `src/utils.ts` | Update `readingTime()` to accept plain text (extracted from Portable Text) instead of raw Markdown. |

**Files that remain unchanged:**

| File | Reason |
|---|---|
| `src/pages/photography.astro` | Static data, no CMS migration yet |
| `src/pages/uses.astro` | Static content |
| `src/pages/newsletter.astro` | Static content + external form handler |
| `src/pages/404.astro` | Static error page |
| `src/pages/homelab/*` | Static MDX content + React Flow component |
| `src/layouts/HomelabPage.astro` | Layout for static homelab pages |
| `src/components/homelab/*` | React Flow canvas component |
| `src/components/ui/*` | Generic UI components |
| `src/components/SidebarIcon.astro` | Icon mapping utility |
| `src/styles/global.css` | Styles |
| `src/data/homelab-canvas.ts` | Canvas data |
| `src/navigation.ts` | Retained as static fallback during first migration |
| `src/components/SidebarNav.astro` | Retained with static import during first migration |
| `src/layouts/Layout.astro` | Retained with static navigation during first migration |

**Runtime sitemap:**

Astro's `@astrojs/sitemap` integration cannot discover SSR dynamic `[slug]` routes at build time because there is no `getStaticPaths`. Two options:

1. **Runtime sitemap endpoint:** Create a new route (e.g. `src/pages/sitemap-dynamic.xml.ts`) that queries Emdash collections at request time and generates a sitemap XML document including all dynamic slugs plus static routes. Update `robots.txt` and layout references to include this endpoint alongside the existing `/sitemap-index.xml`.
2. **Replace entirely:** Replace the static `@astrojs/sitemap` integration with a single runtime sitemap endpoint that covers both static and dynamic routes.

Either option must filter to `status: "published"` only and be tested for zero draft leakage. Validate that search engines can crawl the dynamic sitemap.

**Gate:** All migrated routes serve correct published content. No draft content leaks. RSS validates. Sitemap includes all dynamic slugs.

### Phase 4: Search Migration

**Current state:** Pagefind indexes all HTML pages in the build output, including posts, projects, homelab pages, uses, photography, and newsletter. It provides full-text search across the entire site.

**Emdash built-in search:** Only searches Emdash-managed collections (posts, projects after migration). It does not index static pages (homelab, uses, photography, newsletter). The browser search UI must use the documented Emdash client endpoint: `/_emdash/api/search` or the `emdash/ui/search` component (validate exact path against pinned version docs). Do not use a server-side `search()` function for the browser UI.

**Decision required -- choose one:**

1. **Full migration:** Migrate all searchable content into Emdash collections (including homelab pages, uses, etc.) so Emdash search covers everything. This requires creating Emdash collections for content that is currently static MDX/HTML.
2. **Combined index:** Keep Pagefind for static pages and use Emdash search for CMS collections. The search UI merges results from both sources. This adds complexity but preserves coverage.
3. **Accept narrower coverage:** Use Emdash search for posts and projects only. Static pages (homelab, uses, etc.) are not searchable. This is the simplest path but reduces functionality.

**Default recommendation:** Option 3 (accept narrower coverage) for initial launch. Option 1 (full migration) can be pursued later. Document the decision and the coverage gap.

**Parity testing before Pagefind removal:**

1. Before any migration, capture a search baseline from the current production Cloudflare Workers deployment (which includes the Pagefind index). Export the Pagefind index metadata or run a representative set of queries against the live production site and record the result URLs and excerpts. Alternatively, run a local build of the current static site (via `astro build`) and extract the Pagefind index from `dist/pagefind/` as a local baseline.
2. After Emdash collections are populated and the SSR site is running on the staging Tunnel hostname, run the same representative queries against the Emdash search endpoint (`/_emdash/api/search` or `emdash/ui/search`).
3. Compare the result sets. Verify that all expected posts and projects appear in Emdash results (route/content coverage) and that result relevance is acceptable. Do not require identical ranking -- Pagefind and Emdash use different ranking algorithms. Do not attempt to run Pagefind against the SSR staging site; Pagefind indexes static HTML at build time and cannot index SSR routes.
4. Only remove `astro-pagefind`, `src/components/search.astro` Pagefind implementation, and Pagefind type declarations from `src/env.d.ts` after parity is confirmed against the preserved baseline.

**Search component changes:**

- The search dialog UI (HTML structure, keyboard shortcuts, dialog behavior) can be preserved.
- Replace the Pagefind `import("/pagefind/pagefind.js")` lazy-load with a fetch to `/_emdash/api/search` or the `emdash/ui/search` component.
- Update the result rendering to use Emdash result types instead of `PagefindResult`.

**Gate:** Search parity confirmed for posts and projects. Pagefind removed only after parity passes.

### Phase 5: Navigation Migration (Contingent)

- Navigation migration is contingent on demonstrating that Emdash's menu schema can represent the custom `icon`, `match`, and `collapsible` fields used by the existing sidebar.
- Build a schema mapping that maps Emdash menu items to the existing `SidebarNavItem` interface. If `icon`, `match`, or `collapsible` cannot be represented, retain static navigation.
- If the schema mapping passes, replace the static `src/navigation.ts` import in `SidebarNav.astro` with a runtime fetch from Emdash's menu API.
- The static `src/navigation.ts` remains as a fallback during staged migration regardless.
- Verify that collapsible sections, nested items, active state detection, and icon mapping all work correctly.

**Gate:** Schema mapping validated, or static navigation retained with documented limitation.

### Phase 6: Backup and Restore Drill

**Backup target:** Cloudflare R2 (private bucket, client-side encrypted).

**Backup contents (all staged together before hashing/upload):**
1. SQLite database: consistent snapshot via `.backup` command or `VACUUM INTO`. Never copy live `.db`, `.db-wal`, or `.db-shm` files independently -- this produces an inconsistent state.
2. Media directory (`/var/lib/v3frankie/media/`).
3. Minimal encrypted configuration/recovery material: `.env` file (excluding tunnel token -- tunnel credentials live exclusively in cloudflared service config/secret) and the rclone config file containing the R2 remote and crypt remote definitions.
4. Backup manifest (checksums, timestamp, file list).

**Operational requirements for the backup process:**

- Stage the database snapshot, a dated copy of the media directory, and the configuration/recovery material into a single staging directory before any hashing or upload.
- Run `PRAGMA integrity_check` on the snapshot and confirm the output is exactly the single word `ok`. Fail immediately if it is not.
- Generate `sha256sum` checksums for all staged files and write them to a manifest file.
- Encrypt the staging directory using rclone crypt (client-side encryption) and upload to R2 under dated prefix paths:
  - `daily/YYYY/MM/DD/`
  - `weekly/YYYY/WW/` (promote one daily per week)
  - `monthly/YYYY/MM/` (promote one weekly per month)
- Fail fast on any error (integrity check failure, checksum mismatch, upload failure, encryption failure). Exit non-zero.
- Clean the staging directory after successful upload.
- Do not include Cloudflare Tunnel credentials in the backup. Tunnel credentials are managed exclusively in the cloudflared service configuration or cloudflared secret store.

**R2 bucket configuration and authorization:**

- Bucket name: `v3frankie-me-backups`
- **Default recommendation: deletion-based retention.** Create a dedicated R2 API token scoped to this bucket with the `Object Read & Write` permission. This allows rclone to list, read, write, and delete objects. The token is stored in the rclone config file. No access to other buckets.
- **Alternative: immutable R2 Bucket Locks.** If immutability is required, enable R2 Bucket Lock with a default retention period covering the maximum intended retention (e.g. 120 days). The same `Object Read & Write` token is used for writes; Bucket Lock itself prevents object deletion during the retention period, regardless of token permissions. The backup script cannot perform deletion-based cleanup -- retention is enforced entirely by the lock policy and R2 lifecycle rules. This is the safer but more operationally complex option. Evaluate before implementation.
- Lifecycle policy: expire objects after 120 days (safety net; the backup script manages primary retention via prefix-based cleanup). This safely exceeds the three full calendar months of the retention policy.
- Public access: blocked.
- CORS: not needed.

**Encryption key and configuration:**

- The rclone crypt passphrase and the rclone configuration file (containing the R2 remote and crypt remote definitions) must be accessible to the unattended backup process on the host. Default approach: store the rclone config in the system user's home directory (`~/.config/rclone/rclone.conf`) and provide the crypt passphrase via a systemd credential (`LoadCredential=`) or a protected environment variable in the backup service unit. This avoids an interactive unlock at each run.
- A separate recovery copy of the rclone config file and crypt passphrase must be preserved outside the host (e.g. printed and stored offline, or in a separate encrypted volume). This recovery copy is the fallback if the host is lost; it is not required by the running backup job.

**Failure monitoring:**

- The backup process must exit non-zero on any failure.
- A cron wrapper or systemd timer should report failures (e.g. mail to the system user, or a healthcheck.io ping on success with alerting on missed pings).

**Retention (enforced by backup script, with R2 lifecycle as safety net):**

- Daily backups: 7 days.
- Weekly backups: 4 weeks.
- Monthly backups: 3 months.
- The backup script removes prefixes outside these windows. R2 lifecycle policy (120-day expiration) is a safety net only.

**Restoration verification (quarterly):**

1. Download the latest encrypted backup from R2 to a temporary directory.
2. Decrypt and verify checksums against the manifest.
3. Run `PRAGMA integrity_check` on the restored database and confirm output is exactly `ok`.
4. Verify media file count and a sample of file checksums.
5. Document the restoration procedure in a runbook stored alongside the encryption key.

**Installation and provisioning:**

- Install rclone on the Linux box.
- Configure the R2 remote and crypt remote using `rclone config`.
- Test the backup process in dry-run mode before enabling the cron schedule.

**Gate:** Backup process runs successfully, uploads to R2, integrity check passes, restoration drill passes.

### Phase 7: Hosting, Config, and Secrets

- Create `.env` file at `/var/lib/v3frankie/.env` (not in the checkout directory):
  - `EMDASH_ENCRYPTION_KEY` -- generated via `emdash secrets generate`. This key encrypts plugin secrets at rest; it is not a session key and does not govern session continuity.
  - `EMDASH_DATABASE_PATH=/var/lib/v3frankie/data/emdash.db`
  - `EMDASH_MEDIA_PATH=/var/lib/v3frankie/media`
  - `EMDASH_SITE_URL=https://v3frankie.me`
  - `EMDASH_TRUSTED_PROXY_HEADERS=cf-connecting-ip` (comma-separated string, not JSON array)
  - Do not include `CLOUDFLARE_TUNNEL_TOKEN` in the application `.env`. Tunnel credentials live exclusively in the cloudflared service configuration or cloudflared secret store.
- Configure Astro allowed domains in `astro.config.mjs` using `RemotePattern` objects:

```js
export default defineConfig({
  security: {
    allowedDomains: [{ hostname: "v3frankie.me" }],
  },
  // ...
});
```

- Create systemd service file `/etc/systemd/system/v3frankie.service`. Resolve the actual Node executable path after installation (e.g. `$(which node)` or `readlink -f $(which node)`):

```
[Unit]
Description=v3frankie.me Astro SSR
After=network.target

[Service]
Type=simple
User=v3frankie
WorkingDirectory=/var/www/v3frankie.me
EnvironmentFile=/var/lib/v3frankie/.env
ExecStart=<resolved-node-path> ./dist/server/entry.mjs
Restart=always
RestartSec=5
Environment=HOST=127.0.0.1
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

- Create systemd service for cloudflared tunnel.
- Enable and start both services.

**Gate:** Application starts via systemd, environment variables load correctly, admin login works.

### Phase 8: Cloudflare Tunnel and Cache/Security

**Tunnel setup:**
- In Cloudflare Zero Trust dashboard, create a new Tunnel (e.g. "v3frankie-me").
- Install and authenticate cloudflared on the Linux box.
- Configure Tunnel ingress to forward public traffic to `127.0.0.1:3000`.
- Do not configure the production CNAME yet. Use a temporary staging hostname (e.g. `staging.v3frankie.me` or a Tunnel-generated `.trycloudflare.com` URL) for non-final testing.
- Verify: `curl -H "Host: <staging-hostname>" 127.0.0.1:3000` returns the app.

**Staging hostname limitations for passkey testing:**
- A `trycloudflare.com` hostname cannot validate passkeys whose RP ID is `v3frankie.me`. Passkey registration is bound to the origin's effective domain.
- For staging passkey tests, two separate approaches exist -- do not conflate them:
  - **Separate staging configuration:** Set `siteUrl` to `https://staging.v3frankie.me` (a dedicated hostname with its own DNS entry and Tunnel routing). Register a test passkey scoped to the staging RP ID. This does not use `EMDASH_ALLOWED_ORIGINS` -- the staging origin is the sole `siteUrl`.
  - **Production siteUrl with allowed staging origin:** Keep `siteUrl` as `https://v3frankie.me` but add the staging hostname to `EMDASH_ALLOWED_ORIGINS` (or the equivalent Emdash config). This allows the production RP ID to accept registrations from the staging origin. Validate that this does not weaken the security model.
  - Or defer all passkey validation to the controlled production cutover (Phase 9), accepting that staging cannot fully exercise the auth flow.
- Do not claim that staging on a non-production hostname is equivalent to final-domain validation.

**Proxy-origin configuration:**
- Emdash and Astro must know the public origin (`https://v3frankie.me`) to generate correct redirect URLs, preview URLs, and CSRF tokens. Set `EMDASH_SITE_URL` and Astro `site` accordingly.
- Cloudflare Tunnel forwards the original client IP via `CF-Connecting-IP` header. Configure Emdash to trust this header via `trustedProxyHeaders: ["cf-connecting-ip"]` in `astro.config.mjs`, or `EMDASH_TRUSTED_PROXY_HEADERS=cf-connecting-ip` as a comma-separated string.

**Cache rules:**
- Cloudflare cache rules apply to traffic routed through the Tunnel. Configure:
  - **Dynamic HTML (all pages):** uncached (`Cache-Control: private, no-store`). Start with everything uncached; add caching only after `toolbar: "client"` is configured to prevent server-injected admin toolbar from being cached and served to anonymous visitors.
  - **Admin/API/Preview:** `Cache-Control: no-store, max-age=0`. Set `CDN-Cache-Control: no-store` for Cloudflare edge.
  - **Static assets (JS, CSS):** cacheable with fingerprint-based URLs. Set `Cache-Control: public, max-age=31536000, immutable` for hashed assets.
  - **Media served via `/_emdash/api/media/file`:** caching behaviour depends on Emdash's response headers. Validate and configure cache-control at the Emdash or Cloudflare level accordingly. Do not promise immutable URLs without proof.
- Cloudflare cache rules (in dashboard): create a rule matching `/_emdash/*` to bypass cache.

**Security rules (Cloudflare WAF):**
- Rate-limit `/_emdash/admin/*` to prevent brute-force login attempts.
- Rate-limit `/_emdash/api/*` to prevent API abuse.
- Enable Bot Fight Mode or WAF managed rules in Cloudflare dashboard.
- Do not implement referrer-based media blocking. Public media is public. Private media requires Emdash's signed/auth delivery mechanism (validate availability).

**Gate:** Staging Tunnel hostname passes all applicable functional tests. Passkey validation approach is decided (separate staging RP ID or deferred to cutover).

### Phase 9: Parallel Validation and DNS Cutover

**Pre-cutover validation (on staging Tunnel hostname):**

1. `node ./dist/server/entry.mjs` starts and listens on 127.0.0.1:3000.
2. All public routes return 200 with correct content.
3. `/_emdash/admin` loads and accepts passkey authentication (if staging RP ID configured).
4. Emdash API returns correct data for posts and projects.
5. RSS feed validates against W3C feed validator.
6. Runtime sitemap includes all expected dynamic and static URLs.
7. Search parity confirmed against preserved Pagefind baseline: Emdash search returns expected posts and projects with acceptable relevance.
8. Navigation matches the existing sidebar structure (or static fallback is confirmed working).
9. Media URLs resolve correctly via `/_emdash/api/media/file`.
10. `PRAGMA integrity_check` passes on the production database (output exactly `ok`).
11. Backup process runs successfully and uploads to R2.
12. Restoration drill passes: download, decrypt, verify, integrity check.

**Capture current routing:**

Before cutover, document the current Cloudflare Workers deployment configuration:
- The Workers service name and route configuration.
- The custom domain (`v3frankie.me`) binding in Cloudflare dashboard -- specifically the DNS record and Workers route that direct traffic to the Worker.
- The current Workers deployment ID or version.
- Tag the known-good commit: `git tag deploy/current-worker`.

**Cutover:**

1. Point `v3frankie.me` DNS to the Tunnel UUID (CNAME).
2. Immediately test passkey registration, CSRF, redirect URLs, and preview URLs on the final domain.
3. Monitor logs for errors.
4. Keep the Cloudflare Workers deployment intact and ready for rollback.

**Rollback:**

- The current Cloudflare Workers deployment remains live and untouched throughout the migration. DNS cutover is the only switch.
- **Rollback procedure:**
  1. Restore the captured DNS configuration: revert the `v3frankie.me` DNS record to point to the Cloudflare Workers custom-domain binding/route that was documented before cutover. This is a DNS change, not a CNAME-to-Worker pointer -- the Workers route is bound to the domain within Cloudflare's configuration.
  2. The Workers deployment is the last known-good build artifact -- not a `git checkout main` gamble.
  3. If the Workers artifact has been overwritten by subsequent builds, redeploy from the known-good commit: `git checkout deploy/current-worker && bun install && bun run build && wrangler deploy`.
  4. Verify site is serving correctly after rollback.

**Gate:** Final-domain passkey and preview tests pass, or rollback executed successfully.

---

## Decisions Before Implementation

| Decision | Default Recommendation | Alternatives |
|---|---|---|
| Database | Local SQLite (better-sqlite3) | libSQL (spike required), PostgreSQL |
| Reverse proxy | None initially | Angie, nginx, caddy |
| Process manager | systemd | Docker, pm2, supervisord |
| Backup tool | rclone + R2 | restic, borg, duplicity |
| Backup encryption | rclone crypt (client-side) | gpg, age |
| Backup retention model | Deletion-based (script manages prefixes) | R2 Bucket Lock (immutable, write-only writer) |
| Node runtime | Node 22.12+ (not Bun) | -- |
| Search coverage | Emdash collections only (narrower) | Combined Pagefind+Emdash, full migration |
| Media storage | Local disk via Emdash media API | R2 direct, S3, Backblaze B2 |
| Deploy mechanism | Manual git pull + install/build + systemd restart | Future CI (optional) |
| General uptime monitoring | Deferred initially | Uptime Kuma, healthchecks.io |
| Backup-job failure alerting | Mandatory at launch | -- |
| Content body format | Portable Text (conversion required, gated) | Keep static Markdown (stop if conversion fails) |
| Emdash version | Pin beta version, test upgrades | -- |
| Navigation | Static retained initially | Emdash menu (contingent on schema mapping) |
| Passkey staging | Defer to production cutover | Separate staging RP ID and hostname |

**Default path:** Local SQLite (better-sqlite3), no reverse proxy, systemd, rclone + R2 + client-side encryption (deletion-based retention), Node 22.12+, Emdash-only search (narrower coverage), local media via Emdash API, manual git pull + install/build + systemd restart, Portable Text for all content after conversion gate, static navigation retained initially, passkey validation at production cutover, backup-job failure alerting mandatory at launch, general uptime monitoring deferred.

---

## Reference Links

- Emdash: https://docs.emdashcms.com
- Cloudflare Tunnel: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/
- Cloudflare R2: https://developers.cloudflare.com/r2/
- Cloudflare R2 Bucket Lock: https://developers.cloudflare.com/r2/buckets/object-lock/
- Cloudflare WAF: https://developers.cloudflare.com/waf/
- Astro SSR: https://docs.astro.build/en/guides/server-side-rendering/
- Astro @astrojs/node adapter: https://docs.astro.build/en/guides/integrations-guide/node/
- Astro sitemap: https://docs.astro.build/en/guides/integrations-guide/sitemap/
- Astro security.allowedDomains: https://docs.astro.build/en/reference/configuration-reference/#securityalloweddomains
- better-sqlite3: https://github.com/WiseLibs/better-sqlite3
- libSQL: https://libsql.org
- rclone: https://rclone.org
- rclone crypt: https://rclone.org/crypt/
- Portable Text: https://portabletext.org
