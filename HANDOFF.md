# The Summit Collections: Claude Code Execution Handoff

Save this file as `HANDOFF.md` in the repo root (or paste it whole into Claude Code). It is an execution brief, not a design document. Do not re-audit the deployed site. The audit is done (see section 1). Build.

---

## 0. Mission

Turn the founder-review storefront into a premium, internationally credible abaya label experience: original editorial design, exceptional presentation of the founder's photographs, refined purposeful motion, flawless mobile behaviour, and a trustworthy enquiry flow. Deliver a verified Vercel founder-review deployment with screenshot evidence and a QA report.

Success = a founder can open one URL on a phone and feel the brand is worth more. Not "it builds".

---

## 1. Known starting facts (do not re-verify, just use)

- Repo: `mrzulqarnainnadabo/summit-collections-review`
- Base branch: `feat/founder-catalogue-foundation` (latest commit: "fix: pass storefront accessibility and responsive QA")
- Vercel project: `summit-collections-founder-review`, team scope `mrzulqarnainnadabo-8349s-projects`
- Current review URL: https://summit-collections-founder-review-5zw2rsc1f.vercel.app
- An older redesign attempt exists on `feat/premium-storefront-v2`. Treat it as reference only. Do not build on it.
- Catalogue: 14 pieces, images at `/products/sc-001.webp` to `sc-014.webp`, logo at `/assets/summit-logo.webp`.
- Known weaknesses of the current site, to fix:
  1. Products are anonymous ("Piece 01"). There is no catalogue identity.
  2. Brand introduction is thin: two image pairs and one line of copy.
  3. Filters are only Neutrals / Dark tones / Colour.
  4. No `og:image`; the Twitter card is `summary`. Shared WhatsApp links look unfinished.
  5. Header appears to stack two layers with repeated WhatsApp CTAs.
  6. Generic "Abayas in detail." hero. It is not memorable.
- Facts that must be preserved exactly (read them from the existing code or config, do not retype): WhatsApp number/link, store address, Instagram link, "Price on enquiry" behaviour, the enquiry-bag to WhatsApp flow.

---

## 2. Hard rules (violating any is a failed session)

1. Never touch the original production site (`the-summit-collections.netlify.app`). Run no Netlify commands.
2. Never run `vercel --prod`, `vercel promote`, `vercel alias`, `vercel domains`, or `vercel env` changes. Never push to `main` or any production branch. Never merge.
3. Only push to the new feature branch (section 3). Vercel's Git integration builds it as a Preview.
4. Never change repo visibility. Never buy or register anything.
5. Never invent product names, prices, sizes, stock, reviews, testimonials, awards, delivery promises, founder stories, or history.
6. Never alter, retouch, recolour, regenerate or overwrite the founder's original photographs. Originals stay byte-identical (verify with `git diff --stat` and a checksum list). You may generate resized derivatives into a separate folder for delivery. Never stretch or carelessly crop.
7. The enquiry-bag to WhatsApp flow must keep working. Any change must be re-tested end to end.
8. If a command could affect production or anything irreversible, stop and ask.
9. Do not claim anything works without having run it. Report failures plainly.

---

## 3. Setup (run in order; stop at the first failure and report it)

```bash
# Tooling
node -v            # need >= 20
gh auth status || gh auth login          # GitHub: needs push access to the repo
npm i -g vercel
vercel whoami || vercel login

# Repo + branch
git clone https://github.com/mrzulqarnainnadabo/summit-collections-review.git
cd summit-collections-review
git fetch --all
git checkout feat/founder-catalogue-foundation
git checkout -b feat/summit-flagship-v3

# Link to the existing review project ONLY
vercel link --yes --project summit-collections-founder-review --scope mrzulqarnainnadabo-8349s-projects
cat .vercel/project.json                  # confirm projectName is summit-collections-founder-review

# Safety checks before any deploy
vercel project inspect summit-collections-founder-review --scope mrzulqarnainnadabo-8349s-projects
#  -> note the Production Branch. Confirm feat/summit-flagship-v3 is NOT it.
#  -> if it is, STOP and ask.

# Install + baseline
cat package.json | head -50               # note framework, scripts, deps
npm install
npm run build                             # record baseline success/failure

# Test tooling
npm i -D @playwright/test @axe-core/playwright
npx playwright install chromium
```

Required access, nothing more:
- GitHub: write access to `summit-collections-review` (push the feature branch only).
- Vercel: member access to the team above so the CLI can link and read deployments.
- No production credentials, DNS, domain or billing access are needed or wanted.

Preview-protection note: if the founder cannot open the preview without a Vercel login, report that and ask. Do not disable protection on your own.

---

## 4. Skills and references (time-box: 20 minutes total, then build)

