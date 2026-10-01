# Rushikesh Shirkar | Portfolio

Personal portfolio of Rushikesh Shirkar, Senior Software Engineer and Product Engineer based in Pune, India.

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
| Contact | Email, mobile, LinkedIn and GitHub |

## Features

- Dark and light themes, with the choice remembered between visits
- Command palette (`Cmd K` / `Ctrl K`) for navigation and quick actions
- Responsive layout from phone to desktop
- Reduced-motion support for all animation
- Keyboard-accessible tabs, dialogs and controls
- SEO metadata and JSON-LD structured data

## Tech stack

- HTML, CSS and vanilla JavaScript
- Canvas and inline SVG for graphics
- Google Fonts: Inter Tight, Instrument Serif, JetBrains Mono
- No framework, no build step, no runtime dependencies

## Project structure

```
.
├── index.html    Markup and content
├── styles.css    Design tokens, layout and motion
└── main.js       Interactions, canvas graphics and command palette
```

## Run locally

Serve the folder with any static server:

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Deploy

The site is fully static. Upload the three files to any static host, such as GitHub Pages, Netlify, Vercel or Cloudflare Pages. No build command is required.

## Updating content

- Text and section content: `index.html`
- Career stage data for the hero stack and the story diagrams: `main.js`
- Colours, typography and spacing: the `:root` tokens at the top of `styles.css`

## Contact

- Email: rushikeshit4003@gmail.com
- LinkedIn: https://www.linkedin.com/in/rushikesh-shirkar-772a1112a
- GitHub: https://github.com/RushiShirkar

© 2026 Rushikesh Shirkar. All rights reserved.
