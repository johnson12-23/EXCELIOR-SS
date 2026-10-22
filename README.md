# Excelior Solutions Services

A responsive, single-page cleaning business website built with Next.js, React, TypeScript, Tailwind CSS, and Supabase.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
3. Run `supabase/schema.sql` in the Supabase SQL editor to create the quote request table.
4. Start the site with `npm run dev` and visit `http://localhost:3000`.

Quote requests are validated by the `/api/lead` server endpoint and saved to `public.quote_requests`. The service role key stays server-side; never use a `NEXT_PUBLIC_` prefix for it. Without Supabase credentials, the form reports that quote requests are not available.

## Production

Set the two Supabase environment variables in your hosting provider, then run `npm run build` and `npm start`.
