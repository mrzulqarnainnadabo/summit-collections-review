import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const cataloguePath = resolve('data/products.json');
const catalogue = JSON.parse(readFileSync(cataloguePath, 'utf8'));
const products = catalogue.products;
const published = products.filter((product) => product.status !== 'provisional-unpublished');
const provisional = products.filter((product) => product.status === 'provisional-unpublished');
const priced = products.filter((product) => product.price !== undefined);
const ids = new Set(products.map((product) => product.id));

assert.equal(published.length, 14, 'Expected exactly 14 catalogue entries for the review.');
assert.equal(provisional.length, 1, 'Expected one explicitly unpublished provisional record.');
assert.equal(priced.length, 1, 'Only the legacy Yasmine price may be present.');
assert.equal(provisional[0].id, 'SC-015', 'SC-015 must remain the unpublished provisional record.');
assert.equal(provisional[0].assets.length, 0, 'The provisional record must not have public image assets.');
assert.equal(ids.size, products.length, 'Product IDs must be unique.');

for (const product of published) {
  assert.ok(product.assets?.length, `${product.id} must have an image path.`);
  for (const asset of product.assets) {
    assert.match(asset, /^\/products\/sc-\d{3}\.webp$/, `${product.id} has an unexpected asset path: ${asset}`);
  }
}
const yasmine = products.find((product) => product.id === 'SC-001');
assert.equal(yasmine?.name, 'Yasmine');
assert.equal(yasmine?.price, 480000);
assert.equal(yasmine?.priceStatus, 'legacy-confirmed');
assert.ok(yasmine.priceNote?.toLowerCase().includes('confirm'), 'Legacy price must carry a reconfirmation note.');

const blueLace = products.find((product) => product.id === 'SC-010');
assert.equal(blueLace?.view, 'back', 'SC-010 must remain explicitly back-view-only.');
assert.equal(blueLace?.status, 'confirmed-incomplete-photography');

const requireAssets = process.argv.includes('--require-assets');
const missingAssets = published.flatMap((product) => product.assets.filter((asset) => !existsSync(resolve(`.${asset}`))));
if (requireAssets) {
  assert.deepEqual(missingAssets, [], 'All published catalogue image files must exist before visual QA.');
}

console.log(`Catalogue integrity passed: ${published.length} published references, ${provisional.length} unpublished provisional record, ${priced.length} legacy price.`);
if (missingAssets.length) {
  console.log(`Asset check pending: ${missingAssets.length} image files are not yet committed. Run with --require-assets after importing approved derivatives.`);
} else {
  console.log('All published product image files are present.');
}
