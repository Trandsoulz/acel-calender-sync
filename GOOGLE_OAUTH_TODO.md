# Google OAuth Calendar Sync - Implementation TODO

## Overview

This document outlines the tasks required to complete Google OAuth integration for full calendar syncing capabilities. The goal is to enable real-time, bi-directional sync with subscribers' Google Calendars.

---

## Current State (What's Already Done)

✅ **Completed Features:**
- OAuth flow initiation (`/api/auth/google`)
- OAuth callback handling (`/api/auth/google/callback`)
- Token exchange and storage in Subscriber model
- Secondary calendar creation ("HOTR Port Harcourt" calendar)
- Initial event sync on subscription
- Event description footer with church info
- Access/refresh token storage in database
- Basic token refresh utility function

---

## Implementation Phases

### Phase 1: Auto-Sync on Event Changes (Priority: HIGH)

**Goal:** When an admin creates, updates, or deletes an event, automatically sync changes to all affected Google Calendar subscribers.

#### Tasks:

- [ ] **1.1 Create event sync utility function**
  ```typescript
  // lib/sync.ts
  async function syncEventToAllSubscribers(
    eventId: string,
    action: 'create' | 'update' | 'delete'
  ): Promise<void>
  ```
  - Fetch event with targeting criteria
  - Find all subscribers with Google OAuth connected
  - Filter subscribers who match event targeting
  - Sync event to each subscriber's Google Calendar

- [ ] **1.2 Add sync triggers to admin event APIs**
  - `POST /api/admin/calendars/[id]/events` → Trigger sync after event creation
  - `PATCH /api/admin/events/[eventId]` → Trigger sync after event update
  - `DELETE /api/admin/events/[eventId]` → Trigger sync for event deletion

- [ ] **1.3 Handle token refresh during sync**
  - Check if access token is expired before API calls
  - Automatically refresh using stored refresh token
  - Update subscriber record with new tokens
  - Retry failed syncs after token refresh

- [ ] **1.4 Implement sync error handling**
  - Handle rate limits (429 errors)
  - Handle invalid tokens (revoked access)
  - Log sync failures for debugging
  - Queue failed syncs for retry

---

### Phase 2: Token Management (Priority: HIGH)

**Goal:** Robust handling of OAuth tokens including refresh, expiry, and revocation.

#### Tasks:

- [ ] **2.1 Create token refresh middleware**
  ```typescript
  // lib/google.ts
  async function ensureValidToken(subscriberId: string): Promise<string>
  ```
  - Check token expiry before any Google API call
  - Refresh if expired (within 5-minute buffer)
  - Update database with new tokens
  - Return valid access token

- [ ] **2.2 Handle token revocation**
  - Detect when user revokes access (401 errors)
  - Clear Google OAuth fields from subscriber
  - Mark subscriber as needing re-authorization
  - Send notification email (optional)

- [ ] **2.3 Add re-authorization flow**
  - Create endpoint for subscribers to reconnect Google
  - `GET /api/auth/google/reauthorize?subscriberId=xxx`
  - Show prompt on subscriber profile page
  - Handle re-authorization callback

- [ ] **2.4 Token encryption (Security Enhancement)**
  - Encrypt access/refresh tokens at rest
  - Use AES-256-GCM or similar
  - Store encryption key in environment variable
  - Decrypt only when needed for API calls

---

### Phase 3: Background Sync Jobs (Priority: MEDIUM)

**Goal:** Handle sync operations asynchronously to prevent blocking API responses.

#### Tasks:

- [ ] **3.1 Implement job queue system**
  - Choose queue solution (e.g., BullMQ, pg-boss, Quirrel)
  - Set up Redis/PostgreSQL for job storage
  - Create job workers for sync operations

- [ ] **3.2 Create sync job types**
  ```typescript
  type SyncJob = 
    | { type: 'sync_event'; eventId: string; action: 'create' | 'update' | 'delete' }
    | { type: 'sync_subscriber'; subscriberId: string }
    | { type: 'bulk_sync'; calendarId: string }
  ```

- [ ] **3.3 Add job scheduling**
  - Queue sync jobs on event changes
  - Process jobs with rate limiting (avoid Google API limits)
  - Implement exponential backoff for retries
  - Dead letter queue for failed jobs

- [ ] **3.4 Add sync status tracking**
  - Track last successful sync time per subscriber
  - Track sync failures and error messages
  - Add sync status to admin dashboard

---

### Phase 4: Subscriber Management (Priority: MEDIUM)

**Goal:** Allow subscribers to manage their Google Calendar connection.

#### Tasks:

- [ ] **4.1 Create subscriber profile page**
  - `GET /profile/[feedToken]` or `/manage/[feedToken]`
  - Show connected Google account (email)
  - Display sync status and last sync time
  - Option to disconnect Google Calendar

- [ ] **4.2 Add disconnect endpoint**
  - `POST /api/subscriber/disconnect-google`
  - Revoke Google OAuth tokens via API
  - Clear tokens from database
  - Delete HOTR calendar from user's account (optional)

- [ ] **4.3 Add reconnect endpoint**
  - `GET /api/auth/google/reconnect?feedToken=xxx`
  - Similar to initial OAuth but updates existing subscriber
  - Re-sync all events after reconnection

- [ ] **4.4 Create email notifications**
  - Notify on successful sync setup
  - Alert on sync failures
  - Remind to reconnect if token revoked

---

### Phase 5: Admin Dashboard Enhancements (Priority: LOW)

**Goal:** Provide visibility into Google sync status for administrators.

#### Tasks:

