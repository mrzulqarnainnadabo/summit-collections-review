# Founder-supplied product image workflow

The provisional catalogue lives in `data/products.json`. The current image package is audited in [FOUNDER_REVIEW_ASSET_AUDIT.md](./FOUNDER_REVIEW_ASSET_AUDIT.md).

## Catalogue rules

- Fourteen product references are represented; SC-010 has only a back photograph and is not a complete gallery.
- SC-015 is provisional and must remain unpublished until the founder confirms whether IMG_8264 is a separate garment or the reverse of SC-004.
- IMG_8888 contains two garments and must be split into separate crops for SC-003 and SC-004.
- Product names, prices, sizes and stock levels must not be invented. Temporary visual descriptors are not founder-approved names.
- Keep source photographs unchanged. Store approved web derivatives separately.

## Asset convention

Approved web derivatives are referenced by the storefront at `/products/sc-001.webp` through `/products/sc-014.webp`. Keep original source photographs outside the deployable catalogue; derivatives must preserve full garment framing and be committed before a preview is considered ready.

The prepared archive contains 14 RGB WebP derivatives at 1,800px high, produced by resolution-limited resizing only. It is currently available in the project file library but has not yet been committed to the repository.

The import workflow expects the archive at `assets/summit-founder-review-assets.zip` on `feat/founder-catalogue-foundation`. After that file is committed, GitHub Actions validates the archive, copies the 14 files into `products/`, and removes the temporary ZIP.

## Review gates

1. Verify the JPEG/PNG conversion against each original HEIC where the original is available.
2. Confirm the prepared primary image for every product.
3. Confirm SC-015 grouping with the founder.
4. Obtain a front view for SC-010 before treating its product page as complete.
5. Confirm all 14 referenced image files exist in the repository.
6. Run browser QA at mobile, tablet and desktop widths, including image loading and product detail interactions.
7. Only after these gates pass, prepare a founder-facing Netlify review deployment.

Do not use generated or stock imagery to fill missing product views. Do not publish the provisional item or infer stock, sizes, availability or pricing.
