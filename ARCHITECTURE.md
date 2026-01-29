# HOTR Calendar Sync - System Architecture

## Overview

HOTR Calendar Sync is a personalized calendar subscription system built for House on the Rock Port Harcourt. It allows church members to subscribe to a calendar feed that automatically filters events based on their demographics (age, gender, relationship status, country).

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Next.js)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Home Page   │  │  Calendar    │  │  Subscribe   │  │    Admin     │     │
│  │     /        │  │  /calendars  │  │  /subscribe  │  │   /admin/*   │     │
│  │              │  │   /[slug]    │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER (Next.js App Router)                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────────┐   │
│  │    Public APIs          │  │           Admin APIs                     │   │
│  │                         │  │                                          │   │
│  │  POST /api/subscribe    │  │  POST /api/admin/login                   │   │
│  │  GET  /api/calendars    │  │  POST /api/admin/logout                  │   │
│  │  GET  /api/calendars/   │  │  GET  /api/admin/me                      │   │
│  │       [id]/events       │  │  GET/POST /api/admin/calendars           │   │
│  │                         │  │  GET/PATCH/DELETE /api/admin/calendars/  │   │
│  │  GET  /calendar/[slug]/ │  │       [id]                               │   │
│  │       feed/[token].ics  │  │  GET/POST /api/admin/calendars/[id]/     │   │
│  │  (ICS Feed Generator)   │  │       events                             │   │
│  │                         │  │  GET/PATCH/DELETE /api/admin/events/     │   │
│  │                         │  │       [eventId]                          │   │
│  └─────────────────────────┘  └─────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LIBRARY LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  lib/prisma  │  │  lib/auth    │  │  lib/ics     │  │  lib/utils   │     │
│  │              │  │              │  │              │  │              │     │
│  │  Prisma      │  │  Session     │  │  ICS File    │  │  Helpers:    │     │
│  │  Client +    │  │  Management  │  │  Generation  │  │  - slugify   │     │
│  │  Accelerate  │  │  Cookie Auth │  │  Calendar    │  │  - tokens    │     │
│  │  Extension   │  │  Password    │  │  URLs for    │  │  - age calc  │     │
│  │              │  │  Hashing     │  │  Google/     │  │  - targeting │     │
│  │              │  │              │  │  Apple/      │  │    matching  │     │
│  │              │  │              │  │  Outlook     │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                    ┌─────────────────────────────────┐                      │
│                    │      Prisma Postgres            │                      │
│                    │      (with Accelerate)          │                      │
│                    │                                 │                      │
│                    │  ┌─────────┐  ┌─────────────┐   │                      │
│                    │  │  Admin  │  │  Calendar   │   │                      │
│                    │  └─────────┘  └──────┬──────┘   │                      │
│                    │                      │          │                      │
│                    │         ┌────────────┼────────┐ │                      │
│                    │         ▼            ▼        │ │                      │
│                    │  ┌─────────────┐ ┌───────────┐│ │                      │
│                    │  │   Event     │ │Subscriber ││ │                      │
│                    │  │ (targeting) │ │(demographics)│                      │
│                    │  └─────────────┘ └───────────┘│ │                      │
│                    │                               │ │                      │
│                    └─────────────────────────────────┘                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Concepts

### 1. Personalized Calendar Feeds

The key innovation is **demographic-based event filtering**:

```
Event (with targeting)          Subscriber (with demographics)
─────────────────────           ────────────────────────────
targetGenders: ["female"]       gender: "female"
targetAgeMin: 18                age: 25 (calculated from DOB)
targetAgeMax: 35                country: "Nigeria"
targetCountries: ["Nigeria"]    relationshipStatus: "single"
targetRelationshipStatuses: []  
```

When a subscriber requests their ICS feed, the system:
1. Fetches all events for their calendar
2. Filters events based on matching criteria
3. Generates a personalized ICS file

### 2. ICS Feed URLs

Each subscriber gets a unique, private URL:
```
/calendar/{calendarSlug}/feed/{subscriberToken}.ics
```

This URL can be added to:
- **Google Calendar** (via URL subscription)
- **Apple Calendar** (via webcal:// protocol)
- **Outlook** (via webcal:// protocol)

---

## Database Schema

### Admin
- Authentication for dashboard access
- Email/password with bcrypt hashing

### Calendar
- Container for events
- Has a unique slug for public URLs
- Has a token for admin operations

### Event
- Standard calendar event fields (title, time, location)
- **Targeting fields**:
  - `targetGenders[]` - Filter by gender
  - `targetAgeMin/Max` - Filter by age range
  - `targetCountries[]` - Filter by country
  - `targetRelationshipStatuses[]` - Filter by relationship status

### Subscriber
- Demographics (gender, DOB, country, relationship status)
- Unique `feedToken` for personalized ICS URL
- Linked to a specific calendar

---

## User Flows

### Public User Flow
```
1. Visit /calendars/[slug]     → View calendar info & events
2. Click "Subscribe"           → Navigate to /subscribe
3. Fill demographics form      → Submit to POST /api/subscribe
4. Receive personalized URLs   → Add to preferred calendar app
5. Calendar app fetches ICS    → GET /calendar/[slug]/feed/[token].ics
```

### Admin Flow
```
1. Login at /admin/login       → POST /api/admin/login
2. View dashboard              → See all calendars & stats
3. Manage calendars            → Create/edit/delete calendars
4. Manage events               → Create events with targeting criteria
5. View subscribers            → See who subscribed & demographics
```

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | Prisma Postgres (with Accelerate) |
| ORM | Prisma 7.3 |
| Styling | Tailwind CSS 4 |
| Calendar | ics library |
| Auth | Manual session-based (cookies) |
| Password | bcryptjs |

---

## File Structure

```
/
├── app/
│   ├── page.tsx                    # Home page
│   ├── layout.tsx                  # Root layout with metadata
│   ├── globals.css                 # Tailwind + custom CSS variables
│   ├── not-found.tsx               # 404 page
│   │
│   ├── calendars/
│   │   └── [slug]/
│   │       └── page.tsx            # Public calendar view
│   │
│   ├── subscribe/
│   │   └── page.tsx                # Subscription form
│   │
│   ├── calendar/
│   │   └── [slug]/
│   │       └── feed/
│   │           └── [token]/
│   │               └── route.ts    # ICS feed generator
│   │
│   ├── admin/
│   │   ├── login/page.tsx          # Admin login
│   │   ├── dashboard/page.tsx      # Admin dashboard
│   │   └── calendars/
│   │       └── [id]/page.tsx       # Calendar management
│   │
│   ├── api/
│   │   ├── subscribe/route.ts      # Subscription endpoint
│   │   ├── calendars/              # Public calendar APIs
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── events/route.ts
│   │   └── admin/                  # Admin APIs
│   │       ├── login/route.ts
│   │       ├── logout/route.ts
│   │       ├── me/route.ts
│   │       ├── calendars/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       └── events/route.ts
│   │       └── events/
│   │           └── [eventId]/route.ts
│   │
│   └── _components/                # Shared components
│
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── auth.ts                     # Authentication utilities
│   ├── ics.ts                      # ICS generation
│   └── utils.ts                    # Helper functions
│
├── prisma/
│   ├── schema.prisma               # Database schema
│   ├── seed.ts                     # Seed data
│   └── migrations/                 # Migration history
│
├── public/
│   ├── logo.png                    # HOTR logo (favicon)
│   └── hotr.jpeg                   # HOTR image
│
└── .env                            # Environment variables
```

---

## Environment Variables

```env
# Database connection
DATABASE_URL="prisma+postgres://..."

# Admin credentials (seeded)
ADMIN_EMAIL="admin@hotrph.org"

# Base URL for ICS feed links
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
```

---

## Security Considerations

1. **Feed Tokens**: Each subscriber has a unique, unguessable token
2. **Password Hashing**: Admin passwords use bcrypt with 12 rounds
3. **Session Cookies**: HTTP-only, secure, same-site strict
4. **No Personal Data in ICS**: Feeds only contain event data

---

## Known Limitations & Platform Behaviors

### Mobile Calendar Apps

When users subscribe to an external calendar (ICS feed), the following platform behaviors apply:

| Platform | Web | Mobile |
|----------|-----|--------|
| **Google Calendar** | Calendar appears and shows events automatically ✓ | Calendar is added but **hidden by default** - user must enable it in app settings |
| **Apple Calendar** | Usually works automatically | May require toggling visibility in Calendar settings |
| **Outlook** | Works automatically | May need to enable under subscribed calendars |

**This is a platform limitation, not an application bug.** Calendar apps treat subscribed calendars differently from native calendars for privacy and performance reasons.

**User Instructions (provided on success page):**
- **Google Calendar Mobile**: Open app → Menu (☰) → Check the box next to the calendar name
- **Apple Calendar**: Settings → Calendar → Enable the subscribed calendar
- **Outlook Mobile**: Tap account icon → Enable under subscriptions

---

## Deployment Checklist

- [ ] Set `NEXT_PUBLIC_BASE_URL` to production domain
- [ ] Change admin password after first login
- [ ] Ensure database is properly migrated
- [ ] Test ICS feed URLs work from external calendar apps
