import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-zinc-950 dark:to-zinc-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-r from-indigo-400/30 via-purple-400/30 to-pink-400/30 blur-3xl opacity-50 dark:opacity-20" />
      </div>

      <Container>
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20 dark:bg-indigo-950/50 dark:text-indigo-300 dark:ring-indigo-500/30">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
              />
            </svg>
            Personalized Calendar Feeds
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl dark:text-white">
            Stay Updated with Events{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              That Matter to You
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400 md:text-xl">
            Subscribe to community calendars and receive personalized event
            feeds based on your interests, age, location, and preferences.
            Syncs directly with Google Calendar, Apple Calendar, and Outlook.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/subscribe">
              <Button size="lg" className="w-full sm:w-auto">
                Subscribe to a Calendar
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
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-500">
              Works seamlessly with
            </p>
            <div className="flex items-center gap-8">
              {/* Google Calendar */}
              <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm-9 15h-3v-9h3v9zm6 0h-3V9h3v9z" />
                </svg>
                <span className="text-sm font-medium">Google</span>
              </div>
              {/* Apple Calendar */}
              <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span className="text-sm font-medium">Apple</span>
              </div>
              {/* Outlook */}
              <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
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
          <div className="relative mx-auto max-w-4xl">
            <div className="rounded-2xl bg-zinc-900/5 p-2 ring-1 ring-inset ring-zinc-900/10 dark:bg-white/5 dark:ring-white/10">
              <div className="rounded-xl bg-white shadow-2xl ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800">
                {/* Calendar mockup header */}
                <div className="flex items-center gap-4 border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      January 2026 - Your Personalized Calendar
                    </span>
                  </div>
                </div>
                {/* Calendar mockup body */}
                <div className="grid grid-cols-7 gap-px bg-zinc-200 dark:bg-zinc-700">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="bg-zinc-50 px-4 py-3 text-center text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        {day}
                      </div>
                    )
                  )}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 3; // Start from Thursday (Jan 1, 2026)
                    const isCurrentMonth = day >= 1 && day <= 31;
                    const hasEvent = [5, 12, 15, 22, 28].includes(day);
                    return (
                      <div
                        key={i}
                        className={`min-h-[80px] bg-white p-2 dark:bg-zinc-900 ${
                          !isCurrentMonth ? "opacity-40" : ""
                        }`}
                      >
                        {isCurrentMonth && (
                          <>
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                              {day}
                            </span>
                            {hasEvent && (
                              <div className="mt-1 rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                                Event
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
