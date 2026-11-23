# The Summit Collections — storefront review

A responsive, mobile-first editorial storefront prototype for The Summit Collections, Abuja.

## Brand rules
- Preserve the supplied SC / The Summit Collections logo artwork exactly; do not redraw, recolour, simplify or replace it.
- Keep the brand's gold, black and light neutral identity. The current site uses a restrained black, gold and warm-neutral interface.
- The actual logo image still needs to be added as an original image asset before the final header/footer logo placement can be completed. Until then, the interface uses the brand name as text rather than a fabricated logo mark.

## Responsive experience
- Phone: compact navigation, two-column product browsing, stacked product details and full-width bag drawer.
- Tablet: adjusted navigation, two-column product catalogue and balanced editorial sections.
- Laptop/desktop: full navigation, editorial split hero and multi-column catalogue.
- Supports reduced-motion preferences, visible keyboard focus and touch-friendly controls.

## Catalogue source and accuracy
Product imagery is stored at the repository root and referenced by original filename. Product labels are descriptive unless a confirmed caption name exists.

Important source limitations are preserved:
- IMG_3977 is a profile overview, not a product.
- IMG_3982 is an alternate view of the black floral abaya represented by IMG_3981.
- IMG_3987 is an alternate view of the Yasmine pink border style represented by IMG_3988.
- IMG_3993 is a group photograph, not an individually purchasable listing.
- Prices/sizes not visible in the source remain enquiry-only.
- Products marked sold or sizes marked unavailable are not represented as confirmed stock.
- The founder has confirmed the ₦480,000 Yasmine is available; its listing is shown as available.
- Other stock and size availability must be reconfirmed by the store before payment.

## Commerce boundary
This is a front-end catalogue and WhatsApp-assisted ordering experience. It does not process payments, maintain live inventory, or provide a staff admin dashboard. The store confirms stock, size, final amount and delivery directly with the customer.

## Local preview
Open `index.html` in a static web server. No build step or package install is required.

## Review state
Work is on `feat/premium-storefront-v2` and is not merged into `main`. The original production website remains untouched. Netlify deployment and real-device/browser QA are still pending.
