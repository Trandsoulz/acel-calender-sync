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

const interestOptions = [
  { id: "sunday-service", label: "Sunday Services" },
  { id: "midweek-service", label: "Midweek Services" },
  { id: "youth", label: "Youth Programs" },
  { id: "women", label: "Women's Fellowship" },
  { id: "men", label: "Men's Fellowship" },
  { id: "children", label: "Children's Programs" },
  { id: "singles", label: "Singles Programs" },
  { id: "couples", label: "Couples/Marriage Programs" },
  { id: "special-events", label: "Special Events & Conferences" },
  { id: "outreach", label: "Outreach & Community Service" },
];

const countryOptions = [
  "Nigeria",
  "Ghana",
  "United Kingdom",
  "United States",
  "Canada",
  "South Africa",
  "Other",
];

const platformOptions = [
  { id: "google", label: "Google Calendar", icon: "📅" },
  { id: "apple", label: "Apple Calendar", icon: "🍎" },
  { id: "outlook", label: "Microsoft Outlook", icon: "📧" },
  { id: "other", label: "Other", icon: "📆" },
];

export default function SubscribePage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [calendarUrl, setCalendarUrl] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (interestId: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((i) => i !== interestId)
        : [...prev.interests, interestId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate a unique token for the subscriber
    const feedToken = crypto.randomUUID();

    // Save to localStorage for now
    const subscriber = {
      ...formData,
      feedToken,
      subscribedAt: new Date().toISOString(),
    };

    // Get existing subscribers from localStorage
    const existingSubscribers = JSON.parse(
      localStorage.getItem("subscribers") || "[]"
    );

    // Add new subscriber
    localStorage.setItem(
      "subscribers",
      JSON.stringify([...existingSubscribers, subscriber])
    );

    // Generate calendar URL (this would be a real URL in production)
    const baseUrl = window.location.origin;
    const generatedUrl = `${baseUrl}/calendar/hotr-phc/feed/${feedToken}.ics`;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setCalendarUrl(generatedUrl);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const isStep1Valid =
    formData.firstName && formData.lastName && formData.email;
  const isStep2Valid =
    formData.gender && formData.dateOfBirth && formData.relationshipStatus;
  const isStep3Valid = formData.interests.length > 0 && formData.platform;

  if (isSuccess) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              {/* Success Icon */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg
                  className="h-10 w-10 text-green-600 dark:text-green-400"
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

              <h1 className="mt-6 text-3xl font-bold text-foreground">
                You&apos;re All Set! 🎉
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Welcome to the HOTR Port Harcourt calendar community,{" "}
                {formData.firstName}! Your personalized calendar feed is ready.
              </p>

              {/* Calendar URL Box */}
              <div className="mt-8 rounded-2xl bg-muted p-6 ring-1 ring-border">
                <h2 className="text-lg font-semibold text-foreground">
                  Your Personal Calendar Link
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Copy this link and add it to your calendar app
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    readOnly
                    value={calendarUrl}
                    className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => navigator.clipboard.writeText(calendarUrl)}
                  >
                    Copy Link
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-8 text-left rounded-2xl bg-muted/50 p-6 ring-1 ring-border">
                <h3 className="font-semibold text-foreground">
                  How to add to your calendar:
                </h3>
                <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                  {formData.platform === "google" && (
                    <div>
                      <p className="font-medium text-foreground">
                        Google Calendar:
                      </p>
                      <ol className="mt-2 list-decimal list-inside space-y-1">
                        <li>Open Google Calendar on your computer</li>
                        <li>
                          Click the &quot;+&quot; next to &quot;Other
                          calendars&quot;
                        </li>
                        <li>Select &quot;From URL&quot;</li>
                        <li>Paste your calendar link and click &quot;Add calendar&quot;</li>
                      </ol>
                    </div>
                  )}
                  {formData.platform === "apple" && (
                    <div>
                      <p className="font-medium text-foreground">
                        Apple Calendar:
                      </p>
                      <ol className="mt-2 list-decimal list-inside space-y-1">
                        <li>Open Calendar app on your iPhone/Mac</li>
                        <li>Go to File → New Calendar Subscription</li>
                        <li>Paste your calendar link</li>
                        <li>Click Subscribe</li>
                      </ol>
                    </div>
                  )}
                  {formData.platform === "outlook" && (
                    <div>
                      <p className="font-medium text-foreground">Outlook:</p>
                      <ol className="mt-2 list-decimal list-inside space-y-1">
                        <li>Open Outlook Calendar</li>
                        <li>Click &quot;Add calendar&quot; → &quot;Subscribe from web&quot;</li>
                        <li>Paste your calendar link</li>
                        <li>Click Import</li>
                      </ol>
                    </div>
                  )}
                  {formData.platform === "other" && (
                    <div>
                      <p className="font-medium text-foreground">
                        Other Calendar Apps:
                      </p>
                      <p className="mt-2">
                        Look for an option to &quot;Subscribe to calendar&quot; or &quot;Add
                        calendar from URL&quot; in your calendar app settings, then
                        paste your calendar link.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/">
                  <Button variant="secondary" size="lg">
                    Back to Home
                  </Button>
                </Link>
                <Link href="/learn-more">
                  <Button variant="outline" size="lg">
                    Learn More
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
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                        step >= s
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground ring-1 ring-border"
                      }`}
                    >
                      {s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`h-0.5 w-20 sm:w-28 transition-colors ${
                          step > s ? "bg-accent" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center md:gap-20 gap-16 text-sm">
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
                <span
                  className={
                    step >= 3 ? "text-foreground font-medium" : "text-muted-foreground"
                  }
                >
                  Preferences
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

                {/* Step 3: Preferences */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-foreground">
                      Your Preferences
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        What events are you interested in? *
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {interestOptions.map((interest) => (
                          <label
                            key={interest.id}
                            className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                              formData.interests.includes(interest.id)
                                ? "border-accent bg-accent/10"
                                : "border-border bg-background hover:border-accent/50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.interests.includes(interest.id)}
                              onChange={() => handleInterestChange(interest.id)}
                              className="sr-only"
                            />
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded border ${
                                formData.interests.includes(interest.id)
                                  ? "border-accent bg-accent text-accent-foreground"
                                  : "border-border"
                              }`}
                            >
                              {formData.interests.includes(interest.id) && (
                                <svg
                                  className="h-3 w-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={3}
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-foreground">
                              {interest.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Which calendar app do you use? *
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {platformOptions.map((platform) => (
                          <label
                            key={platform.id}
                            className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                              formData.platform === platform.id
                                ? "border-accent bg-accent/10"
                                : "border-border bg-background hover:border-accent/50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="platform"
                              value={platform.id}
                              checked={formData.platform === platform.id}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <span className="text-2xl">{platform.icon}</span>
                            <span className="text-sm text-foreground">
                              {platform.label}
                            </span>
                          </label>
                        ))}
                      </div>
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

                {step < 3 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={nextStep}
                    disabled={
                      (step === 1 && !isStep1Valid) ||
                      (step === 2 && !isStep2Valid)
                    }
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
                    disabled={!isStep3Valid || isSubmitting}
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
                            d="M4.5 12.75l6 6 9-13.5"
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
