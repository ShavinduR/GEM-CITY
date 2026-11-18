# FACET Fine Jewelry

A static website (HTML, CSS, vanilla JavaScript). There is no build step: upload the files to any static host.
See [REVIEW.md](REVIEW.md) for the code review and the reasons behind the design.

## Preview locally
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000. Use a local server rather than double-clicking the HTML file, because JavaScript modules don't run from `file://`.

> **Placeholder email:** the site currently shows `sales@example.com`. Replace it in
> `assets/js/config.js` and in the HTML pages (search and replace `sales@example.com`).

## Everyday changes

| I want to… | Edit |
|---|---|
| Add, remove or re-price a gem | `assets/js/data/gems.js` (one line per stone; prices in LKR) |
| Add or edit jewellery | `assets/js/data/jewellery.js` |
| Mark a piece reserved or sold | add `status: 'reserved'` or `status: 'sold'` to its line |
| Feature a piece on the homepage | add `featured: true` to its line |
| Change the WhatsApp number, phone or email | `assets/js/config.js`, **and** the footer/contact text in the HTML files (search for `+94 71 109 8429`) |
| Change brand colours or fonts | `assets/css/tokens.css` |

### Adding photos
- **Loose gem:** save the photo as `images/gemw/1/<ID>.webp` (for example `A11.webp`) and add a line with `id: 'A11'`.
- **Jewellery:** add the original photo, then create web-sized versions:
  ```bash
  pip install pillow
  python3 scripts/optimize_images.py "images/ui/jewelleryw/24.webp" j-24
  ```
  Then use `photos: [shot('j-24')]` in `jewellery.js`.

### Shareable links (useful in WhatsApp chats)
- `all-gems.html?type=blue`: blue sapphires only
- `all-gems.html#A3`: opens stone A3 directly
- `contact.html?interest=private-viewing&ref=A3`: pre-filled inquiry form

## Structure
```
index.html, all-gems.html, jewellery.html, contact.html, blog.html,
article-*.html, policies.html, 404.html
assets/css/      tokens → base → components → pages
assets/js/       main.js (entry), config.js, modules/, data/
assets/icons.svg icon sprite
assets/fonts/    self-hosted Montserrat
images/opt/      generated responsive images (do not edit by hand)
scripts/         image optimiser
sitemap.xml, robots.txt, site.webmanifest
```
