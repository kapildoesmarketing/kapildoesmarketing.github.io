# Developer and AI Agent Guide (`kapilpidhwani.in`)

> **Standard**: This document follows **ASD-STE100 (Simplified Technical English)**. Each rule uses active voice, imperative verbs, and one instruction per sentence.

---

## 1. System Architecture

1. Serve the site as static HTML, CSS, and vanilla JavaScript.
2. Do not add frameworks, bundlers, or external UI libraries.
3. Keep all styles in `/assets/css/main.css`.
4. Keep all client-side logic in `/assets/js/main.js`.
5. Keep each route in its own directory with a standalone `index.html` file:
   - `/` (`/index.html`)
   - `/about/` (`/about/index.html`)
   - `/work/` (`/work/index.html`)
   - `/work/<slug>/` (`/work/fundingly/index.html`, `/work/toolity/index.html`)
   - `/playbooks/` (`/playbooks/index.html`)
   - `/links/` (`/links/index.html`)
   - `/contact/` (`/contact/index.html`)
6. Include only the active view inside each page's `<main id="main-content">`. Do not embed hidden views from other routes.

---

## 2. Design System and Visual Rules

### 2.1 Monochrome Dark Palette
1. Use Dark Mode only (`html[data-sf-theme="dark"]`). Do not add a theme toggle.
2. Use these exact surface and text tokens:
   - Canvas background: `#0d0d0d` (`--token-5b5b05c3`)
   - Outer tray background: `#141414` (`--token-e35fc293`)
   - Inner card panel: `#1c1c1c` (`--token-b4c64ac2`)
   - Elevated control / pill: `#242424` (`--token-0ffa333b`)
   - Card border (`1px`): `#252525` (`--token-789768dc`)
   - Primary text: `#f5f5f3` (`--token-9cf0210b`)
   - Secondary text: `#9c9c9a` (`--token-944a5ffb`)
   - Muted / tertiary text: `#7b7b79` (`--token-c4c9a226`)
3. Keep all UI cards, charts, and diagrams strictly monochrome (black, white, and gray).
4. Use green (`#2fc96f`) only for the live status dot.

### 2.2 Layout and Bento Geometry
1. Keep the left sidebar (`.sf-sidebar`, `256px` width) fixed on desktop.
2. Keep the right content container (`#main-content`, max-width `888px`) centered in `.sf-window`.
3. Wrap cards in `.sf-tray` (`padding: 4px; border-radius: 16px;`) with `.sf-panel` (`border-radius: 12px;`) inside.
4. Align multi-column bento splits at both the top and bottom edges (`align-items: stretch`).
5. Reuse existing Sidefolio components (`.sf-services-grid`, `.sf-exp-row`, `.sf-article-row`, `.sf-stat-card`) before creating new CSS classes.

### 2.3 Cursor-Following Card Glow (`[data-sf-glow]`)
1. Apply the monochrome white cursor glow only to right-side gray cards inside `#main-content`.
2. Never apply the cursor glow to `.sf-sidebar`, `.sf-hero-portrait`, or `.sf-work-card` photo frames.
3. Keep the border glow subtle (`::after` peak opacity `0.13`, `380px` radius) and the surface light soft (`::before` peak opacity `0.055`, `520px` radius) so card edges never look sharp.

### 2.4 Photography and Brand Logos
1. Use dark studio hardware mockups (`16:9`, WebP with `440w`, `880w`, `1320w`, and `2752w` `srcset`) for project cards and headers.
2. Render the brand logo ticker (`Trusted by teams at`) in uniform monochrome gray at rest (`opacity: 0.56`).
3. Reveal full original brand colors on logo hover (`filter: none; opacity: 1;`).

---

## 3. Content, Privacy, and Copywriting Rules

### 3.1 Strict Exclusions
1. **Never** mention `Inc42` anywhere in HTML, CSS, JavaScript, JSON-LD, `llms.txt`, or image alt text.
2. **Never** include Kapil's phone number anywhere on the site or in vCards.
3. **Never** use the words `"Ventures"` or `"Live Ventures"` in user-facing copy. Use `"Web Apps"` or `"Projects"`.
4. **Never** stamp literal rubric labels such as `"S · T · A · R breakdown"`, `[S] Situation`, `[T] Task`, `[A] Action`, or `[R] Result` on cards. Tell the story naturally through business headings (`The Problem`, `The System`, `The Result`).

### 3.2 Cognitive Load and Tone
1. Write for senior executives, founders, and hiring leaders.
2. Keep card descriptions under 25 words (2 to 3 lines maximum).
3. Lead with quantified outcomes (`$10M+ incremental revenue`, `2,690+ verified rounds`, `180 utilities`, `<50ms filter`).
4. Do not place two multi-paragraph text columns side by side.
5. Remove redundant section headings when tray `.sf-strip` headers already label the content.

---

## 4. Locked Project Detail Page Structure (`/work/<slug>/`)

Use this exact 6-part vertical flow for every project page:

1. **Row 1 — `50/50` Project Header Card (`.sf-project-hero-row`, `308px` height)**:
   - Left `50%`: Two-tone title (`.sf-hero-title-primary` + `.sf-hero-title-muted`), primary CTA (`Visit <Project> ↗`), and secondary button (`← Back to work`). Do not add bio paragraphs inside this header.
   - Right `50%`: `16:9` studio mockup image.
