# Calendar Sync Application - Task List

## TASK 1: PROJECT SETUP
- [ ] Install Prisma and PostgreSQL client
- [ ] Install ICS generation library (`ical-generator`)
- [ ] Install authentication library (NextAuth.js or similar)
- [ ] Set up environment variables (.env)
- [ ] Configure Prisma with PostgreSQL (Neon/Supabase)
- [ ] Initialize Prisma schema

## TASK 2: DATABASE SCHEMA
- [ ] Create `Admin` model (id, email, password, name, createdAt, updatedAt)
- [ ] Create `Calendar` model (id, name, slug, description, isPublic, token, createdAt, updatedAt)
- [ ] Create `Event` model (id, uid, title, description, startTime, endTime, timezone (default: Africa/Lagos - WAT), status, targetGenders (array/JSON), targetAgeMin, targetAgeMax, targetCountries (array/JSON), targetRelationshipStatuses (array/JSON), calendarId, createdAt, updatedAt)
- [ ] Create `Subscriber` model (id, name, email, gender, country, relationshipStatus, dob, feedToken (unique), calendarId, subscribedAt, platform)
- [ ] Add indexes (slug, uid, calendarId)
- [ ] Add unique constraints (slug, uid per calendar)
- [ ] Run Prisma migration

## TASK 3: CORE UTILITIES
- [ ] Create Prisma client singleton (`/lib/prisma.ts`)
- [ ] Create ICS generator utility (`/lib/ics.ts`)
- [ ] Create calendar helper functions (`/lib/calendar.ts`)
- [ ] Create event UID generator
- [ ] Create slug generator for calendars
- [ ] Create subscriber feed token generator (unique)
- [ ] Create age calculator from DOB
- [ ] Create event filter utility (match subscriber demographics to event targets)
- [ ] Create timezone converter utilities (default: Africa/Lagos - WAT, UTC+1)

## TASK 4: CALENDAR API ENDPOINTS (Admin Protected)
- [ ] `POST /api/admin/calendars` - Create calendar (generates id, slug, token)
- [ ] `GET /api/admin/calendars` - List all calendars (admin)
- [ ] `GET /api/calendars/:slug` - Get public calendar metadata (public)
- [ ] `GET /api/calendars` - List all public calendars (public)
- [ ] `PATCH /api/admin/calendars/:id` - Update calendar (name, description, visibility)
- [ ] `DELETE /api/admin/calendars/:id` - Delete calendar
- [ ] `GET /api/admin/calendars/:id/subscribers` - List subscribers for a calendar

## TASK 5: EVENT API ENDPOINTS
- [ ] `POST /api/admin/calendars/:calendarId/events` - Create event with stable UID (admin)
- [ ] `GET /api/calendars/:slug/events` - List public events (JSON, public)
- [ ] `PATCH /api/admin/events/:eventId` - Update event (keep same UID, admin)
- [ ] `DELETE /api/admin/events/:eventId` - Cancel/delete event (admin)
- [ ] `GET /api/events/:eventId` - Get single event details (public)

## TASK 6: ICS FEED & SUBSCRIPTION ENDPOINTS
- [ ] `GET /calendar/:slug/feed/:subscriberToken.ics` - Generate personalized ICS feed filtered by subscriber demographics (CRITICAL)
- [ ] Set proper headers: `Content-Type: text/calendar`, `Cache-Control`
- [ ] Filter events based on subscriber's age, gender, country, relationship status
- [ ] `GET /calendar/:slug/subscribe/google` - Redirect to Google Calendar with personalized feed URL
- [ ] `GET /calendar/:slug/subscribe/apple` - Redirect with personalized `webcal://` URL
- [ ] `GET /calendar/:slug/subscribe/outlook` - Redirect to Outlook with personalized feed URL
- [ ] `POST /api/subscribe` - Submit subscriber info, generate feedToken, return personalized feed URLs

## TASK 7: ADMIN AUTHENTICATION
- [ ] Set up NextAuth.js (admin only)
- [ ] Create `/api/auth/[...nextauth]` route
- [ ] Add admin login page (`/admin/login`)
- [ ] Protect admin routes with middleware
- [ ] Add session management for admin
- [ ] Seed initial admin account in database

## TASK 8: FRONTEND - PUBLIC PAGES
- [ ] Landing page (`/`) - Hero, features, CTA, show available calendars
- [ ] Public calendar page (`/calendars/:slug`) - Display calendar info & events
- [ ] Subscribe page (`/calendars/:slug/subscribe`) - Collect user info (name, email, gender, country, relationship status, dob) + Show sync buttons (Google, Apple, Outlook, Copy ICS link)
- [ ] Thank you page after subscription - Display personalized feed URL and sync buttons with subscriber's unique token

