# HOTR Calendar Sync - System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Core Features](#core-features)
3. [User Personas](#user-personas)
4. [User Flows](#user-flows)
5. [Technical Architecture](#technical-architecture)
6. [Data Models](#data-models)
7. [API Endpoints](#api-endpoints)

---

## System Overview

### What is this?
The HOTR Calendar Sync is a **personalized church event calendar subscription system** for House on the Rock Port Harcourt. It allows church members to subscribe to a calendar feed that automatically syncs events to their personal calendar apps (Google Calendar, Apple Calendar, Outlook).

### The Key Innovation: Personalized Feeds
Unlike traditional calendars where everyone sees all events, this system **filters events based on each subscriber's demographics**:
- **Age** (calculated from date of birth)
- **Gender** (Male/Female)
- **Country** (Nigeria, etc.)
- **Relationship Status** (Single, Married, Divorced, Widowed)

This means a 22-year-old single male will see different events than a 45-year-old married woman - each person gets events **relevant to them**.

### Why This Matters
- **For Users:** No event noise. You only see events meant for you.
- **For Admins:** Target specific groups without creating multiple calendars.
- **For the Church:** Better event attendance because the right people see the right events.

---

## Core Features

### For Subscribers (Church Members)
| Feature | Description |
|---------|-------------|
| **One-time Subscription** | Fill a form once, get a personalized calendar feed |
| **Auto-Sync** | Events automatically appear in your calendar app |
| **Multi-Platform** | Works with Google Calendar, Apple Calendar, Outlook |
| **Personalized Feed** | Only see events targeted at your demographic |
| **Always Updated** | When admins add/edit/cancel events, your calendar updates automatically |

### For Admins (Church Staff)
| Feature | Description |
|---------|-------------|
| **Create Calendars** | Create multiple calendars (Main, Youth, Women, etc.) |
| **Create Events** | Add events with title, description, date/time, location |
| **Target Demographics** | Specify who should see each event |
| **Manage Subscribers** | View who's subscribed and their demographics |
| **Edit/Cancel Events** | Changes propagate to all subscribers automatically |
| **Analytics** | See subscriber demographics breakdown |

---

## User Personas

### Persona 1: Church Member (Subscriber)
**Name:** Chioma  
**Age:** 24  
**Gender:** Female  
**Status:** Single  
**Country:** Nigeria  

**Goals:**
- Stay updated on church events without checking the website constantly
- Only see events relevant to her (youth events, singles events, women's events)
- Have events in her phone calendar with reminders

**Journey:**
1. Sees the HOTR Calendar Sync link on church website/social media
2. Clicks "Subscribe Now"
3. Fills form with her details
4. Clicks "Add to Google Calendar"
5. Done! Events appear in her Google Calendar

**What She Sees:**
- ✅ Sunday Services (all members)
- ✅ Youth Camp (ages 16-30)
- ✅ Singles Hangout (single people)
- ✅ Women's Conference (females)
- ❌ Men's Fellowship (males only)
- ❌ Married Couples Retreat (married only)
- ❌ Senior Citizens Luncheon (ages 60+)

---

### Persona 2: Married Couple
**Names:** Emeka & Ada  
**Ages:** 35 & 33  
**Status:** Married  
**Country:** Nigeria  

**Scenario:** They each subscribe with their own details.

**Emeka's Calendar Shows:**
- ✅ Sunday Services
- ✅ Men's Fellowship
- ✅ Married Couples Retreat
- ❌ Youth Camp (age > 30)
- ❌ Singles events

**Ada's Calendar Shows:**
- ✅ Sunday Services
- ✅ Women's Conference
- ✅ Married Couples Retreat
- ❌ Youth Camp
- ❌ Singles events
- ❌ Men's Fellowship

---

### Persona 3: Youth Leader (Has Both Roles)
**Name:** Pastor David  
**Age:** 28  
**Gender:** Male  
**Status:** Single  

**As a Subscriber:** Sees youth events, men's events, singles events  
**As an Admin:** Can create and manage events, set targeting criteria

---

### Persona 4: Church Admin
**Name:** Sister Grace  
**Role:** Church Secretary  

**Goals:**
- Create and manage church events
- Target events to specific groups
- Track who's subscribed
- Update or cancel events when needed

**Daily Tasks:**
1. Log into admin dashboard
2. Create new events with targeting
3. Edit existing events
4. View subscriber analytics
5. Manage calendar settings

---

## User Flows

### Flow 1: Subscriber Subscription (DETAILED)

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER SUBSCRIPTION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

Step 1: User Visits Subscribe Page
         │
         ▼
┌─────────────────────────────────────────┐
│           SUBSCRIBE PAGE                 │
│  ─────────────────────────────────────  │
│  "Get personalized church events        │
│   delivered to your calendar"           │
│                                         │
│  [Learn More]  [Subscribe Now]          │
└─────────────────────────────────────────┘
         │
         ▼ (clicks Subscribe Now)
         
Step 2: User Fills Subscription Form
         │
         ▼
┌─────────────────────────────────────────┐
│           SUBSCRIPTION FORM              │
│  ─────────────────────────────────────  │
│  Full Name:     [John Doe           ]   │
│  Email:         [john@email.com     ]   │
│  Gender:        [Male           ▼]      │
│  Date of Birth: [1998-05-15         ]   │
│  Country:       [Nigeria        ▼]      │
│  Relationship:  [Single         ▼]      │
│                                         │
│  [Subscribe]                            │
└─────────────────────────────────────────┘
         │
         ▼ (form submitted)
         
Step 3: System Processes Subscription
         │
         ▼
┌─────────────────────────────────────────┐
│           BACKEND PROCESSING             │
│  ─────────────────────────────────────  │
│  1. Validate form data                  │
│  2. Generate unique feedToken           │
│     → "abc123xyz789"                    │
│  3. Save subscriber to database         │
│  4. Generate personalized feed URL      │
│     → /calendar/hotr/feed/abc123xyz.ics │
└─────────────────────────────────────────┘
         │
         ▼
         
Step 4: User Sees Success Page
         │
         ▼
┌─────────────────────────────────────────┐
│           SUCCESS PAGE                   │
│  ─────────────────────────────────────  │
│  ✓ You're subscribed!                   │
│                                         │
│  Add to your calendar:                  │
│                                         │
│  [📅 Google Calendar]                   │
│  [🍎 Apple Calendar]                    │
│  [📧 Outlook]                           │
│  [🔗 Copy ICS Link]                     │
│                                         │
│  Your personalized feed URL:            │
│  webcal://hotr.com/feed/abc123xyz.ics   │
└─────────────────────────────────────────┘
         │
         ▼ (clicks Google Calendar)
         
Step 5: Calendar App Subscribes
         │
         ▼
┌─────────────────────────────────────────┐
│      GOOGLE CALENDAR (User's App)        │
│  ─────────────────────────────────────  │
│  "Add calendar from URL?"               │
│                                         │
│  URL: webcal://hotr.com/.../abc123.ics  │
│                                         │
│  [Cancel]  [Add Calendar]               │
└─────────────────────────────────────────┘
         │
         ▼ (clicks Add Calendar)
         
Step 6: Events Appear in User's Calendar
         │
         ▼
┌─────────────────────────────────────────┐
│         USER'S GOOGLE CALENDAR           │
│  ─────────────────────────────────────  │
│  January 2026                           │
│  ┌─────┬─────┬─────┬─────┬─────┐       │
│  │ Sun │ Mon │ Tue │ Wed │ Thu │       │
│  ├─────┼─────┼─────┼─────┼─────┤       │
│  │  5  │  6  │  7  │  8  │  9  │       │
│  │ 🔵  │     │     │     │     │       │
│  │Sunday│    │     │     │     │       │
│  │Service    │     │     │     │       │
│  ├─────┼─────┼─────┼─────┼─────┤       │
│  │ 12  │ 13  │ 14  │ 15  │ 16  │       │
│  │ 🟡  │     │     │ 🟢  │     │       │
│  │Youth│     │     │Singles    │       │
│  │Camp │     │     │Hangout    │       │
│  └─────┴─────┴─────┴─────┴─────┘       │
│                                         │
│  ✓ Only YOUR relevant events shown!     │
└─────────────────────────────────────────┘
```

---

### Flow 2: Admin Creating & Pushing Events (DETAILED)

```
┌─────────────────────────────────────────────────────────────────┐
│                  ADMIN EVENT CREATION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

Step 1: Admin Logs In
         │
         ▼
┌─────────────────────────────────────────┐
│           ADMIN LOGIN                    │
│  ─────────────────────────────────────  │
│  Email:    [admin@hotr.com          ]   │
│  Password: [••••••••••              ]   │
│                                         │
│  [Login]                                │
└─────────────────────────────────────────┘
         │
         ▼
         
Step 2: Admin Opens Dashboard
         │
         ▼
┌─────────────────────────────────────────┐
│         ADMIN DASHBOARD                  │
│  ─────────────────────────────────────  │
│  Welcome, Admin!                        │
│                                         │
│  Calendars:                             │
│  ┌────────────────────────────────┐    │
│  │ 📅 HOTR Main Calendar          │    │
│  │    156 subscribers │ 24 events │    │
│  │    [Manage]                    │    │
│  └────────────────────────────────┘    │
│                                         │
│  [+ Create New Calendar]                │
└─────────────────────────────────────────┘
         │
         ▼ (clicks Manage)
         
Step 3: Admin Views Calendar Events
         │
         ▼
┌─────────────────────────────────────────┐
│      HOTR MAIN CALENDAR - EVENTS         │
│  ─────────────────────────────────────  │
│  [+ Add New Event]                      │
│                                         │
│  Upcoming Events:                       │
│  ┌────────────────────────────────┐    │
│  │ Sunday Service                 │    │
│  │ Jan 5, 2026 • 8am, 10am, 12pm │    │
│  │ Target: Everyone              │    │
│  └────────────────────────────────┘    │
│  ┌────────────────────────────────┐    │
│  │ Men's Fellowship               │    │
│  │ Jan 10, 2026 • 5pm            │    │
│  │ Target: Males, Age 25+        │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
         │
         ▼ (clicks Add New Event)
         
Step 4: Admin Creates Event WITH TARGETING
         │
         ▼
┌─────────────────────────────────────────┐
│         CREATE NEW EVENT                 │
│  ─────────────────────────────────────  │
│                                         │
│  EVENT DETAILS                          │
│  ─────────────                          │
│  Title:       [Youth Camp 2026      ]   │
│  Description: [Annual youth retreat ]   │
│  Start:       [2026-02-15 09:00    ]   │
│  End:         [2026-02-17 16:00    ]   │
│  Location:    [Camp Ground, Lagos  ]   │
│  Timezone:    [Africa/Lagos (WAT) ▼]   │
│                                         │
│  ─────────────────────────────────────  │
│  WHO SHOULD SEE THIS EVENT?             │
│  (Leave blank for everyone)             │
│  ─────────────                          │
│                                         │
│  Target Genders:                        │
│  [✓] Male  [✓] Female                   │
│                                         │
│  Target Age Range:                      │
│  Min: [16]  Max: [30]                   │
│                                         │
│  Target Countries:                      │
│  [✓] Nigeria  [ ] Ghana  [ ] UK         │
│                                         │
│  Target Relationship Status:            │
│  [✓] Single [✓] Married [ ] Divorced    │
│                                         │
│  ─────────────────────────────────────  │
│  ESTIMATED REACH: 45 subscribers        │
│  (out of 156 total)                     │
│  ─────────────────────────────────────  │
│                                         │
│  [Cancel]  [Create Event]               │
└─────────────────────────────────────────┘
         │
         ▼ (clicks Create Event)
         
Step 5: Event is Saved to Database
         │
         ▼
┌─────────────────────────────────────────┐
│           DATABASE                       │
│  ─────────────────────────────────────  │
│  Event Created:                         │
│  {                                      │
│    id: "evt_123",                       │
│    uid: "evt_123@hotr.com",             │
│    title: "Youth Camp 2026",            │
│    startTime: "2026-02-15T09:00:00",    │
│    endTime: "2026-02-17T16:00:00",      │
│    timezone: "Africa/Lagos",            │
│    targetGenders: ["male", "female"],   │
│    targetAgeMin: 16,                    │
│    targetAgeMax: 30,                    │
│    targetCountries: ["Nigeria"],        │
│    targetRelationshipStatuses: [...]    │
│  }                                      │
└─────────────────────────────────────────┘
         │
         ▼

Step 6: HOW EVENTS "PUSH" TO USERS
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    THE "PUSH" MECHANISM                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  ⚠️  IMPORTANT: Events are NOT "pushed" in the traditional     │
│      sense. Here's how it actually works:                       │
│                                                                  │
│  1. Calendar apps (Google, Apple, Outlook) PULL the ICS feed    │
│     periodically (usually every 15-60 minutes)                  │
│                                                                  │
│  2. When they pull the feed, the server:                        │
│     a) Looks up the subscriber by their feedToken               │
│     b) Calculates their age from DOB                            │
│     c) Fetches ALL events from database                         │
│     d) FILTERS events to only those matching subscriber         │
│     e) Returns filtered events as ICS format                    │
│                                                                  │
│  3. The calendar app updates its local view                     │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  EXAMPLE: Youth Camp event was just created                     │
│                                                                  │
│  When Chioma's Google Calendar syncs (she's 24, single):        │
│  → Request: GET /calendar/hotr/feed/chioma_token.ics            │
│  → Server checks: Age 24 ✓ (16-30), Nigeria ✓, Single ✓         │
│  → Response includes Youth Camp event                           │
│  → Event appears in her calendar!                               │
│                                                                  │
│  When Emeka's calendar syncs (he's 35, married):                │
│  → Request: GET /calendar/hotr/feed/emeka_token.ics             │
│  → Server checks: Age 35 ✗ (not 16-30)                          │
│  → Response EXCLUDES Youth Camp event                           │
│  → He never sees it!                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### Flow 3: Event Update/Cancellation

