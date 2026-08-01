import { Fragment, type ReactNode } from "react";

/** Convert markdown-ish AI output into clean plain text (no #, **, -). */
export function toPlainText(md: string): string {
  return md
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => {
      let l = line.replace(/^\s*#{1,6}\s*/, "");
      l = l.replace(/\*\*(.+?)\*\*/g, "$1").replace(/__(.+?)__/g, "$1");
      l = l.replace(/(^|\s)\*(?!\s)(.+?)\*/g, "$1$2");
      l = l.replace(/`([^`]+)`/g, "$1");
      l = l.replace(/^\s*[-*•]\s+/, "• ");
      l = l.replace(/^\s*(\d+)[.)]\s+/, "$1. ");
      l = l.replace(/^\s*[-–—_]{3,}\s*$/, "");
      return l.trimEnd();
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function inline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p) || /^__[^_]+__$/.test(p))
      return <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>;
    if (/^`[^`]+`$/.test(p))
      return <code key={i} className="rounded bg-muted px-1 py-0.5 text-[0.85em]">{p.slice(1, -1)}</code>;
    if (/^\*[^*]+\*$/.test(p)) return <em key={i}>{p.slice(1, -1)}</em>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}

/** Renders markdown-ish AI CV / letter output as a clean, structured document. */
export function DocumentRender({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flush = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(
      <Tag
        key={`l${blocks.length}`}
        className={`my-2 space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 ${list.ordered ? "list-decimal" : "list-disc"}`}
      >
        {list.items.map((it, i) => (
          <li key={i} className="marker:text-muted-foreground">{inline(it)}</li>
        ))}
      </Tag>,
    );
    list = null;
  };

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    if (!line.trim()) { flush(); return; }

    if (/^\s*[-–—_*]{3,}\s*$/.test(line)) {
      flush();
      blocks.push(<hr key={`h${idx}`} className="my-5 border-border/70" />);
      return;
    }

    const heading = line.match(/^\s*(#{1,6})\s*(.+?)\s*#*$/);
    if (heading) {
      flush();
      const level = heading[1].length;
      const content = heading[2].replace(/\*\*/g, "").replace(/:$/, "");
      if (level <= 2) {
        blocks.push(
          <h2 key={`t${idx}`} className="mt-6 border-b border-border/60 pb-1.5 font-display text-lg font-semibold uppercase tracking-wide text-foreground first:mt-0">
            {content}
          </h2>,
        );
      } else {
        blocks.push(
          <h3 key={`t${idx}`} className="mt-4 text-sm font-semibold text-foreground">{content}</h3>,
        );
      }
      return;
    }

    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    if (bullet) {
      if (!list || list.ordered) { flush(); list = { ordered: false, items: [] }; }
      list.items.push(bullet[1]);
      return;
    }
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (numbered) {
      if (!list || !list.ordered) { flush(); list = { ordered: true, items: [] }; }
      list.items.push(numbered[1]);
      return;
    }

    flush();
    // A bold-only line acts as a section label
    const boldOnly = line.match(/^\s*\*\*(.+?)\*\*:?\s*$/);
    if (boldOnly) {
      blocks.push(
        <h3 key={`b${idx}`} className="mt-4 text-sm font-semibold text-foreground">{boldOnly[1]}</h3>,
      );
      return;
    }
    blocks.push(
      <p key={`p${idx}`} className="my-2 text-sm leading-relaxed text-foreground/90">{inline(line)}</p>,
    );
  });
  flush();

  return <div className="font-sans">{blocks}</div>;
}
