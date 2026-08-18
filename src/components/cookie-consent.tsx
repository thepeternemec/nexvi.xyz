import { useEffect, useState } from "react";
import { Cookie, Settings2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ALL_ACCEPTED,
  ESSENTIAL_ONLY,
  readConsent,
  saveConsent,
  useCookieConsent,
} from "@/lib/cookie-consent";
import { gtmConsent } from "@/lib/gtm";

type Prefs = { functional: boolean; analytics: boolean };

const CATEGORIES: Array<{
  key: "essential" | keyof Prefs;
  title: string;
  description: string;
}> = [
  {
    key: "essential",
    title: "Strictly necessary",
    description: "Sign-in session, checkout and security. These are always on and can't be switched off.",
  },
  {
    key: "functional",
    title: "Functional",
    description: "Remembers your theme, language and saved prompts on this device.",
  },
  {
    key: "analytics",
    title: "Analytics",
    description: "Anonymous, aggregated usage stats so we know which tools to improve.",
  },
];

export function CookieConsentBanner() {
  const { consent, hydrated } = useCookieConsent();
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ functional: true, analytics: true });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      const current = readConsent();
      setPrefs({
        functional: current?.functional ?? true,
        analytics: current?.analytics ?? true,
      });
      setOpen(true);
    };
    window.addEventListener("nexvi:open-cookie-preferences", onOpen);
    return () => window.removeEventListener("nexvi:open-cookie-preferences", onOpen);
  }, []);

  const showBanner = hydrated && !consent && !dismissed;

  function decide(choice: Prefs) {
    const consent = saveConsent(choice);
    gtmConsent(consent);
    setOpen(false);
  }

  return (
    <>
      {showBanner && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-3 sm:p-5">
          <div
            role="dialog"
            aria-label="Cookie consent"
            className="pointer-events-auto w-full max-w-3xl animate-in slide-in-from-bottom-4 fade-in duration-300 rounded-2xl border border-border/70 bg-background/95 p-4 shadow-2xl backdrop-blur-xl sm:p-5"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
                <Cookie className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold tracking-tight">We use a few cookies</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Essential cookies keep you signed in. Functional and analytics cookies help us remember your
                  preferences and improve the tools. You choose — and we'll remember your choice next time.{" "}
                  <a href="/cookies" className="underline underline-offset-4 hover:text-foreground">
                    Cookie policy
                  </a>
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => decide(ALL_ACCEPTED)}>
                    Accept all
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => decide(ESSENTIAL_ONLY)}>
                    Essential only
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setPrefs({ functional: true, analytics: true });
                      setOpen(true);
                    }}
                  >
                    <Settings2 className="mr-1.5 h-3.5 w-3.5" />
                    Preferences
                  </Button>
                </div>
              </div>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setDismissed(true)}
                className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Cookie preferences</DialogTitle>
            <DialogDescription>
              Choose what we can store on this device. Your choice is saved and reused on future visits.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const isEssential = cat.key === "essential";
              const checked = isEssential ? true : prefs[cat.key as keyof Prefs];
              return (
                <div
                  key={cat.key}
                  className="flex items-start justify-between gap-4 rounded-xl border border-border/70 p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{cat.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{cat.description}</p>
                  </div>
                  <Switch
                    checked={checked}
                    disabled={isEssential}
                    aria-label={cat.title}
                    onCheckedChange={(value) =>
                      setPrefs((prev) => ({ ...prev, [cat.key as keyof Prefs]: value }))
                    }
                  />
                </div>
              );
            })}
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="ghost" size="sm" onClick={() => decide(ESSENTIAL_ONLY)}>
              Reject optional
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => decide(ALL_ACCEPTED)}>
                Accept all
              </Button>
              <Button size="sm" onClick={() => decide(prefs)}>
                Save choices
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