```
┌─────────────────────────────────────────────────────────────────┐
│              EVENT UPDATE PROPAGATION                            │
└─────────────────────────────────────────────────────────────────┘

Scenario: Admin changes Youth Camp date from Feb 15 to Feb 22

Step 1: Admin edits event in dashboard
         │
         ▼
┌─────────────────────────────────────────┐
│  Edit Event: Youth Camp 2026            │
│  ─────────────────────────────────────  │
│  Start: [2026-02-22 09:00] ← CHANGED    │
│  End:   [2026-02-24 16:00] ← CHANGED    │
│                                         │
│  [Save Changes]                         │
└─────────────────────────────────────────┘
         │
         ▼
         
Step 2: Database updated (UID stays the same!)
         │
         ▼
┌─────────────────────────────────────────┐
│  Event Updated:                         │
│  {                                      │
│    uid: "evt_123@hotr.com", ← SAME UID! │
│    startTime: "2026-02-22T09:00:00",    │
│    ...                                  │
│  }                                      │
└─────────────────────────────────────────┘
         │
         ▼
         
Step 3: Next time calendars sync...
         │
         ▼
┌─────────────────────────────────────────┐
│  Chioma's Google Calendar               │
│  ─────────────────────────────────────  │
│                                         │
│  Before sync:                           │
│  📅 Youth Camp - Feb 15-17              │
│                                         │
│  After sync:                            │
│  📅 Youth Camp - Feb 22-24  ← UPDATED!  │
│                                         │
│  ✓ Same event, new date                 │
│  ✓ UID ensures it's recognized as same  │
│  ✓ No duplicate created                 │
└─────────────────────────────────────────┘

─────────────────────────────────────────────────────────────────

Scenario: Admin CANCELS the event

Step 1: Admin clicks "Cancel Event"
         │
         ▼
┌─────────────────────────────────────────┐
│  Event status changed:                  │
│  {                                      │
│    uid: "evt_123@hotr.com",             │
│    status: "CANCELLED", ← STATUS CHANGE │
│    ...                                  │
│  }                                      │
└─────────────────────────────────────────┘
         │
         ▼
         
Step 2: Next calendar sync...
         │
         ▼
┌─────────────────────────────────────────┐
│  Chioma's Google Calendar               │
│  ─────────────────────────────────────  │
│                                         │
│  📅 Youth Camp - CANCELLED              │
│     (strikethrough or removed)          │
│                                         │
│  ✓ Calendar recognizes CANCELLED status │
│  ✓ User sees event is cancelled         │
└─────────────────────────────────────────┘
```

