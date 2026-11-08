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

### 2.1 Black Badge Palette (v3, approved 2026-11-08)
Inspiration: Rolls-Royce Black Badge and Bugatti dark showrooms. Velvet black, matte cards, chrome hairlines, pearl text. No warm or gold tint anywhere in text.
1. Use Dark Mode only (`html[data-sf-theme="dark"]`). Do not add a theme toggle.
2. Surface ladder (each step is visible; never skip a step):
   - Page: `#090909` (`--token-5b5b05c3`)
   - Window: `#101011` (`--token-5bfb5dc5`)
   - Tray / header shell: `#121213` (`--sf-tray`)
   - Card: `#161617` (`--token-b4c64ac2`)
   - Card hover: `#1c1c1c` (`--token-911b53df`)
   - Raised control / pill / input: `#212123` (`--token-0ffa333b`, `--token-e35fc293`)
3. Text: primary `#f7f7f7`, secondary `#a9a9a9`, tertiary `#7a7a7a`. Status green `#7fb389` only on the live dot.
4. Hairlines: cards have no solid border. Each card gets a 1px **chrome gradient edge** (`::after`, white 9% at top to 3.5% mid to 4.5% bottom, `blur(0.35px)`) plus `inset 0 1px 0 rgba(255,255,255,0.07)` and a soft `0 30px 70px rgba(0,0,0,0.32)` shadow.
5. Geometry: window `26px`, trays `22px`, cards `18px`, buttons `12px` radius.
6. Buttons: primary is a pearl gradient (`#f1f1f1` to `#e2e2e2`) with an inner highlight; secondary is a matte gradient (`#1f1f20` to `#171718`). Hover transitions are `0.5s`.
7. Light: **none by default.** No static spotlight, no card cursor glow, no torch. The surfaces carry the depth on their own. The torch (`.sf-cursor-light`) and the card glow (`[data-sf-glow]::before`) stay in the code but are disabled with `display: none`; enable only on Kapil's request.
8. Grain: `body::after` SVG noise at `1.8%`, `soft-light`. Never raise it; it dulls text.
9. Charts: Sankey bars use the `#sf-chrome` gradient defined inside each SVG; ribbons are white at 8%. Knowledge-graph node strokes and label halos use the card color `#161617`.
10. Keep all UI cards, charts, and diagrams strictly monochrome.

Rejected on the way here (do not reintroduce): warm bone/champagne palettes, star fields, aurora glows, large static spotlights, glass/blur cards.

### 2.2 Layout and Bento Geometry
1. Keep the left sidebar (`.sf-sidebar`, `256px` width) fixed on desktop.
2. Keep the right content container (`#main-content`, max-width `888px`) centered in `.sf-window`.
3. Wrap cards in `.sf-tray` (`padding: 4px; border-radius: 16px;`) with `.sf-panel` (`border-radius: 12px;`) inside.
4. Align multi-column bento splits at both the top and bottom edges (`align-items: stretch`).
5. Reuse existing Sidefolio components (`.sf-services-grid`, `.sf-exp-row`, `.sf-article-row`, `.sf-stat-card`) before creating new CSS classes.

### 2.3 Cursor Light (disabled)
1. The card glow (`[data-sf-glow]`) and the torch (`.sf-cursor-light`) are both turned off since 2026-11-08. Kapil reviewed the site with and without them and chose the still surfaces.
2. If re-enabled, apply only to right-side gray cards inside `#main-content`, never to `.sf-sidebar`, `.sf-hero-portrait`, or photo frames.

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

Goal: a visitor (or Kapil before an interview) understands the whole project with the least reading. The page encodes STAR without labelling it: Overview = Situation and Task, What I did = Action, Outcomes = Result.

Use this exact 7-part vertical flow for every project page. Sections 2 to 5 use the Home-style head (`.sf-section-head`: 32px title, 15px subtitle).

