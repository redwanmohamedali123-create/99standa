# 99's Tailoring & Alterations — website

Five static HTML pages. No build step, no framework, no database. Every file
here is the file that gets served.

```
index.html          Home              →  yoursite.com/
services/           Services & Pricing →  yoursite.com/services/
about/              About              →  yoursite.com/about/
contact/            Contact & Hours    →  yoursite.com/contact/
book/               Book an Appointment→  yoursite.com/book/
sitemap.xml         List of pages, for Google
robots.txt          Points crawlers at the sitemap
favicon.svg/.png    Browser tab icon
assets/
  styles.css        All styling — shared by every page
  site.js           Contact form, mobile menu, Calendly, optional live reviews
  fonts/            The three typefaces, served from this site
  logo-navy.svg     Header mark
  logo-cream.svg    Footer mark
  img/              Photographs + the social share image
```

Each page is an `index.html` inside its own folder. That's what makes addresses
read `/contact/` rather than `/contact.html`, and it works the same on GitHub
Pages, Hostinger, or any other static host — no server configuration needed.

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
   folder* — `index.html`, the `services`, `about`, `contact` and `book`
   folders, `sitemap.xml`, `robots.txt`, the favicons, and the whole `assets`
   folder. Commit.

   > Important: upload the **contents**, not the folder itself. `index.html`
   > must sit at the top level of the repository, alongside the `assets`,
   > `services`, `about`, `contact` and `book` folders.
   >
   > **Replacing an earlier upload?** Delete the old `services.html`,
   > `about.html`, `contact.html` and `book.html` from the repository first,
   > or you'll have both versions live at once.

3. **Connect Hostinger.** In hPanel, open your website → **Advanced → Git** →
   **Connect with GitHub**. Authorise the Hostinger GitHub App and grant it
   access to this repository.

4. **Configure and deploy.** Pick the repository, set the branch to `main`, and
   leave the deploy directory as the root (`public_html`). Click **Deploy**.
   Progress streams live in the dashboard.

5. **Done.** Every push to `main` now deploys automatically. There's also a
   **Redeploy** button if you ever want to pull again by hand.

> Deploying **overwrites** whatever is already in `public_html`. If a site is
> live there now, download a copy from File Manager first.

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

4. **Test the contact form.** Send yourself a message from `/contact/` and
   confirm it arrives. It goes through Web3Forms using the key already in
   `contact/index.html`.

---

## Changing things later

Everything you'd realistically want to edit is plain text.

**Prices** — `services/index.html`. Each line looks like this; change the
name or the number and nothing else:

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

**Reviews and rating** — in `index.html`, not the script. Search for
`review-card` and you'll find the ten of them written out as plain HTML; copy
one, change the name and text, and it appears. The `4.9` and `300+` are a few
lines above, in the block with the Google logo. Keep those matching what your
listing actually shows — the button beside them takes visitors straight there.

Six show by default and the rest sit behind a button. Any card marked
`data-extra` is one of the hidden ones; remove that word to show it always.

**Booking link** — `book/index.html`, the `data-url` on the Calendly widget.

**Photographs** — drop replacements into `assets/img/` using the same
filenames. Keep them under about 300 KB each so pages stay quick.

---

## Notes

- The site needs no server-side anything. It will run on any static host.
- Typefaces are served from `assets/fonts/`, not from Google. One less
  third-party dependency, one less round trip, and the type can't silently
  fall back to something else.
- Two outside services are used: Calendly (booking) and Web3Forms (contact
  form). Both fail gracefully — if Calendly is blocked the page offers a phone
  number instead.
- Each page carries only the icons it actually draws, and `styles.css` is
  compiled from these five files, so there is no unused CSS shipped.
- Nothing here tracks visitors. There are no cookies and no analytics. If you
  ever want visitor numbers, that's a separate decision.