---

## Technical Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                      SYSTEM ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │     │  Calendar   │     │   Admin     │
│  (Public)   │     │    Apps     │     │  (Staff)    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │ Subscribe         │ Sync ICS          │ Manage
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────┐
│                    NEXT.JS APP                       │
│  ─────────────────────────────────────────────────  │
│                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Public    │  │  ICS Feed   │  │   Admin     │ │
│  │   Pages     │  │  Generator  │  │   API       │ │
│  │             │  │             │  │             │ │
│  │ - Landing   │  │ - Filter    │  │ - Auth      │ │
│  │ - Subscribe │  │   events    │  │ - CRUD      │ │
│  │ - Success   │  │ - Generate  │  │ - Events    │ │
│  │             │  │   .ics      │  │ - Calendars │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│         │                │                │        │
│         └────────────────┼────────────────┘        │
│                          │                          │
│                          ▼                          │
│              ┌─────────────────────┐               │
│              │   PRISMA ORM        │               │
│              └──────────┬──────────┘               │
│                         │                          │
└─────────────────────────┼──────────────────────────┘
                          │
                          ▼
              ┌─────────────────────┐
              │   POSTGRESQL DB     │
              │   (Neon/Supabase)   │
              │                     │
              │  - Subscribers      │
              │  - Calendars        │
              │  - Events           │
              │  - Admins           │
              └─────────────────────┘
