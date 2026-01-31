"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar, Footer } from "@/app/_components/layout";
import { Container } from "@/app/_components/ui/container";
import { Button } from "@/app/_components/ui/button";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  country: string;
  relationshipStatus: string;
  interests: string[];
  platform: string;
}

interface SubscriptionUrls {
  icsUrl: string;
  googleUrl: string;
  appleUrl: string;
  outlookUrl: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  country: "Nigeria",
  relationshipStatus: "",
  interests: [],
  platform: "",
};

const countryOptions = [
  "Nigeria",
  "Ghana",
  "United Kingdom",
  "United States",
  "Canada",
  "South Africa",
  "Other",
];

export default function SubscribePage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [subscriptionUrls, setSubscriptionUrls] = useState<SubscriptionUrls | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone || null,
          gender: formData.gender,
          country: formData.country,
          relationshipStatus: formData.relationshipStatus,
          dob: formData.dateOfBirth,
          platform: formData.platform,
          interests: formData.interests,
          calendarSlug: "hotr-port-harcourt",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Subscription failed");
      }

      setSubscriptionUrls(data.urls);
      setIsSuccess(true);
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (subscriptionUrls) {
      navigator.clipboard.writeText(subscriptionUrls.icsUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSync = (platform: string) => {
    if (!subscriptionUrls) return;

    switch (platform) {
      case "google":
        window.open(subscriptionUrls.googleUrl, "_blank");
        break;
      case "apple":
        window.location.href = subscriptionUrls.appleUrl;
        break;
      case "outlook":
        window.open(subscriptionUrls.outlookUrl, "_blank");
        break;
      default:
        handleCopyLink();
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const isStep1Valid =
    formData.firstName && formData.lastName && formData.email;
  const isStep2Valid =
    formData.gender && formData.dateOfBirth && formData.relationshipStatus;

  if (isSuccess && subscriptionUrls) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              {/* Success Icon */}
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/5 ring-4 ring-accent/20">
                <svg
                  className="h-12 w-12 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>

              <h1 className="mt-8 text-3xl font-bold text-foreground sm:text-4xl">
                Welcome, {formData.firstName}! 🎉
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
                Your personalized HOTR calendar is ready. Sync it now to never miss an event!
              </p>

              {/* Sync Options */}
              <div className="mt-10">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Choose your calendar app:
                </h2>
                
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Google Calendar */}
                  <button
                    onClick={() => handleSync("google")}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-white/10 border border-border hover:border-accent hover:shadow-lg transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 p-0.5 shrink-0">
                      <div className="w-full h-full rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="font-medium text-foreground group-hover:text-accent transition-colors block">
                        Google Calendar
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Click to add
                      </span>
                    </div>
                  </button>

                  {/* Apple Calendar */}
                  <button
                    onClick={() => handleSync("apple")}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-white/10 border border-border hover:border-accent hover:shadow-lg transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shrink-0">
                      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <span className="font-medium text-foreground group-hover:text-accent transition-colors block">
                        Apple Calendar
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Opens Calendar app
                      </span>
                    </div>
                  </button>

                  {/* Outlook */}
                  <button
                    onClick={() => handleSync("outlook")}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-white/10 border border-border hover:border-accent hover:shadow-lg transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shrink-0">
                      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.57-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V12zm-6-8.25v3h3v-3zm0 4.5v3h3v-3zm0 4.5v1.83l3.05-1.83zm-5.25-9v3h3.75v-3zm0 4.5v3h3.75v-3zm0 4.5v2.03l2.41 1.5 1.34-.8v-2.73zM9 3.75V6h2l.13.01.12.04v-2.3zM5.98 15.98q.9 0 1.6-.3.7-.32 1.19-.86.48-.55.73-1.28.25-.74.25-1.61 0-.83-.25-1.55-.24-.71-.71-1.24t-1.15-.83q-.68-.3-1.55-.3-.92 0-1.64.3-.71.3-1.2.85-.5.54-.75 1.3-.25.74-.25 1.63 0 .85.26 1.56.26.72.74 1.23.48.52 1.17.81.69.3 1.56.3zM7.5 21h12.39L12 16.08V17q0 .41-.3.7-.29.3-.7.3H7.5zm15-.13v-7.24l-5.9 3.54Z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <span className="font-medium text-foreground group-hover:text-accent transition-colors block">
                        Outlook
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Click to add
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Copy Link Option */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">
                  Or copy your personal calendar link:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                  <input
                    type="text"
                    readOnly
                    value={subscriptionUrls.icsUrl}
                    className="flex-1 rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground font-mono truncate"
                  />
                  <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    className="shrink-0"
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                        Copy Link
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-10 rounded-2xl bg-accent/10 p-6 text-left">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Your calendar will stay updated!</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Events are automatically synced to your calendar. When we add new events or make changes, they&apos;ll appear in your calendar automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Users Info Box */}
              <div className="mt-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-6 text-left">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">📱 Mobile Users - Important!</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      After syncing, you may need to <strong className="text-foreground">enable the calendar</strong> in your app:
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span><strong className="text-foreground">Google Calendar:</strong> Open the app → Menu (☰) → Check the box next to &quot;HOTR Port Harcourt&quot;</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span><strong className="text-foreground">Apple Calendar:</strong> Settings → Calendar → Tap to enable the subscribed calendar</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        <span><strong className="text-foreground">Outlook:</strong> Open the app → Tap account icon → Enable the calendar under subscriptions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Back Home */}
              <div className="mt-10">
                <Link href="/">
                  <Button variant="ghost" size="lg">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Home
                  </Button>
                </Link>
              </div>
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
          <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-muted px-5 py-2.5 ring-1 ring-border">
                <Image
                  src="/logo.png"
                  alt="HOTR"
                  width={24}
                  height={24}
                  className="dark:invert"
                />
                <span className="text-sm font-medium text-foreground">
                  Subscribe to Calendar
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Get Your Personalized{" "}
                <span className="text-accent">Calendar Feed</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Tell us a bit about yourself so we can show you events that
                matter to you.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex items-center justify-center">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                        step >= s
                          ? "bg-accent text-black"
                          : "bg-muted text-muted-foreground ring-1 ring-border"
                      }`}
                    >
                      {s}
                    </div>
                    {s < 2 && (
                      <div
                        className={`h-0.5 w-24 sm:w-32 transition-colors ${
                          step > s ? "bg-accent" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center gap-24 sm:gap-32 text-sm">
                <span
                  className={
                    step >= 1 ? "text-foreground font-medium" : "text-muted-foreground"
                  }
                >
                  Basic Info
                </span>
                <span
                  className={
                    step >= 2 ? "text-foreground font-medium" : "text-muted-foreground"
                  }
                >
                  About You
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="rounded-2xl bg-muted/50 p-6 sm:p-8 ring-1 ring-border">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">
                      Basic Information
                    </h2>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="John"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="john.doe@example.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="+234 XXX XXX XXXX"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: About You */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">
                      About You
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      This helps us personalize your event feed.
                    </p>

                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Gender *
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        required
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Used to show age-appropriate events
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="relationshipStatus"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Relationship Status *
                      </label>
                      <select
                        id="relationshipStatus"
                        name="relationshipStatus"
                        required
                        value={formData.relationshipStatus}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="">Select status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="engaged">Engaged</option>
                        <option value="widowed">Widowed</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        {countryOptions.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={prevStep}
                  >
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                      />
                    </svg>
                    Previous
                  </Button>
                ) : (
                  <div />
                )}

                {step < 2 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={nextStep}
                    disabled={!isStep1Valid}
                    className="sm:ml-auto"
                  >
                    Next Step
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
                ) : (
                  <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    disabled={!isStep2Valid || isSubmitting}
                    className="sm:ml-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="mr-2 h-5 w-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Creating your feed...
                      </>
                    ) : (
                      <>
                        Get My Calendar
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
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>

            {/* Privacy Note */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Your information is secure and will only be used to personalize
              your calendar feed.{" "}
              <Link href="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
