# Affiliate E-Commerce Health Supplements Platform

A production-ready full-stack affiliate marketing platform for health supplements built with Next.js 16, React 19, TypeScript, Supabase, and Tailwind CSS.

## Overview

This platform enables health supplement affiliate marketing with a modern, minimalist design inspired by Apple's aesthetic and Nike's dynamic flows. It features a complete e-commerce system with user authentication, product catalog, shopping cart, admin dashboard, and advanced affiliate tracking.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes, Node.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **UI Components**: shadcn/ui, Radix UI
- **Typography**: Inter (body), Playfair Display (headings)
- **Deployment**: Vercel

## Features

### Phase 1 (MVP) - Complete
- ✅ Homepage with hero section and featured products
- ✅ Newsletter signup page with email validation
- ✅ Product catalog with search and filtering
- ✅ User authentication (signup/login/logout)
- ✅ User dashboard with profile management
- ✅ Admin authentication system (backend-only)

### Phase 2 - Complete
- ✅ Admin dashboard with analytics
- ✅ Product management (CRUD operations)
- ✅ User management
- ✅ Analytics dashboard with click tracking
- ✅ Newsletter subscriber management

### Phase 3 - Complete
- ✅ Shopping cart system
- ✅ Saved products (favorites)
- ✅ Affiliate dashboard with performance tracking
- ✅ Advanced click tracking with UTM parameters
- ✅ Affiliate reporting and analytics
- ✅ Conversion tracking

## Project Structure

\`\`\`
├── app/
│   ├── admin/                 # Admin pages (protected)
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── analytics/
│   │   └── users/
│   ├── affiliate/              # Affiliate dashboard
│   │   └── dashboard/
│   ├── auth/                   # Authentication pages
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── callback/
│   │   └── error/
│   ├── api/                    # API routes
│   │   ├── admin/create/       # Backend-only admin creation
│   │   ├── affiliate/
│   │   ├── analytics/
│   │   ├── cart/
│   │   ├── newsletter/
│   │   └── saved-products/
│   ├── cart/                   # Shopping cart page
│   ├── dashboard/              # User dashboard
│   ├── products/               # Product catalog
│   ├── newsletter-signup/      # Newsletter signup page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── header.tsx
│   ├── hero-section.tsx
│   ├── product-catalog.tsx
│   ├── newsletter-form.tsx
│   └── ...
├── lib/
│   ├── supabase/               # Supabase clients
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── middleware.ts       # Session management
│   └── utils/
│       └── utm-generator.ts    # UTM parameter generation
├── scripts/                    # Database migration scripts
│   ├── 001_create_profiles.sql
│   ├── 002_create_newsletter_subscribers.sql
│   ├── 003_create_products.sql
│   ├── 004_create_affiliate_clicks.sql
│   ├── 005_create_profile_trigger.sql
│   ├── 006_seed_products.sql
│   ├── 007_add_admin_role.sql
│   ├── 008_add_product_images.sql
│   ├── 009_add_name_to_profiles.sql
│   ├── 010_create_cart_items.sql
│   ├── 011_create_saved_products.sql
│   ├── 012_create_analytics.sql
│   ├── 013_update_affiliate_clicks_schema.sql
│   ├── 014_create_affiliate_reports.sql
│   └── 015_remove_mailchimp_integration.sql
├── middleware.ts               # Next.js middleware for auth
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies

\`\`\`

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account (free tier available)
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd affiliate-ecommerce-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   pnpm install
   \`\`\`

3. **Set up Supabase**
   - Create a new Supabase project at https://supabase.com
   - Get your project URL and API keys from the project settings
   - Add environment variables (see Environment Variables section)

4. **Run database migrations**
   - Go to the Supabase SQL Editor
   - Run each SQL script in order (001-015) from the `scripts/` folder
   - This creates all necessary tables, triggers, and RLS policies

5. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   pnpm dev
   \`\`\`

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_POSTGRES_URL=your_postgres_url
SUPABASE_POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling

# Admin Creation (for backend-only admin setup)
ADMIN_CREATION_SECRET_KEY=your_secure_random_key

# Development (optional)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`
4. For database URL, go to "Settings" → "Database" → "Connection string" (select "URI")

## Database Schema

### Tables

- **profiles**: User profiles with admin role and name
- **newsletter_subscribers**: Newsletter email subscribers
- **products**: Product catalog with images and affiliate links
- **cart_items**: Shopping cart items per user
- **saved_products**: User's saved/favorite products
- **affiliate_clicks**: Click tracking with IP, user agent, and referrer
- **analytics**: Performance metrics and conversions
- **affiliate_reports**: Periodic affiliate performance snapshots

All tables have Row Level Security (RLS) policies enabled for data protection.

## Authentication

### User Authentication
- Email/password signup and login
- Email verification required
- Session management via Supabase middleware
- Protected routes for authenticated users

### Admin Authentication
- **Backend-only creation** for security
- No frontend signup for admins
- Created via `/api/admin/create` endpoint with secret key