2. **Row 2 — `Workflow Notes` (Bare Monochrome Sankey Diagram)**:
   - Place `<h2 class="sf-sankey-heading">Workflow Notes</h2>` and the 5-column SVG Sankey diagram directly on the black canvas (no card wrapper).
3. **Row 3 — 3-Column Executive Bento Row (`.sf-services-grid`)**:
   - Three equal-height `.sf-service-tray` cards in one row:
     - Card 1 (`The Problem`): Market gap or operational context + quantified barrier in `.sf-service-strip`.
     - Card 2 (`The System`): Architecture or execution system built + scale metric in `.sf-service-strip`.
     - Card 3 (`The Result`): Quantified outcome + impact metric in `.sf-service-strip`.
4. **Row 4 — Baseline-Aligned `2/3 + 1/3` Split (`.sf-project-case-grid`)**:
   - Left `2/3` (`Key decisions & trade-offs` — `.sf-decisions-tray`): Three horizontal `.sf-decision-exp-row` items (`Domain Tag` | `Chose X over Y` + 1-line rationale | `Outcome Pill`).
   - Right `1/3` (`Collaborators` — `.sf-collaborators-tray`): Stretches to match the exact height of the left tray. Contains `.sf-collab-card` items (monogram avatar, name, role, external `↗` link, and 1-line contribution summary). Do not add a separate `Specifications` box.
5. **Row 5 — `Capabilities` (Interactive Knowledge Graph)**:
   - Render `<canvas id="sf-work-graph-canvas" data-default-project="<slug>">` inside `.sf-graph-panel` so the current project node and its 10 connected skills load pre-highlighted.
   - Include the top-right reset icon button (`.sf-graph-reset-btn` with `data-graph-reset`).
6. **Row 6 — Two-Button Project Pager (`.sf-project-pager`)**:
   - Place two `.sf-btn-secondary` buttons at the bottom: `← Previous project` on the left and `Next project →` on the right.

### 4.1 Adapting Content by Project Category
Keep the 6-part visual layout identical when adding new categories, and adapt the copy as follows:
- **Web Apps** (e.g., `Fundingly.in`, `Toolity.in`):
  - *Sankey*: Data ingestion or client-side utility execution pipeline.
  - *3 Bento Cards*: Market/privacy gap → Technical architecture → Usage/scale impact.
  - *Key Decisions*: Engineering and product trade-offs (`Sheets over SQL`, `WASM over Cloud`).
- **Events & Summits** (e.g., Flagship industry summits):
  - *Sankey*: Attendee funnel from invitation & RSVP waves to check-in, tracks, and post-event follow-up.
  - *3 Bento Cards*: Event context & audience mandate (`What the event is`) → Experience & RSVP mailer engine built → Attendance, engagement, and operational hours saved.
  - *Key Decisions*: Experience, logistics, and automation trade-offs (`Custom HTML RSVP mailer over manual threads`).
- **GTM & AI Workflow Systems**:
  - *Sankey*: Signal capture → AI agent processing → Seller/operator action → Revenue impact.
  - *3 Bento Cards*: Operational bottleneck → Agentic workflow built → Hours saved / revenue unlocked.
  - *Key Decisions*: Model, tooling, and adoption trade-offs.

---

## 5. Interactive Charts Rules

### 5.1 Monochrome Sankey Diagram (`.sf-sankey-svg`)
1. Render 5 columns of nodes (`rect` bars in `#d4d4d8`, active `#ffffff`) connected by cubic Bezier ribbons.
2. Highlight the complete end-to-end upstream and downstream path when a user hovers any node or ribbon.

### 5.2 Force-Directed Knowledge Graph (`#sf-work-graph-canvas`)
1. Connect each project hub to 10 core skills (shared skills bridge the center; unique skills fan outward).
2. Pre-select the current project hub when `data-default-project="<slug>"` is set on the `<canvas>`.
3. Always include the top-right `.sf-graph-reset-btn` (`[data-graph-reset]`) inside `.sf-graph-panel` to restore default selection and node positions.

---

## 6. Forms, SEO, and Deployment Protocol

1. **Contact Form**: Post `#contact-inquiry-form` (`Name` `entry.2053400866`, `Email` `entry.1429894223`, `Topic` `entry.39421880`, `Message` `entry.350208973`) to the configured Google Form `formResponse` endpoint using `fetch(..., { mode: 'no-cors' })`.
2. **Pre-Deploy Visual Check**: Before pushing UI changes, capture headless Chrome screenshots (`1440px` width) of modified pages and inspect them for text wrapping, alignment, and cognitive load.
3. **Git Author**: Commit to `kapildoesmarketing/kapildoesmarketing.github.io` as `Kapil Pidhwani <kapildoesmarketing@gmail.com>`. Never commit with an internal corporate email.
4. **Live Sync**: Copy production files from `/usr/local/google/home/hikapil/Projects/kapilpidhwani-v2` to `/usr/local/google/home/hikapil/Projects/kapildoesmarketing.github.io` (excluding `scratch/`, `action_items.md`, and `suggestions.md`), push to `origin/main`, and verify HTTP `200` on `https://kapilpidhwani.in/`.
