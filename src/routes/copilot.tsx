import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatSidebarContext } from "@/components/chat/chat-sidebar-context";
import { SiteHeader } from "@/components/site-shell";

export const Route = createFileRoute("/copilot")({
  head: () => ({
    meta: [
      { title: "Nexvi Copilot — CV, Cover Letter, ATS & Humanizer in one chat" },
      {
        name: "description",
        content:
          "One AI chat for your whole job search: generate tailored CVs and cover letters, score your ATS match, humanize text, and find the right prompt.",
      },
      { property: "og:title", content: "Nexvi Copilot — one chat for your job search" },
      {
        property: "og:description",
        content: "CV Generator, Cover Letter, ATS Optimizer, Humanizer and Prompt Library in a single chat interface.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://nexvi.xyz/copilot" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://nexvi.xyz/copilot" }],
  }),
  component: ChatLayout,
});

function ChatLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-0 px-2 pb-2 pt-2 sm:px-3 sm:pb-3 sm:pt-3">
        <ChatSidebar open={open} onClose={() => setOpen(false)} />
        <main className="min-w-0 flex-1 overflow-hidden rounded-[18px] border border-border/60 bg-card/40">
          <div className="h-[calc(100dvh-6rem)] sm:h-[calc(100vh-7rem)]">
            <ChatSidebarContext.Provider value={{ openSidebar: () => setOpen(true) }}>
              <Outlet />
            </ChatSidebarContext.Provider>
          </div>
        </main>
      </div>
    </div>
  );
}
