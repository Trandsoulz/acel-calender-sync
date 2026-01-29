# HOTR Calendar Sync - Development Journey

A step-by-step documentation of how we built the HOTR Calendar Sync application.

---

## Phase 1: Project Setup & Database

### Step 1: Initialize Next.js Project
Started with a fresh Next.js 16 project using TypeScript and Tailwind CSS 4.

```bash
npx create-next-app@latest acel-calender-sync
```

### Step 2: Install Dependencies
```bash
npm install prisma @prisma/client @prisma/extension-accelerate bcryptjs ics
npm install -D @types/bcryptjs tsx
```

**Why these packages?**
- `prisma` - ORM for database operations
- `@prisma/extension-accelerate` - Connection pooling for Prisma Postgres
- `bcryptjs` - Password hashing for admin auth
- `ics` - Generate ICS calendar files
- `tsx` - Run TypeScript files directly (for seeding)

### Step 3: Create Prisma Postgres Database
Used Prisma Postgres (cloud-hosted) with Accelerate for connection pooling:

```bash
# Created database via Prisma Platform
# Region: eu-west-3 (Paris)
# Name: hotr-calendar-sync
```

### Step 4: Define Database Schema
Created `prisma/schema.prisma` with four models:

1. **Admin** - Dashboard authentication
2. **Calendar** - Container for events with unique slug
3. **Event** - Calendar events with targeting criteria
4. **Subscriber** - Users with demographics for personalized feeds

**Key Design Decisions:**
- Events have targeting fields (arrays for gender, country, relationship status; int for age range)
- Empty arrays mean "everyone" (no filter)
- Subscribers have a unique `feedToken` for private ICS URLs

### Step 5: Run Migrations
```bash
npx prisma migrate dev --name init
```

---

## Phase 2: Core Libraries

### Step 6: Prisma Client (`lib/prisma.ts`)
Created singleton Prisma client with Accelerate extension:

```typescript
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as { prisma?: ReturnType<typeof createPrismaClient> };

function createPrismaClient() {
  return new PrismaClient().$extends(
    withAccelerate({ accelerateUrl: process.env.DATABASE_URL })
  );
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Step 7: Utility Functions (`lib/utils.ts`)
Created helper functions:
- `generateSlug()` - Convert name to URL-safe slug
- `generateFeedToken()` - Create unique subscriber tokens
- `generateEventUid()` - Stable UIDs for ICS events
- `calculateAge()` - Calculate age from DOB
- `matchesEventTargeting()` - Check if subscriber matches event criteria

### Step 8: ICS Generator (`lib/ics.ts`)
Built ICS file generation:
- `generateIcsContent()` - Create valid ICS file from events
- `generateSubscriptionUrls()` - Generate URLs for Google, Apple, Outlook

**URL Formats:**
- Google: `https://calendar.google.com/calendar/r?cid=webcal://...`
- Apple/Outlook: `webcal://domain/calendar/slug/feed/token.ics`

### Step 9: Authentication (`lib/auth.ts`)
Implemented manual session-based auth (no NextAuth):
- `hashPassword()` / `verifyPassword()` - bcrypt operations
- `createSession()` / `getSession()` / `destroySession()` - Cookie management
- `authenticateAdmin()` / `getCurrentAdmin()` - Admin verification

**Why manual auth?**
- Simple requirements (single admin)
- Full control over session handling
- No OAuth needed

---

## Phase 3: API Routes

### Step 10: Subscription API (`app/api/subscribe/route.ts`)
**POST /api/subscribe**
- Receives subscriber demographics
- Creates subscriber record with unique feedToken
- Returns personalized calendar URLs

### Step 11: ICS Feed Route (`app/calendar/[slug]/feed/[token]/route.ts`)
**GET /calendar/:slug/feed/:token.ics**
- Fetches subscriber by token
- Gets all events for calendar
- Filters events based on subscriber demographics
- Returns ICS file with proper headers

### Step 12: Admin Authentication APIs
- **POST /api/admin/login** - Verify credentials, create session
- **POST /api/admin/logout** - Destroy session
- **GET /api/admin/me** - Check current session

### Step 13: Calendar Management APIs
- **GET/POST /api/admin/calendars** - List and create calendars
- **GET/PATCH/DELETE /api/admin/calendars/[id]** - CRUD operations
- **GET/POST /api/admin/calendars/[id]/events** - Events for calendar

### Step 14: Event Management APIs
- **GET/PATCH/DELETE /api/admin/events/[eventId]** - Event CRUD

