import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { UpgradeDialog } from "@/components/upgrade-dialog";
import { CookieConsentBanner } from "@/components/cookie-consent";
import { getInitialThemeScript } from "@/hooks/use-theme";
import { TranslationProvider, AutoTranslate } from "@/lib/use-translation";
import { LocaleProvider } from "@/lib/locale-context";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ApplyWise — AI job application toolkit" },
      { name: "description", content: "ApplyWise turns any job description into an ATS-ready CV, a tailored cover letter and a match score with concrete fixes." },
      { property: "og:site_name", content: "ApplyWise" },
      { property: "og:title", content: "ApplyWise — AI job application toolkit" },
      { property: "og:description", content: "ApplyWise turns any job description into an ATS-ready CV, a tailored cover letter and a match score with concrete fixes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "twitter:title", content: "ApplyWise — AI job application toolkit" },
      { name: "twitter:description", content: "ApplyWise turns any job description into an ATS-ready CV, a tailored cover letter and a match score with concrete fixes." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c2a31f54-f01b-4751-9835-0c10daae18d1/id-preview-3965c72d--16e4ecf7-814f-4fba-ade3-3bc51de0ca46.lovable.app-1785689887212.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c2a31f54-f01b-4751-9835-0c10daae18d1/id-preview-3965c72d--16e4ecf7-814f-4fba-ade3-3bc51de0ca46.lovable.app-1785689887212.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Manrope:wght@300;400;500;600&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ApplyWise",
          url: "https://applywise.eu",
          email: "hello@applywise.eu",
          sameAs: [
            "https://www.linkedin.com/company/applywise",
            "https://x.com/applywise",
            "https://www.instagram.com/applywise",
          ],
          description: "AI tools for job seekers: ATS-optimized CVs, tailored cover letters, humanized writing and match scoring.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ApplyWise",
          url: "https://applywise.eu",
          inLanguage: ["en", "de", "es", "it", "fr"],
          potentialAction: {
            "@type": "SearchAction",
            target: "https://applywise.eu/marketplace?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const GA_ID = "G-JJB1GQ4MN4";
const GTM_ID = "GTM-5LC8WCN6";

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_ID}', { send_page_view: false });`,
          }}
        />
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: getInitialThemeScript() }} />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
        <Scripts />
      </body>

    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  React.useEffect(() => {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (gtag) gtag("event", "page_view", { page_path: pathname });
  }, [pathname]);



  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <TranslationProvider>
          <AutoTranslate />
          <Outlet />
          <UpgradeDialog />
          <CookieConsentBanner />

          <Toaster richColors position="top-center" />

        </TranslationProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}
