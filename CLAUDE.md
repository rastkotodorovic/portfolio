# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run biome-write  # Format code with Biome
```

Pre-commit hooks run Biome formatting on staged files automatically.

## Architecture Overview

This is a **Next.js 16 portfolio template** using the App Router, TypeScript, and the Once UI design system. Content is MDX-based with configuration-driven UI.

### Key Directories

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components organized by feature (blog/, work/, gallery/, about/)
- `src/resources/` - **Central configuration hub**:
  - `once-ui.config.ts` - Routes, styles, fonts, protection rules, social links
  - `content.tsx` - All textual content (person info, page content, metadata)
- `src/utils/` - MDX parsing utilities (`getPosts()` reads and sorts MDX files)
- `src/types/` - TypeScript interfaces for config and content

### Content System

Blog posts and projects are MDX files with YAML frontmatter:
- Blog posts: `src/app/blog/posts/*.mdx`
- Projects: `src/app/work/projects/*.mdx`

Frontmatter fields: `title`, `subtitle`, `summary`, `publishedAt`, `image`, `images[]`, `tags`, `team`, `link`

### Configuration Pattern

All customization flows through `src/resources/`:
1. **Routes & Features**: Enable/disable pages in `once-ui.config.ts`
2. **Content**: Update text, metadata, personal info in `content.tsx`
3. **Theming**: Brand colors, dark/light mode, borders, scaling in `once-ui.config.ts`

### Provider Hierarchy

```
RootLayout → Providers → ThemeProvider → DataThemeProvider → ToastProvider → IconProvider → RouteGuard → Page
```

`RouteGuard` handles route protection (password auth via cookies) and 404s for disabled routes.

### API Routes

- `/api/authenticate` & `/api/check-auth` - Password protection
- `/api/og/generate` - Dynamic OpenGraph image generation
- `/api/rss` - RSS feed

### Path Alias

Use `@/*` for imports from `src/` (e.g., `@/components/Header`).
