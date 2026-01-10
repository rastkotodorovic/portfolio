# Magic Portfolio Blog System Architecture

## Overview
The Magic Portfolio uses a **hybrid blog system** that combines PostgreSQL database storage (via Prisma ORM) with MDX file-based blog posts. The system is built on Next.js 16 with the App Router.

## 1. Blog Post Storage Structure

### Database Model (Prisma)
**Location**: `/Users/rastko/Projects/Next/magic-portfolio/prisma/schema.prisma`

```prisma
enum PostStatus {
  published
  draft
}

model BlogPost {
  id          String     @id @default(cuid())
  title       String
  slug        String     @unique
  status      PostStatus @default(draft)
  tag         String           # Single tag field
  publishedAt DateTime
  summary     String     @db.Text
  content     String?    @db.Text  # Markdown/MDX content
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  @@index([status])
  @@index([publishedAt])
  @@map("blog_posts")
}
```

**Key Fields**:
- `id`: CUID primary key
- `slug`: Unique URL-friendly identifier
- `status`: published or draft (indexes for filtering)
- `tag`: Single categorical tag
- `publishedAt`: Publication timestamp (indexed for sorting)
- `summary`: Short description for listings
- `content`: Full markdown/MDX content stored in database

### File-Based Posts (Legacy/Original)
**Location**: `/Users/rastko/Projects/Next/magic-portfolio/src/app/(public)/blog/posts/`

Files include:
- blog.mdx
- components.mdx
- content.mdx
- localization.mdx
- mailchimp.mdx
- pages.mdx
- password.mdx
- quick-start.mdx
- seo.mdx
- styling.mdx
- work.mdx

**Frontmatter Format** (YAML):
```yaml
---
title: "Post Title"
summary: "Short description for listings"
publishedAt: "YYYY-MM-DD"
tag: "Category Tag"
image: "/path/to/image.jpg"  # Optional
---
```

## 2. Blog Display System

### Public Routes
**Blog Listing**: `src/app/(public)/blog/page.tsx`
- Uses the `<Posts>` component to display blog posts
- Features tiered layout:
  - 1 featured post with thumbnail
  - 2-3 posts in 2-column grid with thumbnails
  - "Earlier posts" section in 2-column grid without thumbnails
- Includes Mailchimp newsletter signup
- Metadata generation for SEO

**Blog Post Detail**: `src/app/(public)/blog/[slug]/page.tsx`
- Fetches blog posts from Prisma database
- Uses `getBlogPostBySlug()` for individual post lookup
- Renders MDX content via `<CustomMDX>` component
- Displays post metadata (date, author, summary)
- Includes author info and avatar
- Shows related posts and share section
- Full rich metadata for SEO and social sharing

### Display Components

**Posts Component**: `src/components/public/blog/Posts.tsx`
- Async server component
- Fetches published posts from database via `getPublishedBlogPosts()`
- Props:
  - `range`: [1,1] or [start, end] to slice posts
  - `columns`: "1" | "2" | "3" grid layout
  - `thumbnail`: boolean for showing images
  - `direction`: "row" | "column" for card layout
  - `exclude`: string[] of slugs to filter out
- Maps Prisma posts to internal format
- Hardcoded image: `/images/projects/project-01/cover-01.jpg`

**Post Component**: `src/components/public/blog/Post.tsx` (Client)
- Individual post card
- Uses Once UI `<Card>` component
- Displays title, author, date, tag, and optional thumbnail
- Links to `/blog/{slug}`

**ShareSection Component**: `src/components/public/blog/ShareSection.tsx` (Client)
- Social media sharing buttons
- Supports: X, LinkedIn, Facebook, Pinterest, WhatsApp, Reddit, Telegram, Email
- Copy link to clipboard functionality
- Controlled by `socialSharing` config

## 3. Admin Pages Structure

**Location**: `src/app/(admin)/`

