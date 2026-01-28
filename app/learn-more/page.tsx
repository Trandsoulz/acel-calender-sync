import Link from "next/link";
import Image from "next/image";
import { Navbar, Footer } from "@/app/_components/layout";
import { Container } from "@/app/_components/ui/container";
import { Button } from "@/app/_components/ui/button";
import { Accordion, AccordionItem } from "@/app/_components/ui/accordion";

const features = [
  {
    title: "Personalized Event Feed",
    description:
      "Get events tailored to your age group, interests, and preferences. No more irrelevant notifications – only what matters to you.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
        />
      </svg>
    ),
  },
  {
    title: "Automatic Calendar Sync",
    description:
      "Subscribe once and events automatically appear in your preferred calendar app – Google Calendar, Apple Calendar, or Outlook.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    ),
  },
  {
    title: "Real-Time Updates",
    description:
      "When events change or new ones are added, your calendar updates automatically. Stay in the loop without lifting a finger.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
    ),
  },
  {
    title: "Privacy First",
    description:
      "Your personal information is used solely to personalize your calendar feed. We never share your data with third parties.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
];

const steps = [
  {
    step: "1",
    title: "Fill Out Your Profile",
    description:
      "Tell us a bit about yourself – your name, age group, and preferences. This helps us show you relevant events.",
  },
  {
    step: "2",
    title: "Get Your Personal Calendar Link",
    description:
      "We'll generate a unique calendar subscription link just for you. This link contains your personalized event feed.",
  },
  {
    step: "3",
    title: "Add to Your Calendar App",
    description:
      "Copy the link and add it to Google Calendar, Apple Calendar, or Outlook. Events will sync automatically.",
  },
  {
    step: "4",
    title: "Stay Updated",
    description:
      "That's it! New events will appear in your calendar, and you'll never miss what matters to you.",
  },
];

const faqs = [
  {
    question: "What kind of events will I see?",
    answer:
      "You'll see HOTR Port Harcourt events that match your profile – Sunday services, midweek services, special programs, youth events, women's meetings, men's fellowship, and more. Events are filtered based on your age, gender, and interests.",
  },
  {
    question: "Is this free?",
    answer:
      "Yes, absolutely! This is a free service for the HOTR Port Harcourt community to help everyone stay connected with church events.",
  },
  {
    question: "Can I unsubscribe later?",
    answer:
      "Yes, you can remove the calendar subscription from your calendar app at any time. You can also contact us to delete your profile from our system.",
  },
  {
    question: "Which calendar apps are supported?",
    answer:
      "Any calendar app that supports ICS/iCal subscriptions – including Google Calendar, Apple Calendar (iPhone, iPad, Mac), Microsoft Outlook, and many others.",
  },
  {
    question: "Will I receive too many notifications?",
    answer:
      "No, that's the beauty of personalized feeds! You only see events relevant to you. Plus, you control notification settings in your calendar app.",
  },
];

export default function LearnMorePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-accent-light/30 via-background to-background" />
          </div>

          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-muted px-5 py-2.5 ring-1 ring-border">
                <Image
                  src="/logo.png"
                  alt="HOTR"
                  width={24}
                  height={24}
                  className="dark:invert"
                />
                <span className="text-sm font-medium text-foreground">
                  How It Works
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Your Personal{" "}
                <span className="text-accent">Church Calendar</span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Stay connected with House on the Rock Port Harcourt. Subscribe
                to receive personalized event updates directly in your calendar
                app – tailored to your interests and schedule.
              </p>
            </div>
          </Container>
        </section>

        {/* What We Do Section */}
        <section className="py-16 md:py-24 bg-muted/50">
          <Container>
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                What We Do
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We make it easy to stay informed about church events without the
                hassle of checking multiple sources.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="relative rounded-2xl bg-background p-6 shadow-sm ring-1 ring-border"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-primary text-primary-foreground">
          <Container>
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/70">
                Getting started takes less than 2 minutes. Here&apos;s how:
              </p>
            </div>

            <div className="mx-auto max-w-2xl">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary-foreground/20 -translate-x-1/2" />

                {steps.map((item, index) => (
                  <div
                    key={index}
                    className="relative pb-16 last:pb-0"
                  >
                    {/* Step number - centered on the line */}
                    <div className="absolute left-1/2 -translate-x-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-lg shadow-lg">
                      {item.step}
                    </div>

                    {/* Content card - alternating sides on desktop, below on mobile */}
                    <div
                      className={`pt-14 md:pt-0 md:w-[calc(50%-2rem)] ${
                        index % 2 === 0 
                          ? "md:pr-8 md:text-right" 
                          : "md:ml-auto md:pl-8 md:text-left"
                      }`}
                    >
                      <div className="rounded-xl bg-primary-foreground/10 backdrop-blur-sm p-6 border border-primary-foreground/10">
                        <h3 className="text-lg font-semibold">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-primary-foreground/70">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-muted/50">
          <Container>
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Got questions? We&apos;ve got answers.
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <Accordion>
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} title={faq.question} defaultOpen={index === 0}>
                    {faq.answer}
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join hundreds of HOTR Port Harcourt members who never miss an
                event.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/subscribe">
                  <Button variant="secondary" size="lg">
                    Subscribe Now
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
                <Link href="/">
                  <Button variant="outline" size="lg">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
