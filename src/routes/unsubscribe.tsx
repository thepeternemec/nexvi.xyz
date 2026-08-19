import * as React from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/unsubscribe")({
  component: UnsubscribePage,
  head: () => ({
    meta: [
      { title: "Unsubscribe — Nexvi" },
      { name: "description", content: "Manage your Nexvi email preferences." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type Status = "idle" | "loading" | "validating" | "success" | "error" | "already";

function UnsubscribePage() {
  const search = Route.useSearch();
  const token = typeof search === "object" && search ? (search as { token?: string }).token : undefined;
  const [status, setStatus] = React.useState<Status>("idle");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("This unsubscribe link is invalid or has expired.");
      return;
    }

    setStatus("validating");
    fetch(`/email/unsubscribe?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Invalid or expired link");
        }
        setStatus("idle");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "This unsubscribe link is invalid or has expired.");
      });
  }, [token]);

  async function handleUnsubscribe() {
    if (!token) return;
    setStatus("loading");
    try {
      const res = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || "Could not unsubscribe. Please try again.");
      }
      setStatus(body.already ? "already" : "success");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <BrandMark />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Email preferences
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You can unsubscribe from Nexvi marketing and product emails below.
        </p>

        <div className="mt-8">
          {status === "validating" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Validating your link…
            </div>
          )}

          {(status === "idle" || status === "loading") && (
            <>
              <p className="mb-6 text-sm text-foreground">
                Click the button to confirm you no longer want to receive these emails.
              </p>
              <Button
                onClick={handleUnsubscribe}
                disabled={status === "loading"}
                className="w-full"
              >
                {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm unsubscribe
              </Button>
            </>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <p className="text-sm font-medium text-foreground">
                You have been unsubscribed.
              </p>
              <p className="text-xs text-muted-foreground">
                You will no longer receive marketing emails from Nexvi.
              </p>
            </div>
          )}

          {status === "already" && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <p className="text-sm font-medium text-foreground">
                You are already unsubscribed.
              </p>
              <p className="text-xs text-muted-foreground">
                This email address is not on our mailing list.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <p className="text-sm font-medium text-foreground">Unable to unsubscribe</p>
              <p className="text-xs text-muted-foreground">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
