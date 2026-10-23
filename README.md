# Excelior Solution Services

A responsive Next.js 15 and React website for Excelior Solution Services, with a protected admin dashboard and Supabase-backed quote and booking management.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Keep the service role key server-side; never prefix it with `NEXT_PUBLIC_`.
3. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and a random `ADMIN_SESSION_SECRET` of at least 32 characters. Use a unique, long password. These values protect the admin session and are not stored in the database.
4. To email quote notifications to the business and a receipt to the client, also configure `RESEND_API_KEY`, `QUOTE_NOTIFICATION_EMAIL`, and `RESEND_FROM_EMAIL`. The sender domain must be verified with Resend.
5. Run the complete, idempotent `supabase/schema.sql` in the Supabase SQL editor. It creates or extends `public.quote_requests`, adds the service, team, settings, and payment-ledger tables, and enables RLS. The application uses its server-side service-role key for authorized admin actions.
6. Run `npm run dev` and visit `http://localhost:3000`. The public site is at `/`; the admin sign-in page is at `/admin/login`.

## Admin dashboard

The admin area is protected by a signed, HTTP-only, eight-hour session cookie. Its APIs verify that session before using the Supabase service-role client. The browser never receives the service-role key. Website quote requests appear in `/admin` and `/admin/bookings`; administrators can update their status, requested date/time, and internal note. Clients are grouped by email. Service changes are stored in `public.service_catalog` and update the public services page and quote form. Team and business settings are stored in Supabase.

The quote form collects preferred date, preferred time, and service area/address when supplied. Older requests remain visible with those fields blank. Run the current schema in Supabase before using dashboard data and mutations.

## Payments

This project has no Paystack or other payment provider configured. The dashboard does not mark quotes paid from browser input and labels revenue unavailable until successful transactions have a server-verified `verified_at` value. A real payment integration still needs provider initialization, signed webhook/API verification, and secure server-side writes to `public.payment_transactions`.

## Production

Set the Supabase, admin, and (if required) Resend variables in the hosting provider's production environment, run `npm run build`, and deploy. Never share the admin password, session secret, service-role key, or Resend key in source control or public client code.
