# Universal Editor learning plan (EDS xwalk)

A step-by-step plan for mastering AEM Universal Editor (UE) on this repo, from beginner to advanced. Each level has three parts: **Learn** (concepts), **Build** (hands-on exercises) and **Checkpoint** (what you should be able to do from memory before moving on).

## Progress

- [x] Level 0: How the setup works
- [x] Level 1: Author with what already exists
- [ ] Level 2: Your first custom block
- [ ] Level 3: Field types
- [ ] Level 4: Container blocks and filters
- [ ] Level 5: Keep UE editing working after your JS runs
- [ ] Level 6: Variants, styles and page-level config
- [ ] Level 7: Content Fragments
- [ ] Level 8: Reuse, localization and publishing at scale
- [ ] Level 9: Forms in UE
- [ ] Level 10: Advanced / expert
- [ ] Capstone

---

## Level 0: How the setup works (orientation)
**Learn**
- How content moves: AEM Author → UE → publish → EDS HTML (via `fstab.yaml`) → your block JS decorates it.
- How `paths.json` maps `/content/...` to site URLs.
- The 3 JSON files and what each one controls:
  - **definition**: what appears in the "+" menu
  - **model**: what fields appear in the properties panel
  - **filter**: what is allowed inside what
- The `...` merge syntax in `models/` and why you edit `_*.json`, not the root files.
- Preview vs. live vs. author URLs, and how the Sidekick fits in.

**Build**: Open a page in UE, then open the same page on `.aem.page`. Use DevTools to compare the delivered HTML table structure with what UE shows.

**Checkpoint**: Draw the flow from "author types text" to "block renders" without looking anything up.

---

## Level 1: Author with what already exists
**Learn**: The UE interface: content tree, properties panel, the add/duplicate/delete/move actions, and the preview toggle. Default content (Text, Title, Image, Button) vs. blocks vs. sections.

**Build**
1. Build a full landing page using only existing blocks (hero, cards, columns, teaser).
2. Add sections and reorder blocks.
3. Publish it and check it on `.aem.live`.

**Checkpoint**: Build a clean page in under 10 minutes and explain why some things can't be dropped into some places (that's what filters control).

---

## Level 2: Your first custom block (simple)
**Learn**: Anatomy of a block: `_block.json` (definitions, models and filters together), `block.js`, `block.css`. The `core/franklin/components/block/v1/block` resource type, and how model fields turn into rows and cells in the HTML.

**Build**: A `quote` block with a `quote` (richtext) field and an `author` (text) field.
- Register it in `models/_component-definition.json` and the section filter.
- Run `build:json`, push, and see it show up in UE.

**Checkpoint**: Create a new block from scratch without copying one.

---

## Level 3: Field types
**Learn**: Every model component type:
- `text`, `richtext`, `number`, `boolean`, `select`, `multiselect`, `radio-group`, `checkbox-group`, `date-time`
- `reference` (assets), `aem-content` (links/paths), `tab`, `container`
- Validation: `required`, `maxSize`, regex. `valueType`, `condition` (showing a field only when another field has a certain value).

**Field collapsing and grouping**: `image` + `imageAlt`, `link` + `linkText` + `linkTitle` + `linkType`, and grouping fields with a `prefix_` so they share one cell.

**Build**: A `profile-card` block that uses at least 10 field types, split across tabs, with a conditional field and required validation.

**Checkpoint**: Predict the delivered HTML structure for any model before you publish it.

---

## Level 4: Container blocks and filters
**Learn**: Container blocks with child items, using the parent definition + item definition + filter pattern (study the existing `cards` block). Key-value blocks (`key-value: true`). Section models and section filters.

**Build**
1. An `accordion` block with `accordion-item` children.
2. A `tabs` block with tab panels.
3. A section filter that only allows certain blocks in a special section type.

**Checkpoint**: Explain parent/child filters and restrict what authors can add, anywhere.

---

## Level 5: Keep UE editing working after your JS runs
This is where most people get stuck.

