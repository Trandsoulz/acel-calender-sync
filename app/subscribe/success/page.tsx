"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Navbar, Footer } from "@/app/_components/layout";
import { Container } from "@/app/_components/ui/container";
import { Button } from "@/app/_components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "there";

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            {/* Success Icon */}
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 ring-4 ring-green-500/20">
              <svg
                className="h-12 w-12 text-green-500"
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
              Welcome, {name}! 🎉
            </h1>

            <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
              Your calendar subscription is ready!
            </p>

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

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