1. **Header Card (`.sf-project-hero-row`)**: two-tone title, `Visit <Project> ↗` (only if a live URL exists), `← Back to work`, showcase image with `.sf-zoom-btn`. No bio text.
2. **Overview** (`.sf-overview-grid`, 2/3 + 1/3): left `.sf-overview-panel` with **two paragraphs** (paragraph 1: the situation in plain words; paragraph 2: what the project is and Kapil's role). Right `.sf-glance-tray` details table with five rows: `Role`, `When`, `Team`, `Scale`, `Outcome`.
3. **How it worked**: section head with page-specific subtitle, the 5-column monochrome Sankey, and a one-sentence `.sf-sankey-caption`. Touch widths show an expand button and a tappable thumbnail with `Tap to expand`.
4. **What I did** (`.sf-services-grid`): three `.sf-service-tray` cards with icon, verb-first title, and one sentence. **No bottom strip.**
5. **Outcomes** (`.sf-project-case-grid`): left `Results | Why it mattered` tray with three rows (`Plain tag` | `Outcome title` + one sentence | `Number pill`). Right `Collaborators` tray with `.sf-collab-card` items. Only name people who approved it; use team names otherwise.
6. **Capabilities**: knowledge graph pre-highlighted for the project.
7. **Pager**: `Previous project` / `Next project` on desktop; project names on mobile.

Copy rules: write for a founder or recruiter who did not see the project. No stack names in titles. Numbers appear once each. Sankey node text uses words for events and counts for data products.

### 4.1 Adapting Content by Project Category
Keep the 7-part layout identical when adding new categories, and adapt the copy as follows:
- **Web Apps** (e.g., `Fundingly.in`, `Toolity.in`):
  - *Overview*: the gap people face → what the product does and that Kapil built it.
  - *Sankey*: data or request flow from source to result.
  - *What I did*: three verb-first cards (`Replaced a paywall with a spreadsheet`).
  - *Outcomes*: `Access`, `Trust`, `Cost`, `Speed`, `Privacy` style tags with a number pill.
- **Events & Summits** (e.g., `Think Travel 2026`):
  - *Overview*: why the industry moment mattered → what the summit was, the sessions, and Kapil's role.
  - *Sankey*: invitation waves → who was in the room → sessions → what leaders took home → what it left behind. Words, not counts.
  - *What I did*: communications, visual identity, narrative.
  - *Outcomes*: `Reach`, `Clarity`, `Legacy`.
- **GTM & AI Workflow Systems**:
  - *Overview*: the operational bottleneck → the system and Kapil's role.
  - *Sankey*: signal capture → processing → operator action → impact.
  - *What I did*: three cards on design, build, adoption.
  - *Outcomes*: hours saved, revenue unlocked, adoption.

---

## 5. Interactive Charts Rules

### 5.1 Monochrome Sankey Diagram (`.sf-sankey-svg`)
1. Render 5 columns of nodes (`rect` bars in `#d4d4d8`, active `#ffffff`) connected by cubic Bezier ribbons.
2. Highlight the complete end-to-end upstream and downstream path when a user hovers any node or ribbon.
3. Below `1024px`, the SVG scales to 100% width and `.sf-sankey-expand-btn` (`[data-open-sankey]`) appears. It opens `#sankey-modal`, a full-screen copy with horizontal scroll.

### 5.2 Force-Directed Knowledge Graph (`#sf-work-graph-canvas`)
1. Connect each project hub to 10 core skills (shared skills bridge the center; unique skills fan outward).
2. Pre-select the current project hub when `data-default-project="<slug>"` is set on the `<canvas>`.
3. Always include the top-right `.sf-graph-reset-btn` (`[data-graph-reset]`) inside `.sf-graph-panel` to restore default selection and node positions.

---

## 6. Responsive System (Mobile, Tablet, Desktop)

### 6.1 Breakpoints
| Range | Name | Shell | Trays |
| :--- | :--- | :--- | :--- |
| `>= 1024px` | Desktop | Fixed `260px` left sidebar + main window | Full multi-column layouts |
| `640-1023px` | Tablet | Sidebar collapses to the bottom tab bar; main is full width | `services`, `contact`, `project-case`, `footer`, `exp-row` go 1 column; `tools` go 2 columns |
| `<= 767px` | Mobile | Same bottom tab bar | Hero rows stack; `stats`, `work`, `tools` go 1 column; `clients` go 2 columns |

Never add a new `@media` value. Use `1023px` or `767px` only.

### 6.2 Bottom Tab Bar (`<= 1023px`)
1. Six items: Home, About, Work, Playbooks, Links, Contact. Icon (`18px`) sits above a `10.5px` label. Each item is `50px` tall.
2. The Contact item carries `.sf-nav-mobile-only`. It is hidden on desktop, where Contact lives in the Connect tray.
3. The bar respects `env(safe-area-inset-bottom)`. Page content keeps `84px` bottom padding so nothing hides behind it.

### 6.3 Touch Rules (`<= 1023px`)
1. Tap targets are at least `44px` tall or have a `44px` pseudo-element hit zone (deck progress dots).
2. No visible text below `12px`.
3. Form inputs are `16px` to stop iOS focus zoom.

### 6.4 Mobile Cover Hero (`<= 767px`, the 5 main pages)
1. The shared header becomes an **editorial cover**: the portrait fills the 460px card, the copy sits on a bottom gradient that starts below the face (`object-position: center 12%`, gradient from 28% to 100%).
2. Each page has two bios: `.sf-hero-bio-long` (desktop) and `.sf-hero-bio-short` (mobile, max 2 sentences). Add both when you create a page.
3. Hero actions render as a 2-column grid with 14px labels that never wrap. Four buttons form a 2×2 grid.
4. Stats collapse to one 3-up row: number plus the short top label (`Projects`, `Experience`, `Clients`). The long caption and icon hide.
5. Project pages (`.sf-project-hero-row`) keep the stacked copy-above-image layout.

### 6.5 Ultra-HD Showcase Images
1. Every showcase ships a 6-step WebP ladder: `440, 880, 1320, 1760, 2200, 2752w`, quality `96`, Lanczos plus a light unsharp mask on downscaled sizes. Masters are the `2752x1536` PNGs in the design archive.
2. `sizes` carries a **1.6x zoom bias**: `(max-width: 767px) 160vw, (max-width: 1023px) 80vw, <slot>px`. A 3x phone loads `2200w`, so pinch-zoom stays crisp.
3. Every showcase has a `.sf-zoom-btn` (`[data-open-lightbox="<2752w file>"]`) that opens `#image-lightbox` with the full master. The button is visible on touch and appears on hover on desktop.
4. Project pages preload the hero with `imagesrcset` and `imagesizes`.

### 6.6 Verification Before Push
1. Capture screenshots at `390x844` (mobile emulation), `820x1180`, and `1440x900` for every changed page.
2. Assert `document.documentElement.scrollWidth === window.innerWidth` at mobile and tablet.
3. Check: no element with `getBoundingClientRect().right > innerWidth`, no tap target under `44px`, no text under `12px`.

---

## 7. SEO Rules

1. Every page sets its own `title`, `description`, `og:description` (`property=`), `og:image`, and `og:image:alt`. The generator enforces this. Never hand-edit a `<head>` in a generated page.
2. Project pages use `og-<slug>.jpg` (`1200x630`, JPEG quality `88`, center-cropped from the `2752x1536` showcase). Section pages use `og-home.png`.
3. Every page includes `theme-color #0a0a0a`, `apple-touch-icon.png` (`180px`), and `/site.webmanifest`.
4. Google Fonts load non-blocking (`media="print" onload="this.media='all'"` with a `<noscript>` fallback).
5. The hero image carries `fetchpriority="high"`. Every `<img>` has `width` and `height`.
6. Showcase assets ship as WebP only (6-step ladder, see 6.5). Do not add JPG fallbacks.
7. `dateModified` and sitemap `lastmod` come from the generation date (`TODAY` in the generator).
8. Add every new route to the generator sitemap list, the command palette `searchCatalog`, and `llms.txt`.

---

## 8. Forms and Deployment Protocol

1. **Contact Form**: Post `#contact-inquiry-form` (`Name` `entry.2053400866`, `Email` `entry.1429894223`, `Topic` `entry.39421880`, `Message` `entry.350208973`) to the configured Google Form `formResponse` endpoint using `fetch(..., { mode: 'no-cors' })`.
2. **Pre-Deploy Visual Check**: Before pushing UI changes, capture headless Chrome screenshots at `390px`, `820px`, and `1440px` of modified pages and inspect them for text wrapping, alignment, and cognitive load.
3. **Git Author**: Commit to `kapildoesmarketing/kapildoesmarketing.github.io` as `Kapil Pidhwani <kapildoesmarketing@gmail.com>`. Never commit with an internal corporate email.
4. **Live Sync**: Copy production files from `/usr/local/google/home/hikapil/Projects/kapilpidhwani-v2` to `/usr/local/google/home/hikapil/Projects/kapildoesmarketing.github.io` (excluding `scratch/`, `action_items.md`, and `suggestions.md`), push to `origin/main`, and verify HTTP `200` on `https://kapilpidhwani.in/`.
