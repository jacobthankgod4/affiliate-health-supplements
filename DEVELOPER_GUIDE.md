# Developer Guide

Quick reference for developers working on this project.

## Project Overview

**Affiliate E-Commerce Health Supplements Platform**
- Full-stack Next.js 16 application
- Supabase backend with PostgreSQL
- Real-time analytics and affiliate tracking
- Admin and affiliate dashboards

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Backend | Next.js API Routes, Node.js |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel |

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Create .env.local with Supabase credentials
# See SETUP_GUIDE.md for details

# Run development server
npm run dev

# Open http://localhost:3000
\`\`\`

## Project Structure

\`\`\`
app/
├── admin/          # Admin pages (protected)
├── affiliate/      # Affiliate dashboard
├── auth/           # Authentication pages
├── api/            # API routes
├── cart/           # Shopping cart
├── dashboard/      # User dashboard
├── products/       # Product catalog
└── page.tsx        # Homepage

components/
├── ui/             # shadcn/ui components
└── *.tsx           # Custom components

lib/
├── supabase/       # Supabase clients
└── utils/          # Utilities

scripts/
└── *.sql           # Database migrations
\`\`\`

## Key Files

| File | Purpose |
|------|---------|
| `middleware.ts` | Session management |
| `app/layout.tsx` | Root layout with fonts |
| `app/globals.css` | Global styles |
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/server.ts` | Server Supabase client |
| `next.config.mjs` | Next.js configuration |

## Common Tasks

### Add a New Page

1. Create file in `app/` directory
2. Add metadata export
3. Import components
4. Add to navigation if needed

Example:
\`\`\`tsx
// app/new-page/page.tsx
export const metadata = {
  title: "New Page",
  description: "Page description",
}

export default function NewPage() {
  return <div>Content</div>
}
\`\`\`

### Add a New API Route

1. Create file in `app/api/` directory
2. Export `GET`, `POST`, `PUT`, `DELETE` functions
3. Use Supabase server client for database access

Example:
\`\`\`tsx
// app/api/example/route.ts
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("table").select()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
\`\`\`

### Add a New Component

1. Create file in `components/` directory
2. Use TypeScript for type safety
3. Import shadcn/ui components as needed

Example:
\`\`\`tsx
// components/my-component.tsx
import { Button } from "@/components/ui/button"

interface MyComponentProps {
  title: string
}

export function MyComponent({ title }: MyComponentProps) {
  return <Button>{title}</Button>
}
\`\`\`

### Query Database

**Server-side (Server Components/API Routes)**:
\`\`\`tsx
import { createClient } from "@/lib/supabase/server"

const supabase = await createClient()
const { data, error } = await supabase
  .from("products")
  .select()
  .eq("category", "nootropics")
\`\`\`

**Client-side (Client Components)**:
\`\`\`tsx
"use client"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()
const { data, error } = await supabase
  .from("products")
  .select()
\`\`\`

### Protect a Route

**For authenticated users**:
\`\`\`tsx
// app/protected/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect("/auth/login")
  
  return <div>Protected content</div>
}
\`\`\`

**For admin users**:
\`\`\`tsx
// app/admin/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect("/auth/login")
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()
  
  if (!profile?.is_admin) redirect("/")
  
  return <div>Admin content</div>
}
\`\`\`

## Database Schema

### Key Tables

**profiles**
- `id` (UUID, PK)
- `email` (text)
- `name` (text)
- `is_admin` (boolean)
- `created_at` (timestamp)

**products**
- `id` (UUID, PK)
- `name` (text)
- `description` (text)
- `price` (decimal)
- `category` (text)
- `image_url` (text)
- `affiliate_link` (text)

**newsletter_subscribers**
- `id` (UUID, PK)
- `email` (text, unique)
- `subscribed_at` (timestamp)

**cart_items**
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `product_id` (UUID, FK)
- `quantity` (integer)

**affiliate_clicks**
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `product_id` (UUID, FK)
- `ip_address` (text)
- `user_agent` (text)
- `referrer` (text)
- `clicked_at` (timestamp)

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | `eyJhbGc...` |
| `SUPABASE_POSTGRES_URL` | Database connection | `postgresql://...` |
| `ADMIN_CREATION_SECRET_KEY` | Admin creation secret | Random string |

## Debugging

### Enable Debug Logging

Add to any file:
\`\`\`tsx
console.log("[v0] Debug message:", variable)
\`\`\`

### Check Supabase Logs

1. Go to Supabase dashboard
2. **Logs** → **API** or **Database**
3. Filter by timestamp or error

### Check Vercel Logs

1. Go to Vercel dashboard
2. **Deployments** → Select deployment
3. **Logs** → View build or runtime logs

## Performance Tips

- Use Server Components by default
- Lazy load heavy components with `dynamic()`
- Optimize images with Next.js Image component
- Use `revalidate` for ISR (Incremental Static Regeneration)
- Minimize client-side JavaScript

## Security Best Practices

- Never expose secrets in client code
- Always validate input on server
- Use RLS policies for database access
- Sanitize user input
- Use HTTPS in production
- Keep dependencies updated

## Testing

\`\`\`bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Deployment

\`\`\`bash
# Push to GitHub
git push origin main

# Vercel auto-deploys on push
# Monitor at https://vercel.com/dashboard
\`\`\`

## Common Errors

| Error | Solution |
|-------|----------|
| "Invalid custom property" | Check `globals.css` syntax |
| "Unauthorized" | Verify Supabase credentials |
| "User not found" | Check email verification |
| "RLS policy violation" | Check RLS policies in Supabase |

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org/docs)

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test locally
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/name`
5. Create Pull Request

---

**Last Updated**: October 2025
