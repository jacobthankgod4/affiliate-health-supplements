# Setup and Deployment Guide

## System Status: Production Ready ✅

This guide walks you through setting up and deploying the Affiliate E-Commerce Health Supplements Platform.

## Pre-Deployment Checklist

- [ ] Node.js 18+ installed
- [ ] Supabase account created
- [ ] Vercel account created
- [ ] GitHub repository created
- [ ] Environment variables prepared

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in project details:
   - **Name**: `affiliate-ecommerce`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
4. Wait for project to initialize (2-3 minutes)

### 1.2 Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → Save as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → Save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → Save as `SUPABASE_SERVICE_ROLE_KEY`

3. Go to **Settings** → **Database**
4. Under "Connection string", select "URI"
5. Copy the connection string → Save as `SUPABASE_POSTGRES_URL`
6. Replace `[YOUR-PASSWORD]` with your database password

### 1.3 Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the first migration script from `scripts/001_create_profiles.sql`
4. Click **Run**
5. Repeat for all scripts in order (001-015)

**Important**: Run scripts in this exact order:
\`\`\`
001_create_profiles.sql
002_create_newsletter_subscribers.sql
003_create_products.sql
004_create_affiliate_clicks.sql
005_create_profile_trigger.sql
006_seed_products.sql
007_add_admin_role.sql
008_add_product_images.sql
009_add_name_to_profiles.sql
010_create_cart_items.sql
011_create_saved_products.sql
012_create_analytics.sql
013_update_affiliate_clicks_schema.sql
014_create_affiliate_reports.sql
015_remove_mailchimp_integration.sql
\`\`\`

### 1.4 Configure Authentication

1. Go to **Authentication** → **Providers**
2. Ensure "Email" is enabled (default)
3. Go to **Authentication** → **URL Configuration**
4. Add redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback`

## Step 2: Local Development Setup

### 2.1 Clone and Install

\`\`\`bash
# Clone repository
git clone <your-repo-url>
cd affiliate-ecommerce-app

# Install dependencies
npm install
# or
pnpm install
\`\`\`

### 2.2 Create Environment File

Create `.env.local` in the root directory:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_POSTGRES_URL=your_postgres_url
SUPABASE_POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling

# Admin Creation Secret (generate a random string)
ADMIN_CREATION_SECRET_KEY=your_random_secret_key_here

# Development
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### 2.3 Run Development Server

\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

Open http://localhost:3000 in your browser.

## Step 3: Create Admin User

### 3.1 Generate Admin Secret Key

Generate a secure random string (use a password generator):
\`\`\`bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString())) | Select-Object -First 32
\`\`\`

### 3.2 Create Admin via API

\`\`\`bash
curl -X POST http://localhost:3000/api/admin/create \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "secure_password_123",
    "name": "Admin User"
  }'
\`\`\`

Expected response:
\`\`\`json
{
  "success": true,
  "message": "Admin user created successfully",
  "userId": "user-id-here"
}
\`\`\`

### 3.3 Login as Admin

1. Go to http://localhost:3000/auth/login
2. Enter admin email and password
3. You'll be redirected to `/dashboard`
4. Click "Admin Dashboard" in the navigation to access admin features

## Step 4: Test Core Features

### 4.1 Test User Flow

- [ ] Visit homepage at `/`
- [ ] Click "Sign Up" and create a test account
- [ ] Verify email (check Supabase Auth)
- [ ] Login with test account
- [ ] View dashboard at `/dashboard`
- [ ] Edit profile at `/dashboard/profile`

### 4.2 Test Newsletter

- [ ] Go to `/newsletter-signup`
- [ ] Enter email and subscribe
- [ ] Check Supabase `newsletter_subscribers` table
- [ ] Try subscribing with same email (should show "already subscribed")

### 4.3 Test Products

- [ ] Go to `/products`
- [ ] Search for products
- [ ] Filter by category
- [ ] Click product to view details
- [ ] Click affiliate link (should track click)

### 4.4 Test Shopping Cart

- [ ] Add products to cart from `/products`
- [ ] Go to `/cart`
- [ ] Adjust quantities
- [ ] Remove items
- [ ] Check cart persists after refresh

### 4.5 Test Admin Features

- [ ] Login as admin
- [ ] Go to `/admin/dashboard`
- [ ] View analytics
- [ ] Go to `/admin/products` and add/edit products
- [ ] Go to `/admin/users` to view all users
- [ ] Go to `/admin/analytics` to view click tracking

### 4.6 Test Affiliate Features

- [ ] Login as regular user
- [ ] Go to `/affiliate/dashboard`
- [ ] View your referral performance
- [ ] Check click tracking data

## Step 5: Deployment to Vercel

### 5.1 Push to GitHub

\`\`\`bash
git add .
git commit -m "Initial commit: Affiliate e-commerce platform"
git push origin main
\`\`\`

### 5.2 Connect to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"

### 5.3 Add Environment Variables

In Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add all variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_POSTGRES_URL`
   - `SUPABASE_POSTGRES_URL_NON_POOLING`
   - `ADMIN_CREATION_SECRET_KEY`
   - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (set to your Vercel URL)

