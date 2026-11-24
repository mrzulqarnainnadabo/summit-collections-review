# Founder review asset audit

**Project:** The Summit Collections  
**Asset package:** `summit-founder-review-assets.zip`  
**Package size:** 4,228,873 bytes  
**Package validation:** ZIP integrity check passed; 14 WebP derivatives and `MANIFEST.json` present.

## Processing provenance

The supplied archive identifies these as prepared founder-review derivatives. Processing is resolution-limited resizing only: no generative edits, colour grading, background removal or garment retouching. The original boutique setting and garment details remain visible.

All derivatives are RGB WebP files, 1,800 pixels high. Their combined size is approximately 4.1 MB.

| Reference | Dimensions | File size | Image note |
|---|---:|---:|---|
| SC-001 | 1350 × 1800 | 442,132 B | Front |
| SC-002 | 1142 × 1800 | 271,878 B | Front |
| SC-003 | 675 × 1800 | 141,330 B | Left garment crop from IMG_8888 |
| SC-004 | 675 × 1800 | 162,754 B | Right garment crop from IMG_8888 |
| SC-005 | 1047 × 1800 | 255,418 B | Front |
| SC-006 | 1108 × 1800 | 291,416 B | Front |
| SC-007 | 1234 × 1800 | 375,248 B | Front |
| SC-008 | 1157 × 1800 | 320,452 B | Front |
| SC-009 | 1145 × 1800 | 258,536 B | Front |
| SC-010 | 1158 × 1800 | 292,300 B | Back view only |
| SC-011 | 1200 × 1800 | 406,962 B | Front |
| SC-012 | 1226 × 1800 | 367,236 B | Front |
| SC-013 | 1163 × 1800 | 323,800 B | Front |
| SC-014 | 1192 × 1800 | 315,760 B | Front |

## Visual inspection

A contact sheet was inspected. All 14 files open successfully and show the expected garment references. SC-003 and SC-004 are distinct garments in one source photograph and remain separate catalogue entries. SC-010 shows the back only; do not imply that a front photograph exists.

## Repository integration status

The archive is available in the project file library and has been validated locally. It has **not yet been committed** to this repository. The storefront currently references:

- `/products/sc-001.webp` through `/products/sc-014.webp`

The image import workflow expects the archive at:

- `assets/summit-founder-review-assets.zip`

Once the archive is committed at that exact path on `feat/founder-catalogue-foundation`, the workflow validates and copies the 14 WebP derivatives into `products/`, then removes the temporary ZIP from the branch.

Do not treat the current branch as photo-complete or founder-preview-ready until all 14 image files exist at their referenced paths and browser QA confirms the images load at mobile, tablet and desktop widths.

## Publication safeguards

- Keep SC-015 unpublished until the founder confirms whether it is a separate garment.
- Do not invent a front view for SC-010.
- Keep non-legacy product descriptors visibly provisional until the founder approves official names.
- Yasmine's ₦480,000 amount is a legacy record and must be reconfirmed before checkout or final publication.
- Do not invent sizes, availability, stock levels or delivery claims.


## Additional repository uploads reviewed on 24 November 2026

Seven root-level PNG uploads, `IMG_3991.png` through `IMG_3997.png`, were inspected as visual references. They are screenshots of social-media posts and include interface chrome around the garment photographs. They are **not** clean source photographs and have not been mapped authoritatively to the 14 catalogue records.

Do not substitute these screenshots for the prepared WebP derivatives, crop them into customer-facing product photography, or infer product names from them. The approved catalogue image set remains the 14 files in `summit-founder-review-assets.zip` listed above. The additional captures may be retained as reference material only.