Purpose: extract a one-page `design/principles.md` of rules you will actually apply. Do not write essays.

1. Check which skills Claude Code already has (`/skills` or the plugin list). If a `frontend-design` skill is available, load and use it.
2. Fetch and read, in this order. Verify each URL resolves; if one does not, say so and move on, never guess the content:
   - Vercel Web Interface Guidelines (`vercel-labs` org, `web-design-guidelines` / agent-skills repo): apply as a lint checklist.
   - Emil Kowalski's design-engineering writing and animation guidance (`emilkowalski`): easing, durations, interruptibility.
   - ThinkUI (thinkui.xyz) and Anti UI Slop (uizze.com): the anti-patterns list.
   - Taste Skill (`Leonxlnx` GitHub): find the exact repo; do not assume the bare profile URL.
3. Motion/pattern references (look, extract technique, never copy): scrolltide.co, awwwards.com, godly.website, 60fps.design, navbar.gallery, footer.design, cta.gallery.
4. Output: `design/principles.md` with at most 15 bullets: type, spacing, image treatment, motion durations/easings, anti-slop bans. Commit it.

---

## 5. Design exploration (decision by prototype, not by document)

First, look at all 14 photographs at full size. Record in `design/photo-notes.md`: aspect ratio, subject placement, background, lighting, which are strong hero candidates, which are weak. Resolution gaps become founder requests (section 9).

Then build two working hero + collection-grid prototypes as real routes (for example `/?v=a` and `/?v=b`), using real photos. Seeds only; the photos decide:

- **Direction A: "Atelier Index."** Warm paper ground (the current `#f1eee8` theme colour is a starting point), a fine serif display face paired with a restrained sans, numbered catalogue index (SC-001 to SC-014 as editorial catalogue references, not product names), hairline rules, asymmetric full-bleed photography, quiet motion.
- **Direction B: "Dark Gallery."** Deep, warm-neutral dark ground, the photographs lit like a gallery wall, oversized cropped-by-design typography only where it earns its place, horizontal scrolling lookbook moment, stronger contrast.

Rules for both: not black-and-gold by default. The palette comes from the actual fabrics and photography. No stock imagery. No generic gradient hero. No rounded-card grid. No fake trust badges.

Screenshot both at 390 and 1440 into `qa/direction/`. Pick one by judging which makes the actual photographs look best. Write a five-line rationale in `design/direction.md`. Delete the loser's route. Then implement fully.

---

## 6. Build scope (all of it, not just the homepage)

- **Homepage:** distinctive hero from real photography; one purposeful primary action; considered transition into the collection; confirmed-fact brand introduction only. Where facts are missing, use a quiet, honest line, not invented copy.
- **Header / navigation:** one clean layer; mobile menu as an accessible dialog (focus trap, Esc, focus return); one persistent WhatsApp entry, not three.
- **Collection:** consistent image ratio with no distortion; per-image `object-position` metadata so important details are never cut; search plus the filters the catalogue truly supports (colour groupings derived from the photos; mark them "founder to confirm" in the data file); catalogue reference on every item; hover and focus states; empty and no-results states.
- **Product detail:** large, careful image presentation (zoom or gallery only if more than one image exists; do not fake extra views); catalogue reference; "Price on enquiry"; size/fit/availability shown only as "Ask the store" until the founder supplies data; "Add to selection" and direct "Enquire on WhatsApp".
- **Enquiry bag:** drawer with quantity, note, contact details where the current flow requires them, and the WhatsApp handoff message built from selected items. Preserve current behaviour. Add a test.
- **Footer:** correct address (with the existing directions link), WhatsApp, Instagram, useful navigation. Nothing invented.
- **Meta:** real `og:image` (generated from an existing photograph with the logo, written to a separate file; never alter the originals), `summary_large_image`, correct titles/descriptions, `lang`, favicon, `robots`, sitemap if applicable.
- **Data layer:** keep the catalogue in one data file (or the existing CSV/JSON) with explicit nullable fields (`name`, `price`, `sizes`, `availability`, `verified: false`). The UI must render gracefully when they are null and must start showing them automatically once the founder fills them in.

Stack rule: keep the existing framework. Add at most one motion library (Motion or GSAP, justify it in the PR) and optional smooth-scroll only if it measurably improves feel without hurting a11y. No Three.js/WebGL unless a prototype proves a clear benefit within the performance budget.

---

## 7. Motion specification

