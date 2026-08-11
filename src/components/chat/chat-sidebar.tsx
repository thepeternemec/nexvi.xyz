import { Link, useNavigate, useParams, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquarePlus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { CHAT_MODES } from "@/lib/chat-modes";
import { deleteThread, listThreads } from "@/lib/chat-store";

export function ChatSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const params = useParams({ strict: false }) as { threadId?: string };

  const threads = useQuery({
    queryKey: ["chat-threads"],
    queryFn: listThreads,
    enabled: isAuthenticated,
  });

  async function remove(id: string) {
    try {
      await deleteThread(id);
      await queryClient.invalidateQueries({ queryKey: ["chat-threads"] });
      if (params.threadId === id) navigate({ to: "/chat" }).catch(() => undefined);
    } catch {
      toast.error("Could not delete that conversation.");
    }
  }

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={onClose}
        />
      )}
      <aside
        className={`${
          open ? "translate-x-0" : "-translate-x-[110%]"
        } fixed inset-y-0 left-0 z-50 flex w-[17rem] flex-col gap-4 overflow-y-auto border-r border-border/60 bg-card p-4 transition-transform lg:static lg:z-auto lg:mr-3 lg:translate-x-0 lg:rounded-[18px] lg:border lg:bg-card/40`}
      >
        <div className="flex items-center justify-between lg:hidden">
          <span className="text-[13px] font-semibold">Workspace</span>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Link to="/chat" onClick={onClose} className="block">
          <Button className="w-full justify-start gap-2 rounded-xl text-[13px]">
            <MessageSquarePlus className="h-4 w-4" /> New chat
          </Button>
        </Link>

        <div>
          <div className="px-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Tools</div>
          <nav className="mt-2 space-y-0.5">
            {CHAT_MODES.map((m) => (
              <Link
                key={m.id}
                to="/chat"
                search={{ mode: m.id }}
                onClick={onClose}
                className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background">
                  <m.icon className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 truncate">{m.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="min-h-0 flex-1">
          <div className="px-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">History</div>
          {!isAuthenticated ? (
            <p className="mt-2 px-1 text-[12px] leading-relaxed text-muted-foreground">
              <Link to="/login" className="text-foreground underline underline-offset-2">
                Sign in
              </Link>{" "}
              to save your conversations.
            </p>
          ) : threads.isLoading ? (
            <p className="mt-2 px-1 text-[12px] text-muted-foreground">Loading…</p>
          ) : (threads.data ?? []).length === 0 ? (
            <p className="mt-2 px-1 text-[12px] text-muted-foreground">No conversations yet.</p>
          ) : (
            <ul className="mt-2 space-y-0.5">
              {(threads.data ?? []).map((t) => {
                const active = pathname.endsWith(`/chat/${t.id}`);
                return (
                  <li
                    key={t.id}
                    className={`group flex items-center gap-1 rounded-lg pr-1 ${
                      active ? "bg-muted" : "hover:bg-muted/60"
                    }`}
                  >
                    <Link
                      to="/chat/$threadId"
                      params={{ threadId: t.id }}
                      onClick={onClose}
                      className="min-w-0 flex-1 truncate px-2 py-2 text-[12.5px] text-foreground/90"
                      title={t.title}
                    >
                      {t.title}
                    </Link>
                    <button
                      onClick={() => remove(t.id)}
                      aria-label="Delete conversation"
                      className="rounded-md p-1 text-muted-foreground opacity-0 transition hover:text-foreground group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
