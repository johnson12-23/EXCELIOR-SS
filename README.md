# Excelior Solutions Services

A responsive, single-page cleaning business website built with Next.js, React, TypeScript, Tailwind CSS, and Supabase.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. To email quote notifications to the business and a receipt to the client, also set `RESEND_API_KEY`, `QUOTE_NOTIFICATION_EMAIL`, and `RESEND_FROM_EMAIL`. The sender address must use a domain verified with Resend.
3. Run `supabase/schema.sql` in the Supabase SQL editor to create the quote request table.
4. Start the site with `npm run dev` and visit `http://localhost:3000`.

Quote requests are validated by the `/api/lead` server endpoint and saved to `public.quote_requests`. When the Resend settings are present, requests are also emailed to the business and a receipt is sent to the client. The service role and Resend keys stay server-side; never use a `NEXT_PUBLIC_` prefix for them. The booking form reports an error if the required Supabase credentials are missing or a request cannot be saved.

## Production

Set the two Supabase environment variables in your hosting provider. Add the three Resend values to enable email notifications. Then run `npm run build` and `npm start`.
