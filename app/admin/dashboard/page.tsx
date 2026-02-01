"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/app/_components/ui/logo";

interface Calendar {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  _count: {
    events: number;
    subscribers: number;
  };
}

interface Admin {
  id: string;
  email: string;
  name: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/me");
      if (!response.ok) {
        router.push("/admin/login");
        return;
      }
      const data = await response.json();
      setAdmin(data.admin);
      fetchCalendars();
    } catch {
      router.push("/admin/login");
    }
  };

  const fetchCalendars = async () => {
    try {
      const response = await fetch("/api/admin/calendars");
      if (response.ok) {
        const data = await response.json();
        setCalendars(data.calendars);
      }
    } catch (error) {
      console.error("Failed to fetch calendars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-[var(--muted-foreground)] text-xs sm:text-sm hidden sm:inline">
              {admin?.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
              Dashboard
            </h1>
            <p className="text-[var(--muted-foreground)] text-sm sm:text-base mt-1">
              Manage your calendars and events
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-[var(--accent)] text-black font-medium rounded-lg hover:bg-[var(--accent)]/90 transition-colors text-center"
          >
            + New Calendar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 sm:p-6">
            <p className="text-[var(--muted-foreground)] text-xs sm:text-sm">Calendars</p>
            <p className="text-xl sm:text-3xl font-bold text-[var(--foreground)] mt-1">
              {calendars.length}
            </p>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 sm:p-6">
            <p className="text-[var(--muted-foreground)] text-xs sm:text-sm">Events</p>
            <p className="text-xl sm:text-3xl font-bold text-[var(--foreground)] mt-1">
              {calendars.reduce((sum, cal) => sum + cal._count.events, 0)}
            </p>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 sm:p-6">
            <p className="text-[var(--muted-foreground)] text-xs sm:text-sm">Subscribers</p>
            <p className="text-xl sm:text-3xl font-bold text-[var(--foreground)] mt-1">
              {calendars.reduce((sum, cal) => sum + cal._count.subscribers, 0)}
            </p>
          </div>
        </div>

        {/* Calendars List */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Calendars
            </h2>
          </div>
          
          {calendars.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[var(--muted-foreground)]">No calendars yet.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 text-[var(--accent)] hover:underline"
              >
                Create your first calendar
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {calendars.map((calendar) => (
                <Link
                  key={calendar.id}
                  href={`/admin/calendars/${calendar.id}`}
                  className="block px-4 sm:px-6 py-4 hover:bg-[var(--background)] transition-colors active:bg-[var(--background)]"
                >
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-[var(--foreground)] truncate">
                        {calendar.name}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)] mt-1 truncate">
                        /{calendar.slug}
                        {!calendar.isPublic && (
                          <span className="ml-2 px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-xs rounded">
                            Private
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)] mt-2 sm:hidden">
                        <span>{calendar._count.events} events</span>
                        <span>{calendar._count.subscribers} subs</span>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 text-sm text-[var(--muted-foreground)] flex-shrink-0">
                      <span>{calendar._count.events} events</span>
                      <span>{calendar._count.subscribers} subscribers</span>
                      <span className="text-[var(--accent)]">→</span>
                    </div>
                    <span className="text-[var(--accent)] sm:hidden flex-shrink-0">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Calendar Modal */}
      {showCreateModal && (
        <CreateCalendarModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            fetchCalendars();
          }}
        />
      )}
    </div>
  );
}

function CreateCalendarModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/calendars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, isPublic }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to create calendar");
        return;
      }

      onCreated();
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Create Calendar
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Youth Ministry Events"
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
              placeholder="Optional description..."
              rows={3}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 accent-[var(--accent)]"
            />
            <label htmlFor="isPublic" className="text-sm text-[var(--foreground)]">
              Make this calendar public
            </label>
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
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
