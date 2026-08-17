/**
 * SEO monitoring engine.
 * Runs a suite of technical SEO checks against the live site:
 * robots.txt, sitemap.xml, canonical/hreflang tags and JSON-LD schema.
 * Server-only: called from the cron endpoint and from admin server functions.
 */

export type CheckStatus = "pass" | "warn" | "fail";

export interface CheckResult {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
}

export interface SeoRunResult {
  baseUrl: string;
  status: CheckStatus;
  passed: number;
  warned: number;
  failed: number;
  checks: CheckResult[];
  finishedAt: string;
}

/** Pages whose head tags we validate on every run. */
const PAGES_TO_CHECK = ["/", "/prompts", "/pricing", "/about", "/humanizer"];

const LOCALES = ["de", "es", "it", "fr"];

async function fetchText(url: string): Promise<{ ok: boolean; status: number; text: string; contentType: string }> {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "ApplyWise-SEO-Monitor/1.0" },
      redirect: "follow",
    });
    const text = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      text,
      contentType: res.headers.get("content-type") ?? "",
    };
  } catch (error) {
    return { ok: false, status: 0, text: "", contentType: String(error) };
  }
}

async function checkRobots(baseUrl: string): Promise<CheckResult[]> {
  const url = `${baseUrl}/robots.txt`;
  const res = await fetchText(url);
  if (!res.ok) {
    return [{ id: "robots.reachable", label: "robots.txt reachable", status: "fail", detail: `HTTP ${res.status} for ${url}` }];
  }

  const out: CheckResult[] = [
    { id: "robots.reachable", label: "robots.txt reachable", status: "pass", detail: `HTTP 200, ${res.text.length} bytes` },
  ];

  const blocksEverything = /^\s*disallow:\s*\/\s*$/im.test(res.text) && !/^\s*allow:\s*\//im.test(res.text);
  out.push({
    id: "robots.crawlable",
    label: "Crawling allowed",
    status: blocksEverything ? "fail" : "pass",
    detail: blocksEverything ? "robots.txt contains a site-wide Disallow: /" : "No site-wide Disallow found",
  });

  const hasSitemap = /^\s*sitemap:\s*https?:\/\/\S+sitemap\.xml/im.test(res.text);
  out.push({
    id: "robots.sitemap",
    label: "Sitemap directive present",
    status: hasSitemap ? "pass" : "warn",
    detail: hasSitemap ? "robots.txt points at sitemap.xml" : "No Sitemap: directive found in robots.txt",
  });

  return out;
}

async function checkSitemap(baseUrl: string): Promise<CheckResult[]> {
  const url = `${baseUrl}/sitemap.xml`;
  const res = await fetchText(url);
  if (!res.ok) {
    return [{ id: "sitemap.reachable", label: "sitemap.xml reachable", status: "fail", detail: `HTTP ${res.status} for ${url}` }];
  }

  const out: CheckResult[] = [
    { id: "sitemap.reachable", label: "sitemap.xml reachable", status: "pass", detail: `HTTP 200, ${res.text.length} bytes` },
  ];

  const isXml = res.contentType.includes("xml");
  out.push({
    id: "sitemap.contentType",
    label: "Sitemap served as XML",
    status: isXml ? "pass" : "fail",
    detail: isXml ? res.contentType : `Wrong Content-Type: ${res.contentType || "unknown"} (Google rejects HTML sitemaps)`,
  });

  const wellFormed = res.text.trimStart().startsWith("<?xml") && /<urlset[\s>]|<sitemapindex[\s>]/.test(res.text);
  out.push({
    id: "sitemap.wellFormed",
    label: "Sitemap XML well-formed",
    status: wellFormed ? "pass" : "fail",
    detail: wellFormed ? "XML declaration and <urlset> present" : "Missing XML declaration or <urlset> root element",
  });

  const locs = [...res.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!.trim());
  out.push({
    id: "sitemap.urlCount",
    label: "Sitemap contains URLs",
    status: locs.length > 0 ? "pass" : "fail",
    detail: `${locs.length} <loc> entries`,
  });

  const external = locs.filter((l) => !l.startsWith(baseUrl));
  out.push({
    id: "sitemap.sameHost",
    label: "Sitemap URLs match site host",
    status: external.length === 0 ? "pass" : "fail",
    detail: external.length === 0 ? "All URLs use the canonical host" : `${external.length} URL(s) point elsewhere, e.g. ${external[0]}`,
  });

  const hasLocales = LOCALES.every((l) => locs.some((loc) => loc.includes(`${baseUrl}/${l}`)));
  out.push({
    id: "sitemap.locales",
    label: "Localized URLs listed",
    status: hasLocales ? "pass" : "warn",
    detail: hasLocales ? "de, es, it and fr URLs present" : "Some locale-prefixed URLs are missing from the sitemap",
  });

  // Spot-check a handful of sitemap URLs actually resolve.
  const sample = locs.slice(0, 5);
  const broken: string[] = [];
  for (const loc of sample) {
    const page = await fetchText(loc);
    if (!page.ok) broken.push(`${loc} (HTTP ${page.status})`);
  }
  out.push({
    id: "sitemap.sampleReachable",
    label: "Sampled sitemap URLs resolve",
    status: broken.length === 0 ? "pass" : "fail",
    detail: broken.length === 0 ? `${sample.length} sampled URLs returned 200` : `Broken: ${broken.join(", ")}`,
  });

  return out;
}

