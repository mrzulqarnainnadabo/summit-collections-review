# The Summit Collections — founder review storefront

A responsive editorial storefront for the founder's abaya collection. This project is developed separately from the original production website.

## Brand direction

- Preserve the supplied Summit Collections logo asset at `assets/summit-logo.webp`.
- Use a restrained black, warm ivory, taupe and muted-gold palette.
- Lead with the founder's actual garments and photography.
- Keep the interface editorial, spacious and product-led rather than a generic ecommerce template.

## Founder-supplied catalogue

The working catalogue is defined in `data/products.json`.

- 14 confirmed product references are represented.
- SC-003 and SC-004 are separate garments cropped from the shared IMG_8888 source.
- SC-010 is explicitly labelled back-view-only.
- SC-015 remains provisional and is excluded from the public collection.
- Legacy visual matches have been restored selectively: Yasmine (last recorded price ₦480,000), Turquoise Bloom and Lilac Border. These labels are carried forward only where the garment details support the match.\n- Yasmine's price is a legacy record and must be reconfirmed with the founder before checkout or final publication.\n- No other product prices, sizes, stock levels or product claims are invented.

Approved image derivatives are referenced at `/products/sc-001.webp` through `/products/sc-014.webp`. The converted source JPEGs are retained separately; only carefully prepared derivatives should be committed to the storefront.

## Experience

- Editorial hero, brand story, collection browsing and location section.
- Filters for neutral, dark and colour edits, plus search.
- Product detail dialog and enquiry selection drawer.
- WhatsApp enquiry handoff; the store confirms current price, size, availability and delivery directly.
- Responsive navigation, reduced-motion support and scroll-based editorial details.

## Commerce boundary

This is a catalogue and enquiry experience. It does not process payments or claim live inventory. All pricing, sizing and availability must be confirmed by the store.

## Development and release status

- Active branch: `feat/founder-catalogue-foundation`.
- The catalogue data and storefront rendering have been connected to the 14 confirmed product references.
- The prepared WebP product image derivatives are packaged separately and still need to be committed under `/products` before a founder-facing preview is considered ready.
- Browser QA and a fresh Vercel preview are pending.
- The original production site and `main` branch have not been changed by this work.