```

### ICS Feed Generation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              ICS FEED GENERATION (THE CORE MAGIC)                │
└─────────────────────────────────────────────────────────────────┘

Request: GET /calendar/hotr-phc/feed/abc123xyz.ics

         ▼

Step 1: Parse feedToken from URL
        feedToken = "abc123xyz"
         │
         ▼

Step 2: Lookup subscriber in database
        SELECT * FROM subscribers WHERE feedToken = "abc123xyz"
        
        Result:
        {
          name: "Chioma",
          email: "chioma@email.com",
          gender: "female",
          dob: "2002-03-15",      → Age = 24
          country: "Nigeria",
          relationshipStatus: "single"
        }
         │
         ▼

Step 3: Fetch all events for this calendar
        SELECT * FROM events WHERE calendarId = "hotr-phc"
         │
         ▼

Step 4: Filter events based on subscriber demographics
        
        For each event:
        ┌───────────────────────────────────────────────────────┐
        │ Event: "Men's Fellowship"                             │
        │ Targets: gender=male                                  │
        │ Subscriber: gender=female                             │
        │ Match: ❌ EXCLUDED                                    │
        └───────────────────────────────────────────────────────┘
        
        ┌───────────────────────────────────────────────────────┐
        │ Event: "Youth Camp"                                   │
        │ Targets: age 16-30, country=Nigeria                   │
        │ Subscriber: age=24, country=Nigeria                   │
        │ Match: ✅ INCLUDED                                    │
        └───────────────────────────────────────────────────────┘
        
        ┌───────────────────────────────────────────────────────┐
        │ Event: "Singles Hangout"                              │
        │ Targets: relationshipStatus=single                    │
        │ Subscriber: relationshipStatus=single                 │
        │ Match: ✅ INCLUDED                                    │
        └───────────────────────────────────────────────────────┘
         │
         ▼

Step 5: Generate ICS file with filtered events

        BEGIN:VCALENDAR
        VERSION:2.0
        PRODID:-//HOTR Port Harcourt//Calendar//EN
        X-WR-CALNAME:HOTR PHC Events
        
        BEGIN:VEVENT
        UID:evt_456@hotr.com
        DTSTART:20260215T090000Z
        DTEND:20260217T160000Z
        SUMMARY:Youth Camp 2026
        DESCRIPTION:Annual youth retreat...
        LOCATION:Camp Ground, Lagos
        STATUS:CONFIRMED
        END:VEVENT
        
        BEGIN:VEVENT
        UID:evt_789@hotr.com
        DTSTART:20260120T170000Z
        DTEND:20260120T200000Z
        SUMMARY:Singles Hangout
        DESCRIPTION:Fellowship for singles...
        STATUS:CONFIRMED
        END:VEVENT
        
        END:VCALENDAR
         │
         ▼

Step 6: Return ICS with proper headers
        
        Content-Type: text/calendar; charset=utf-8
        Cache-Control: max-age=300
        
        (ICS content)
```

