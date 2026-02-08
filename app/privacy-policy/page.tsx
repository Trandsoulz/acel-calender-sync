import Link from "next/link";
import { Navbar, Footer } from "@/app/_components/layout";
import { Container } from "@/app/_components/ui/container";

export const metadata = {
    title: "Privacy Policy | HOTR Calendar",
    description: "Privacy Policy for HOTR Calendar - House on the Rock Port Harcourt Calendar Subscription Service",
};

export default function PrivacyPolicyPage() {
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
                                Privacy Policy
                            </h1>
                            <p className="text-muted-foreground">
                                Effective Date: {effectiveDate} | Last Updated: {lastUpdated}
                            </p>
                        </div>

                        {/* Introduction */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">1. Introduction</h2>
                            <p className="text-muted-foreground mb-4">
                                Welcome to HOTR Calendar (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), a calendar subscription
                                service operated by House on the Rock Port Harcourt. This Privacy Policy explains how we
                                collect, use, disclose, and safeguard your personal information when you use our website
                                and services at{" "}
                                <Link href="/" className="text-accent hover:text-accent-dark">
                                    hotr-calendar.vercel.app
                                </Link>{" "}
                                (the &quot;Service&quot;).
                            </p>
                            <p className="text-muted-foreground mb-4">
                                This Privacy Policy is prepared in compliance with the Nigeria Data Protection Regulation
                                (NDPR) 2019, the Nigeria Data Protection Act 2023 (NDPA), and other applicable data
                                protection laws. We are committed to protecting your privacy and ensuring transparency
                                in how we handle your personal data.
                            </p>
                            <p className="text-muted-foreground">
                                By using our Service, you consent to the collection and use of your information as
                                described in this Privacy Policy. If you do not agree with this policy, please do not
                                use our Service.
                            </p>
                        </section>

                        {/* Data Controller */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">2. Data Controller</h2>
                            <p className="text-muted-foreground mb-4">
                                The data controller responsible for your personal information is:
                            </p>
                            <div className="bg-muted rounded-lg p-6 mb-4">
                                <p className="text-foreground font-medium">House on the Rock Port Harcourt</p>
                                <p className="text-muted-foreground">Port Harcourt, Rivers State, Nigeria</p>
                                <p className="text-muted-foreground">
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

                        {/* Information We Collect */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">3. Information We Collect</h2>

                            <h3 className="text-lg font-medium text-foreground mb-3">3.1 Information You Provide Directly</h3>
                            <p className="text-muted-foreground mb-4">
                                When you subscribe to our calendar service, we collect the following personal information:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                                <li><span className="font-medium text-foreground">Full Name:</span> Your first and last name for personalization</li>
                                <li><span className="font-medium text-foreground">Email Address:</span> For communication and account identification</li>
                                <li><span className="font-medium text-foreground">Phone Number:</span> Optional, for additional contact purposes</li>
                                <li><span className="font-medium text-foreground">Date of Birth:</span> To determine your age group for relevant events</li>
                                <li><span className="font-medium text-foreground">Gender:</span> To personalize event recommendations</li>
                                <li><span className="font-medium text-foreground">Country:</span> To understand our user demographics</li>
                                <li><span className="font-medium text-foreground">Relationship Status:</span> To recommend relevant programs and events</li>
                                <li><span className="font-medium text-foreground">Interests:</span> Your selected preferences (e.g., youth, worship, families) for personalized calendar feeds</li>
                            </ul>

                            <h3 className="text-lg font-medium text-foreground mb-3">3.2 Information from Google OAuth</h3>
                            <p className="text-muted-foreground mb-4">
                                If you choose to connect via Google, we may access:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                                <li><span className="font-medium text-foreground">Basic Profile Information:</span> Your name and email from your Google account</li>
                                <li><span className="font-medium text-foreground">Calendar Access:</span> Permission to add events to your Google Calendar (only when you explicitly subscribe)</li>
                            </ul>
                            <p className="text-muted-foreground mb-4">
                                <strong className="text-foreground">Important:</strong> We do not read, modify, or delete any existing events
                                in your Google Calendar. We only add church events that you have subscribed to receive.
                            </p>

                            <h3 className="text-lg font-medium text-foreground mb-3">3.3 Automatically Collected Information</h3>
                            <p className="text-muted-foreground mb-4">
                                When you access our Service, we may automatically collect:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li><span className="font-medium text-foreground">Device Information:</span> Browser type, operating system</li>
                                <li><span className="font-medium text-foreground">Usage Data:</span> Pages visited, time spent, interaction patterns</li>
                                <li><span className="font-medium text-foreground">IP Address:</span> For security and analytics purposes</li>
                            </ul>
                        </section>

                        {/* Legal Basis for Processing */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">4. Legal Basis for Processing</h2>
                            <p className="text-muted-foreground mb-4">
                                Under the Nigeria Data Protection Act 2023 and NDPR 2019, we process your personal data based on:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li><span className="font-medium text-foreground">Consent:</span> You provide explicit consent when subscribing to our Service</li>
                                <li><span className="font-medium text-foreground">Legitimate Interest:</span> To provide personalized calendar services and communicate relevant church events</li>
                                <li><span className="font-medium text-foreground">Performance of Service:</span> To fulfill our commitment to deliver personalized event notifications</li>
                            </ul>
                        </section>

                        {/* How We Use Your Information */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">5. How We Use Your Information</h2>
                            <p className="text-muted-foreground mb-4">
                                We use your personal information for the following purposes:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>To create and manage your personalized calendar subscription</li>
                                <li>To filter and deliver events relevant to your age group, gender, and interests</li>
                                <li>To sync church events with your preferred calendar application</li>
                                <li>To communicate important updates about church events and services</li>
                                <li>To improve our Service and user experience</li>
                                <li>To maintain security and prevent fraud</li>
                                <li>To comply with legal obligations</li>
                            </ul>
                        </section>

                        {/* Data Sharing and Disclosure */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">6. Data Sharing and Disclosure</h2>
                            <p className="text-muted-foreground mb-4">
                                <strong className="text-foreground">We do not sell, trade, or rent your personal information to third parties.</strong>
                            </p>
                            <p className="text-muted-foreground mb-4">
                                We may share your information only in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>
                                    <span className="font-medium text-foreground">Service Providers:</span> With trusted third-party services
                                    (such as hosting providers and database services) that help us operate our Service, under strict
                                    confidentiality agreements
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">Legal Requirements:</span> When required by Nigerian law,
                                    court order, or government regulations
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">Church Leadership:</span> Aggregate, anonymized data may
                                    be shared with church leadership for planning purposes (no individual identification)
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">With Your Consent:</span> In any other situation where
                                    you have given explicit consent
                                </li>
                            </ul>
                        </section>

                        {/* Google OAuth Specific */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">7. Google OAuth and API Usage</h2>
                            <p className="text-muted-foreground mb-4">
                                Our Service uses Google OAuth for authentication and calendar integration. Here&apos;s what you need to know:
                            </p>

                            <h3 className="text-lg font-medium text-foreground mb-3">7.1 Permissions We Request</h3>
                            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                                <li>Read your basic Google profile (name, email)</li>
                                <li>Add events to your Google Calendar (write-only access for subscribed events)</li>
                            </ul>

                            <h3 className="text-lg font-medium text-foreground mb-3">7.2 How We Use Google Data</h3>
                            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                                <li>We use your Google profile information solely for authentication and personalization</li>
                                <li>We only add church events to your calendar that you have explicitly subscribed to</li>
                                <li>We do not read, modify, or delete any of your existing calendar events</li>
                                <li>We do not share your Google data with any third parties</li>
                            </ul>

                            <h3 className="text-lg font-medium text-foreground mb-3">7.3 Revoking Google Access</h3>
                            <p className="text-muted-foreground mb-4">
                                You can revoke our access to your Google account at any time through:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>
                                    Your Google Account settings at{" "}
                                    <a
                                        href="https://myaccount.google.com/permissions"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent hover:text-accent-dark"
                                    >
                                        myaccount.google.com/permissions
                                    </a>
                                </li>
                                <li>Contacting us directly to remove your subscription</li>
                            </ul>
                        </section>

                        {/* Data Security */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">8. Data Security</h2>
                            <p className="text-muted-foreground mb-4">
                                We implement appropriate technical and organizational measures to protect your personal data, including:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Encryption of data in transit using SSL/TLS protocols</li>
                                <li>Secure database storage with access controls</li>
                                <li>Regular security assessments and updates</li>
                                <li>Limited access to personal data by authorized personnel only</li>
                            </ul>
                            <p className="text-muted-foreground mt-4">
                                While we strive to protect your information, no method of transmission over the Internet
                                is 100% secure. We encourage you to contact us immediately if you suspect any unauthorized
                                access to your account.
                            </p>
                        </section>

                        {/* Data Retention */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">9. Data Retention</h2>
                            <p className="text-muted-foreground mb-4">
                                We retain your personal data for as long as your subscription is active or as needed to
                                provide you with our Service. Specifically:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li><span className="font-medium text-foreground">Active Subscriptions:</span> Data is retained while your subscription is active</li>
                                <li><span className="font-medium text-foreground">Inactive Accounts:</span> Data may be retained for up to 24 months after last activity</li>
                                <li><span className="font-medium text-foreground">Upon Request:</span> We will delete your data within 30 days of receiving a valid deletion request</li>
                                <li><span className="font-medium text-foreground">Legal Requirements:</span> Some data may be retained longer if required by Nigerian law</li>
                            </ul>
                        </section>

                        {/* Your Rights */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">10. Your Rights Under Nigerian Law</h2>
                            <p className="text-muted-foreground mb-4">
                                Under the Nigeria Data Protection Act 2023 and NDPR 2019, you have the following rights:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li><span className="font-medium text-foreground">Right to Access:</span> Request a copy of your personal data we hold</li>
                                <li><span className="font-medium text-foreground">Right to Rectification:</span> Request correction of inaccurate or incomplete data</li>
                                <li><span className="font-medium text-foreground">Right to Erasure:</span> Request deletion of your personal data</li>
                                <li><span className="font-medium text-foreground">Right to Restrict Processing:</span> Request limitation of how we use your data</li>
                                <li><span className="font-medium text-foreground">Right to Data Portability:</span> Receive your data in a structured, machine-readable format</li>
                                <li><span className="font-medium text-foreground">Right to Object:</span> Object to processing of your personal data</li>
                                <li><span className="font-medium text-foreground">Right to Withdraw Consent:</span> Withdraw your consent at any time</li>
                            </ul>
                            <p className="text-muted-foreground mt-4">
                                To exercise any of these rights, please contact us at{" "}
                                <a href="mailto:info@hotrportharcourt.com" className="text-accent hover:text-accent-dark">
                                    info@hotrportharcourt.com
                                </a>
                                . We will respond to your request within 30 days.
                            </p>
                        </section>

                        {/* Cookies */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">11. Cookies and Tracking Technologies</h2>
                            <p className="text-muted-foreground mb-4">
                                We use essential cookies necessary for the operation of our Service. These cookies are
                                required for authentication and session management. We do not use advertising or
                                tracking cookies.
                            </p>
                            <p className="text-muted-foreground">
                                You can control cookies through your browser settings. However, disabling essential
                                cookies may affect your ability to use our Service.
                            </p>
                        </section>

                        {/* Children&apos;s Privacy */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">12. Children&apos;s Privacy</h2>
                            <p className="text-muted-foreground mb-4">
                                Our Service is intended for users of all ages within the church community. For users
                                under 18 years of age, we recommend that parents or guardians supervise the subscription
                                process and provide consent on behalf of minors.
                            </p>
                            <p className="text-muted-foreground">
                                We do not knowingly collect personal information from children under 13 without parental
                                consent. If you believe we have collected information from a child under 13 without
                                appropriate consent, please contact us immediately.
                            </p>
                        </section>

                        {/* International Transfers */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">13. International Data Transfers</h2>
                            <p className="text-muted-foreground mb-4">
                                Our Service is hosted on servers that may be located outside Nigeria. By using our
                                Service, you consent to the transfer of your information to countries outside Nigeria,
                                including for processing and storage purposes.
                            </p>
                            <p className="text-muted-foreground">
                                When transferring data internationally, we ensure appropriate safeguards are in place
                                in accordance with the Nigeria Data Protection Act 2023 and use service providers that
                                maintain adequate data protection standards.
                            </p>
                        </section>

                        {/* Changes to Policy */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">14. Changes to This Privacy Policy</h2>
                            <p className="text-muted-foreground mb-4">
                                We may update this Privacy Policy from time to time to reflect changes in our practices
                                or legal requirements. We will notify you of any material changes by:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Posting the updated policy on this page with a new &quot;Last Updated&quot; date</li>
                                <li>Sending an email notification for significant changes (if we have your email)</li>
                            </ul>
                            <p className="text-muted-foreground mt-4">
                                We encourage you to review this Privacy Policy periodically.
                            </p>
                        </section>

                        {/* Contact Information */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">15. Contact Us</h2>
                            <p className="text-muted-foreground mb-4">
                                If you have any questions, concerns, or requests regarding this Privacy Policy or our
                                data practices, please contact us:
                            </p>
                            <div className="bg-muted rounded-lg p-6">
                                <p className="text-foreground font-medium">House on the Rock Port Harcourt</p>
                                <p className="text-muted-foreground">Data Protection Contact</p>
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

                        {/* Complaints */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-foreground mb-4">16. Complaints</h2>
                            <p className="text-muted-foreground mb-4">
                                If you are not satisfied with how we handle your personal data or your complaint,
                                you have the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC):
                            </p>
                            <div className="bg-muted rounded-lg p-6">
                                <p className="text-foreground font-medium">Nigeria Data Protection Commission</p>
                                <p className="text-muted-foreground">
                                    Website:{" "}
                                    <a
                                        href="https://ndpc.gov.ng"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent hover:text-accent-dark"
                                    >
                                        ndpc.gov.ng
                                    </a>
                                </p>
                            </div>
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
