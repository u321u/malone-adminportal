Version 2: pixel-closer homepage based on the uploaded HTML, with the original structured admin panel.

# The Malone Team — Next.js site with admin panel

This is a Vercel-ready Next.js rebuild of the Malone Team real estate website with a client-manageable admin panel.

## What is included
- Public marketing website
- Listings page
- Buyer and seller lead forms
- Admin login page
- Admin dashboard to manage:
  - site content
  - contact information
  - featured listings
  - testimonials
  - lead submissions
- Demo/local mode using browser storage
- Supabase-ready mode for production persistence and shared admin access

## Deploy to Vercel
1. Create a new GitHub repo and upload this project.
2. Import the repo into Vercel.
3. Add the environment variables from `.env.example`.
4. Optional but recommended: create a Supabase project and run the SQL in `supabase/schema.sql`.
5. Deploy.

## Admin access
- Visit `/admin`
- In demo mode, use the email/password from your env vars.
- In Supabase mode, the same credentials are used for a simple protected session inside the app.

## Important note
Without Supabase configured, the site still works and the admin panel still works in the browser that made the edits. For a real client, use Supabase so listings, reviews, and leads are shared and persistent.

## Local development
```bash
npm install
npm run dev
```

## Recommended production setup
- Vercel for hosting
- Supabase for database + lead storage
- Vercel environment variables for admin credentials
