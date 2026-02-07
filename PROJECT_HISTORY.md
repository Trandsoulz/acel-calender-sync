# HOTR Calendar Sync - Complete Project History

## Project Overview

**Project Name:** HOTR Calendar Sync  
**Purpose:** A personalized church event calendar subscription system for House on the Rock Port Harcourt  
**Start Date:** January 2026  
**Current Status:** Core features complete, Google OAuth integration in progress

---

## Executive Summary

This project delivers a personalized calendar subscription system that allows church members to subscribe to a calendar feed that automatically syncs events to their personal calendar apps (Google Calendar, Apple Calendar, Outlook). The key innovation is **demographic-based event filtering** - each subscriber gets events relevant to their age, gender, country, and relationship status.

---

## Phase 1: Project Setup & Infrastructure

### 1.1 Project Initialization
- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Command:** `npx create-next-app@latest acel-calender-sync`

### 1.2 Dependencies Installed
```bash
# Core Dependencies
- prisma - ORM for database operations
- @prisma/client - Prisma client for database queries
- @prisma/extension-accelerate - Connection pooling for Prisma Postgres
- bcryptjs - Password hashing for admin authentication
- ics - ICS calendar file generation
- googleapis - Google Calendar API integration

# Dev Dependencies
- @types/bcryptjs - TypeScript types for bcryptjs
- tsx - Run TypeScript files directly (for seeding)
```

### 1.3 Database Setup
- **Provider:** Prisma Postgres (cloud-hosted)
- **Region:** eu-west-3 (Paris)
- **Features:** Accelerate extension for connection pooling
- **Database Name:** hotr-calendar-sync

---

## Phase 2: Database Schema Design

### 2.1 Models Created

#### Admin Model
```prisma
model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Calendar Model
```prisma
model Calendar {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique
  description String?
  isPublic    Boolean      @default(true)
  token       String       @unique @default(cuid())
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  events      Event[]
  subscribers Subscriber[]
}
```

#### Event Model (with Targeting)
```prisma
model Event {
  id                         String   @id @default(cuid())
  uid                        String   // Stable UID for ICS
  title                      String
  description                String?
  startTime                  DateTime
  endTime                    DateTime
  timezone                   String   @default("Africa/Lagos")
  location                   String?
  status                     String   @default("confirmed")
  
  // Targeting criteria (empty array = everyone)
  targetGenders              String[] @default([])
  targetAgeMin               Int?
  targetAgeMax               Int?
  targetCountries            String[] @default([])
  targetRelationshipStatuses String[] @default([])
  
  calendarId                 String
  calendar                   Calendar @relation(...)
}
```

#### Subscriber Model (with Google OAuth fields)
```prisma
model Subscriber {
  id                 String    @id @default(cuid())
  name               String
  email              String
  phone              String?
  gender             String    // male, female
  country            String
  relationshipStatus String    // single, married, divorced, widowed
  dob                DateTime
  feedToken          String    @unique @default(cuid())
  platform           String?   // google, apple, outlook, other
  interests          String[]  @default([])
  
  // Google Calendar integration
  googleAccessToken  String?
  googleRefreshToken String?
  googleTokenExpiry  DateTime?
  googleCalendarId   String?   // ID of the calendar in their account
  
  calendarId         String
  calendar           Calendar  @relation(...)
  subscribedAt       DateTime  @default(now())
}
```

### 2.2 Database Migrations
- **Migration 1:** `20260128215846_initial_schema` - Core models
- **Migration 2:** `20260129160625_add_google_oauth_fields` - Google OAuth support

---

## Phase 3: Core Libraries

### 3.1 Prisma Client (`lib/prisma.ts`)
- Singleton pattern for database client
- Accelerate extension integration
- Hot-reload safe for development

### 3.2 Utility Functions (`lib/utils.ts`)
- `generateSlug()` - Convert names to URL-safe slugs
- `generateFeedToken()` - Create unique subscriber tokens
- `generateEventUid()` - Stable UIDs for ICS events
- `calculateAge()` - Calculate age from date of birth
- `matchesEventTargeting()` - Match subscriber demographics to event criteria

### 3.3 ICS Generator (`lib/ics.ts`)
- `generateIcsContent()` - Create valid ICS calendar files
- `generateSubscriptionUrls()` - Generate URLs for Google, Apple, Outlook
- RFC 5545 compliant output
- Timezone support (Africa/Lagos - WAT)

### 3.4 Authentication (`lib/auth.ts`)
- `hashPassword()` / `verifyPassword()` - bcrypt operations
- `createSession()` / `getSession()` / `destroySession()` - Cookie management
- `authenticateAdmin()` / `getCurrentAdmin()` - Admin verification
- HTTP-only, secure, same-site strict cookies

### 3.5 Google Calendar Integration (`lib/google.ts`)
- `getGoogleAuthUrl()` - Generate OAuth authorization URL
- `getTokensFromCode()` - Exchange auth code for tokens
- `getAuthenticatedClient()` - Create authenticated OAuth client
- `createHotrCalendar()` - Create HOTR secondary calendar in user's account
- `syncEventToGoogleCalendar()` - Sync individual events
- `syncAllEventsForSubscriber()` - Bulk sync all relevant events
- `deleteEventFromGoogleCalendar()` - Remove events
- `refreshAccessToken()` - Refresh expired tokens
- Custom event ID conversion for Google Calendar format compliance

---

## Phase 4: API Routes

### 4.1 Public APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/subscribe` | POST | Create subscriber, generate feed URLs |
| `/api/subscribe/platform` | POST | Platform-specific subscription handling |
| `/api/calendars` | GET | List public calendars |
| `/api/calendars/[slug]` | GET | Get calendar details by slug |
| `/api/calendars/[slug]/events` | GET | Get calendar events |
| `/calendar/[slug]/feed/[token]` | GET | Generate personalized ICS feed |

