# The Summit Collections — visual direction record

## Audit findings
- The production site remains untouched.
- The original production homepage remains unchanged. The separate review site is published at https://summit-collections-review.netlify.app.
- The review repository contains 19 original product screenshots (IMG_3979.png–IMG_3997.png) plus IMG_3977.png, a collection/profile collage. Two repeated carousel pairs are grouped, giving 17 product entries.
- The review build now includes its own styles, scripts and locally served WebP presentation crops.
- The founder's SC logo is preserved from the original brand asset at https://the-summit-collections.netlify.app/assets/summit-logo.png. It is used as supplied, not redrawn.
- Original post captions were read from the supplied screenshots. The interface shows only listed prices and size ranges that could be read, labels them as original-post information, and asks the team to confirm current prices and availability. Official names are used only where present in the captions; all other products retain numbered references. No live stock, care or delivery policy is invented.

## Three directions considered
1. Midnight Atelier — near-black, antique gold and burgundy; cinematic, but risks making the garments recede.
2. Chromatic Gallery — editorial fashion-house composition; deep ink framing, warm gallery surfaces, restrained gold and wine; large original garment photography; direct discovery and product detail.
3. The Golden Courtyard — terracotta, sand and olive with architectural framing; atmospheric, but risks decorative overstatement.

## Selection
**Chromatic Gallery** is selected, with an Abuja-led modest-fashion editorial voice. It gives the colourful garments visual priority, preserves the existing gold/black identity, and supports an elegant but usable shopping journey. The earlier “Dubai in Nigeria” positioning was removed because it was not established as a verified brand proposition and pushed the design toward a borrowed luxury trope.

## Reference principles applied
- Awwwards / Godly / 60fps: confident art direction, deliberate pacing, restrained motion.
- ScrollTide / ScrollShaders: scroll-linked reveals and image transitions only where they clarify the experience; no unnecessary shader/WebGL layer.
- 21st.dev / Aceternity / Magic UI: interaction patterns are references, not templates; keep controls accessible and lightweight.
- Modest-fashion case studies: show silhouette and garment detail, carry editorial storytelling into product detail, and keep mobile discovery direct.

## Product and commerce integrity
- The original repository PNGs remain unchanged. Twenty 4:5 WebP presentation crops are generated from the supplied screenshots; the account header and lower post interface bands are trimmed, but boutique backgrounds and objects may remain. This is conventional cropping, not background removal or restoration.
- No invented prices, stock claims, official product names, measurements or policies.
- Bag and WhatsApp handoff are an enquiry/order-request flow. There is no payment gateway, live inventory, order database or automated fulfilment.
- Production domain and original repository main branch are not modified by this redesign.

## Review implementation status — 23 November 2026
- The separate review deployment is ready at https://summit-collections-review.netlify.app. The original production domain is not modified.
- Product cards use source-grounded labels, local 4:5 crops, keyboard-operable controls and visible focus treatment. Product details preserve historical source prices and size ranges as such.
- Playwright checks passed at 320, 360, 390, 768, 1024, 1440 and 1920px: no horizontal overflow; 17 catalogue entries; product dialog keyboard open/close and focus restoration; search/filter behavior; no page errors or broken product images.
- The selection bag is an enquiry builder that hands off to WhatsApp. It is not payment checkout, live stock, reservation or order management.
- Remaining brand validation: confirm all historical prices, size ranges, names, current availability, contact and showroom details. A controlled product shoot with clean backgrounds and close-up embroidery views is still the best route to a genuinely premium product gallery. Do not replace the real garments with generated substitutes.
