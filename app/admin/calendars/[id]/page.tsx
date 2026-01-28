"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/app/_components/ui/logo";
import { calculateAge } from "@/lib/utils";

interface Event {
  id: string;
  uid: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  timezone: string;
  location: string | null;
  status: string;
  targetGenders: string[];
  targetAgeMin: number | null;
  targetAgeMax: number | null;
  targetCountries: string[];
  targetRelationshipStatuses: string[];
}

interface Subscriber {
  id: string;
  name: string;
  email: string;
  gender: string;
  country: string;
  relationshipStatus: string;
  dob: string;
  platform: string | null;
  interests: string[];
  subscribedAt: string;
}

interface Calendar {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isPublic: boolean;
  token: string;
  events: Event[];
  subscribers: Subscriber[];
  _count: {
    events: number;
    subscribers: number;
  };
}

export default function CalendarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"events" | "subscribers">("events");
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchCalendar();
  }, [resolvedParams.id]);

  const fetchCalendar = async () => {
    try {
      const authResponse = await fetch("/api/admin/me");
      if (!authResponse.ok) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(`/api/admin/calendars/${resolvedParams.id}`);
      if (!response.ok) {
        router.push("/admin/dashboard");
        return;
      }

      const data = await response.json();
      setCalendar(data.calendar);
    } catch {
      router.push("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCalendar();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleDeleteCalendar = async () => {
    if (!confirm("Are you sure you want to delete this calendar? This will also delete all events and subscriber data.")) return;

    try {
      const response = await fetch(`/api/admin/calendars/${resolvedParams.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent)] border-t-transparent"></div>
      </div>
    );
  }

  if (!calendar) return null;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="text-[var(--muted-foreground)]">/</span>
            <Link href="/admin/dashboard" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              {calendar.name}
            </h1>
            <p className="text-[var(--muted-foreground)] mt-1">
              /{calendar.slug}
              {!calendar.isPublic && (
                <span className="ml-2 px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-xs rounded">
                  Private
                </span>
              )}
            </p>
            {calendar.description && (
              <p className="text-[var(--muted-foreground)] mt-2">{calendar.description}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditingEvent(null);
                setShowEventModal(true);
              }}
              className="px-4 py-2 bg-[var(--accent)] text-black font-medium rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
            >
              + New Event
            </button>
            <button
              onClick={handleDeleteCalendar}
              className="px-4 py-2 border border-red-500/30 text-red-500 font-medium rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <p className="text-[var(--muted-foreground)] text-sm">Events</p>
            <p className="text-3xl font-bold text-[var(--foreground)] mt-1">
              {calendar._count.events}
            </p>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <p className="text-[var(--muted-foreground)] text-sm">Subscribers</p>
            <p className="text-3xl font-bold text-[var(--foreground)] mt-1">
              {calendar._count.subscribers}
            </p>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <p className="text-[var(--muted-foreground)] text-sm">Subscribe Link</p>
            <p className="text-sm text-[var(--accent)] mt-1 truncate">
              /calendars/{calendar.slug}/subscribe
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-[var(--border)]">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "events"
                ? "text-[var(--accent)] border-[var(--accent)]"
                : "text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)]"
            }`}
          >
            Events ({calendar.events.length})
          </button>
          <button
            onClick={() => setActiveTab("subscribers")}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "subscribers"
                ? "text-[var(--accent)] border-[var(--accent)]"
                : "text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)]"
            }`}
          >
            Subscribers ({calendar.subscribers.length})
          </button>
        </div>

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
            {calendar.events.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-[var(--muted-foreground)]">No events yet.</p>
                <button
                  onClick={() => {
                    setEditingEvent(null);
                    setShowEventModal(true);
                  }}
                  className="mt-4 text-[var(--accent)] hover:underline"
                >
                  Create your first event
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {calendar.events.map((event) => (
                  <div key={event.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-[var(--foreground)]">
                          {event.title}
                          {event.status === "cancelled" && (
                            <span className="ml-2 px-2 py-0.5 bg-red-500/10 text-red-500 text-xs rounded">
                              Cancelled
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)] mt-1">
                          {new Date(event.startTime).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                          {event.location && ` • ${event.location}`}
                        </p>
                        {/* Targeting info */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {event.targetGenders.length > 0 && (
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded">
                              {event.targetGenders.join(", ")}
                            </span>
                          )}
                          {(event.targetAgeMin || event.targetAgeMax) && (
                            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded">
                              Ages {event.targetAgeMin || 0}-{event.targetAgeMax || "∞"}
                            </span>
                          )}
                          {event.targetRelationshipStatuses.length > 0 && (
                            <span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 text-xs rounded">
                              {event.targetRelationshipStatuses.join(", ")}
                            </span>
                          )}
                          {event.targetCountries.length > 0 && (
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">
                              {event.targetCountries.join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingEvent(event);
                            setShowEventModal(true);
                          }}
                          className="px-3 py-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="px-3 py-1 text-sm text-red-500 hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === "subscribers" && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
            {calendar.subscribers.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-[var(--muted-foreground)]">No subscribers yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                        Gender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                        Country
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                        Platform
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {calendar.subscribers.map((subscriber) => (
                      <tr key={subscriber.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                          {subscriber.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)]">
                          {subscriber.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)] capitalize">
                          {subscriber.gender}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)]">
                          {calculateAge(new Date(subscriber.dob))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)]">
                          {subscriber.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)] capitalize">
                          {subscriber.relationshipStatus}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)] capitalize">
                          {subscriber.platform || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted-foreground)]">
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          calendarId={calendar.id}
          event={editingEvent}
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
          onSaved={() => {
            setShowEventModal(false);
            setEditingEvent(null);
            fetchCalendar();
          }}
        />
      )}
    </div>
  );
}

function EventModal({
  calendarId,
  event,
  onClose,
  onSaved,
}: {
  calendarId: string;
  event: Event | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEditing = !!event;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [startTime, setStartTime] = useState(
    event ? new Date(event.startTime).toISOString().slice(0, 16) : ""
  );
  const [endTime, setEndTime] = useState(
    event ? new Date(event.endTime).toISOString().slice(0, 16) : ""
  );
  const [location, setLocation] = useState(event?.location || "");
  const [status, setStatus] = useState(event?.status || "confirmed");
  const [targetGenders, setTargetGenders] = useState<string[]>(event?.targetGenders || []);
  const [targetAgeMin, setTargetAgeMin] = useState(event?.targetAgeMin?.toString() || "");
  const [targetAgeMax, setTargetAgeMax] = useState(event?.targetAgeMax?.toString() || "");
  const [targetRelationshipStatuses, setTargetRelationshipStatuses] = useState<string[]>(
    event?.targetRelationshipStatuses || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = {
      title,
      description: description || null,
      startTime,
      endTime,
      location: location || null,
      status,
      targetGenders,
      targetAgeMin: targetAgeMin ? parseInt(targetAgeMin) : null,
      targetAgeMax: targetAgeMax ? parseInt(targetAgeMax) : null,
      targetRelationshipStatuses,
      targetCountries: [],
    };

    try {
      const url = isEditing
        ? `/api/admin/events/${event.id}`
        : `/api/admin/calendars/${calendarId}/events`;

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || "Failed to save event");
        return;
      }

      onSaved();
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleGender = (gender: string) => {
    setTargetGenders((prev) =>
      prev.includes(gender)
        ? prev.filter((g) => g !== gender)
        : [...prev, gender]
    );
  };

  const toggleStatus = (s: string) => {
    setTargetRelationshipStatuses((prev) =>
      prev.includes(s) ? prev.filter((rs) => rs !== s) : [...prev, s]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4 py-8">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl w-full max-w-2xl">
          <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between sticky top-0 bg-[var(--card)] rounded-t-xl z-10">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              {isEditing ? "Edit Event" : "Create Event"}
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                placeholder="House on the Rock, Port Harcourt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                <option value="confirmed">Confirmed</option>
                <option value="tentative">Tentative</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Targeting */}
          <div className="border-t border-[var(--border)] pt-6">
            <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
              Audience Targeting
              <span className="ml-2 text-[var(--muted-foreground)] font-normal">
                (leave empty to target everyone)
              </span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--muted-foreground)] mb-2">
                  Gender
                </label>
                <div className="flex gap-3">
                  {["male", "female"].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => toggleGender(gender)}
                      className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                        targetGenders.includes(gender)
                          ? "bg-[var(--accent)] text-black"
                          : "bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]"
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--muted-foreground)] mb-2">
                    Min Age
                  </label>
                  <input
                    type="number"
                    value={targetAgeMin}
                    onChange={(e) => setTargetAgeMin(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    min="0"
                    max="120"
                    placeholder="Any"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--muted-foreground)] mb-2">
                    Max Age
                  </label>
                  <input
                    type="number"
                    value={targetAgeMax}
                    onChange={(e) => setTargetAgeMax(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    min="0"
                    max="120"
                    placeholder="Any"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[var(--muted-foreground)] mb-2">
                  Relationship Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {["single", "married", "divorced", "widowed"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleStatus(s)}
                      className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                        targetRelationshipStatuses.includes(s)
                          ? "bg-[var(--accent)] text-black"
                          : "bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[var(--border)] text-[var(--foreground)] rounded-lg hover:bg-[var(--background)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-[var(--accent)] text-black font-medium rounded-lg hover:bg-[var(--accent)]/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
