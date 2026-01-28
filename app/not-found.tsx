import Link from "next/link";
import Image from "next/image";
import { Container } from "@/app/_components/ui/container";
import { Button } from "@/app/_components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Container>
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
          {/* Logo */}
          <Link href="/" className="mb-8">
            <Image
              src="/logo.png"
              alt="HOTR Port Harcourt"
              width={80}
              height={80}
              className="dark:invert"
            />
          </Link>

          {/* 404 Number */}
          <div className="relative">
            <h1 className="text-[150px] sm:text-[200px] font-bold text-accent/20 leading-none select-none">
              404
            </h1>
          </div>

          {/* Message */}
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            Oops! It looks like this page has wandered off. Don&apos;t worry,
            let&apos;s get you back on track.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/">
              <Button variant="secondary" size="lg">
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
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                Go Home
              </Button>
            </Link>
            <Link href="/subscribe">
              <Button variant="outline" size="lg">
                Subscribe to Calendar
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Here are some helpful links:
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Home
              </Link>
              <Link
                href="/learn-more"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Learn More
              </Link>
              <Link
                href="/subscribe"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Subscribe
              </Link>
              <a
                href="https://hotrportharcourt.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                HOTR Website
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* Footer */}
      <div className="py-6 border-t border-border">
        <Container>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} House on the Rock Port Harcourt. All
            rights reserved.
          </p>
        </Container>
      </div>
    </div>
  );
}
