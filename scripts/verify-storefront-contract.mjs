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
assert.match(html, /property="og:title"/, 'Open Graph title metadata is required.');
assert.match(html, /property="og:description"/, 'Open Graph description metadata is required.');
assert.match(html, /name="twitter:card" content="summary"/, 'A conservative social sharing card must be declared.');
assert.match(html, /rel="preload" as="image" href="\/products\/sc-001\.webp" fetchpriority="high"/, 'The lead hero image must be preloaded at high priority.');
assert.match(js, /fetch\('\/data\/products\.json'\)/, 'Static catalogue data should use normal browser caching.');
assert.doesNotMatch(js, /fetch\('\/data\/products\.json',\{cache:'no-store'\}\)/, 'Static catalogue data must not disable browser caching.');
assert.match(html, /class="brand" href="#top" aria-label="The Summit Collections home"><img src="\/assets\/summit-logo\.webp" alt=""/, 'Header logo must not duplicate its accessible link name.');
assert.match(html, /id="mobileNav"[^>]*inert/, 'Mobile navigation must start inert.');
assert.match(html, /<dialog id="detail" class="product-dialog" aria-labelledby="detailTitle" aria-describedby="detailView detailPriceNote">/, 'Product dialog must expose its dynamic title and concise product context to assistive technology.');
assert.match(html, /id="drawer"[^>]*aria-hidden="true"[^>]*inert/, 'Selection drawer must start hidden and inert.');
assert.match(html, /id="bagOpen"[^>]*aria-controls="drawer"[^>]*aria-expanded="false"/, 'Selection trigger must expose its collapsed state.');
assert.match(css, /:where\(a,button,input,\[tabindex\]\):focus-visible/, 'Visible keyboard focus styling is required.');
assert.match(css, /prefers-reduced-motion:reduce/, 'Reduced-motion styling is required.');
assert.doesNotMatch(html, /ticker-track/, 'The simplified editorial page must not reintroduce a decorative ticker.');
assert.doesNotMatch(css, /ticker-track/, 'Removed ticker styling must not remain as dead CSS.');
assert.match(css, /\.reveal,\s*\.reveal-image,\s*\.product-card\s*\{\s*opacity:\s*1\s*!important;/, 'Reduced-motion mode must not leave content hidden behind reveal effects.');
assert.match(css, /transition-duration:\s*(?:0)?\.01ms\s*!important/, 'Reduced-motion mode must suppress non-essential transitions.');
assert.match(js, /hasWorkingName=p=>p\.nameSource\?\.startsWith\('temporary visual descriptor'\)/, 'Temporary visual descriptors must be explicitly identified as unapproved.');
assert.match(js, /name-status/, 'Temporary catalogue names must be labelled in customer-facing selection surfaces.');
assert.match(js, /data-qty="increase"/, 'Enquiry selection must allow increasing item quantity.');
assert.match(js, /data-qty="decrease"/, 'Enquiry selection must allow decreasing item quantity.');
assert.match(js, /quantities\[id\]\|\|1/, 'Every selected item must retain a positive quantity.');
assert.match(js, /' × '\+\(quantities\[id\]\|\|1\)/, 'WhatsApp enquiry must include each selected quantity.');
assert.match(js, /setAttribute\('aria-label',`\$\{total\} selected \$\{total===1\?'unit':'units'\}`\)/, 'Selection count must have an accurate accessible label.');
assert.match(html, /id="count" aria-live="polite" aria-atomic="true"/, 'Selection count changes must be announced to assistive technology.');
assert.match(js, /if\(e\.key==='Tab'\)/, 'Open enquiry drawer must retain its keyboard focus trap.');
assert.match(js, /function restoreFocus\(target,fallback\)/, 'Drawer focus restoration must use a shared validated focus helper.');
assert.match(js, /el\.isConnected&&el\.getClientRects\(\)\.length>0&&!el\.disabled/, 'Focus restoration must reject detached, hidden, or disabled elements.');
assert.match(js, /restoreFocus\(target,\$\('#bagOpen'\)\)/, 'Drawer focus restoration must fall back to the selection trigger when its original target is unavailable.');
assert.match(js, /drawerReturnFocus=null;restoreFocus\(target/, 'Drawer must clear its saved focus target after closing.');
assert.match(js, /mobile\.inert=!open/, 'Closed mobile navigation must be removed from keyboard interaction.');
assert.match(js, /nextControl\?\.focus\(\)/, 'Quantity changes must preserve keyboard focus after the enquiry bag re-renders.');
assert.match(js, /controls\.find\(el=>el\.dataset\.qty===action&&!el\.disabled\)\|\|controls\.find\(el=>!el\.disabled\)/, 'Quantity changes must move focus to an enabled control when the active action becomes disabled.');
assert.match(js, /const controls=\$\$\('#items \[data-qty\]'\)\.filter\(el=>el\.dataset\.id===id\)/, 'Quantity focus restoration must query a collection of controls, not a single element.');
assert.match(js, /\(remaining\[Math\.min\(oldIndex,remaining\.length-1\)\]\|\|\$\('#bagClose'\)\)\.focus\(\)/, 'Removing an item must move keyboard focus to the next useful control.');
assert.match(js, /\$\$\('\[data-filter\]'\)\.forEach\(x=>/, 'Filter updates must iterate over all filter controls.');
assert.match(js, /\$\$\('#mobileNav a'\)\.forEach\(a=>/, 'Mobile navigation must bind every navigation link.');
assert.match(js, /\$\$\('\[data-parallax\]'\)\.forEach\(el=>/, 'Scroll effects must iterate over all parallax elements.');

console.log(`Storefront contract passed: ${idSet.size} unique IDs, required controls present, catalogue hooks and accessibility safeguards checked.`);