**Learn**
- The `data-aue-*` attributes (resource, type, prop, model, filter, label).
- What happens when your `decorate()` rebuilds the DOM, and how to preserve these attributes with `moveInstrumentation` from `scripts/scripts.js`.
- Live-update events like `aue:content-patch`, and how `scripts/editor-support.js` handles them.

**Build**
1. Rewrite the `accordion` so it restructures the DOM.
2. Break inline editing on purpose, then fix it.

**Checkpoint**: Every custom block you write stays inline-editable and selectable in UE.

---

## Level 6: Variants, styles and page-level config
**Learn**
- Block options with a `classes` field (select/multiselect) that turn into CSS variants.
- Section styles and section metadata.
- Page metadata model (`models/_page.json`) and templates (`models/_templates.json`).
- Placeholders and spreadsheets (the configuration and headers mappings in `paths.json`).

**Build**
1. Add "dark / light / compact" variants to `profile-card`.
2. A custom page template with extra metadata fields that your JS reads.

**Checkpoint**: Give authors design choices without them touching code.

---

## Level 7: Content Fragments
**Learn**
- Content Fragment Models: field types, fragment references, nested models.
- Creating and editing CFs, including editing them in UE.
- Headless delivery: GraphQL endpoints, persisted queries, and CORS/publish access (AEM hosts are in `config.json`).
- Two ways to show CFs in EDS:
  - (a) A block with an `aem-content` / reference field that picks a CF, then JS fetches its data through a persisted query.
  - (b) A list or query-driven block.

**Build**
1. A `Promotion` CF model (title, description, image, CTA, expiry date).
2. Create 3 fragments.
3. A `cf-teaser` block that lets authors pick a fragment in UE and renders it.
4. A `cf-list` block that lists all active promotions.

**Checkpoint**: Explain when to use a CF vs. a block vs. a fragment page. Wire a new CF model into EDS end to end.

---

## Level 8: Reuse, localization and publishing at scale
**Learn**
- Fragments (the `fragment` block), header and footer as fragments.
- MSM/language copies. The site already has en/es/fr/jp, so learn blueprint → live copy, inheritance, and rollouts.
- Translation workflow, the publish/unpublish flow, and Launches.
- Query index (`helix-query.yaml`) and sitemap.

**Build**
1. A shared promo fragment used on 3 pages.
2. Roll a page out to `fr`, break inheritance on one component, then roll out again.
3. A blog-style list driven by the query index.

**Checkpoint**: Manage a multi-language site without losing edits.

---

## Level 9: Forms in UE
**Learn**: The Adaptive Forms authoring experience in UE: the `form` vs. `embed-adaptive-form` blocks, form components, rules, submit actions and validation.

**Build**: A contact or lead form authored fully in UE, with a rule (show/hide a field) and a working submit.

**Checkpoint**: Build and change a form without touching code.

---

## Level 10: Advanced / expert
- **UE extensions**: App Builder extensions for custom properties-panel fields, custom actions and custom data sources.
- **Custom data types / dynamic select options**: options loaded from a URL.
- **Performance**: Lighthouse 100 with your custom blocks, and the eager/lazy/delayed loading phases.
- **Quality**: linting, Cypress tests (`cypress/`), and block conventions.
- **Commerce drop-in blocks**: how UE-authored content mixes with commerce blocks (`product-teaser`, `product-details`).

---

## Capstone
A complete "Campaign" microsite made with all of the above:
- A custom template
- 3+ custom blocks with variants
- A CF-driven promotions list
- A shared fragment
- A localized `fr` version
- A lead-capture form
- Lighthouse 95+

Everything should be editable in UE, with nothing hard-coded.

---

## Working rules while practising
- Create a git branch per level (for example `level-2-quote-block`) and test with the `branch--rapidleopard80293--aemsitestrial.aem.page` URL. That way `main` stays clean.
- After editing any `_*.json`, run `npm run build:json` and push. UE reads the definitions from the code on GitHub, not your local files.
- Keep a short notes file per level with what broke and why. That's where most of the learning happens.

**Suggested pace:** about 1 level per 2–3 days, and Level 5 and Level 7 deserve extra time.
