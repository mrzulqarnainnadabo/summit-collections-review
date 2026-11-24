# The Summit Collections — founder review storefront

A responsive editorial storefront for the founder's abaya collection. This project is developed separately from the original production website.

## Brand direction

- Preserve the supplied Summit Collections logo asset at `assets/summit-logo.webp`.
- Use a restrained black, warm ivory, taupe and muted-gold palette.
- Lead with the founder's actual garments and photography.
- Keep the interface editorial, spacious and product-led rather than a generic ecommerce template.

## Founder-supplied catalogue

The working catalogue is defined in `data/products.json`.

- 14 product references are represented in the review catalogue.
- SC-003 and SC-004 are separate garments cropped from the shared IMG_8888 source.
- SC-010 is explicitly labelled back-view-only.
- SC-015 remains provisional and is excluded from the public collection.
- Legacy visual matches have been restored selectively: Yasmine (last recorded price ₦480,000), Turquoise Bloom and Lilac Border. These labels are carried forward only where the garment colour and distinctive detailing support the match.
- Other pieces use temporary editorial visual descriptors (for example, Sage Lace and Gilded Ivory), not founder-approved official names.
- Yasmine's price is a legacy record and must be reconfirmed with the founder before any order is accepted.
- No other product prices, sizes, stock levels or product claims are invented.

The 14 approved founder-supplied WebP derivatives are committed at `/products/sc-001.webp` through `/products/sc-014.webp`. Their archive manifest was checked against image dimensions and byte sizes before import.

## Experience

- Editorial hero, brand story, collection browsing and location section.
- Filters for neutral, dark and colour edits, plus search.
- Product detail dialog and enquiry selection drawer.
- WhatsApp enquiry handoff; the store confirms current price, size, availability and delivery directly.
- Responsive navigation, reduced-motion support and scroll-based editorial details.
- Social-sharing metadata is defined without inventing a canonical production URL or an unapproved social preview image.
- Static catalogue JSON uses normal browser caching; the lead hero photograph is preloaded and marked high priority.

## Commerce boundary

This is a catalogue and enquiry experience. It does not process payments or claim live inventory. All pricing, sizing and availability must be confirmed by the store.

## Development and release status

- Active development branch: `feat/founder-catalogue-foundation`.
- Founder asset import completed: 14 of 14 WebP files committed; SC-010 remains back-view-only and SC-015 remains unpublished.
- GitHub Actions passed the import workflow and the catalogue metadata/storefront contract checks after asset integration.
- The development workflow now also requires all 14 image files to exist, and the import workflow checks each WebP's dimensions and byte size against the manifest.
- Browser QA runs 15 Chromium tests covering WCAG A/AA checks, all published catalogue images, provisional-item exclusion, back-view and naming disclosures, search/filter behaviour, product detail and enquiry flows, empty enquiry-state handling, WhatsApp handoff, keyboard focus, mobile touch targets, and horizontal overflow at 390px, 820px and 1440px. Latest completed run passed 15/15 on `50e3888ba3782e4e46bd6e250323347ecbb2981f`.
- Responsive typography, text contrast, enquiry-drawer readability and mobile touch-target corrections are included. Browser QA screenshots capture the full storefront, product-detail dialog and enquiry drawer at mobile (390px), tablet (820px) and desktop (1440px). Product-detail capture now waits for the entrance animation to finish.
- Latest completed browser QA: https://github.com/mrzulqarnainnadabo/summit-collections-review/actions/runs/45438178394 (15/15 passed; screenshot artifact `summit-storefront-browser-qa`, artifact ID `14941793988`). Latest completed catalogue integrity: https://github.com/mrzulqarnainnadabo/summit-collections-review/actions/runs/45438178317 (passed).
- No review deployment has been created for the current branch. Vercel is intentionally out of scope.
- The original production website and `main` branch remain untouched. Do not deploy or merge without explicit approval.