#### Creating an Admin User

Use the backend API to create admin users:

\`\`\`bash
curl -X POST http://localhost:3000/api/admin/create \
  -H "Authorization: Bearer YOUR_ADMIN_CREATION_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "secure_password_here",
    "name": "Admin Name"
  }'
\`\`\`

Then log in at `/auth/login` with the admin credentials.

## Key Features

### Homepage
- Hero section with compelling value proposition
- Featured products showcase
- Trust/social proof section
- Newsletter CTA
- Responsive mobile-first design

### Newsletter Signup
- Dedicated signup page at `/newsletter-signup`
- Email validation (client & server-side)
- Duplicate subscriber handling
- Success/error messaging

### Product Catalog
- Search functionality
- Category filtering (Nootropics, Proteins, Vitamins)
- Product cards with ratings and pricing
- Affiliate link tracking
- Responsive grid layout

### User Dashboard
- Profile management
- Saved products (favorites)
- Shopping cart
- Order history (ready for Phase 4)

### Admin Dashboard
- Product management (CRUD)
- User management
- Analytics with click tracking
- Revenue and conversion metrics
- Top-performing products

### Affiliate Dashboard
- Performance tracking
- Click and conversion metrics
- Revenue attribution
- UTM parameter generation
- Recent referrals activity

## API Routes

### Authentication
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/login` - User login
- `POST /api/admin/create` - Backend-only admin creation

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter

### Products
- `GET /api/products` - Get all products
- `POST /api/affiliate/track-click` - Track affiliate clicks

### Cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart

### Saved Products
- `POST /api/saved-products/toggle` - Toggle saved product

### Analytics
- `POST /api/analytics/track-conversion` - Track conversions

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   \`\`\`bash
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Add environment variables from `.env.local`
   - Click "Deploy"

3. **Update Supabase Redirect URL**
   - In Supabase, go to "Authentication" → "URL Configuration"
   - Add your Vercel deployment URL to "Redirect URLs"
   - Example: `https://your-app.vercel.app/auth/callback`

### Environment Variables on Vercel

Add all environment variables from `.env.local` to your Vercel project:
1. Go to "Settings" → "Environment Variables"
2. Add each variable with its value
3. Redeploy the project

## Development Workflow

### Running Locally
\`\`\`bash
npm run dev
\`\`\`

### Building for Production
\`\`\`bash
npm run build
npm start
\`\`\`

### Linting
\`\`\`bash
npm run lint
\`\`\`

## Database Migrations

All database migrations are in the `scripts/` folder. To run them:

1. **In Supabase Dashboard**
   - Go to "SQL Editor"
   - Click "New Query"
   - Copy and paste each SQL script (001-015 in order)
   - Click "Run"

2. **Or use Supabase CLI**
   \`\`\`bash
   supabase db push
   \`\`\`

## Security Best Practices

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Admin creation only via backend API with secret key
- ✅ Session management with automatic token refresh
- ✅ Protected routes with middleware
- ✅ Email verification for new accounts
- ✅ Secure password hashing via Supabase Auth
- ✅ CORS and CSRF protection via Next.js

## Performance Optimizations

- ✅ Server-side rendering (SSR) for SEO
- ✅ Image optimization with Next.js Image component
- ✅ CSS-in-JS with Tailwind CSS v4
- ✅ Code splitting and lazy loading
- ✅ Database query optimization with indexes
- ✅ Caching strategies for static content

## Accessibility

- ✅ WCAG 2.1 AA compliance
- ✅ Semantic HTML elements
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Color contrast compliance

## Troubleshooting

### Common Issues

**"Invalid custom property" error**
- Ensure `globals.css` has correct Tailwind v4 syntax
- Check that font variables are properly defined

**Authentication not working**
- Verify Supabase credentials in `.env.local`
- Check that email verification is enabled in Supabase
- Ensure redirect URL is configured in Supabase

**Database connection errors**
- Verify `SUPABASE_POSTGRES_URL` is correct
- Check that all migration scripts have been run
- Ensure RLS policies are properly configured

**Admin creation fails**
- Verify `ADMIN_CREATION_SECRET_KEY` is set
- Check that the Authorization header is correct
- Ensure the user email doesn't already exist

## Future Enhancements

- Payment processing (Stripe integration)
- Email notifications (Resend or SendGrid)
- Advanced analytics and reporting
- Affiliate commission management
- Multi-currency support
- API documentation (Swagger/OpenAPI)
- Mobile app (React Native)

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: support@health.waidemobility.org
- Documentation: https://docs.health.waidemobility.org

## Changelog

### v1.0.0 (Current)
- Complete Phase 1, 2, and 3 implementation
- Full authentication system
- Product catalog with affiliate tracking
- Admin and affiliate dashboards
- Shopping cart and saved products
- Analytics and reporting
- Removed Mailchimp integration
- Premium typography (Inter + Playfair Display)
- Backend-only admin creation for security

---

**Last Updated**: October 2025
**Status**: Production Ready
