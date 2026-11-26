# Agent instructions — The Summit Collections

Read `HANDOFF.md` if present, then `design/principles.md` and `design/photo-notes.md` before changing the storefront.

## Non-negotiable boundaries
- Work only on `feat/summit-flagship-v3` unless explicitly instructed otherwise.
- Never touch `main`, production branches, the original Netlify site, production Vercel projects, domains, billing or environment variables.
- Do not run production deploy/promote/alias commands.
- Preserve the 14 founder-supplied WebP files byte-for-byte.
- Do not invent product names, prices, sizes, stock, reviews, testimonials, awards, delivery claims, founder history or brand statements.
- Keep SC-015 unpublished; disclose SC-010 as back-view-only; mark temporary catalogue descriptors as unapproved.
- Preserve the existing WhatsApp enquiry-bag flow and verify any changes end to end.

## Design and implementation
- Build from the actual repository and existing data, not generic templates.
- Product photography is the primary content. Never stretch or carelessly crop it.
- Keep the existing stack unless a documented reason supports changing it.
- Motion must be purposeful, interruptible, compositor-friendly and reduced-motion aware.
- Use semantic HTML, keyboard-operable controls, visible focus, correct image dimensions and responsive layouts.
- No inert controls, fake metrics, fake social proof, generic AI UI patterns or unnecessary 3D.

## Verification honesty
- Run available checks and report exact outcomes.
- Do not claim visual inspection, browser testing, Lighthouse or deployment success unless actually performed.
- Capture mobile and desktop screenshots and review them critically before calling the work complete.
