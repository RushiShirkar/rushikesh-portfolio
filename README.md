# Rushikesh Shirkar | Portfolio

Personal portfolio of Rushikesh Shirkar, Senior Software Engineer and Product Engineer based in Pune, India.

Live site: https://rushishirkar.com

The site presents six years of work across SaaS, fintech, trade-tech and eCommerce, including three multi-tenant products taken from zero to production.

## Sections

| Section | Description |
| --- | --- |
| Hero | Identity, headline and an interactive isometric stack showing the layers owned at each career stage |
| Engineering DNA | Four paired strengths linked to a scroll-driven helix, plus key figures |
| Experience | Career shown as a Gantt chart; select a bar to view the role in detail |
| Products | Celoxis, Eximfiles, eBRC Platform and Scriphouse |
| Technical Arsenal | Filterable skills grid grouped by layer |
| Engineering Stories | Four case studies with animated architecture diagrams |
| Philosophy | Operating principles |
| Quick Answers | Six frequently asked questions, mirrored in structured data |
| Contact | Email, mobile, LinkedIn and GitHub |

## Features

- Dark and light themes, with the choice remembered between visits
- Command palette (`Cmd K` / `Ctrl K`) for navigation and quick actions
- Responsive layout from phone to desktop
- Reduced-motion support for all animation
- Keyboard-accessible tabs, dialogs and controls
- SEO metadata, Open Graph tags and JSON-LD structured data
- `robots.txt`, `sitemap.xml` and `llms.txt` for search engines and AI assistants

## Tech stack

- HTML, CSS and vanilla JavaScript
- Canvas and inline SVG for graphics
- Google Fonts: Inter Tight, Instrument Serif, JetBrains Mono
- No framework, no build step, no runtime dependencies

## Project structure

```
.
├── index.html          Markup, content, metadata and structured data
├── styles.css          Design tokens, layout and motion
├── main.js             Interactions, canvas graphics and command palette
├── 404.html            Not-found page
├── robots.txt          Crawler rules
├── sitemap.xml         Sitemap
├── llms.txt            Plain-text profile for AI assistants
├── site.webmanifest    Web app manifest
├── og-image.png        Social share image (1200 x 630)
├── favicon.svg         Icons (plus apple-touch-icon.png, icon-192.png, icon-512.png)
└── tools/
    └── set-domain.sh   Rewrites the site domain in every file that needs it
```

## Run locally

Serve the folder with any static server:

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Deploy

The site is fully static and is hosted on Vercel. No build command or output directory is required.

To move the site to a different domain, update every absolute URL in one step:

```bash
sh tools/set-domain.sh https://new-domain.com/
```

## Agent readiness

- `middleware.js` (Vercel Routing Middleware) serves Markdown when a request prefers `text/markdown`: `/`, `/about`, `/contact` and `/privacy` return their `.md` twin, and unknown paths return a Markdown 404. Browsers keep getting HTML.
- `vercel.json` enables clean URLs and sends `Vary: Accept` on pages.
- `llms.txt` follows the llmstxt.org format and tells agents when to use the site.

Check it with:

```bash
curl -sS -i -H 'Accept: text/markdown' https://rushishirkar.com/
```

## Tests

```bash
npm test
```

Runs the Node test suites in `tests/` (no dependencies): content negotiation, Markdown 404s, page and schema checks, llms.txt structure and sitemap coverage.

## Updating content

- Text and section content: `index.html`
- Career stage data for the hero stack and the story diagrams: `main.js`
- Colours, typography and spacing: the `:root` tokens at the top of `styles.css`
- When the FAQ text changes, update the matching `FAQPage` entry in the JSON-LD block and in `llms.txt`
- When page text changes, update its Markdown twin (`index.md`, `about.md`, `contact.md`, `privacy.md`)
- After any content change, update `lastmod` in `sitemap.xml`

## Contact

- Email: rushikeshit4003@gmail.com
- LinkedIn: https://www.linkedin.com/in/rushikesh-shirkar-772a1112a
- GitHub: https://github.com/RushiShirkar

© 2026 Rushikesh Shirkar. All rights reserved.
