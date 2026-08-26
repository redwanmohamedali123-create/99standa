# 99's Tailoring & Alterations — website

Five static HTML pages. No build step, no framework, no database. Every file
here is the file that gets served.

```
index.html          Home
services.html       Services & Pricing
about.html          About
contact.html        Contact & Hours
book.html           Book an Appointment
sitemap.xml         List of pages, for Google
robots.txt          Points crawlers at the sitemap
favicon.svg/.png    Browser tab icon
assets/
  styles.css        All styling — shared by every page
  site.js           Reviews, contact form, menu, Calendly
  logo-navy.svg     Header mark
  logo-cream.svg    Footer mark
  img/              Photographs + the social share image
```

Everything shared lives in `assets/`, so a visitor downloads the stylesheet,
the script and the logo once and every page after that loads from cache.

---

## Deploying

### Option A — GitHub, with automatic deploys (recommended)

Set this up once and every future change goes live by pushing to GitHub.

1. **Create the repository.** On github.com, click **New repository**, name it
   something like `99standa-website`, leave it **Public** (simplest — Hostinger
   connects to public repos without SSH keys), and create it.

2. **Upload these files.** Easiest without touching a terminal: on the new repo
   page click **uploading an existing file**, then drag in *the contents of this
   folder* — the five `.html` files, `sitemap.xml`, `robots.txt`, the favicons,
   and the whole `assets` folder. Commit.

   > Important: upload the **contents**, not the folder itself. `index.html`
   > must sit at the top level of the repository, not inside a subfolder.

3. **Connect Hostinger.** In hPanel, open your website → **Advanced → Git** →
   **Connect with GitHub**. Authorise the Hostinger GitHub App and grant it
   access to this repository.

4. **Configure and deploy.** Pick the repository, set the branch to `main`, and
   leave the deploy directory as the root (`public_html`). Click **Deploy**.
   Progress streams live in the dashboard.

5. **Done.** Every push to `main` now deploys automatically. There's also a
   **Redeploy** button if you ever want to pull again by hand.

### Option B — straight upload, no GitHub

In hPanel open **File Manager**, go into `public_html`, delete whatever is
already there, and upload the contents of this folder. Same rule: `index.html`
at the top level, `assets` as a folder beside it.

Faster to do once, but every future change is another manual upload with no
history and no way to undo. Option A is worth the extra fifteen minutes.

---

## After it's live — five minutes, worth doing

1. **Check the share card.** Paste `https://www.99standa.com/` into
   [Facebook's Sharing Debugger](https://developers.facebook.com/tools/debug/).
   It should show the photo of the seam being trimmed. If it doesn't, confirm
   `assets/img/og-image.jpg` loads in a browser.

2. **Tell Google the site exists.** Add the site in
   [Google Search Console](https://search.google.com/search-console), verify
   ownership, then submit `https://www.99standa.com/sitemap.xml` under
   **Sitemaps**. This is what gets the five pages indexed separately — the
   pricing page is the one most likely to bring in searches.

3. **Link it from your Google Business Profile.** Point the website field at
   `https://www.99standa.com/`. The structured data on the home page tells
   Google the address, hours and prices match the listing.

4. **Test the contact form.** Send yourself a message from `contact.html` and
   confirm it arrives. It goes through Web3Forms using the key already in
   `assets/site.js`.

---

## Changing things later

Everything you'd realistically want to edit is plain text.

**Prices** — `services.html`. Each line looks like this; change the name or the
number and nothing else:

```html
<li class="flex justify-between items-end">
  <span ...>Shorten Sleeve</span>
  <div ...></div>
  <span ...>$50</span>
</li>
```

**Hours or address** — they appear in three places: the footer of every page,
the Contact page, and the structured data block near the top of `index.html`.
Update all three so Google doesn't see a contradiction.

**Reviews and rating** — top of `assets/site.js`, in the `GOOGLE` block. The
rating and count are set to `4.9` and `300+`; keep them matching what your
Google listing actually shows, since the button next to them takes visitors
straight there. Add reviews to the `reviews` array in the same shape as the
ones already there.

**Booking link** — `book.html`, the `data-url` on the Calendly widget.

**Photographs** — drop replacements into `assets/img/` using the same
filenames. Keep them under about 300 KB each so pages stay quick.

---

## Notes

- The site needs no server-side anything. It will run on any static host.
- Three outside services are used: Google Fonts (typefaces), Calendly
  (booking), and Web3Forms (contact form). Each fails gracefully — if Calendly
  is blocked the page offers a phone number instead, and if the fonts don't
  load the site still renders in a system serif.
- Nothing here tracks visitors. There are no cookies and no analytics. If you
  ever want visitor numbers, that's a separate decision.
