import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2, RefreshCw, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { extractResumeText } from "@/lib/resume.functions";
import { clearResume, fileToBase64, saveResume, type SavedResume } from "@/lib/resume-store";

const TEXT_TYPES = ["text/plain", "text/markdown", "application/json", ""];

function isTextFile(file: File) {
  return TEXT_TYPES.includes(file.type) || /\.(txt|md|markdown)$/i.test(file.name);
}

export function ResumePanel({
  value,
  saved,
  userId,
  onChange,
}: {
  value: string;
  saved: SavedResume | null;
  userId?: string;
  onChange: (text: string, saved: SavedResume | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const extract = useServerFn(extractResumeText);

  const hasResume = value.trim().length > 0;

  async function persist(text: string, fileName: string | null) {
    try {
      const rec = await saveResume(text, fileName, userId);
      onChange(text, rec);
    } catch {
      onChange(text, { fileName, content: text, updatedAt: new Date().toISOString() });
    }
  }

  async function handleFile(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large — keep it under 10 MB.");
      return;
    }
    setBusy(true);
    try {
      let text: string;
      if (isTextFile(file)) {
        text = await file.text();
      } else {
        const dataBase64 = await fileToBase64(file);
        const mimeType =
          file.type || (/\.pdf$/i.test(file.name) ? "application/pdf" : "application/octet-stream");
        if (!/pdf|image\//.test(mimeType)) {
          toast.error("Please upload a PDF, image, or plain text file (.txt / .md).");
          return;
        }
        const res = await extract({ data: { fileName: file.name, mimeType, dataBase64 } });
        text = res.text;
      }
      if (!text.trim()) {
        toast.error("That file looked empty.");
        return;
      }
      await persist(text.trim(), file.name);
      toast.success("Resume saved to your workspace.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not read that file.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm backdrop-blur-sm">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.md,.markdown,image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-muted/50">
            <FileText className="h-4 w-4 text-primary" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="whitespace-nowrap text-[13px] font-semibold">Your resume</p>
            <p className="truncate text-[12px] text-muted-foreground">
              {hasResume
                ? `${saved?.fileName ?? "Pasted resume"} · saved for every tool`
                : "Upload once — Copilot reuses it across CV, cover letter and ATS."}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {hasResume ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={busy}
                  onClick={() => inputRef.current?.click()}
                  className="h-8 w-8"
                >
                  {busy ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{busy ? "Reading…" : "Replace resume"}</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="default"
              size="sm"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="h-8 text-[12px]"
            >
              {busy ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="mr-1.5 h-3.5 w-3.5" />
              )}
              {busy ? "Reading…" : "Upload"}
            </Button>
          )}
          {hasResume && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove resume"
                  disabled={busy}
                  onClick={async () => {
                    await clearResume(userId);
                    onChange("", null);
                    toast.success("Resume removed.");
                  }}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Remove resume</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="mt-4">
        {hasResume && !editing ? (
          <div className="flex items-start justify-between gap-3">
            <p className="line-clamp-3 flex-1 text-[12px] leading-relaxed text-muted-foreground">
              {value.slice(0, 280)}
            </p>
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="h-8 shrink-0 text-[12px]">
              Edit
            </Button>
          </div>
        ) : (
          <>
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value, saved)}
              onBlur={() => {
                if (value.trim()) void persist(value.trim(), saved?.fileName ?? null);
                setEditing(false);
              }}
              placeholder="…or paste your resume / background here"
              className="min-h-[120px] resize-none rounded-xl border-border/60 bg-muted/30 text-[13px] placeholder:text-muted-foreground/60 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring"
            />
            <p className="mt-2 text-[11px] text-muted-foreground">
              PDF, image or .txt / .md supported. Saved automatically.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