- Page entrance and headline reveal: staggered, under about 900ms total, ease-out curves; no bounce.
- Image reveals: clip or mask reveals tied to scroll, once per element.
- Collection hover: image shift or secondary-info reveal; 150 to 250ms; interruptible.
- Product-to-detail transition: shared-element or crossfade with correct focus handling.
- Nav, drawer, dialog: spring or ease transitions under 300ms.
- Animate only `transform` and `opacity`. No layout thrash. No animation that blocks interaction.
- `prefers-reduced-motion: reduce` gives an effectively static, fully usable site (test it).
- Low-power and mobile: simplify (no parallax, shorter reveals, no smooth-scroll hijack).
- If a motion cannot be justified in one sentence of "what it communicates", cut it.

---

## 8. Verification (all required; evidence goes in `qa/`)

Commit scripts, not just results, so runs are reproducible.

**Automated**
- [ ] `npm run build` passes; lint and typecheck pass (add the scripts if missing).
- [ ] Playwright e2e at 390, 768, 1024, 1440 px: nav (desktop and mobile), search, each filter, open a product, add to selection, change quantity, remove, enquiry drawer, WhatsApp URL built correctly (assert the `wa.me/…?text=` content), footer links, keyboard-only pass (Tab order, visible focus, Esc closes dialogs).
- [ ] axe-core on every route and on open dialogs: zero serious or critical violations.
- [ ] Console: zero errors and warnings on every route.
- [ ] Link check: every internal and external link returns success (`wa.me`, Instagram, Maps link included).
- [ ] No horizontal overflow at 360, 390, 768, 1024, 1440.
- [ ] Lighthouse (mobile preset) on home and a product page. Targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95; LCP ≤ 2.5s, CLS ≤ 0.05. Run against the **deployed preview**, not only localhost. If a target is missed, fix it or report it honestly with the cause.
- [ ] Reduced-motion run: screenshots and a pass of the e2e suite with `reducedMotion: 'reduce'`.
- [ ] Original photographs unchanged: `git diff --stat` shows no modified files under the original image folder; save a checksum list to `qa/checksums.txt`.

**Visual (you must actually look at them, critically)**
- [ ] Full-page and above-the-fold screenshots at the four widths for: home, collection, product detail, enquiry drawer open, mobile menu open, footer, no-results state. Save under `qa/screenshots/`.
- [ ] Review each screenshot against: hierarchy, spacing precision, image clarity on mobile, text contrast, nothing clipped, nothing that looks template-generated. Fix and re-shoot. Do at least two critique-and-fix rounds before deploying.
- [ ] Ask: would this sit credibly beside international fashion labels? Would a first-time customer feel safe enquiring? Are the photographs the star?

---

## 9. Deploy and report

```bash
git add -A
git commit -m "feat: summit flagship v3 founder-review storefront"
git push -u origin feat/summit-flagship-v3     # the ONLY push allowed
```

Then:
1. Find the Preview deployment for this branch (Vercel dashboard, or `vercel ls --scope mrzulqarnainnadabo-8349s-projects`). Confirm state READY and that its target is Preview, not Production.
2. Run the Lighthouse and Playwright checks against that deployed URL. Save results.
3. Write `qa/REPORT.md`: deployment URL and commit SHA; what changed (max 10 bullets); checklist results with pass/fail and numbers; any failures or known weaknesses; screenshot index.
4. If the Vercel build fails: read the build log, fix, push again. Never paper over it.

**Founder-confirmation list (include in the report verbatim)**
- Product names and prices for each of the 14 pieces (or confirmation to keep "Price on enquiry").
- Sizes, fit notes, availability, delivery terms.
- Confirmed colour/category groupings.
- Brand statement or story, and whether any tagline ("Elegance Is The Only Beauty That Never Fades", "Dubai In Nigeria", nationwide delivery) is approved for use. Use them only if the founder confirms.
- Additional photographs wanted: a clean back and detail view for each piece, consistent lighting and background, at least 2000px on the long edge; one hero-quality editorial image set; a store exterior or interior photo for the visit section.
- Confirmation that all 14 pieces are final and none are provisional.

---

## 10. Working discipline

- Order: setup → principles (20 min) → photo notes → two prototypes → pick → full build → motion → QA loop → deploy → report.
- Commit often on the feature branch, in small meaningful commits.
- Do not re-audit the old deployment. Do not write long design prose. Decisions live in short files; proof lives in screenshots and test output.
- When something is ambiguous and could affect the founder's brand claims, use a placeholder state and list it in the founder-confirmation list, never a guess.
- End the session by stating the preview URL, the commit SHA, and the pass/fail summary, and nothing more.

---

## Kickoff prompt (paste into Claude Code after `cd summit-collections-review`)

> Read HANDOFF.md fully and follow it in order. Start with section 3 setup; report each command's result briefly. Do not audit the old deployment. Do not touch production. Begin the 20-minute reference study, then photo notes, then the two prototypes. Show me the two direction screenshots and your pick before the full build.