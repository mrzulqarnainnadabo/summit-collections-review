# Founder-supplied product image workflow

The provisional catalogue lives in `data/products.json`.

## Catalogue rules

- Fourteen product references are confirmed; SC-010 has only a back photograph and is not a complete gallery.
- SC-015 is provisional and must remain unpublished until the founder confirms whether IMG_8264 is a separate garment or the reverse of SC-004.
- IMG_8888 contains two garments and must be split into separate crops for SC-003 and SC-004.
- Product names, prices, sizes, colours and stock levels have not been supplied. Do not invent them.
- Keep source photographs unchanged. Store approved web derivatives separately.

## Asset convention

Approved web derivatives are referenced by the storefront at `/products/sc-001.webp` through `/products/sc-014.webp`. Keep the original JPEGs outside the deployable catalogue; the derivatives must preserve full garment framing and be committed before a preview is considered ready. Example paths:

```
products/sc-001.webp
products/sc-001-detail-01.webp
products/sc-002.webp
...
```

Use a 3:4 portrait crop where the original composition permits. Preserve the full garment, colour, fabric, embroidery, lace, beadwork and silhouette. Do not generate missing views or use generative edits that change product details.

## Review gates

1. Verify the JPEG/PNG conversion against each original HEIC.
2. Approve the primary crop for every product.
3. Confirm SC-015 grouping with the founder.
4. Obtain a front view for SC-010 before treating its product page as complete.
5. Only after approved images exist, replace the old catalogue image references in the storefront.
