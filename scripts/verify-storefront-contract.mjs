import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync('index.html', 'utf8');
const js = readFileSync('app.js', 'utf8');
const css = readFileSync('styles.css', 'utf8');
const catalogue = JSON.parse(readFileSync('data/products.json', 'utf8'));
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const idSet = new Set(ids);

assert.equal(ids.length, idSet.size, 'HTML IDs must be unique.');
for (const id of [
  'top', 'siteHeader', 'progressBar', 'prelude', 'grid', 'detail', 'drawer',
  'scrim', 'count', 'items', 'bagOpen', 'bagClose', 'detailImg', 'detailClose',
  'detailRef', 'detailTitle', 'detailView', 'detailPrice', 'detailPriceNote',
  'size', 'add', 'send', 'name', 'location', 'menuOpen', 'mobileNav', 'search'
]) {
  assert.ok(idSet.has(id), `Required storefront control is missing: #${id}`);
}

for (const selector of [
  '#grid', '#detail', '#drawer', '#scrim', '#count', '#items', '#bagOpen',
  '#bagClose', '#detailImg', '#detailClose', '#detailRef', '#detailTitle',
  '#detailView', '#detailPrice', '#detailPriceNote', '#size', '#add', '#send',
  '#name', '#location', '#menuOpen', '#mobileNav', '#search', '#siteHeader',
  '#progressBar', '#prelude'
]) {
  assert.ok(js.includes(selector), `JavaScript does not reference required control: ${selector}`);
}

for (const product of catalogue.products.filter((item) => item.status !== 'provisional-unpublished')) {
  assert.ok(product.assets.length, `${product.id} has no asset reference.`);
}
assert.match(html, /<main id="top"/, 'Skip link destination must exist.');
assert.match(html, /id="mobileNav"[^>]*inert/, 'Mobile navigation must start inert.');
assert.match(html, /id="drawer"[^>]*aria-hidden="true"[^>]*inert/, 'Selection drawer must start hidden and inert.');
assert.match(html, /id="bagOpen"[^>]*aria-controls="drawer"[^>]*aria-expanded="false"/, 'Selection trigger must expose its collapsed state.');
assert.match(css, /:where\(a,button,input,\[tabindex\]\):focus-visible/, 'Visible keyboard focus styling is required.');
assert.match(css, /prefers-reduced-motion:reduce/, 'Reduced-motion styling is required.');

console.log(`Storefront contract passed: ${idSet.size} unique IDs, required controls present, catalogue hooks and accessibility safeguards checked.`);
