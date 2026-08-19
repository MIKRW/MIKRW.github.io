// ============================================================================
// SEO / METADATA CONTENT — search engine + link-preview metadata.
//
// NOTE: because link-preview crawlers (LinkedIn, Slack, Twitter, iMessage)
// don't execute JavaScript, the tags they read (page <title>, meta
// description, Open Graph, Twitter card) can't be generated from this file —
// they're hardcoded in the "=== SEO ===" block near the top of index.html's
// <head>. Update BOTH places when the pitch changes so they stay in sync.
//
// Everything in this file feeds the JSON-LD structured-data block that
// script.js injects into <head> at load — that one's fine to keep dynamic
// since search engines (Google) do execute JS before reading it.
// ============================================================================

window.SITE_CONTENT = window.SITE_CONTENT || {};

SITE_CONTENT.seo = {
  siteUrl: "https://mikrw.github.io/portfolio_site/",

  // Same copy that's mirrored into index.html's static meta description / og:description.
  description: "Mikaela is a uni student building projects in IT, development, and cybersecurity, and looking for internships.",

  // Comma-searchable topics for your own reference — not read by Google directly,
  // but useful as a checklist for the words your bio/project text should actually contain.
  keywords: ["IT support", "cybersecurity", "junior developer", "internship", "portfolio"],

  // Path to a real social-preview image (1200x630px recommended) once you have one —
  // e.g. "og-image.png" placed at the repo root. Leave blank until then; the static
  // og:image / twitter:image tags in index.html should be removed or filled in to match.
  ogImage: "",

  // schema.org/Person fields for the JSON-LD block.
  person: {
    name: "Mikaela",
    jobTitle: "IT Support / Junior Cybersecurity",
    sameAs: [
      "https://github.com/MIKRW",
      "https://www.linkedin.com/in/mikaela-ward/"
    ]
  }
};
