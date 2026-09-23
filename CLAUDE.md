# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Frescopa site: AEM Edge Delivery Services (EDS) with **AEM authoring via Universal Editor ("xwalk")**, integrated with Adobe Commerce drop-ins and AEM Forms. Plain browser ES modules — there is no bundler/build step for site code; files in `blocks/`, `scripts/`, `styles/` are served as-is. Code reaches EDS via the AEM Code Sync GitHub app on push, so UE/preview only see what is pushed to the branch.

## Commands

- `npm install` — also runs `postinstall` (`build.mjs` + `postinstall.js`), which copies `@dropins/*` packages into `scripts/__dropins__/` and event SDKs into `scripts/`. Don't hand-edit those generated files.
- `npm start` — local dev server (`aem up`) at http://localhost:3000, proxying content from the preview environment.
- `npm run lint` — ESLint (airbnb-base + json + `eslint-plugin-xwalk`) and Stylelint. `npm run lint:js` / `npm run lint:css` individually. CI (`.github/workflows/main.yaml`) runs only `npm ci && npm run lint`.
- `npm run build:json` — merges model partials into root `component-definition.json`, `component-models.json`, `component-filters.json`. The husky pre-commit hook runs this automatically and stages the results whenever any `_*.json` file is staged.
- E2E tests live in a separate package: `cd cypress && npm install`, then `npm run cypress:run` (PaaS) or `npm run cypress:saas:run`. Expects local server at http://127.0.0.1:3000. Single spec: `npx cypress run --config-file cypress.paas.config.js --spec src/tests/<path>.spec.js`. Tags `@skipSaas` / `@skipPaas` exclude tests per environment.

## Universal Editor component model (the key cross-file concept)

UE reads three root JSON files. **Never edit the root files directly** — they are generated:

| Root file | Source partials | Controls |
|---|---|---|
| `component-definition.json` | `models/_component-definition.json` → `models/_*.json` + `blocks/*/_*.json#/definitions` | what's in the UE "+" add menu |
| `component-models.json` | `models/_component-models.json` → `#/models` | properties-panel fields |
| `component-filters.json` | `models/_component-filters.json` → `#/filters` | what may be placed inside what |

Partials use merge-json-cli `"...": "path#/pointer"` includes. Each block keeps `definitions`, `models`, `filters` together in `blocks/<name>/_<name>.json`.

Adding a new UE-authorable block requires:
1. `blocks/<name>/_<name>.json` with a definition using `resourceType: core/franklin/components/block/v1/block` and `template.name`/`template.model`.
2. A reference in the "Blocks" group of `models/_component-definition.json` (it lists block globs individually, not a wildcard).
3. Adding the block id to the section filter `components` list in `models/_section.json`, or it can't be inserted into a section.
4. `npm run build:json`, then push.

Model field names map to rows/cells in the delivered block HTML; field suffix conventions (`image` + `imageAlt`, `link` + `linkText`/`linkTitle`/`linkType`) and `prefix_` grouping collapse multiple fields into one cell.

## Runtime architecture

- `scripts/aem.js` — EDS core library (decorateBlocks, loadBlock, loadSection, readBlockConfig…). Treat as upstream.
- `scripts/scripts.js` — page lifecycle: `loadEager` (templates, experimentation, `initializeDropins()`, page-type detection for commerce data layer, first section/LCP) → `loadLazy` (header/footer, remaining sections) → `loadDelayed` (`scripts/delayed.js`). Exports `decorateMain`, `moveInstrumentation`, `fetchIndex`, `rootLink`.
- Blocks: `blocks/<name>/<name>.js` exports `default async function decorate(block)`; CSS auto-loaded alongside.
- **UE instrumentation**: on author, elements carry `data-aue-*` / `data-richtext-*` attributes. When a block's `decorate()` replaces DOM nodes, call `moveInstrumentation(from, to)` from `scripts/scripts.js` or the element stops being editable in UE.
- `scripts/editor-support.js` (loaded only in the UE author context) listens for `aue:content-*` events and re-decorates just the changed block/section instead of reloading; falls back to full reload. Form blocks are delegated to `scripts/form-editor-support.js`.
- Commerce: `scripts/initializers/*` set up drop-ins (auth, cart, pdp, order…); `commerce-*` blocks render drop-in containers. `scripts/configs.js` loads `config.json` (endpoints, headers) with per-root-path overrides under `public` for multi-store/locale.
- Forms: `blocks/form/` is the AEM Forms (adaptive form) block with its own components, rules engine, and submit logic; `embed-adaptive-form` embeds forms authored in AEM.

## Content / environment config

- `fstab.yaml` — mountpoint to the AEM author franklin.delivery endpoint.
- `paths.json` — maps `/content/2026/39/rapidleopard80293/...` JCR paths to site URLs (locales `en`, `es`, `fr`, `jp`); `includes` lists content/DAM/forms paths published to EDS.
- `helix-query.yaml` / `helix-sitemap.yaml` — query index and sitemap definitions.
- `.hlxignore` excludes `_*.json`, `cypress/`, build scripts etc. from delivery.

## Conventions enforced by lint

- Imports must include the `.js` extension.
- `console.log` is disallowed (warn/error/info/debug allowed).
- Unix line endings.

## Learning plan

This repo is used as a practice ground for mastering Universal Editor. The step-by-step plan and current progress live in the file below; when helping, act as a guide for the current level (the user does the UE authoring, Claude helps with code and explanations), and tick off levels in its Progress list when the user completes them.

@UE-LEARNING-PLAN.md