- [ ] **5.1 Add sync status to subscriber list**
  - Column showing Google sync status (connected/disconnected)
  - Last sync timestamp
  - Sync error indicator

- [ ] **5.2 Create bulk sync controls**
  - "Sync All Subscribers" button
  - "Sync All Events" button for specific calendar
  - Progress indicator for bulk operations

- [ ] **5.3 Add sync logs view**
  - View recent sync operations
  - Filter by status (success/failed)
  - Show error details for debugging

- [ ] **5.4 Add analytics**
  - Percentage of subscribers with Google connected
  - Sync success rate over time
  - Common error types

---

### Phase 6: Advanced Features (Priority: FUTURE)

**Goal:** Enhanced functionality for power users and complex use cases.

#### Tasks:

- [ ] **6.1 Bi-directional sync (Read from Google)**
  - Detect when user modifies synced event
  - Sync changes back to HOTR system
  - Handle conflict resolution

- [ ] **6.2 Push notifications via Google Calendar**
  - Set up webhook for calendar changes
  - React to user modifications in real-time

- [ ] **6.3 Multiple calendar support**
  - Allow subscriber to choose target calendar
  - Sync to existing calendar instead of creating new one

- [ ] **6.4 Batch API operations**
  - Use Google Calendar Batch API for efficiency
  - Reduce API calls for bulk operations

---

## API Endpoints to Create

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `/api/sync/event` | POST | Manual event sync trigger | High |
| `/api/sync/subscriber/[id]` | POST | Sync all events for subscriber | High |
| `/api/subscriber/disconnect-google` | POST | Disconnect Google Calendar | Medium |
| `/api/auth/google/reconnect` | GET | Re-authorize Google access | Medium |
| `/api/admin/sync-status` | GET | Get sync status overview | Low |
| `/profile/[feedToken]` | GET | Subscriber profile page | Medium |

---

## Database Schema Changes

### Add to Subscriber model:
```prisma
model Subscriber {
  // ... existing fields ...
  
  // Sync tracking (add these)
  lastSyncAt     DateTime?  // Last successful sync
  syncStatus     String?    // 'synced', 'pending', 'failed'
  syncError      String?    // Last error message
  googleEmail    String?    // User's Google email for display
}
```

### Create SyncLog model (optional):
```prisma
model SyncLog {
  id           String   @id @default(cuid())
  subscriberId String
  eventId      String?
  action       String   // 'create', 'update', 'delete'
  status       String   // 'success', 'failed'
  error        String?
  createdAt    DateTime @default(now())
  
  subscriber   Subscriber @relation(fields: [subscriberId], references: [id])
}
```

---

## Environment Variables Needed

```env
# Already required
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# New for enhanced security
TOKEN_ENCRYPTION_KEY="32-byte-encryption-key-here"

# For background jobs (if using Redis)
REDIS_URL="redis://localhost:6379"

# For email notifications (optional)
SMTP_HOST="smtp.example.com"
SMTP_USER="notifications@hotrph.org"
SMTP_PASS="your-smtp-password"
```

---

## Google Cloud Console Setup

### Required OAuth Scopes:
```typescript
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",      // Full calendar access
  "https://www.googleapis.com/auth/userinfo.email", // Get user email
  "https://www.googleapis.com/auth/userinfo.profile", // Get user name
];
```

### Consent Screen Configuration:
- App Name: HOTR Calendar Sync
- Authorized Domains: your-domain.com
- Scopes: Calendar (read/write), User info

### OAuth Credentials:
- Type: Web Application
- Authorized redirect URIs:
  - `https://your-domain.com/api/auth/google/callback`
  - `http://localhost:3000/api/auth/google/callback` (development)

---

## Testing Checklist

### Phase 1 Testing:
- [ ] Create event → syncs to all matching subscribers
- [ ] Update event → updates in subscriber calendars
- [ ] Delete event → removes from subscriber calendars
- [ ] Event with targeting → only syncs to matching subscribers

### Phase 2 Testing:
- [ ] Token refresh works when expired
- [ ] Revoked tokens are handled gracefully
- [ ] Re-authorization flow works correctly

### Phase 3 Testing:
- [ ] Jobs are queued correctly
- [ ] Rate limiting prevents API quota exhaustion
- [ ] Failed jobs are retried with backoff

### Phase 4 Testing:
- [ ] Profile page loads with correct info
- [ ] Disconnect removes tokens and calendar
- [ ] Reconnect re-establishes sync

---

## Implementation Order (Recommended)

1. **Phase 1.1-1.2**: Event sync utility + API triggers (Core functionality)
2. **Phase 2.1-2.2**: Token refresh middleware + revocation handling (Reliability)
3. **Phase 1.3-1.4**: Error handling and retry logic (Robustness)
4. **Phase 4.1-4.3**: Subscriber management pages (User experience)
5. **Phase 3**: Background jobs (Scalability)
6. **Phase 5**: Admin dashboard enhancements (Visibility)
7. **Phase 6**: Advanced features (Future)

---

## Estimated Timeline

| Phase | Effort | Estimated Time |
|-------|--------|----------------|
| Phase 1 | Medium | 2-3 days |
| Phase 2 | Medium | 1-2 days |
| Phase 3 | High | 3-4 days |
| Phase 4 | Medium | 2-3 days |
| Phase 5 | Low | 1-2 days |
| Phase 6 | High | TBD |

**Total for Core Features (Phases 1-2):** ~4-5 days  
**Total for Full Implementation (Phases 1-5):** ~10-14 days

---

## Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/v3/reference)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

*Created: February 2026*
*Last Updated: February 2026*
