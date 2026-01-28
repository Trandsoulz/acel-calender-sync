import Link from "next/link";
import Image from "next/image";
import { Container } from "@/app/_components/ui/container";
import { Button } from "@/app/_components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-light/30 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 blur-3xl opacity-50" />
      </div>

      <Container>
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo Badge */}
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-muted px-5 py-2.5 ring-1 ring-border">
            <Image
              src="/logo.png"
              alt="HOTR"
              width={24}
              height={24}
              className="dark:invert"
            />
            <span className="text-sm font-medium text-foreground">
              House on the Rock Port Harcourt
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Never Miss a{" "}
            <span className="text-accent">
              Church Event
            </span>{" "}
            Again
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg leading-8 text-muted-foreground md:text-xl">
            Subscribe to HOTR Port Harcourt&apos;s calendar and get personalized event
            notifications based on your interests, age group, and preferences.
            Syncs directly with your Google, Apple, or Outlook calendar.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/calendars/hotr-port-harcourt">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                View Calendar
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              </Button>
            </Link>
            <Link href="/calendars/hotr-port-harcourt/subscribe">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Subscribe Now
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">
              Works seamlessly with
            </p>
            <div className="flex items-center gap-8">
              {/* Google Calendar */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm-9 15h-3v-9h3v9zm6 0h-3V9h3v9z" />
                </svg>
                <span className="text-sm font-medium">Google</span>
              </div>
              {/* Apple Calendar */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span className="text-sm font-medium">Apple</span>
              </div>
              {/* Outlook */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h7.9q.44 0 .75.3.3.3.3.75V6H24q.41 0 .7.3.3.29.3.7v5zM6 7H1v10h5V7zm9.5-4.5h-7v4h3.3q.41 0 .75.3.3.3.3.7v9h2.65V2.5zm6.5 6H14v6h8V8.5zm0 12v-5H7v5h15z" />
                </svg>
                <span className="text-sm font-medium">Outlook</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero illustration/mockup */}
        <div className="mt-16 sm:mt-24">
          <div className="relative mx-auto max-w-4xl overflow-x-auto">
            <div className="min-w-[640px] rounded-2xl bg-foreground/5 p-2 ring-1 ring-inset ring-foreground/10">
              <div className="rounded-xl bg-background shadow-2xl ring-1 ring-border">
                {/* Calendar mockup header */}
                <div className="flex items-center gap-4 border-b border-border px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500" />
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-500" />
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                      January 2026 - HOTR PHC Events
                    </span>
                  </div>
                </div>
                {/* Calendar mockup body */}
                <div className="grid grid-cols-7 gap-px bg-border">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="bg-muted px-2 sm:px-4 py-2 sm:py-3 text-center text-[10px] sm:text-xs font-semibold text-muted-foreground"
                      >
                        {day}
                      </div>
                    )
                  )}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 3; // Start from Thursday (Jan 1, 2026)
                    const isCurrentMonth = day >= 1 && day <= 31;
                    const isSunday = (i % 7) === 0 && isCurrentMonth;
                    const isTuesday = (i % 7) === 2 && isCurrentMonth;
                    const hasSpecialEvent = [11, 18, 25].includes(day); // Special events on certain Sundays
                    return (
                      <div
                        key={i}
                        className={`min-h-[60px] sm:min-h-[80px] bg-background p-1.5 sm:p-2 ${
                          !isCurrentMonth ? "opacity-40" : ""
                        }`}
                      >
                        {isCurrentMonth && (
                          <>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {day}
                            </span>
                            {isSunday && (
                              <div className="mt-1 rounded bg-accent/20 px-1 sm:px-1.5 py-0.5 text-[9px] sm:text-xs font-medium text-accent-dark truncate">
                                Sunday Service
                              </div>
                            )}
                            {isTuesday && (
                              <div className="mt-1 rounded bg-primary/10 px-1 sm:px-1.5 py-0.5 text-[9px] sm:text-xs font-medium text-foreground truncate">
                                Midweek
                              </div>
                            )}
                            {hasSpecialEvent && (
                              <div className="mt-1 rounded bg-accent px-1 sm:px-1.5 py-0.5 text-[9px] sm:text-xs font-medium text-accent-foreground truncate">
                                Special Event
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
