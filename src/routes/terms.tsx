import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Privacy — Nexvi" },
      { name: "description", content: "Nexvi terms of service and privacy policy: how we handle your CV data, AI processing, subscriptions and your rights under GDPR." },
      { property: "og:title", content: "Nexvi Terms & Privacy" },
      { property: "og:description", content: "How Nexvi handles your data, AI processing and subscriptions." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://nexvi.xyz/terms" },
    ],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/terms" }],
  }),
  component: TermsPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

export function TermsPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Terms &amp; Privacy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: 1 August 2026</p>

        <Section title="Using Nexvi">
          <p>
            Nexvi provides AI tools that generate CVs, cover letters, ATS analyses and rewritten text. You keep
            ownership of everything you paste in and everything the tools produce for you. You are responsible for
            checking that the final documents are accurate before sending them to an employer.
          </p>
          <p>
            Don't use Nexvi to create misleading claims about your experience, to upload someone else's personal data
            without their consent, or to abuse the service through automated bulk requests.
          </p>
        </Section>

        <Section title="Plans and billing">
          <p>
            The Free plan includes a limited number of generations per tool. Premium is billed monthly through
            our payment provider and renews automatically until you cancel. You can cancel any time from Subscription in
            your dashboard; access continues until the end of the paid period.
          </p>
        </Section>

        <Section title="What data we process">
          <p>
            We store your account details (name, email, avatar), your plan and usage counters, and the timestamps of your
            generations. CV and job-description text you paste is sent to our AI providers to produce your output and is
            not used to train models.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            You can access, correct, export or delete your data at any time — edit your details on the Account page or
            email <a className="underline hover:text-foreground" href="mailto:info@nexvi.xyz">info@nexvi.xyz</a> to
            request a full export or deletion. We respond within 30 days as required by GDPR.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            We use a small set of essential cookies for sign-in and preferences. Details are on the{" "}
            <a className="underline hover:text-foreground" href="/cookies">Cookies page</a>.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms? Email{" "}
            <a className="underline hover:text-foreground" href="mailto:info@nexvi.xyz">info@nexvi.xyz</a>.
          </p>
        </Section>
      </div>
    </SiteShell>
  );
}
