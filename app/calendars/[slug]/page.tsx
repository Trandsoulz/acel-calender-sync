"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Navbar, Footer } from "@/app/_components/layout";
import { Container } from "@/app/_components/ui/container";
import { Button } from "@/app/_components/ui/button";
import { formatDateForDisplay } from "@/lib/utils";

interface CalendarInfo {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  eventCount: number;
  subscriberCount: number;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  location: string | null;
}

export default function PublicCalendarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [calendar, setCalendar] = useState<CalendarInfo | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCalendarData();
  }, [resolvedParams.slug]);

  const fetchCalendarData = async () => {
    try {
      // Fetch calendar info
      const calResponse = await fetch(`/api/calendars/${resolvedParams.slug}`);
      if (!calResponse.ok) {
        if (calResponse.status === 404) {
          setError("Calendar not found");
        } else if (calResponse.status === 403) {
          setError("This calendar is private");
        } else {
          setError("Failed to load calendar");
        }
        return;
      }
      const calData = await calResponse.json();
      setCalendar(calData);

      // Fetch events
      const eventsResponse = await fetch(`/api/calendars/${resolvedParams.slug}/events`);
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events || []);
      }
    } catch {
      setError("Failed to load calendar");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-20">
          <Container>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-20">
          <Container>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-4">{error}</h1>
              <p className="text-muted-foreground mb-8">
                The calendar you&apos;re looking for doesn&apos;t exist or is not accessible.
              </p>
              <Link href="/">
                <Button>Go Home</Button>
              </Link>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20">
        <Container>
          {/* Calendar Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {calendar?.name}
            </h1>
            {calendar?.description && (
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {calendar.description}
              </p>
            )}
            <div className="flex justify-center gap-8 mt-6 text-muted-foreground">
              <span>{calendar?.eventCount} upcoming events</span>
            </div>
          </div>

          {/* Subscribe CTA */}
          <div className="bg-primary rounded-2xl p-8 text-center mb-12">
            <h2 className="text-2xl font-bold text-primary-foreground mb-3">
              Stay Updated with Personalized Events
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Subscribe to receive events tailored to you. Your calendar will automatically
              sync with events relevant to your age, interests, and more.
            </p>
            <Link href={`/calendars/${resolvedParams.slug}/subscribe`}>
              <Button variant="secondary" className="text-lg px-8 py-3">
                Subscribe Now
              </Button>
            </Link>
          </div>

          {/* Upcoming Events */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Upcoming Events
            </h2>
            
            {events.length === 0 ? (
              <div className="text-center py-12 bg-muted rounded-xl">
                <p className="text-muted-foreground">No upcoming events at the moment.</p>
                <p className="text-muted-foreground mt-2">Subscribe to be notified when new events are added!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-muted rounded-xl p-4 sm:p-6 hover:ring-2 hover:ring-accent/50 transition-all overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-semibold text-foreground break-words">
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="text-muted-foreground mt-2 text-sm sm:text-base break-words line-clamp-3">
                            {event.description}
                          </p>
                        )}
                        {event.location && (
                          <p className="text-muted-foreground mt-2 flex items-start gap-2 text-sm sm:text-base">
                            <span className="shrink-0">📍</span> 
                            <span className="break-words">{event.location}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-left md:text-right shrink-0">
                        <p className="text-accent font-medium text-sm sm:text-base">
                          {formatDateForDisplay(event.startTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
