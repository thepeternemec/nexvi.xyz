import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ResumePanel } from "@/components/chat/resume-panel";
import { getResume, type SavedResume } from "@/lib/resume-store";

/**
 * Drop-in resume/CV upload + storage panel for the standalone tool pages.
 * Loads the workspace-saved resume once and keeps the tool's text field in sync.
 */
export function ResumeField({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (text: string) => void;
  className?: string;
}) {
  const { user } = useAuth();
  const [saved, setSaved] = useState<SavedResume | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    const key = user?.id ?? "anon";
    if (loadedFor === key) return;
    let active = true;
    void getResume(user?.id).then((rec) => {
      if (!active) return;
      setLoadedFor(key);
      if (rec?.content) {
        setSaved(rec);
        if (!value.trim()) onChange(rec.content);
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, loadedFor]);

  return (
    <div className={className}>
      <ResumePanel
        value={value}
        saved={saved}
        userId={user?.id}
        onChange={(text, rec) => {
          onChange(text);
          setSaved(rec);
        }}
      />
    </div>
  );
}
