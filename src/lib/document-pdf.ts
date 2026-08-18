import { jsPDF } from "jspdf";

type Block =
  | { kind: "h1" | "h2" | "p"; text: string }
  | { kind: "li"; text: string }
  | { kind: "hr" };

function strip(s: string) {
  return s
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/(^|\s)\*(?!\s)(.+?)\*/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

function parse(md: string): Block[] {
  const out: Block[] = [];
  for (const raw of md.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) continue;
    if (/^\s*[-–—_*]{3,}\s*$/.test(line)) { out.push({ kind: "hr" }); continue; }
    const heading = line.match(/^\s*(#{1,6})\s*(.+?)\s*#*$/);
    if (heading) {
      out.push({ kind: heading[1].length <= 2 ? "h1" : "h2", text: strip(heading[2]).replace(/:$/, "") });
      continue;
    }
    const boldOnly = line.match(/^\s*\*\*(.+?)\*\*:?\s*$/);
    if (boldOnly) { out.push({ kind: "h2", text: strip(boldOnly[1]) }); continue; }
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/) ?? line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet) { out.push({ kind: "li", text: strip(bullet[1]) }); continue; }
    out.push({ kind: "p", text: strip(line) });
  }
  return out;
}

/** Build the paginated A4 PDF document for markdown-ish CV/letter text. */
export function buildDocumentPdf(md: string) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 56;
  const maxW = pageW - margin * 2;
  let y = margin;

  const ensure = (h: number) => {
    if (y + h > pageH - margin) { doc.addPage(); y = margin; }
  };

  for (const b of parse(md)) {
    if (b.kind === "hr") {
      ensure(16);
      doc.setDrawColor(200);
      doc.line(margin, y + 4, pageW - margin, y + 4);
      y += 16;
      continue;
    }

    if (b.kind === "h1") {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      const lines = doc.splitTextToSize(b.text.toUpperCase(), maxW) as string[];
      ensure(lines.length * 17 + 18);
      y += 10;
      doc.setTextColor(20);
      doc.text(lines, margin, y);
      y += lines.length * 17 - 4;
      doc.setDrawColor(180);
      doc.line(margin, y, pageW - margin, y);
      y += 12;
      continue;
    }

    if (b.kind === "h2") {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      const lines = doc.splitTextToSize(b.text, maxW) as string[];
      ensure(lines.length * 14 + 12);
      y += 8;
      doc.setTextColor(20);
      doc.text(lines, margin, y);
      y += lines.length * 14;
      continue;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(45);
    const indent = b.kind === "li" ? 16 : 0;
    const lines = doc.splitTextToSize(b.text, maxW - indent) as string[];
    ensure(lines.length * 13.5 + 4);
    if (b.kind === "li") doc.text("•", margin, y);
    doc.text(lines, margin + indent, y);
    y += lines.length * 13.5 + (b.kind === "li" ? 2 : 5);
  }

  return doc;
}

/**
 * Render markdown-ish CV/letter text as a clean, paginated A4 PDF and download it.
 * Sandboxed preview iframes commonly block `<a download>` navigations, so when we
 * are framed we open the PDF in a top-level tab (still inside the user gesture),
 * where the browser's own PDF viewer offers a download button.
 */
export function downloadDocumentPdf(md: string, filename: string) {
  const blob = buildDocumentPdf(md).output("blob");
  const file = new Blob([blob], { type: "application/pdf" });
  const url = URL.createObjectURL(file);

  const framed = (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();

  const openTab = () => {
    const w = window.open(url, "_blank", "noopener,noreferrer");
    return !!w;
  };

  const anchorDownload = () => {
    try {
      const doc = framed && window.top?.document ? window.top.document : document;
      const a = doc.createElement("a");
      a.href = url;
      a.download = filename;
      a.rel = "noopener";
      a.style.display = "none";
      doc.body.appendChild(a);
      a.click();
      a.remove();
      return true;
    } catch {
      return false;
    }
  };

  // Always try a real file download first; only fall back to a viewer tab.
  const ok = anchorDownload() || openTab();
  if (!ok) throw new Error("Download blocked by the browser");

  // Give the browser time to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}


/** Object URL for an inline PDF preview. Revoke it when done. */
export function createDocumentPdfUrl(md: string): string {
  return URL.createObjectURL(buildDocumentPdf(md).output("blob"));
}