### 4.2 Admin APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/login` | POST | Admin authentication |
| `/api/admin/logout` | POST | Destroy admin session |
| `/api/admin/me` | GET | Get current admin info |
| `/api/admin/calendars` | GET/POST | List and create calendars |
| `/api/admin/calendars/[id]` | GET/PATCH/DELETE | Calendar CRUD |
| `/api/admin/calendars/[id]/events` | GET/POST | Calendar events management |
| `/api/admin/events/[eventId]` | GET/PATCH/DELETE | Individual event CRUD |

### 4.3 Google OAuth APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/google` | GET | Initiate Google OAuth flow |
| `/api/auth/google/callback` | GET | Handle OAuth callback, sync events |

---

## Phase 5: Frontend Pages

### 5.1 Public Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Landing page with hero, features, CTA |
| Calendar View | `/calendars/[slug]` | Public calendar info and events |
| Subscribe | `/subscribe` | Multi-step subscription form |
| Subscribe (Calendar) | `/calendars/[slug]/subscribe` | Subscribe to specific calendar |
| Success | `/subscribe/success` | Post-subscription confirmation |
| Learn More | `/learn-more` | Additional information |

### 5.2 Admin Pages

| Page | Path | Description |
|------|------|-------------|
| Login | `/admin/login` | Admin authentication |
| Dashboard | `/admin/dashboard` | Overview of all calendars, stats |
| Calendar Detail | `/admin/calendars/[id]` | Manage events, view subscribers |

### 5.3 UI Components Created

**Layout Components:**
- `Navbar` - Site navigation with logo
- `Footer` - Site footer with social links

**UI Components:**
- `Container` - Responsive content wrapper
- `Button` - Styled button with variants
- `Logo` - HOTR logo component
- `Accordion` - Expandable content sections

**Section Components:**
- `Hero` - Landing page hero section

---

## Phase 6: Features Implemented

### 6.1 Core Features ✅

