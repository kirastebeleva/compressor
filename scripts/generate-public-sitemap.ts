import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { getSitemapEntries } from "../src/lib/sitemap-entries";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const entries = getSitemapEntries();
const body = entries
  .map(
    (e) =>
      `  <url>\n    <loc>${escapeXml(e.url)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

const outPath = join(process.cwd(), "public", "sitemap.xml");
writeFileSync(outPath, xml, "utf8");
console.log(`Wrote ${outPath} (${entries.length} URLs)`);