### Step 15: Public Calendar APIs
- **GET /api/calendars** - List public calendars
- **GET /api/calendars/[id]** - Get calendar details
- **GET /api/calendars/[id]/events** - Get calendar events

---

## Phase 4: Frontend Pages

### Step 16: Home Page (`app/page.tsx`)
Landing page with:
- Hero section with CTA
- Features overview
- Church branding (black background, gold accents)

### Step 17: Public Calendar Page (`app/calendars/[slug]/page.tsx`)
Shows calendar info and upcoming events:
- Calendar name and description
- List of upcoming events with dates
- "Subscribe Now" button linking to subscription form

### Step 18: Subscribe Page (`app/subscribe/page.tsx`)
Multi-step form:
1. **Step 1**: Basic info (name, email, phone)
2. **Step 2**: Demographics (gender, DOB, country, relationship status)
3. **Success**: Sync buttons for Google, Apple, Outlook

**Key Feature**: Direct sync buttons that open calendar apps:
```typescript
const handleGoogleSync = () => {
  window.open(urls.google, '_blank');
};
```

### Step 19: Admin Login (`app/admin/login/page.tsx`)
Simple login form:
- Email/password fields
- Error handling for invalid credentials
- Redirects to dashboard on success

### Step 20: Admin Dashboard (`app/admin/dashboard/page.tsx`)
Main admin interface:
- Stats overview (calendars, events, subscribers)
- Calendar list with subscriber counts
- Create calendar modal
- Links to individual calendar management

### Step 21: Calendar Detail Page (`app/admin/calendars/[id]/page.tsx`)
Full calendar management:
- **Events Tab**: List events, create/edit with targeting modal
- **Subscribers Tab**: View all subscribers with demographics
- Event modal with targeting options:
  - Gender checkboxes (Male/Female)
  - Age range inputs
  - Country selection
  - Relationship status checkboxes

---

## Phase 5: Styling & Polish

### Step 22: Brand Colors
Configured Tailwind with HOTR colors in `globals.css`:
```css
:root {
  --primary: #D4A853;      /* Gold */
  --background: #0a0a0a;   /* Black */
  --card: #171717;         /* Dark gray */
}
```

### Step 23: Dark Mode Fixes
Fixed text contrast issues:
- Changed `text-[var(--muted)]` to `text-[var(--muted-foreground)]`
- Set button text to `text-black` on gold backgrounds

### Step 24: Modal Scrolling
Fixed event modal being cut off:
- Changed modal container to `overflow-y-auto`
- Used `min-h-full flex items-start justify-center`

### Step 25: App Metadata
Updated `layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: "HOTR Calendar | House on the Rock Port Harcourt",
  description: "Stay connected with House on the Rock Port Harcourt...",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};
```

---

## Phase 6: Seed Data

### Step 26: Create Seed Script (`prisma/seed.ts`)
Populated database with initial data:

**Admin User:**
- Email: `admin@hotrph.org`
- Password: `admin123`

**Default Calendar:**
- Name: "HOTR Port Harcourt Events"
- Slug: `hotr-port-harcourt`

**Sample Events:**
1. **Sunday Service** - Every Sunday, no targeting (everyone)
2. **Youth Night** - Ages 18-35 only
3. **Couples Retreat** - Married couples only

```bash
npm run db:seed
```

---

## Phase 7: Environment Configuration

### Step 27: Environment Variables
Created `.env` file:

```env
# Database
DATABASE_URL="prisma+postgres://..."

# Admin (for reference)
ADMIN_EMAIL="admin@hotrph.org"

# Base URL (important for production!)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**Production Note:** Change `NEXT_PUBLIC_BASE_URL` to your deployed domain.

---

## Summary: What We Built

### Features Delivered
✅ Personalized calendar subscriptions based on demographics  
✅ ICS feed generation compatible with Google/Apple/Outlook  
✅ Admin dashboard for managing calendars and events  
✅ Event targeting (gender, age, country, relationship status)  
✅ Direct "Add to Calendar" buttons (not copy/paste)  
✅ Session-based admin authentication  
✅ Mobile-responsive design with HOTR branding  

### Technical Achievements
- Clean separation of concerns (lib, api, pages)
- Type-safe database operations with Prisma
- Efficient personalized filtering at feed generation time
- Secure token-based feed URLs

### File Count
- 4 library files
- 15+ API routes
- 6 page components
- 1 database schema with 4 models

---

## Next Steps for Production

1. **Deploy to Vercel/similar**
2. **Set environment variables in hosting platform**
3. **Change default admin password**
4. **Create real church events**
5. **Share calendar URL with congregation**

---

*Built with ❤️ for House on the Rock Port Harcourt*