| Feature | Status | Description |
|---------|--------|-------------|
| Personalized Calendar Feeds | ✅ | ICS feeds filtered by demographics |
| Multi-Platform Support | ✅ | Google, Apple, Outlook integration |
| Event Targeting | ✅ | Gender, age, country, relationship status |
| Admin Dashboard | ✅ | Full calendar and event management |
| Subscriber Management | ✅ | View subscribers with demographics |
| Session-Based Auth | ✅ | Secure admin authentication |
| Responsive Design | ✅ | Mobile-first HOTR branding |

### 6.2 Google Calendar Features ✅

| Feature | Status | Description |
|---------|--------|-------------|
| OAuth Flow | ✅ | User authorization for calendar access |
| Secondary Calendar Creation | ✅ | Create "HOTR Port Harcourt" calendar in user's account |
| Initial Event Sync | ✅ | Sync relevant events on subscription |
| Token Storage | ✅ | Store access/refresh tokens for future operations |
| Custom Calendar Styling | ✅ | Gold branding for HOTR calendar |

### 6.3 Event Content Enhancement ✅

Each synced event includes a comprehensive footer with:
- Church social media links (Facebook, Instagram, TikTok)
- Official website URL
- Contact information (Phone, WhatsApp)
- Official WhatsApp Channel invitation
- Livestream links (Facebook, YouTube, iRadio)
- Attendance/registration link with barcode

---

## Phase 7: Styling & Branding

### 7.1 Color Scheme
```css
:root {
  --primary: #D4A853;      /* Gold - HOTR accent */
  --background: #0a0a0a;   /* Black - main background */
  --card: #171717;         /* Dark gray - card backgrounds */
  --foreground: #fafafa;   /* White - text */
  --muted-foreground: #a1a1aa; /* Gray - secondary text */
}
```

### 7.2 Typography & Design
- Dark mode first design
- Gold accents on black background
- Clean, modern aesthetic
- Mobile-responsive layouts

---

## Phase 8: Seed Data

### 8.1 Default Admin
- **Email:** admin@hotrph.org
- **Password:** admin123

### 8.2 Default Calendar
- **Name:** HOTR Port Harcourt Events
- **Slug:** hotr-port-harcourt

### 8.3 Sample Events
1. **Sunday Service** - Every Sunday, no targeting (everyone)
2. **Youth Night** - Ages 18-35 only
3. **Couples Retreat** - Married couples only

---

## Technical Achievements

### Architecture Highlights
- Clean separation of concerns (lib, api, pages)
- Type-safe database operations with Prisma
- Efficient personalized filtering at feed generation time
- Secure token-based feed URLs
- RFC 5545 compliant ICS generation

### Security Measures
- Feed tokens: Unique, unguessable per subscriber
- Password hashing: bcrypt with 12 rounds
- Session cookies: HTTP-only, secure, same-site strict
- No PII in ICS feeds: Only event data transmitted

### Performance Optimizations
- Prisma Accelerate for connection pooling
- Efficient database queries with proper indexes
- Lazy loading of calendar data

---

## File Count Summary

| Category | Count |
|----------|-------|
| Library Files | 5 |
| API Routes | 15+ |
| Page Components | 8 |
| UI Components | 10+ |
| Database Models | 4 |
| Migrations | 2 |

---

## Environment Variables

```env
# Database
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/..."

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Application
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
```

---

## Known Limitations

### Mobile Calendar Behavior
| Platform | Behavior |
|----------|----------|
| Google Calendar (Mobile) | Calendar added but hidden by default |
| Apple Calendar | May require visibility toggle |
| Outlook Mobile | May need to enable under subscriptions |

*This is a platform limitation, not an application bug.*

---

## Deployment Readiness

- [x] Core subscription system complete
- [x] Admin dashboard functional
- [x] ICS feed generation working
- [x] Google OAuth flow implemented
- [x] Initial event sync working
- [ ] Auto-sync on event changes (TODO)
- [ ] Token refresh automation (TODO)
- [ ] Background sync jobs (TODO)

---

## Next Steps & Roadmap

See `GOOGLE_OAUTH_TODO.md` for detailed implementation plan for completing Google Calendar integration.

---

*Documentation last updated: February 2026*
*Built with ❤️ for House on the Rock Port Harcourt*
