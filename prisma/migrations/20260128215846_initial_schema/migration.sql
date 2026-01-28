-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Lagos',
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "targetGenders" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "targetAgeMin" INTEGER,
    "targetAgeMax" INTEGER,
    "targetCountries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "targetRelationshipStatuses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "calendarId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "gender" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "relationshipStatus" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "feedToken" TEXT NOT NULL,
    "platform" TEXT,
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "calendarId" TEXT NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Calendar_slug_key" ON "Calendar"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Calendar_token_key" ON "Calendar"("token");

-- CreateIndex
CREATE INDEX "Calendar_slug_idx" ON "Calendar"("slug");

-- CreateIndex
CREATE INDEX "Event_calendarId_idx" ON "Event"("calendarId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_calendarId_uid_key" ON "Event"("calendarId", "uid");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_feedToken_key" ON "Subscriber"("feedToken");

-- CreateIndex
CREATE INDEX "Subscriber_calendarId_idx" ON "Subscriber"("calendarId");

-- CreateIndex
CREATE INDEX "Subscriber_feedToken_idx" ON "Subscriber"("feedToken");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriber" ADD CONSTRAINT "Subscriber_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
