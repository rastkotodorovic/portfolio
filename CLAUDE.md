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

- `src/app/` - Next.js App Router with route groups
  - `(public)/` - Public-facing pages (home, about, blog, work, gallery)
  - `(admin)/` - Admin pages with separate layout, protected by NextAuth
  - `api/` - API routes
- `src/components/` - React components organized by feature (blog/, work/, gallery/, about/)
- `src/resources/` - **Central configuration hub**:
  - `once-ui.config.ts` - Routes, styles, fonts, protection rules, social links
  - `content.tsx` - All textual content (person info, page content, metadata)
- `src/utils/` - MDX parsing utilities (`getPosts()` reads and sorts MDX files)
- `src/types/` - TypeScript interfaces for config and content
- `src/middleware.ts` - Route protection middleware for /admin routes

### Route Group Structure

```
src/app/
├── layout.tsx              # Root layout (html, head, body, Providers, fonts)
├── (public)/
│   ├── layout.tsx          # Public layout (Header, Footer, Background, RouteGuard)
│   ├── page.tsx            # Home (/)
│   ├── not-found.tsx
│   ├── about/
│   ├── blog/
│   │   ├── page.tsx
│   │   ├── [slug]/
│   │   └── posts/*.mdx
│   ├── gallery/
│   └── work/
│       ├── page.tsx
│       ├── [slug]/
│       └── projects/*.mdx
├── (admin)/
│   ├── layout.tsx          # Admin layout (client component with SessionProvider)
│   └── admin/
│       ├── page.tsx        # /admin (protected dashboard, server component)
│       ├── SignOutButton.tsx  # Client component for sign out
│       └── login/
│           └── page.tsx    # /admin/login (Google sign-in)
└── api/
    ├── auth/
    │   └── [...nextauth]/  # NextAuth.js v4 API routes & config
    └── ...
```

### Authentication System

Admin routes are protected using **NextAuth.js v4** with Google OAuth:

- **Configuration**: `src/app/api/auth/[...nextauth]/route.ts` - Contains `authOptions` with Google provider and email restrictions
- **Middleware**: `src/middleware.ts` - Protects `/admin/*` routes using `getToken()` from `next-auth/jwt`
- **Session Access**:
  - Server components: `getServerSession(authOptions)`
  - Client components: `useSession()` hook (within SessionProvider)

**Environment Variables Required**:
```env
AUTH_SECRET=           # Generate with: openssl rand -base64 32
AUTH_GOOGLE_ID=        # Google OAuth client ID
AUTH_GOOGLE_SECRET=    # Google OAuth client secret
ADMIN_EMAILS=          # Comma-separated list of allowed admin emails
```

**Access Control**:
- Only Google accounts listed in `ADMIN_EMAILS` can sign in
- Email must be verified by Google
- Unauthorized emails are rejected at sign-in with "Access denied" error

**Google OAuth Setup**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (dev)
4. Add production URI: `https://yourdomain.com/api/auth/callback/google`

### Content System

Blog posts and projects are MDX files with YAML frontmatter:
- Blog posts: `src/app/(public)/blog/posts/*.mdx`
- Projects: `src/app/(public)/work/projects/*.mdx`

When using `getPosts()`, paths must include the route group:
```typescript
getPosts(["src", "app", "(public)", "blog", "posts"])
getPosts(["src", "app", "(public)", "work", "projects"])
```

Frontmatter fields: `title`, `subtitle`, `summary`, `publishedAt`, `image`, `images[]`, `tags`, `team`, `link`

### Configuration Pattern

All customization flows through `src/resources/`:
1. **Routes & Features**: Enable/disable pages in `once-ui.config.ts`
2. **Content**: Update text, metadata, personal info in `content.tsx`
3. **Theming**: Brand colors, dark/light mode, borders, scaling in `once-ui.config.ts`

### Layout Hierarchy

```
RootLayout (fonts, theme init, Providers)
├── (public)/layout.tsx → Header, Background, RouteGuard, Footer
│   └── Public pages (/, /about, /blog, /work, /gallery)
└── (admin)/layout.tsx → SessionProvider (client), minimal wrapper
    └── Admin pages (/admin, /admin/login)
```

- `RouteGuard` handles route protection (password auth via cookies) and 404s for disabled routes
- Admin routes use NextAuth.js middleware for Google OAuth protection

### API Routes

- `/api/auth/[...nextauth]` - NextAuth.js OAuth handlers (GET/POST)
- `/api/authenticate` & `/api/check-auth` - Password protection (legacy RouteGuard)
- `/api/og/generate` - Dynamic OpenGraph image generation
- `/api/rss` - RSS feed

### Path Alias

Use `@/*` for imports from `src/` (e.g., `@/components/Header`).
