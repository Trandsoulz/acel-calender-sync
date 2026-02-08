import Link from "next/link";
import { Navbar, Footer } from "@/app/_components/layout";
import { Container } from "@/app/_components/ui/container";

export const metadata = {
    title: "Terms of Service | HOTR Calendar",
    description: "Terms of Service for HOTR Calendar - House on the Rock Port Harcourt Calendar Subscription Service",
};

export default function TermsOfServicePage() {
    const effectiveDate = "February 7, 2026";
    const lastUpdated = "February 7, 2026";

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                <Container size="md">
                    <div className="prose prose-slate max-w-none">
                        {/* Header */}
                        <div className="mb-12 text-center">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                                Terms of Service
                            </h1>
                            <p className="text-muted-foreground">
                                Effective Date: {effectiveDate} | Last Updated: {lastUpdated}
                            </p>
                        </div>

                        {/* Introduction */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction and Acceptance</h2>
                            <p className="text-muted-foreground mb-4">
                                Welcome to HOTR Calendar (&quot;Service&quot;), a calendar subscription service operated by
                                House on the Rock Port Harcourt (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service
                                (&quot;Terms&quot;) govern your access to and use of our website located at{" "}
                                <Link href="/" className="text-accent hover:text-accent-dark">
                                    hotr-calendar.vercel.app
                                </Link>{" "}
                                and all related services.
                            </p>
                            <p className="text-muted-foreground mb-4">
                                By accessing or using our Service, you agree to be bound by these Terms and our{" "}
                                <Link href="/privacy-policy" className="text-accent hover:text-accent-dark">
                                    Privacy Policy
                                </Link>
                                . If you do not agree to these Terms, you may not access or use the Service.
                            </p>
                            <p className="text-muted-foreground">
                                These Terms are governed by the laws of the Federal Republic of Nigeria, including
                                the Nigeria Data Protection Act 2023, Consumer Protection Council Act, and other
                                applicable laws and regulations.
                            </p>
                        </section>

                        {/* Description of Service */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
                            <p className="text-muted-foreground mb-4">
                                HOTR Calendar is a free calendar subscription service that enables members and
                                attendees of House on the Rock Port Harcourt to:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                                <li>Subscribe to personalized church event calendars</li>
                                <li>Receive event notifications based on age group, gender, and interests</li>
                                <li>Sync church events with Google Calendar, Apple Calendar, Microsoft Outlook, and other calendar applications</li>
                                <li>Stay updated on services, programs, and special events</li>
                            </ul>
                            <p className="text-muted-foreground">
                                The Service is provided free of charge as a ministry tool to help our community
                                stay connected with church activities.
                            </p>
                        </section>

                        {/* User Registration */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">3. User Registration and Account</h2>

                            <h3 className="text-lg font-medium text-foreground mb-3">3.1 Registration Requirements</h3>
                            <p className="text-muted-foreground mb-4">
                                To use certain features of our Service, you must provide accurate and complete
                                information during the subscription process. You agree to:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                                <li>Provide truthful, accurate, and current information</li>
                                <li>Update your information if it changes</li>
                                <li>Keep any calendar subscription links private and secure</li>
                                <li>Not share your subscription links with unauthorized persons</li>
                            </ul>

                            <h3 className="text-lg font-medium text-foreground mb-3">3.2 Eligibility</h3>
                            <p className="text-muted-foreground mb-4">
                                Our Service is available to individuals of all ages. For users under 18 years of age,
                                we recommend parental or guardian supervision during registration. By using the Service,
                                you represent that:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>You have the legal capacity to enter into these Terms</li>
                                <li>If under 18, you have obtained parental or guardian consent</li>
                                <li>You are not prohibited by law from using the Service</li>
                            </ul>
                        </section>

                        {/* User Conduct */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">4. User Conduct and Responsibilities</h2>
                            <p className="text-muted-foreground mb-4">
                                You agree to use our Service responsibly and in accordance with these Terms. You shall NOT:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Use the Service for any unlawful purpose or in violation of Nigerian law</li>
                                <li>Attempt to gain unauthorized access to our systems or other users&apos; data</li>
                                <li>Interfere with or disrupt the Service or servers connected to the Service</li>
                                <li>Use automated systems to access the Service without our express permission</li>
                                <li>Share false or misleading information during registration</li>
                                <li>Impersonate any person or entity</li>
                                <li>Use the Service to distribute spam, malware, or unauthorized advertising</li>
                                <li>Attempt to reverse engineer, decompile, or extract source code from the Service</li>
                                <li>Redistribute subscription links or content without authorization</li>
                            </ul>
                        </section>

                        {/* Google OAuth */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">5. Third-Party Services (Google Integration)</h2>
                            <p className="text-muted-foreground mb-4">
                                Our Service integrates with Google services for authentication and calendar functionality.
                                By using these features, you acknowledge and agree that:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                                <li>Your use of Google services is subject to Google&apos;s Terms of Service and Privacy Policy</li>
                                <li>We may access your Google profile information and calendar as described in our Privacy Policy</li>
                                <li>You can revoke Google access at any time through your Google Account settings</li>
                                <li>We are not responsible for Google&apos;s practices or any changes to their services</li>
                            </ul>
                            <p className="text-muted-foreground">
                                For calendar applications other than Google Calendar, integration is provided through
                                standard iCal/ICS protocols. We are not responsible for third-party calendar application
                                functionality.
                            </p>
                        </section>

                        {/* Intellectual Property */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">6. Intellectual Property Rights</h2>

                            <h3 className="text-lg font-medium text-foreground mb-3">6.1 Our Intellectual Property</h3>
                            <p className="text-muted-foreground mb-4">
                                The Service, including its original content, features, functionality, and branding
                                (excluding user-provided content), is and will remain the exclusive property of
                                House on the Rock Port Harcourt and its licensors. This includes:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                                <li>The HOTR Calendar name, logo, and branding</li>
                                <li>Website design, layout, and user interface</li>
                                <li>Software code and technical implementations</li>
                                <li>Event descriptions and church-related content</li>
                            </ul>

                            <h3 className="text-lg font-medium text-foreground mb-3">6.2 Limited License</h3>
                            <p className="text-muted-foreground">
                                We grant you a limited, non-exclusive, non-transferable license to access and use
                                the Service for your personal, non-commercial use, subject to these Terms.
                            </p>
                        </section>

                        {/* Service Availability */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">7. Service Availability and Modifications</h2>

                            <h3 className="text-lg font-medium text-foreground mb-3">7.1 Availability</h3>
                            <p className="text-muted-foreground mb-4">
                                While we strive to provide continuous access to our Service, we do not guarantee
                                uninterrupted availability. The Service may be temporarily unavailable due to:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                                <li>Scheduled maintenance and updates</li>
                                <li>Technical issues or system failures</li>
                                <li>Factors beyond our reasonable control</li>
                            </ul>

                            <h3 className="text-lg font-medium text-foreground mb-3">7.2 Modifications</h3>
                            <p className="text-muted-foreground">
                                We reserve the right to modify, suspend, or discontinue any part of the Service
                                at any time, with or without notice. We will make reasonable efforts to notify
                                users of significant changes.
                            </p>
                        </section>

                        {/* Disclaimer of Warranties */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">8. Disclaimer of Warranties</h2>
                            <p className="text-muted-foreground mb-4">
                                THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS, WITHOUT WARRANTIES
                                OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                                <li>Implied warranties of merchantability and fitness for a particular purpose</li>
                                <li>Warranties that the Service will be uninterrupted, secure, or error-free</li>
                                <li>Warranties regarding the accuracy or reliability of event information</li>
                                <li>Warranties that the Service will meet your specific requirements</li>
                            </ul>
                            <p className="text-muted-foreground">
                                Event dates, times, and details are provided as a convenience and may be subject
                                to change. Users should verify important event information through official church
                                channels.
                            </p>
                        </section>

                        {/* Limitation of Liability */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">9. Limitation of Liability</h2>
                            <p className="text-muted-foreground mb-4">
                                TO THE MAXIMUM EXTENT PERMITTED BY NIGERIAN LAW, HOUSE ON THE ROCK PORT HARCOURT,
                                ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS SHALL NOT BE LIABLE FOR:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                                <li>Loss of profits, data, or other intangible losses</li>
                                <li>Damages resulting from your use or inability to use the Service</li>
                                <li>Damages resulting from unauthorized access to your personal data</li>
                                <li>Damages resulting from errors, omissions, or inaccuracies in event information</li>
                            </ul>
                            <p className="text-muted-foreground">
                                This limitation applies regardless of the legal theory under which damages are claimed,
                                whether we have been advised of the possibility of such damages, and even if a remedy
                                set forth herein is found to have failed its essential purpose.
                            </p>
                        </section>

                        {/* Indemnification */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">10. Indemnification</h2>
                            <p className="text-muted-foreground">
                                You agree to indemnify, defend, and hold harmless House on the Rock Port Harcourt,
                                its affiliates, officers, directors, employees, and agents from and against any claims,
                                liabilities, damages, losses, costs, or expenses (including reasonable legal fees)
                                arising out of or in connection with:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                                <li>Your use of the Service</li>
                                <li>Your violation of these Terms</li>
                                <li>Your violation of any rights of another person or entity</li>
                                <li>Any false or misleading information you provide</li>
                            </ul>
                        </section>

                        {/* Termination */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">11. Termination</h2>

                            <h3 className="text-lg font-medium text-foreground mb-3">11.1 Your Right to Terminate</h3>
                            <p className="text-muted-foreground mb-4">
                                You may stop using the Service at any time by:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                                <li>Removing the calendar subscription from your calendar application</li>
                                <li>Revoking Google access (if applicable) through your Google Account settings</li>
                                <li>Contacting us to request deletion of your subscription</li>
                            </ul>

                            <h3 className="text-lg font-medium text-foreground mb-3">11.2 Our Right to Terminate</h3>
                            <p className="text-muted-foreground mb-4">
                                We may terminate or suspend your access to the Service immediately, without prior
                                notice or liability, if you breach these Terms or for any other reason at our sole discretion.
                            </p>

                            <h3 className="text-lg font-medium text-foreground mb-3">11.3 Effect of Termination</h3>
                            <p className="text-muted-foreground">
                                Upon termination, your right to use the Service will immediately cease. Provisions
                                of these Terms that should survive termination will remain in effect, including
                                intellectual property, disclaimers, limitations of liability, and indemnification.
                            </p>
                        </section>

                        {/* Dispute Resolution */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">12. Dispute Resolution</h2>

                            <h3 className="text-lg font-medium text-foreground mb-3">12.1 Informal Resolution</h3>
                            <p className="text-muted-foreground mb-4">
                                For any dispute arising from these Terms or the Service, we encourage you to first
                                contact us directly to seek an informal resolution. We will endeavor to resolve
                                disputes amicably within 30 days.
                            </p>

                            <h3 className="text-lg font-medium text-foreground mb-3">12.2 Governing Law</h3>
                            <p className="text-muted-foreground mb-4">
                                These Terms shall be governed by and construed in accordance with the laws of the
                                Federal Republic of Nigeria, without regard to conflict of law principles.
                            </p>

                            <h3 className="text-lg font-medium text-foreground mb-3">12.3 Jurisdiction</h3>
                            <p className="text-muted-foreground">
                                Any legal action or proceeding arising out of these Terms or the Service shall be
                                brought exclusively in the courts of competent jurisdiction located in Rivers State,
                                Nigeria. You consent to the jurisdiction of such courts and waive any objection to
                                venue in such courts.
                            </p>
                        </section>

                        {/* Severability */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">13. Severability</h2>
                            <p className="text-muted-foreground">
                                If any provision of these Terms is held to be invalid, illegal, or unenforceable by
                                a court of competent jurisdiction, the remaining provisions shall continue in full
                                force and effect. The invalid provision shall be modified to the minimum extent
                                necessary to make it valid and enforceable while preserving its intent.
                            </p>
                        </section>

                        {/* Entire Agreement */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">14. Entire Agreement</h2>
                            <p className="text-muted-foreground">
                                These Terms, together with our{" "}
                                <Link href="/privacy-policy" className="text-accent hover:text-accent-dark">
                                    Privacy Policy
                                </Link>
                                , constitute the entire agreement between you and House on the Rock Port Harcourt
                                regarding your use of the Service. These Terms supersede any prior agreements,
                                communications, or understandings, whether written or oral, concerning the subject
                                matter hereof.
                            </p>
                        </section>

                        {/* Changes to Terms */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">15. Changes to These Terms</h2>
                            <p className="text-muted-foreground mb-4">
                                We reserve the right to modify these Terms at any time. When we make changes, we will:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                                <li>Update the &quot;Last Updated&quot; date at the top of this page</li>
                                <li>Post the revised Terms on this page</li>
                                <li>For significant changes, provide notice through the Service or via email (if available)</li>
                            </ul>
                            <p className="text-muted-foreground">
                                Your continued use of the Service after any modifications indicates your acceptance
                                of the updated Terms. We encourage you to review these Terms periodically.
                            </p>
                        </section>

                        {/* Contact Information */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">16. Contact Information</h2>
                            <p className="text-muted-foreground mb-4">
                                If you have any questions, concerns, or feedback about these Terms of Service,
                                please contact us:
                            </p>
                            <div className="bg-muted rounded-lg p-6">
                                <p className="text-foreground font-medium">House on the Rock Port Harcourt</p>
                                <p className="text-muted-foreground">Port Harcourt, Rivers State, Nigeria</p>
                                <p className="text-muted-foreground mt-2">
                                    Email:{" "}
                                    <a href="mailto:info@hotrportharcourt.com" className="text-accent hover:text-accent-dark">
                                        info@hotrportharcourt.com
                                    </a>
                                </p>
                                <p className="text-muted-foreground">
                                    Website:{" "}
                                    <a
                                        href="https://hotrportharcourt.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent hover:text-accent-dark"
                                    >
                                        hotrportharcourt.com
                                    </a>
                                </p>
                            </div>
                        </section>

                        {/* Acknowledgment */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">17. Acknowledgment</h2>
                            <p className="text-muted-foreground">
                                BY USING OUR SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE
                                TO BE BOUND BY THESE TERMS OF SERVICE AND OUR PRIVACY POLICY.
                            </p>
                        </section>

                        {/* Back to Home */}
                        <div className="mt-12 text-center">
                            <Link
                                href="/"
                                className="inline-flex items-center text-accent hover:text-accent-dark transition-colors"
                            >
                                <svg
                                    className="mr-2 h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                                    />
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </>
    );
}