---

## Data Models

### Subscriber Model
```
┌─────────────────────────────────────────┐
│             SUBSCRIBER                   │
├─────────────────────────────────────────┤
│ id              String    (Primary Key) │
│ name            String                  │
│ email           String                  │
│ gender          Enum      (male/female) │
│ dob             DateTime  (Date of Birth)│
│ country         String                  │
│ relationshipStatus Enum   (single/married/divorced/widowed) │
│ feedToken       String    (Unique!)     │
│ calendarId      String    (Foreign Key) │
│ subscribedAt    DateTime                │
│ platform        String    (google/apple/outlook) │
└─────────────────────────────────────────┘
```

### Event Model
```
┌─────────────────────────────────────────┐
│               EVENT                      │
├─────────────────────────────────────────┤
│ id              String    (Primary Key) │
│ uid             String    (Stable ICS UID) │
│ title           String                  │
│ description     String                  │
│ startTime       DateTime                │
│ endTime         DateTime                │
│ timezone        String    (default: Africa/Lagos) │
│ location        String                  │
│ status          Enum      (scheduled/cancelled) │
│ calendarId      String    (Foreign Key) │
│ createdAt       DateTime                │
│ updatedAt       DateTime                │
│                                         │
│ ─── TARGETING FIELDS ───               │
│ targetGenders   String[]  (e.g., ["male"]) │
│ targetAgeMin    Int?      (e.g., 16)    │
│ targetAgeMax    Int?      (e.g., 30)    │
│ targetCountries String[]  (e.g., ["Nigeria"]) │
│ targetRelationshipStatuses String[]     │
└─────────────────────────────────────────┘
```

