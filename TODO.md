# TODO

## SEO
- [ ] Add a real `og:image` / `twitter:image` (1200x630px) — currently `content/seo.js` has `ogImage: ""` left blank, and there's no image meta tag in `index.html`'s SEO block. Without it, link previews (LinkedIn, Slack, Discord, iMessage) render bare.
- [x] Review SEO tags end-to-end (title, meta description, canonical, OG/Twitter tags, JSON-LD, sitemap.xml, robots.txt) — done, findings below.
- [ ] `<title>` (index.html) is generic ("Mikaela — Portfolio") and out of sync with the more descriptive `og:title`/`twitter:title` ("Mikaela — IT / Development / Security"). Align them.
- [ ] `twitter:card` is set to `summary` (small image) — switch to `summary_large_image` once an `og:image` exists.
- [ ] `sitemap.xml` has no `<lastmod>` on its single URL entry — add one.
