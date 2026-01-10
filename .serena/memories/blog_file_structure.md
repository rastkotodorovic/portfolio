# Magic Portfolio Blog - File Structure & Locations

## Core Blog Files

### Public Blog Routes
```
src/app/(public)/blog/
├── page.tsx                          # Blog listing page
│   - Uses <Posts> component
│   - Shows featured + recent posts
│   - Includes Mailchimp newsletter
│
├── [slug]/
│   └── page.tsx                      # Individual post detail page
│       - Fetches from Prisma database
│       - Uses getBlogPostBySlug()
│       - Renders CustomMDX content
│       - Shows related posts
│
└── posts/                            # MDX blog post files (11 files)
    ├── blog.mdx
    ├── components.mdx
    ├── content.mdx
    ├── localization.mdx
    ├── mailchimp.mdx
    ├── pages.mdx
    ├── password.mdx
    ├── quick-start.mdx
    ├── seo.mdx
    ├── styling.mdx
    └── work.mdx
```

### Admin Blog Routes
```
src/app/(admin)/
├── layout.tsx                        # Admin layout wrapper
│   - SessionProvider
│   - Sidebar + header
│   - Client component
│
└── admin/
    ├── page.tsx                      # Dashboard
    │   - Stats cards
    │   - Recent posts/projects lists
    │
    ├── posts/
    │   ├── page.tsx                  # Posts management table
    │   │   - Protected by NextAuth
    │   │   - DataTable with search
    │   │   - Fetch via getAllBlogPosts()
    │   │
    │   └── columns.tsx               # Table column definitions
    │       - BlogPost UI type
    │       - 6 columns with actions
    │
    ├── projects/
    │   ├── page.tsx
    │   └── columns.tsx
    │
    └── globals.css                   # Admin-specific styles
```

### Components
```
src/components/public/blog/
├── Posts.tsx                         # Async server component
│   - Props: range, columns, thumbnail, direction, exclude
│   - Fetches getPublishedBlogPosts()
│   - Maps DB format to display format
│
├── Post.tsx                          # Client component - Post card
│   - Displays individual post preview
│   - Links to detail page
│
└── ShareSection.tsx                  # Client component - Social sharing
    - 8 social platforms + copy link
    - Config-driven display
```

### MDX & Content Processing
```
src/components/public/
├── mdx.tsx                           # CustomMDX component
│   - MDXRemote wrapper
│   - Custom HTML element handlers
│   - Once UI component mappings
│   - Auto-heading ID generation
│
└── (other public components)
    ├── Header.tsx
    ├── Footer.tsx
    ├── HeadingLink.tsx
    └── ... other shared components
```

### Database Layer
```
src/lib/
├── prisma.ts                         # Prisma client singleton
│   - Global instance management
│   - Logging config
│
└── db/
    ├── posts.ts                      # Database functions
    │   - getAllBlogPosts()
    │   - getBlogPostBySlug()
    │   - getPublishedBlogPosts()
    │   - Similar for projects
    │
    └── mappers.ts                    # Type conversion
        - mapPrismaBlogPostToUI()
        - mapPrismaProjectToUI()
```

### Schema & Configuration
```
prisma/
└── schema.prisma                     # Prisma data models
    - BlogPost model
    - Project model
    - PostStatus enum
    - Database indexes
```

## File Dependencies

### Blog Page Routes
**src/app/(public)/blog/page.tsx** depends on:
- @/resources (blog config, baseURL)
- @/components (Posts, Mailchimp)
- Once UI System (Column, Heading, Schema, Meta)

**src/app/(public)/blog/[slug]/page.tsx** depends on:
- next/navigation (notFound)
- @/lib/db/posts (getBlogPostBySlug, getPublishedBlogPosts)
- @/components (CustomMDX, Posts, ShareSection)
- Once UI System (all display components)

### Components
**Posts.tsx** depends on:
- @/lib/db/posts (getPublishedBlogPosts)
- ./Post (renders each post card)
- Once UI System (Grid)

**Post.tsx** depends on:
- @/resources (person config)
- @/utils (formatDate)
- Once UI System (Card, Media, Row, Column, Avatar, Text)

**ShareSection.tsx** depends on:
- @/resources (socialSharing config)
- Once UI System (Row, Text, Button, useToast)

### Admin Pages
**src/app/(admin)/admin/posts/page.tsx** depends on:
- next-auth (getServerSession)
- @/lib/db/posts (getAllBlogPosts)
- @/lib/db/mappers (mapPrismaBlogPostToUI)
- ./columns (DataTable column definitions)
- @/components/admin (DataTable, Button)

## Database Connection

**Environment Variables Required**:
```
DATABASE_URL="postgresql://user:password@localhost:5432/magic_portfolio?schema=public"
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
ADMIN_EMAILS=...
```

**Docker Setup**:
```bash
npm run db:start      # Start PostgreSQL container
npm run db:reset      # Reset database
npm run prisma:migrate # Run migrations
npm run prisma:seed   # Seed database
```

## Key Type Definitions

### Prisma BlogPost
- id: string (CUID)
- title: string
- slug: string (unique)
- status: PostStatus (published | draft)
- tag: string
- publishedAt: DateTime
- summary: string
- content: string | null
- createdAt: DateTime
- updatedAt: DateTime

### UI BlogPost (Admin)
- id: string
- title: string
- slug: string
- status: "published" | "draft"
- tag: string
- publishedAt: string (ISO date)
- summary: string

### Post Display Format (Public)
```typescript
{
  slug: string
  content: string
  metadata: {
    title: string
    publishedAt: string (ISO)
    summary: string
    tag: string
    image: string (hardcoded currently)
  }
}
```

## Important Notes

1. **Hardcoded Image**: All posts currently use `/images/projects/project-01/cover-01.jpg`
   - Located in Posts.tsx line 31
   - Should be replaced with per-post image field

2. **Date Formatting**: 
   - Database: DateTime
   - Admin UI: YYYY-MM-DD string
   - Public: ISO string format with formatDate utility

3. **URL Structure**:
   - Posts listing: `/blog`
   - Post detail: `/blog/{slug}`
   - Admin dashboard: `/admin`
   - Posts management: `/admin/posts`
   - Login: `/admin/login`

4. **Protected Routes**:
   - All /admin/* routes require NextAuth session
   - Email-based access control via ADMIN_EMAILS

5. **Static Generation**:
   - Blog posts use generateStaticParams for SSG
   - Metadata generation for each post