### Calendar Model
```
┌─────────────────────────────────────────┐
│              CALENDAR                    │
├─────────────────────────────────────────┤
│ id              String    (Primary Key) │
│ name            String    (e.g., "HOTR Main") │
│ slug            String    (URL-friendly, unique) │
│ description     String                  │
│ isPublic        Boolean                 │
│ token           String    (Admin access token) │
│ createdAt       DateTime                │
│ updatedAt       DateTime                │
└─────────────────────────────────────────┘
```

---

## API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/calendars` | List all public calendars |
| GET | `/api/calendars/:slug` | Get calendar details |
| GET | `/api/calendars/:slug/events` | List public events |
| POST | `/api/subscribe` | Submit subscription form |
| GET | `/calendar/:slug/feed/:feedToken.ics` | **THE MAIN ICS FEED** |

### Admin Endpoints (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/calendars` | Create calendar |
| GET | `/api/admin/calendars` | List all calendars |
| PATCH | `/api/admin/calendars/:id` | Update calendar |
| DELETE | `/api/admin/calendars/:id` | Delete calendar |
| POST | `/api/admin/calendars/:id/events` | Create event |
| PATCH | `/api/admin/events/:id` | Update event |
| DELETE | `/api/admin/events/:id` | Delete/cancel event |
| GET | `/api/admin/calendars/:id/subscribers` | List subscribers |

---

## Summary: The Two Main Flows

### 1. User Subscribing to Receive Events
```
User → Subscribe Page → Fill Form → Get feedToken → Add to Calendar App → Events appear!
```

### 2. Admin Pushing Events to Users
```
Admin → Login → Create Event + Set Targeting → Save to DB → (Calendar apps sync) → Users see event!
```

**Key Insight:** Admins don't literally "push" to each user. They create events with targeting criteria, and when each user's calendar syncs, the server filters events for that specific user based on their demographics.

---

## Questions?

If you have questions about how any part of this system works, refer to this document or ask for clarification!
