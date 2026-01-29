"use client";

import { useState, useEffect, use, useMemo, useRef } from "react";
import Link from "next/link";
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
}

interface SubscriptionUrls {
  icsUrl: string;
  googleUrl: string;
  appleUrl: string;
  outlookUrl: string;
}

interface CalendarInfo {
  name: string;
  slug: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  country: "",
  relationshipStatus: "",
};

// All countries list
const allCountries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
  "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export default function CalendarSubscribePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return allCountries;
    return allCountries.filter(country => 
      country.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [subscriptionUrls, setSubscriptionUrls] = useState<SubscriptionUrls | null>(null);
  const [subscriberId, setSubscriberId] = useState<string | null>(null);
  const [calendar, setCalendar] = useState<CalendarInfo | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendar();
  }, [resolvedParams.slug]);

  const fetchCalendar = async () => {
    try {
      const response = await fetch(`/api/calendars/${resolvedParams.slug}`);
      if (!response.ok) {
        setError("Calendar not found");
        return;
      }
      const data = await response.json();
      setCalendar({ name: data.name, slug: data.slug });
    } catch {
      setError("Failed to load calendar");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

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
          calendarSlug: resolvedParams.slug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Subscription failed");
      }

      setSubscriptionUrls(data.urls);
      setSubscriberId(data.subscriber.id);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const isStep1Valid =
    formData.firstName && formData.lastName && formData.email;
  const isStep2Valid =
    formData.gender && formData.dateOfBirth && formData.country && formData.relationshipStatus;

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

  if (error && !calendar) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-20">
          <Container>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-4">{error}</h1>
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

  if (isSuccess && subscriptionUrls) {
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
                Welcome to {calendar?.name}! Choose your calendar app below to sync your personalized events.
              </p>

              {/* Sync Buttons */}
              <div className="mt-8 space-y-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Sync with your calendar
                </h2>
                
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Google Calendar */}
                  <a
                    href={subscriptionUrls.googleUrl}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl bg-muted hover:bg-muted/80 ring-1 ring-border hover:ring-accent transition-all"
                  >
                    <div className="w-12 h-12 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-10 h-10">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <span className="font-medium text-foreground">Google Calendar</span>
                  </a>

                  {/* Apple Calendar */}
                  <a
                    href={subscriptionUrls.appleUrl}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl bg-muted hover:bg-muted/80 ring-1 ring-border hover:ring-accent transition-all"
                  >
                    <div className="w-12 h-12 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                    <span className="font-medium text-foreground">Apple Calendar</span>
                  </a>

                  {/* Outlook */}
                  <a
                    href={subscriptionUrls.outlookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 p-6 rounded-xl bg-muted hover:bg-muted/80 ring-1 ring-border hover:ring-accent transition-all"
                  >
                    <div className="w-12 h-12 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-10 h-10">
                        <path fill="#0078D4" d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.23-.578.23h-8.547v-6.959l1.6 1.229c.102.086.227.13.379.13.151 0 .277-.044.379-.13l7.005-5.377v-.177zm-.816-1.158L15.637 12l-1.453-1.113V5.18h8.184c.226 0 .419.076.578.228.158.152.238.346.238.576v.245zM13.184 5.18v13.491H.816c-.227 0-.42-.076-.578-.229C.08 18.289 0 18.096 0 17.867V5.424c0-.23.08-.424.238-.576.158-.152.351-.228.578-.228h12.368v.56zM8 15.5c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2z"/>
                      </svg>
                    </div>
                    <span className="font-medium text-foreground">Outlook</span>
                  </a>
                </div>

                {/* Copy Link Option */}
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    Or copy the calendar link to add manually:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={subscriptionUrls.icsUrl}
                      className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(subscriptionUrls.icsUrl);
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mobile Setup Instructions */}
              <div className="mt-8 rounded-xl bg-blue-500/10 border border-blue-500/20 p-6 text-left">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                  📱 Mobile Users - Enable Your Calendar
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  After clicking a sync button above, you may need to enable the calendar in your app:
                </p>
                <div className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Google Calendar (Android/iOS)</p>
                      <p className="text-muted-foreground">Open app → Tap ☰ menu → Find &quot;HOTR Port Harcourt&quot; → Check the box to show events</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Apple Calendar (iPhone/iPad)</p>
                      <p className="text-muted-foreground">Settings → Calendar → Accounts → Tap the subscribed calendar → Toggle &quot;Show&quot; on</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                        <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.57-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V12z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Outlook (Android/iOS)</p>
                      <p className="text-muted-foreground">Open app → Tap profile icon → Settings → Enable calendar under &quot;Subscribed Calendars&quot;</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href={`/calendars/${resolvedParams.slug}`}>
                  <Button variant="ghost">← Back to Calendar</Button>
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
          <div className="mx-auto max-w-xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                Subscribe to {calendar?.name}
              </h1>
              <p className="mt-2 text-muted-foreground">
                Fill in your details to receive personalized event updates
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <div className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                      step >= 1
                        ? "bg-accent text-black"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    1
                  </div>
                  <div
                    className={`h-1 w-16 ${
                      step >= 2 ? "bg-accent" : "bg-muted"
                    }`}
                  />
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                      step >= 2
                        ? "bg-accent text-black"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    2
                  </div>
                </div>
              </div>
              <div className="mt-2 flex justify-center gap-12 text-sm">
                <span className={step >= 1 ? "text-accent" : "text-muted-foreground"}>
                  Basic Info
                </span>
                <span className={step >= 2 ? "text-accent" : "text-muted-foreground"}>
                  About You
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-muted rounded-2xl p-6 ring-1 ring-border">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="+234..."
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStep1Valid}
                    className="w-full mt-4"
                  >
                    Continue
                  </Button>
                </div>
              )}

              {/* Step 2: About You */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                  </div>

                  <div className="relative" ref={countryDropdownRef}>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={formData.country || countrySearch}
                      onChange={(e) => {
                        setCountrySearch(e.target.value);
                        setFormData((prev) => ({ ...prev, country: "" }));
                        setShowCountryDropdown(true);
                      }}
                      onFocus={() => setShowCountryDropdown(true)}
                      placeholder="Search for a country..."
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    />
                    {showCountryDropdown && (
                      <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-background border border-border rounded-lg shadow-lg">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country) => (
                            <button
                              key={country}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, country }));
                                setCountrySearch("");
                                setShowCountryDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-muted text-foreground transition-colors"
                            >
                              {country}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-muted-foreground">No countries found</div>
                        )}
                      </div>
                    )}
                    {/* Hidden input to maintain form validation */}
                    <input type="hidden" name="country" value={formData.country} required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Relationship Status *
                    </label>
                    <select
                      name="relationshipStatus"
                      value={formData.relationshipStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      required
                    >
                      <option value="">Select status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isStep2Valid || isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Subscribing..." : "Subscribe"}
                    </Button>
                  </div>
                </div>
              )}
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link href={`/calendars/${resolvedParams.slug}`} className="hover:text-accent">
                ← Back to Calendar
              </Link>
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