3. Click "Deploy"

### 5.4 Update Supabase Redirect URL

1. Go to Supabase dashboard
2. **Authentication** → **URL Configuration**
3. Add your Vercel URL to "Redirect URLs":
   - `https://your-app.vercel.app/auth/callback`

### 5.5 Verify Deployment

1. Visit your Vercel URL
2. Test signup/login flow
3. Test admin creation API
4. Verify all features work

## Step 6: Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Supabase redirect URLs configured
- [ ] Database migrations completed
- [ ] Admin user created
- [ ] SSL certificate enabled (automatic on Vercel)
- [ ] Custom domain configured (optional)
- [ ] Email verification working
- [ ] Admin dashboard accessible
- [ ] Analytics tracking working
- [ ] Newsletter signup working

## Troubleshooting

### Issue: "Invalid custom property" error

**Solution**: Ensure `app/globals.css` has correct Tailwind v4 syntax. Check that font variables are properly defined.

### Issue: Authentication not working

**Solution**:
1. Verify Supabase credentials in environment variables
2. Check that email verification is enabled in Supabase
3. Ensure redirect URL is configured in Supabase
4. Check browser console for specific error messages

### Issue: Database connection errors

**Solution**:
1. Verify `SUPABASE_POSTGRES_URL` is correct
2. Check that all migration scripts have been run
3. Ensure RLS policies are properly configured
4. Test connection in Supabase SQL Editor

### Issue: Admin creation fails

**Solution**:
1. Verify `ADMIN_CREATION_SECRET_KEY` is set correctly
2. Check that Authorization header matches: `Bearer YOUR_SECRET_KEY`
3. Ensure the user email doesn't already exist
4. Check Supabase Auth for any errors

### Issue: Products not showing

**Solution**:
1. Verify `006_seed_products.sql` has been run
2. Check Supabase `products` table has data
3. Verify RLS policies allow public read access
4. Check browser console for API errors

## Performance Optimization

### Database Optimization
- All tables have proper indexes
- RLS policies are optimized
- Connection pooling enabled

### Frontend Optimization
- Next.js Image component for image optimization
- CSS-in-JS with Tailwind CSS v4
- Code splitting and lazy loading
- Server-side rendering for SEO

### Caching Strategy
- Static pages cached at edge
- Dynamic content cached with revalidation
- Browser caching enabled

## Security Hardening

### Already Implemented
- ✅ Row Level Security (RLS) on all tables
- ✅ Backend-only admin creation
- ✅ Session management with token refresh
- ✅ Email verification required
- ✅ Secure password hashing
- ✅ CORS protection
- ✅ CSRF protection

### Additional Recommendations
- Enable 2FA in Supabase
- Set up monitoring and alerts
- Regular security audits
- Keep dependencies updated
- Monitor API usage

## Monitoring and Maintenance

### Supabase Monitoring
1. Go to **Monitoring** in Supabase dashboard
2. Check database performance
3. Monitor API usage
4. Review error logs

### Vercel Monitoring
1. Go to **Analytics** in Vercel dashboard
2. Monitor page performance
3. Check error rates
4. Review deployment history

### Regular Tasks
- [ ] Weekly: Check error logs
- [ ] Monthly: Review analytics
- [ ] Quarterly: Security audit
- [ ] Annually: Update dependencies

## Support and Resources

- **Documentation**: See `README.md`
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **GitHub Issues**: Report bugs and request features

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Status**: Production Ready