## TASK 9: FRONTEND - ADMIN DASHBOARD
- [ ] Admin login page (`/admin/login`)
- [ ] Dashboard home (`/admin/dashboard`) - List all calendars
- [ ] Calendar detail page (`/admin/calendars/:id`) - Edit calendar, manage events, view subscribers with demographics
- [ ] Create calendar form (`/admin/calendars/new`)
- [ ] Event editor (`/admin/calendars/:id/events/new`) - Create/edit events with targeting options
- [ ] Event editor (`/admin/calendars/:id/events/:eventId/edit`) - Edit event and targeting
- [ ] Event detail view - Show which demographics this event targets and estimated reach
- [ ] Subscriber list view for each calendar - Show demographics breakdown (age, gender, country, etc.)
- [ ] Subscriber analytics - Charts showing subscriber demographics distribution
- [ ] Delete calendar confirmation
- [ ] Delete event confirmation

## TASK 10: FRONTEND - FORMS & VALIDATION
- [ ] Subscriber form (name, email, gender dropdown, country dropdown, relationship status dropdown, date of birth picker) - on subscribe page
- [ ] Admin login form (email, password)
- [ ] Calendar form (name, description, public/private toggle) - admin only
- [ ] Event form (title, description, start/end datetime, timezone selector with WAT default, status) - admin only
- [ ] Event targeting form (target genders multi-select, target age range min/max, target countries multi-select, target relationship statuses multi-select) - admin only
- [ ] Client-side validation (email format, required fields, age validation)
- [ ] Error handling & display
- [ ] Success notifications

## TASK 11: ICS FEED GENERATION LOGIC
- [ ] Generate valid VCALENDAR wrapper
- [ ] Fetch subscriber by feedToken
- [ ] Calculate subscriber's age from DOB
- [ ] Filter events based on targeting criteria (gender, age, country, relationship status)
- [ ] Generate VEVENT entries only for matched events
- [ ] Include stable UIDs (format: `event-{id}@yourdomain.com`)
- [ ] Include timezone info (VTIMEZONE - Africa/Lagos for WAT)
- [ ] Handle event status (SCHEDULED, CANCELLED)
- [ ] Format datetime properly (UTC with WAT timezone conversion)
- [ ] Add DTSTAMP, CREATED, LAST-MODIFIED
- [ ] Test personalized ICS with Google Calendar (WAT timezone)
- [ ] Test personalized ICS with Apple Calendar (WAT timezone)
- [ ] Test personalized ICS with Outlook (WAT timezone)
- [ ] Test demographic filtering (verify correct events show for different subscribers)

## TASK 12: CACHING & OPTIMIZATION
- [ ] Add cache headers to ICS feed endpoint (`max-age=300`)
- [ ] Add ETag support for ICS feeds
- [ ] Optimize database queries (select only needed fields)
- [ ] Add database indexes for performance
- [ ] Implement feed "dirty" flag for cache invalidation

## TASK 13: REDIRECT URL GENERATION
- [ ] Google Calendar: `https://calendar.google.com/calendar/u/0/r?cid={feedUrl}`
- [ ] Apple Calendar: `webcal://` protocol conversion
- [ ] Outlook: `https://outlook.live.com/calendar/0/addfromweb?url={feedUrl}`
- [ ] Encode URLs properly

## TASK 14: STYLING & UI
- [ ] Set up Tailwind CSS utility classes
- [ ] Create reusable components (Button, Card, Input, etc.)
- [ ] Style landing page
- [ ] Style public calendar pages
- [ ] Style subscribe page with platform icons
- [ ] Style admin dashboard
- [ ] Style forms
- [ ] Add responsive design (mobile-friendly)
- [ ] Add loading states
- [ ] Add empty states

## TASK 15: TESTING
- [ ] Test calendar creation
- [ ] Test event CRUD operations
- [ ] Test event targeting (create event with specific demographics)
- [ ] Test personalized ICS feed generation
- [ ] Test subscription flow and feedToken generation
- [ ] Test subscription to Google Calendar with personalized feed
- [ ] Test subscription to Apple Calendar with personalized feed
- [ ] Test subscription to Outlook with personalized feed
- [ ] Test event updates (verify UID stability)
- [ ] Test event cancellation
- [ ] Test demographic filtering (age ranges, gender, country, relationship status)
- [ ] Test edge cases (subscriber matches no events, subscriber matches all events)
- [ ] Test timezone handling
- [ ] Test public/private calendar visibility
- [ ] Test authentication flows

## TASK 16: DEPLOYMENT
- [ ] Set up Neon/Supabase PostgreSQL database
- [ ] Add production environment variables to Vercel
- [ ] Configure Prisma for production
- [ ] Deploy to Vercel
- [ ] Test production ICS feed
- [ ] Test calendar subscriptions in production
- [ ] Set up custom domain (optional)
- [ ] Configure SSL/HTTPS

## TASK 17: POLISH & EXTRAS (Optional)
- [ ] Add analytics tracking for subscriptions
- [ ] Add calendar export (download ICS file)
- [ ] Add event search/filter
- [ ] Add recurring events support
- [ ] Add event reminders
- [ ] Add email notifications
- [ ] Add calendar sharing permissions
- [ ] Add API documentation
- [ ] Add user settings page
- [ ] Add dark mode
