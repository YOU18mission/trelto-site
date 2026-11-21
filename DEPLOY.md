# Deploy Trelto (trelto.com)

Static HTML/CSS/JS. No build step, $0 hosting. Deploy the contents of this folder (`site/`) as the site root.

**Recommended path now: GitHub Pages, with DNS left at Spaceship.**

The Spaceship zone already has Zoho Mail MX, SPF, DKIM, and DMARC records for `hello@trelto.com` and `luke@trelto.com`. Those records must stay. Do not change the domain’s nameservers.

Cloudflare Pages can serve `www` with a CNAME while leaving nameservers at Spaceship, but its official setup for the apex (`trelto.com`) requires moving the zone to Cloudflare nameservers. That is the wrong move here. GitHub Pages is the simplest $0 option that can take both `trelto.com` and `www.trelto.com` with A/AAAA/CNAME records added alongside the existing mail records.

This file is the runbook. The live deploy was not completed from the bot: the connected GitHub connector can read Luke’s GitHub account but cannot create a repository, push files, or enable Pages, and the local `gh` CLI is not logged in. There is no Cloudflare connector. See “Account step still needed” below.

## What’s in this folder

| Path | Role |
|---|---|
| `index.html` | Home |
| `snapshot.html` | Free AI Snapshot form (mailto hello@trelto.com) |
| `sample-audit.html` | Anonymized method sample (not a client) |
| `privacy.html`, `terms.html`, `404.html` | Legal and error pages |
| `css/`, `js/`, `fonts/`, `img/` | Assets (fonts are self-hosted) |
| `robots.txt`, `sitemap.xml` | Crawling |
| `CNAME` | `trelto.com` (used by GitHub Pages) |
| `.nojekyll` | Stops GitHub from running Jekyll |
| `_headers`, `_redirects` | Used by Cloudflare Pages only, harmless on GitHub |
| `shots/` | Local design screenshots; do not publish (listed in `.gitignore`) |

Preview locally:

```bash
python3 -m http.server 8765 --directory /workspace/aeo-agency/site
```

Then open http://127.0.0.1:8765/

## A. GitHub Pages (recommended — keeps DNS at Spaceship)

1. Create a **public** GitHub repository named `trelto-site` under Luke’s GitHub account.
2. Put the contents of this `site/` folder at the **repository root** (the HTML files, `css/`, `js/`, `fonts/`, `img/`, `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml`). Do not upload `shots/`.
3. In the repo: Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / root (`/`). Wait until `https://<github-username>.github.io/trelto-site/` loads. Because a `CNAME` file is present, GitHub will also expect the custom domain; if the site 404s on the github.io URL before DNS is pointed, that’s expected.
4. In Settings → Pages → Custom domain, confirm `trelto.com` (the `CNAME` file already says that). Also add or allow `www.trelto.com`. Wait for the certificate. Enforce HTTPS.
5. At **Spaceship**, leave nameservers alone and **add** the records below. Do not delete or edit the existing Zoho MX, SPF, DKIM, or DMARC records. Do not turn on a Spaceship “parking” or “forwarding” profile that would overwrite the zone.

### Exact DNS records to add at Spaceship

Host `@` means the apex, `trelto.com`. TTL 3600 (or Spaceship’s default) is fine.

**A records for `trelto.com` (add all four):**

| Type | Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

**AAAA records for `trelto.com` (recommended, add all four):**

| Type | Host | Value |
|---|---|---|
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

**CNAME for www:**

| Type | Host | Value |
|---|---|---|
| CNAME | `www` | `<github-username>.github.io` |

Replace `<github-username>` with the account that owns `trelto-site`. Do not CNAME `www` at `trelto.com` itself, and do not point MX or TXT records at GitHub.

If Spaceship already has an A, AAAA, or CNAME on `@` or `www` from domain parking, remove only those conflicting web records — never the Zoho MX/TXT records — then add the table above.

6. After DNS propagates, confirm:
   - https://trelto.com/ and https://www.trelto.com/ (one should redirect to the canonical `https://trelto.com/`)
   - /snapshot.html, /sample-audit.html, /privacy.html, /terms.html, and a made-up path showing `404.html`
   - A test email to hello@trelto.com still arrives (mail records untouched)
   - Fonts load from `/fonts/` and https://trelto.com/img/og.png is the social preview

GitHub’s custom-domain docs: https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site

## B. Cloudflare Pages (only if you accept a nameserver change)

Official Cloudflare Pages setup for `trelto.com` (the apex) requires adding the domain as a Cloudflare zone and changing nameservers. That would mean copying every Zoho MX/SPF/DKIM/DMARC record into Cloudflare **before** the nameserver change, then changing nameservers at Spaceship. It is $0, but it is riskier for mail than option A and is not the default here.

Serving only `www.trelto.com` from Pages (CNAME `www` → `<project>.pages.dev`) can leave nameservers at Spaceship, but then `trelto.com` itself would still need a separate apex solution.

Skip this unless GitHub Pages is unavailable.

## Account step still needed

The site files are ready. They are not live yet.

- The Cursor GitHub connector is connected as **YOU18mission** and can list repositories, but it has no tool to create a repo, push files, or enable GitHub Pages. There is no `trelto-site` repository today.
- The box `gh` CLI is not logged in.
- There is no Cloudflare connector, and no Cloudflare account should be created just to get around this.

To finish the deploy, one of these is enough (all $0):

1. **Preferred:** Log the box (or the bot) into Luke’s GitHub account with permission to create a public repo — for example `gh auth login` with a token that can create `trelto-site`, or a GitHub connector that can create repos and push — and ask the bot to finish the deploy. Then add the Spaceship records above.
2. **Manual, about 10 minutes:** Create public repo `trelto-site` on GitHub, upload this `site/` folder as the root (including `CNAME` and `.nojekyll`, excluding `shots/`), turn on Pages from the `main` branch root, then add the A/AAAA/CNAME records at Spaceship without touching Zoho mail records.

## Snapshot form

`hello@trelto.com` is live on Zoho Mail Free. The form still opens the visitor’s email app with a filled-in request to that address, which is enough for launch and costs $0.

If you later want in-browser submit without a mail app, add a free Formspree or Tally form and follow the earlier note in this folder’s history: set `data-formspree="https://formspree.io/f/<id>"` on `#snapshot-form`, and name the provider in the privacy policy.

## What not to do

- Don’t change Spaceship nameservers.
- Don’t delete or edit Zoho MX, SPF, DKIM, or DMARC records.
- Don’t pay for GitHub, Cloudflare, or a form tool.
- Don’t publish `shots/`.