function extractCanonical(html: string): string | null {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (!match) return null;
  const href = match[0].match(/href=["']([^"']+)["']/i);
  return href ? href[1]! : null;
}

async function checkPage(baseUrl: string, path: string): Promise<CheckResult[]> {
  const url = `${baseUrl}${path}`;
  const res = await fetchText(url);
  const label = path === "/" ? "homepage" : path;

  if (!res.ok) {
    return [{ id: `page${path}.reachable`, label: `${label} reachable`, status: "fail", detail: `HTTP ${res.status}` }];
  }

  const out: CheckResult[] = [];
  const html = res.text;

  // Canonical
  const canonicals = [...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]*>/gi)];
  const canonical = extractCanonical(html);
  if (canonicals.length === 0) {
    out.push({ id: `page${path}.canonical`, label: `${label}: canonical tag`, status: "fail", detail: "No <link rel=\"canonical\"> found" });
  } else if (canonicals.length > 1) {
    out.push({ id: `page${path}.canonical`, label: `${label}: canonical tag`, status: "fail", detail: `${canonicals.length} canonical tags found (must be exactly 1)` });
  } else if (canonical !== url && canonical !== `${url}/` && !(path === "/" && canonical === baseUrl)) {
    out.push({ id: `page${path}.canonical`, label: `${label}: canonical tag`, status: "fail", detail: `Canonical does not self-reference: ${canonical}` });
  } else {
    out.push({ id: `page${path}.canonical`, label: `${label}: canonical tag`, status: "pass", detail: canonical! });
  }

  // Title & description
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1]?.trim() ?? "";
  const badTitle = !title || /lovable/i.test(title);
  out.push({
    id: `page${path}.title`,
    label: `${label}: title tag`,
    status: badTitle ? "fail" : title.length > 65 ? "warn" : "pass",
    detail: badTitle ? `Missing or placeholder title: "${title}"` : `${title.length} chars — "${title}"`,
  });
  out.push({
    id: `page${path}.description`,
    label: `${label}: meta description`,
    status: !description ? "fail" : description.length > 165 ? "warn" : "pass",
    detail: !description ? "Missing meta description" : `${description.length} chars`,
  });

  // hreflang alternates
  const alternates = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]!);
  const missingLocales = LOCALES.filter((l) => !alternates.some((a) => a.startsWith(l)));
  out.push({
    id: `page${path}.hreflang`,
    label: `${label}: hreflang alternates`,
    status: alternates.length === 0 ? "fail" : missingLocales.length ? "warn" : "pass",
    detail:
      alternates.length === 0
        ? "No hreflang alternates found"
        : missingLocales.length
          ? `Missing hreflang for: ${missingLocales.join(", ")}`
          : `${alternates.length} alternates (incl. x-default: ${alternates.includes("x-default")})`,
  });

  // Open Graph
  const ogTitle = /<meta[^>]+property=["']og:title["'][^>]+content=["'][^"']+["']/i.test(html);
  out.push({
    id: `page${path}.og`,
    label: `${label}: Open Graph tags`,
    status: ogTitle ? "pass" : "warn",
    detail: ogTitle ? "og:title present" : "og:title missing",
  });

  // Single H1
  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
  out.push({
    id: `page${path}.h1`,
    label: `${label}: single H1`,
    status: h1Count === 1 ? "pass" : h1Count === 0 ? "fail" : "warn",
    detail: `${h1Count} H1 element(s)`,
  });

  // JSON-LD schema validation
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]!);
  if (blocks.length === 0) {
    out.push({ id: `page${path}.schema`, label: `${label}: JSON-LD schema`, status: "warn", detail: "No JSON-LD block found" });
  } else {
    const problems: string[] = [];
    const types: string[] = [];
    for (const [i, raw] of blocks.entries()) {
      try {
        const parsed = JSON.parse(raw) as Record<string, unknown> | Record<string, unknown>[];
        const nodes = Array.isArray(parsed) ? parsed : [parsed];
        for (const node of nodes) {
          if (!node["@context"]) problems.push(`block ${i + 1}: missing @context`);
          const type = node["@type"];
          if (!type) problems.push(`block ${i + 1}: missing @type`);
          else types.push(String(type));
        }
      } catch (error) {
        problems.push(`block ${i + 1}: invalid JSON (${error instanceof Error ? error.message : "parse error"})`);
      }
    }
    out.push({
      id: `page${path}.schema`,
      label: `${label}: JSON-LD schema`,
      status: problems.length ? "fail" : "pass",
      detail: problems.length ? problems.join("; ") : `Valid: ${types.join(", ")}`,
    });
  }

  return out;
}

