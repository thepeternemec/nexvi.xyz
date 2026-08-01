import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — ApplyWise" },
      { name: "description", content: "Which cookies ApplyWise uses, what each one does, how long it lasts and how to control them in your browser." },
      { property: "og:title", content: "ApplyWise Cookie Policy" },
      { property: "og:description", content: "The cookies ApplyWise sets for sign-in, preferences and analytics — and how to control them." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/cookies" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: CookiesPage,
});

const cookies = [
  { name: "Session token", purpose: "Keeps you signed in between visits", type: "Essential", life: "Until sign-out" },
  { name: "Theme preference", purpose: "Remembers light or dark mode", type: "Essential", life: "1 year" },
  { name: "Language preference", purpose: "Remembers your selected language", type: "Essential", life: "1 year" },
  { name: "Saved prompts", purpose: "Stores prompts you bookmarked on this device", type: "Functional", life: "1 year" },
  { name: "Checkout session", purpose: "Links your payment back to your account", type: "Essential", life: "Minutes" },
];

function CookiesPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Cookie policy</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          ApplyWise keeps cookies to a minimum. We don't sell your data and we don't use advertising trackers. Below is
          every cookie or local storage entry the site can set.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border/70">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Purpose</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Lifetime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cookies.map((c) => (
                <tr key={c.name}>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.purpose}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.life}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 text-lg font-semibold tracking-tight">Managing cookies</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You can clear or block cookies in your browser settings at any time. Blocking essential cookies will sign you
          out and reset your theme and language preferences. For anything else, see our{" "}
          <a className="underline hover:text-foreground" href="/terms">Terms &amp; Privacy</a> page or email{" "}
          <a className="underline hover:text-foreground" href="mailto:hello@applywise.eu">hello@applywise.eu</a>.
        </p>
      </div>
    </SiteShell>
  );
}
