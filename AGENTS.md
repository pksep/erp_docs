# AGENTS.md

## Repository purpose
- This is a VitePress documentation site for an ERP product, not an application/service codebase.
- The actual docs source lives under `src/`, and the site is deployed to GitHub Pages.

## Working directory
- Work from `/Volumes/KINGSTON/project/erp-docs/erp_docs`.
- The repository root for the docs project is `erp_docs/`, not its parent directory.

## Essential commands
Observed in `package.json` and `README.md`:

```bash
bun i
bun run start:dev
bun run build
bun run start
```

- `bun run start:dev` runs `vitepress dev src`
- `bun run build` runs `vitepress build src`
- `bun run start` runs `vitepress preview src`
- There are no lint or test scripts in `package.json`.

## Deployment
- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Deploys on pushes to `main`; pull requests also run the build job.
- Uses Bun in CI (`oven-sh/setup-bun@v1`).
- Upload artifact path is `src/.vitepress/dist`.
- Site base path is hard-coded to `/erp_docs/` in `src/.vitepress/config.ts`; preserve this unless the GitHub Pages repository/path changes.

## Source layout
- `src/index.md` — homepage with VitePress `home` frontmatter.
- `src/guide/` — guide pages.
- `src/use-cases/` — scenario-based documentation.
- `src/videos/` — video guide landing page.
- `src/public/` — static assets exposed from site root (`/logo.png`, `/favicon.ico`, etc.).
- `src/.vitepress/config.ts` — all site navigation, sidebar, footer, GitHub edit-link, locale, and base-path config.

## Architecture and control flow
- This project is mostly content-driven: Markdown pages plus one central VitePress config.
- `src/.vitepress/config.ts` defines:
  - top navigation
  - sidebar structure
  - GitHub edit-link template
  - footer and previous/next labels
  - locale metadata
- Content pages rely on those links being correct. When adding, renaming, or deleting pages/sections, update `config.ts` accordingly.
- Static files in `src/public/` are referenced with root-relative paths like `/logo.png`.

## Non-obvious repo gotchas
- `README.md` still describes the project structure using `/docs`, but the real content directory is `src/`. The scripts and config also use `src`, so follow the code, not the README wording.
- `tsconfig.json` includes `docs/.vitepress/**/*`, which does not match the observed `src/.vitepress/config.ts` location. Treat this as stale configuration unless you verify otherwise before changing TypeScript-related setup.
- `src/.vitepress/config.ts` contains hard-coded in-page anchor links for sidebar items such as `/use-cases/#управление-запасами` and `/videos/#...`. If section headings change, those anchors may break and must be updated manually.
- The docs use Russian UI/content strings throughout (`title`, nav, footer, page copy). Match that language unless the repository content changes direction.
- `src/guide/getting-started.md` embeds `<VideoPlayer src="/videos/intro.mp4" />`, and `src/videos/index.md` contains a commented `<VideoCard ... />` example, but no component implementations were found in this repository. Before adding more custom components, verify whether they are provided externally or still need to be created.

## Content conventions observed
- Markdown pages use YAML frontmatter at the top.
- The homepage uses VitePress home-page frontmatter (`layout: home`, `hero`, `features`).
- Internal links are root-relative, e.g. `/guide/getting-started`, `/videos/`, `/use-cases/`.
- Navigation labels, footer text, and page headings are in Russian.
- Asset references are also root-relative and assume `src/public/` publishing behavior.

## Testing and validation
- There is no automated test suite in the repository.
- The primary validation step is a site build:

```bash
bun run build
```

- For content/navigation changes, also run local preview if needed:

```bash
bun run start:dev
bun run start
```

## When editing this repo
- Read `src/.vitepress/config.ts` before making structural doc changes; most breakage will come from stale nav/sidebar/edit-link config rather than Markdown syntax.
- Keep page paths, nav links, sidebar entries, and heading anchors in sync.
- Preserve the GitHub Pages assumptions unless intentionally changing deployment:
  - base path `/erp_docs/`
  - build output `src/.vitepress/dist`
- Do not add undocumented commands or workflows: only Bun/VitePress/GitHub Pages usage was observed here.