### Layout
**File**: `src/app/(admin)/layout.tsx`
- Client component with SessionProvider
- Uses Sidebar from shadcn UI components
- Minimal header with Admin label
- Protected by NextAuth.js middleware

### Admin Dashboard
**File**: `src/app/(admin)/admin/page.tsx`
- Requires authenticated session
- Redirects to `/admin/login` if not authenticated
- Shows stats cards: Blog Posts, Projects, Users, Page Views
- Lists recent posts and projects (mock data)

### Blog Posts Management
**File**: `src/app/(admin)/admin/posts/page.tsx`
- Protected by NextAuth
- Fetches all blog posts from database
- Uses DataTable component with shadcn columns
- Features:
  - Title, slug, status, tag, publishedAt columns
  - Sortable columns
  - Searchable by title
  - Row selection checkboxes
  - Actions dropdown (View, Edit, Delete)
  - "New Post" button

**Columns Definition**: `src/app/(admin)/admin/posts/columns.tsx`
- ColumnDef from TanStack React Table
- BlogPost UI type:
  ```typescript
  type BlogPost = {
    id: string;
    title: string;
    slug: string;
    status: "published" | "draft";
    tag: string;
    publishedAt: string;
    summary: string;
  }
  ```
- Sortable columns: title, publishedAt
- Status badge (published/draft)
- Tag badge

### Projects Management
**File**: `src/app/(admin)/admin/projects/page.tsx`
- Similar structure to posts
- Data table for projects

## 4. Database Utilities

**Location**: `src/lib/db/posts.ts`

Functions:
```typescript
getAllBlogPosts(): Promise<BlogPost[]>
  // Returns all posts ordered by publishedAt desc

getBlogPostBySlug(slug: string): Promise<BlogPost | null>
  // Finds single post by slug

getPublishedBlogPosts(): Promise<BlogPost[]>
  // Returns only published posts ordered by publishedAt desc

// Similar functions for projects
getAllProjects(): Promise<Project[]>
getProjectBySlug(slug: string): Promise<Project | null>
getPublishedProjects(): Promise<Project[]>
```

**Mappers**: `src/lib/db/mappers.ts`
```typescript
mapPrismaBlogPostToUI(post: PrismaBlogPost): BlogPost
  // Converts Prisma model to UI type, formats publishedAt to YYYY-MM-DD

mapPrismaProjectToUI(project: PrismaProject): Project
```

**Prisma Client**: `src/lib/prisma.ts`
- Singleton pattern with global namespace
- Logging enabled in development mode
- Reuses connection in dev mode

## 5. MDX Processing

**Component**: `src/components/public/mdx.tsx`

**Custom Components Available**:
- HTML elements: p, h1-h6, img, a, code, pre, ol, ul, li, hr
- Once UI components: Heading, Text, CodeBlock, InlineCode, Accordion, AccordionGroup, Table, Feedback, Button, Card, Grid, Row, Column, Icon, Media, SmartLink

**Features**:
- Automatic heading ID generation via slugify
- Custom link handling (internal, hash, external)
- Markdown code blocks converted to CodeBlock components
- Image optimization via Once UI Media component
- List and line formatting

## 6. Content Mapping Flow

```
Database (Prisma) → getPublishedBlogPosts()
  ↓
Posts.tsx component
  ↓
Maps to internal format with metadata
  ↓
Post.tsx (display cards)
  ↓
Links to /blog/[slug]

Individual Post:
Database → getBlogPostBySlug()
  ↓
blog/[slug]/page.tsx
  ↓
CustomMDX renders post.content
```

## 7. Key Technologies

- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL (Docker)
- **ORM**: Prisma 6.19.1
- **MDX**: next-mdx-remote 5.0.0
- **UI System**: Once UI System
- **Component Library**: shadcn UI (admin)
- **Table Library**: TanStack React Table 8.21.3
- **Auth**: NextAuth.js 4.24.13
