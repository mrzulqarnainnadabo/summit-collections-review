# The Summit Collections — visual direction record

## Audit findings
- The production site remains untouched.
- The live homepage has placeholder hero/collection imagery and sample product rows.
- The review repository contains 19 individual product screenshots (IMG_3979.png–IMG_3997.png) plus IMG_3977.png, a collection/profile collage.
- The repository's original HTML referenced missing assets/styles/scripts; the Netlify review project has no published deploy.
- The founder's SC logo is preserved from the original brand asset at https://the-summit-collections.netlify.app/assets/summit-logo.png. It is used as supplied, not redrawn.
- Product prices, official product names, stock, sizing, care and delivery policy are not reliably available as structured catalogue data in the repository. The interface therefore uses numbered references and explicitly requests confirmation rather than fabricating details.

## Three directions considered
1. Midnight Atelier — near-black, antique gold and burgundy; cinematic, but risks making the garments recede.
2. Chromatic Gallery — editorial fashion-house composition; deep ink framing, warm gallery surfaces, restrained gold and wine; large original garment photography; direct discovery and product detail.
3. The Golden Courtyard — terracotta, sand and olive with architectural framing; atmospheric, but risks decorative overstatement.

## Selection
**Chromatic Gallery** is selected. It gives the colourful embroidered garments visual priority, preserves the existing gold/black identity, and supports an elegant but usable shopping journey.

## Reference principles applied
- Awwwards / Godly / 60fps: confident art direction, deliberate pacing, restrained motion.
- ScrollTide / ScrollShaders: scroll-linked reveals and image transitions only where they clarify the experience; no unnecessary shader/WebGL layer.
- 21st.dev / Aceternity / Magic UI: interaction patterns are references, not templates; keep controls accessible and lightweight.
- Modest-fashion case studies: show silhouette and garment detail, carry editorial storytelling into product detail, and keep mobile discovery direct.

## Product and commerce integrity
- Product images are the original repository assets. Their Instagram screenshot framing is cropped in the presentation layer; the source files are not altered.
- No invented prices, stock claims, official product names, measurements or policies.
- Bag and WhatsApp handoff are an enquiry/order-request flow. There is no payment gateway, live inventory, order database or automated fulfilment.
- Production domain and original repository main branch are not modified by this redesign.
