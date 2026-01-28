import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  
  const admin = await prisma.admin.upsert({
    where: { email: "admin@hotrph.org" },
    update: {},
    create: {
      email: "admin@hotrph.org",
      password: adminPassword,
      name: "Admin",
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // Create default calendar
  const calendar = await prisma.calendar.upsert({
    where: { slug: "hotr-port-harcourt" },
    update: {},
    create: {
      name: "HOTR Port Harcourt Events",
      slug: "hotr-port-harcourt",
      description: "Official calendar for House on the Rock Port Harcourt",
      isPublic: true,
    },
  });

  console.log("✅ Default calendar created:", calendar.name);

  // Create sample events
  const now = new Date();
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + (7 - now.getDay()));
  nextSunday.setHours(9, 0, 0, 0);

  const sundayServiceEnd = new Date(nextSunday);
  sundayServiceEnd.setHours(12, 0, 0, 0);

  await prisma.event.upsert({
    where: {
      calendarId_uid: {
        calendarId: calendar.id,
        uid: `event-sunday-service@hotrph.org`,
      },
    },
    update: {},
    create: {
      uid: `event-sunday-service@hotrph.org`,
      title: "Sunday Service",
      description: "Join us for our weekly Sunday service. All are welcome!",
      startTime: nextSunday,
      endTime: sundayServiceEnd,
      timezone: "Africa/Lagos",
      location: "House on the Rock, Port Harcourt",
      status: "confirmed",
      targetGenders: [],
      targetCountries: [],
      targetRelationshipStatuses: [],
      calendarId: calendar.id,
    },
  });

  console.log("✅ Sample Sunday Service event created");

  // Create a youth event (targeted)
  const youthNight = new Date(nextSunday);
  youthNight.setDate(youthNight.getDate() + 5); // Friday
  youthNight.setHours(18, 0, 0, 0);

  const youthNightEnd = new Date(youthNight);
  youthNightEnd.setHours(21, 0, 0, 0);

  await prisma.event.upsert({
    where: {
      calendarId_uid: {
        calendarId: calendar.id,
        uid: `event-youth-night@hotrph.org`,
      },
    },
    update: {},
    create: {
      uid: `event-youth-night@hotrph.org`,
      title: "Youth Night",
      description: "A special evening for our young adults (18-35). Worship, fellowship, and fun!",
      startTime: youthNight,
      endTime: youthNightEnd,
      timezone: "Africa/Lagos",
      location: "House on the Rock, Port Harcourt - Youth Hall",
      status: "confirmed",
      targetGenders: [],
      targetAgeMin: 18,
      targetAgeMax: 35,
      targetCountries: [],
      targetRelationshipStatuses: [],
      calendarId: calendar.id,
    },
  });

  console.log("✅ Sample Youth Night event created (targeted: ages 18-35)");

  // Create a couples event (targeted)
  const couplesRetreat = new Date(nextSunday);
  couplesRetreat.setDate(couplesRetreat.getDate() + 14);
  couplesRetreat.setHours(10, 0, 0, 0);

  const couplesRetreatEnd = new Date(couplesRetreat);
  couplesRetreatEnd.setHours(16, 0, 0, 0);

  await prisma.event.upsert({
    where: {
      calendarId_uid: {
        calendarId: calendar.id,
        uid: `event-couples-retreat@hotrph.org`,
      },
    },
    update: {},
    create: {
      uid: `event-couples-retreat@hotrph.org`,
      title: "Couples Retreat",
      description: "A day of renewal and reconnection for married couples.",
      startTime: couplesRetreat,
      endTime: couplesRetreatEnd,
      timezone: "Africa/Lagos",
      location: "House on the Rock, Port Harcourt",
      status: "confirmed",
      targetGenders: [],
      targetCountries: [],
      targetRelationshipStatuses: ["married"],
      calendarId: calendar.id,
    },
  });

  console.log("✅ Sample Couples Retreat event created (targeted: married)");

  console.log("\n🎉 Database seeding complete!");
  console.log("\n📝 Admin login credentials:");
  console.log("   Email: admin@hotrph.org");
  console.log("   Password: admin123");
  console.log("\n⚠️  Please change the password in production!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