async function checkLocaleRoutes(baseUrl: string): Promise<CheckResult[]> {
  const out: CheckResult[] = [];
  for (const locale of LOCALES) {
    const url = `${baseUrl}/${locale}`;
    const res = await fetchText(url);
    if (!res.ok) {
      out.push({ id: `locale.${locale}`, label: `/${locale} reachable`, status: "fail", detail: `HTTP ${res.status}` });
      continue;
    }
    const lang = res.text.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1] ?? "";
    out.push({
      id: `locale.${locale}`,
      label: `/${locale} lang attribute`,
      status: lang.startsWith(locale) ? "pass" : "fail",
      detail: lang.startsWith(locale) ? `lang="${lang}"` : `Expected lang="${locale}", got "${lang || "none"}"`,
    });
  }
  return out;
}

export async function runSeoChecks(baseUrl = "https://applywise.eu"): Promise<SeoRunResult> {
  const normalized = baseUrl.replace(/\/+$/, "");

  const groups = await Promise.all([
    checkRobots(normalized),
    checkSitemap(normalized),
    checkLocaleRoutes(normalized),
    ...PAGES_TO_CHECK.map((p) => checkPage(normalized, p)),
  ]);

  const checks = groups.flat();
  const failed = checks.filter((c) => c.status === "fail").length;
  const warned = checks.filter((c) => c.status === "warn").length;
  const passed = checks.filter((c) => c.status === "pass").length;

  return {
    baseUrl: normalized,
    status: failed > 0 ? "fail" : warned > 0 ? "warn" : "pass",
    passed,
    warned,
    failed,
    checks,
    finishedAt: new Date().toISOString(),
  };
}

export function buildAlertEmail(run: SeoRunResult): { subject: string; html: string; text: string } {
  const broken = run.checks.filter((c) => c.status === "fail");
  const warnings = run.checks.filter((c) => c.status === "warn");
  const subject = `[ApplyWise SEO] ${broken.length} check${broken.length === 1 ? "" : "s"} failing on ${run.baseUrl}`;

  const row = (c: CheckResult) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;font:14px system-ui">${c.label}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;font:13px ui-monospace,monospace;color:#444">${c.detail}</td></tr>`;

  const html = `<div style="font:14px system-ui;color:#111;max-width:640px">
  <h2 style="font-size:18px;margin:0 0 8px">SEO monitoring alert</h2>
  <p style="margin:0 0 16px;color:#555">${broken.length} failing, ${warnings.length} warnings, ${run.passed} passing — checked ${run.baseUrl} at ${run.finishedAt}.</p>
  <h3 style="font-size:15px;margin:16px 0 4px;color:#b42318">Failing</h3>
  <table style="border-collapse:collapse;width:100%">${broken.map(row).join("")}</table>
  ${warnings.length ? `<h3 style="font-size:15px;margin:16px 0 4px;color:#b54708">Warnings</h3><table style="border-collapse:collapse;width:100%">${warnings.map(row).join("")}</table>` : ""}
  <p style="margin:20px 0 0"><a href="${run.baseUrl}/seo-monitor" style="color:#4f46e5">Open the SEO monitor dashboard</a></p>
</div>`;

  const text = [
    `SEO monitoring alert for ${run.baseUrl} (${run.finishedAt})`,
    `${broken.length} failing, ${warnings.length} warnings, ${run.passed} passing.`,
    "",
    "Failing:",
    ...broken.map((c) => `- ${c.label}: ${c.detail}`),
    ...(warnings.length ? ["", "Warnings:", ...warnings.map((c) => `- ${c.label}: ${c.detail}`)] : []),
  ].join("\n");

  return { subject, html, text };
}
