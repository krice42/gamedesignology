# gamedesignology
 
# Game Designology — How the Site Works

## Tech Stack
- **Astro** — static site framework that turns `.astro` components + `.md` files into HTML
- **Custom CSS** — all styling lives in `src/styles/global.css` (no Tailwind)
- **Netlify** — deployment target (configured in `astro.config.mjs` and `static.json`)
- **@astrojs/image** — automatic image optimization (WebP/AVIF output)

---

## How the Site Is Structured

```
src/
├── pages/           ← Every file here becomes a URL route
│   ├── index.astro          → /
│   ├── about.astro          → /about
│   ├── 404.astro            → /404
│   ├── gamedesign/
│   │   ├── [...page].astro  → /gamedesign/ (paginated list)
│   │   ├── post-1.md        → /gamedesign/post-1
│   │   └── ...
│   ├── tutorials/
│   │   ├── [...page].astro  → /tutorials/
│   │   └── post-1.md        → /tutorials/post-1
│   └── category/
│       └── [category].astro → /category/game-balance, etc.
├── components/      ← Reusable UI pieces (Nav, Footer, PostCard, etc.)
├── layouts/         ← Page wrappers (MainLayout, TutorialPostLayout)
├── data/            ← Navigation link lists
├── js/              ← Utility functions (slugify, formatDate, formatBlogPosts)
└── styles/          ← global.css — all design tokens and component styles
```

**How a blog post renders:**
1. A `.md` file (e.g. `post-1.md`) declares `layout: "../../layouts/TutorialPostLayout.astro"` in its frontmatter
2. Astro feeds the markdown content + frontmatter into that layout
3. `TutorialPostLayout` renders the `PostHeader` (hero image, title, date, category) then the post body
4. The whole thing is wrapped in `MainLayout` which adds the Nav and Footer

**How the homepage works:**
`index.astro` uses `Astro.glob()` to collect all `.md` files from both sections, runs them through `formatBlogPosts()` (sorts by date, filters drafts), takes the latest 3 from each, and renders them as `PostCard` components.

---

## How to Update the Look

All visual design lives in **`src/styles/global.css`**.

### Colors
At the top of the file, CSS variables define the entire color palette:
```css
/* Light mode */
--color-bg: ...         /* page background */
--color-text: ...       /* body text */
--color-accent: #ff8c00 /* orange highlights, links, badges */

/* Dark mode (inside @media (prefers-color-scheme: dark)) */
```
Change `--color-accent` to swap the orange highlights across the whole site at once.

### Fonts
The font is loaded in **`src/layouts/MainHead.astro`** via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible..." />
```
Replace the font name there, then update `font-family` in `global.css`.

### Spacing & Font Sizes
Defined as CSS custom properties using a scale system:
```css
--space-xs, --space-sm, --space-md ...
--fs-sm, --fs-base, --fs-lg, --fs-xl ...
```
Adjusting these cascades changes throughout the whole site.

### Component-level Styles
Each UI section has its own class block in `global.css`:
- `.navbar` — top navigation bar
- `.card` — post preview cards
- `.sidenavbar` — left sidebar
- `.category-banner` — orange category header sections
- `.about` — the about page grid
- `.post-content` — individual post layout

### Logo
Replace `public/temp-logo.jpg` with a new image (keep the same filename, or update the reference in `src/components/Nav.astro`).

---

## How to Add a Blog Post

Create a new `.md` file in the appropriate folder. Copy the frontmatter from an existing post:

```markdown
---
layout: "../../layouts/TutorialPostLayout.astro"
title: "Your Post Title"
date: 2024-01-15
author: "Author Name"
image:
  src: "/images/your-image.jpg"
  alt: "Image description"
description: "Brief SEO description"
draft: false
category: "Game Balance"
---

Your post content here in Markdown.
```

- Drop the image in `public/images/`
- `category` must match an existing category slug (e.g. `"Game Balance"`, `"Map Making"`, `"Game Logic"`, `"Unreal"`) or add a new one (see below)
- Set `draft: true` to hide the post without deleting it

---

## How to Remove a Blog Post

Delete the `.md` file. The post will disappear from all lists, pagination, and category pages automatically.

---

## How to Add a New Section (e.g. `/reviews/`)

1. **Create the folder and posts:** `src/pages/reviews/post-1.md`, etc.
2. **Create a paginated index page:** Copy `src/pages/gamedesign/[...page].astro`, update the `Astro.glob()` path to point at `../reviews/*.md`
3. **Add it to the nav:** Open `src/data/navData.js` and add:
   ```js
   { text: "Reviews", href: "/reviews/" }
   ```
4. **Optionally add a sidebar:** Copy `src/components/SideBar.astro`, update its links, and drop it into the new section's layout

---

## How to Add a New Category

1. Add posts with the new category name in their frontmatter (e.g. `category: "Level Design"`)
2. Open the relevant sidebar data file (`src/data/sideNavData.js` or `sideNavTutData.js`) and add:
   ```js
   { text: "Level Design", href: "/category/level-design" }
   ```
3. The category page (`src/pages/category/[category].astro`) is already dynamic — it will automatically handle the new category route

---

## How to Remove a Page

| Page type | How to remove |
|-----------|--------------|
| Blog post | Delete the `.md` file |
| Static page (about, etc.) | Delete the `.astro` file from `src/pages/` |
| Entire section | Delete the folder under `src/pages/`, remove its entry from `navData.js` |
| Category | Remove posts with that category + remove its entry from the sidebar data file |

---

## Deployment (Netlify)

The project is pre-configured for Netlify. To deploy:
1. Push the project to GitHub
2. Connect the repo to Netlify
3. Build command: `npm run build` / Publish directory: `dist`
