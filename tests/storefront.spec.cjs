const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const baseURL = 'http://127.0.0.1:4173';
const widths = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-820', width: 820, height: 1180 },
  { name: 'desktop-1440', width: 1440, height: 1000 },
];

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await expect(page.locator('.product-card')).toHaveCount(14);
});

test('storefront and product dialog meet WCAG A/AA accessibility checks', async ({ page }) => {
  await page.locator('#prelude.done').waitFor({ timeout: 3000 });
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    const step = Math.max(320, window.innerHeight * 0.7);
    const height = document.documentElement.scrollHeight;
    for (let y = 0; y < height; y += step) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1000);
  const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
  const storefront = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(storefront.violations.map(v => ({
    id: v.id,
    impact: v.impact,
    targets: v.nodes.map(n => n.target),
  }))).toEqual([]);

  await page.locator('.product-visual[data-id="SC-001"]').click();
  const productDialog = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(productDialog.violations.map(v => ({
    id: v.id,
    impact: v.impact,
    targets: v.nodes.map(n => n.target),
  }))).toEqual([]);
});

test('all published catalogue photographs load from the repository', async ({ page }) => {
  const paths = Array.from({ length: 14 }, (_, i) => `/products/sc-${String(i + 1).padStart(3, '0')}.webp`);
  const responses = await Promise.all(paths.map(path => page.request.get(baseURL + path)));
  expect(responses.every(response => response.ok())).toBe(true);
  const images = page.locator('.product-card .product-visual img');
  await expect(images).toHaveCount(14);
  const imageHints = await images.evaluateAll(nodes => nodes.map(img => ({ loading: img.loading, decoding: img.decoding })));
  expect(imageHints.every(img => img.loading === 'lazy' && img.decoding === 'async')).toBe(true);
  await images.evaluateAll(nodes => nodes.forEach(img => { img.loading = 'eager'; }));
  await page.evaluate(async () => Promise.all(
    [...document.querySelectorAll('.product-card .product-visual img')].map(img => img.decode())
  ));
  const results = await images.evaluateAll(nodes => nodes.map(img => ({
    src: new URL(img.currentSrc || img.src).pathname,
    complete: img.complete,
    width: img.naturalWidth,
    height: img.naturalHeight,
    fallback: img.dataset.fallback === 'true',
  })));
  expect(results.filter(x => x.complete && x.width > 0 && x.height > 0)).toHaveLength(14);
  expect(results.filter(x => x.fallback)).toHaveLength(0);
  expect(results.map(x => x.src).sort()).toEqual(
    Array.from({ length: 14 }, (_, i) => `/products/sc-${String(i + 1).padStart(3, '0')}.webp`).sort()
  );
});

test('provisional catalogue entries and unapproved names are disclosed correctly', async ({ page }) => {
  await expect(page.locator('.product-card')).toHaveCount(14);
  await expect(page.locator('.product-card[data-id="SC-015"]')).toHaveCount(0);
  const backView = page.locator('.product-card').filter({ has: page.locator('[data-id="SC-010"]') });
  await expect(backView).toContainText('BACK VIEW');
  await expect(backView).toContainText('Back view');
  await expect(page.locator('.product-card').filter({ hasText: 'Yasmine' })).not.toContainText('TEMPORARY DESCRIPTOR · NOT FOUNDER-APPROVED');
  await expect(page.locator('.product-card').filter({ hasText: 'Turquoise Bloom' })).not.toContainText('TEMPORARY DESCRIPTOR · NOT FOUNDER-APPROVED');
  await expect(page.locator('.product-card').filter({ hasText: 'Lilac Border' })).not.toContainText('TEMPORARY DESCRIPTOR · NOT FOUNDER-APPROVED');
  await expect(page.locator('.product-card').filter({ hasText: 'Sage Lace' })).toContainText('TEMPORARY DESCRIPTOR · NOT FOUNDER-APPROVED');
  await expect(page.locator('.product-card').filter({ hasText: 'Gilded Ivory' })).toContainText('TEMPORARY DESCRIPTOR · NOT FOUNDER-APPROVED');
  await page.locator('.product-visual[data-id="SC-003"]').click();
  await expect(page.locator('#detailView')).toContainText('Temporary descriptor · not founder-approved');
  await page.locator('#add').click();
  await expect(page.locator('#drawer')).toBeVisible();
  await expect(page.locator('#items')).toContainText('TEMPORARY DESCRIPTOR · NOT FOUNDER-APPROVED');
  await expect(page.locator('#items')).not.toContainText('WORKING DESCRIPTOR');
  await page.locator('#bagClose').click();
  await expect(page.locator('#detailView')).toContainText('Front view');
  await expect(page.locator('#detail')).not.toBeVisible();
});

test('search and category filters update the collection', async ({ page }) => {
  await page.getByRole('button', { name: /Dark tones/ }).click();
  await expect(page.locator('.product-card')).toHaveCount(3);
  await expect(page.locator('.product-card h3', { hasText: 'Midnight Cascade' })).toBeVisible();
  await page.getByRole('button', { name: /All pieces/ }).click();
  await page.getByRole('searchbox', { name: 'Search collection' }).fill('Yasmine');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await expect(page.locator('.product-card h3')).toHaveText('Yasmine');
  await page.getByRole('searchbox', { name: 'Search collection' }).fill('no-such-piece');
  await expect(page.getByText('No pieces match that search.', { exact: true })).toBeVisible();
});

test('product details, enquiry selection and quantity controls work', async ({ page }) => {
  await page.locator('.product-visual[data-id="SC-001"]').click();
  await expect(page.locator('#detail')).toBeVisible();
  await expect(page.locator('#detailTitle')).toHaveText('Yasmine');
  await expect(page.locator('#detailPrice')).toContainText('480,000');
  await page.locator('#size').fill('Size 56');
  await page.locator('#add').click();
  await expect(page.locator('#drawer')).toBeVisible();
  await expect(page.locator('#items')).toContainText('Yasmine');
  await expect(page.locator('#items')).toContainText('Size 56');
  await expect(page.locator('#items img')).toHaveAttribute('loading', 'lazy');
  await expect(page.locator('#items img')).toHaveAttribute('decoding', 'async');
  await expect(page.locator('#detailImg')).toHaveAttribute('decoding', 'async');
  await expect(page.locator('#count')).toHaveText('1');
  await page.locator('#items [data-qty="increase"]').click();
  await expect(page.locator('#items .quantity-control span')).toHaveText('2');
  await expect(page.locator('#count')).toHaveText('2');
  await page.locator('#items [data-qty="decrease"]').click();
  await expect(page.locator('#items .quantity-control span')).toHaveText('1');
  await page.locator('#items [data-remove]').click();
  await expect(page.locator('#items .empty-state')).toBeVisible();
  await expect(page.locator('#count')).toHaveText('0');
});

test('WhatsApp enquiry opens with selected item and customer details', async ({ page }) => {
  await page.locator('.product-visual[data-id="SC-002"]').click();
  await page.locator('#add').click();
  await page.locator('#name').fill('Test Customer');
  await page.locator('#location').fill('Abuja');
  await page.evaluate(() => { window.__openedWhatsApp = ''; window.open = url => { window.__openedWhatsApp = url; }; });
  await page.locator('#send').click();
  const url = await page.evaluate(() => window.__openedWhatsApp);
  expect(url).toContain('wa.me/2347082812850');
  const message = decodeURIComponent(url.split('?text=')[1]);
  expect(message).toContain('SC-002 — Mustard Noir');
  expect(message).toContain('[TEMPORARY DESCRIPTOR]');
  expect(message).toContain('Test Customer');
  expect(message).toContain('Abuja');
});

test('enquiry drawer keeps product information and form controls readable on mobile and desktop', async ({ page }) => {
  for (const viewport of widths) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.locator('.product-visual[data-id="SC-002"]').click();
    await page.locator('#add').click();
    await expect.poll(() => page.locator('#drawer').evaluate(node => Math.abs(node.getBoundingClientRect().right - window.innerWidth))).toBeLessThan(1);
    const layout = await page.locator('#drawer').evaluate(node => {
      const rect = node.getBoundingClientRect();
      const copy = node.querySelector('.drawer-bottom>p');
      const label = node.querySelector('.drawer-bottom label');
      const input = node.querySelector('.drawer-bottom input');
      const quantity = node.querySelector('.quantity-control button');
      const remove = node.querySelector('[data-remove]');
      return {
        left: rect.left, right: rect.right, viewport: document.documentElement.clientWidth,
        copySize: parseFloat(getComputedStyle(copy).fontSize),
        labelSize: parseFloat(getComputedStyle(label).fontSize),
        inputSize: parseFloat(getComputedStyle(input).fontSize),
        inputHeight: input.getBoundingClientRect().height,
        quantityWidth: quantity.getBoundingClientRect().width,
        quantityHeight: quantity.getBoundingClientRect().height,
        removeWidth: remove.getBoundingClientRect().width,
        removeHeight: remove.getBoundingClientRect().height,
      };
    });
    expect(layout.left).toBeGreaterThanOrEqual(-1);
    expect(layout.right).toBeLessThanOrEqual(layout.viewport + 1);
    expect(layout.copySize).toBeGreaterThanOrEqual(12);
    expect(layout.labelSize).toBeGreaterThanOrEqual(11);
    expect(layout.inputSize).toBeGreaterThanOrEqual(16);
    expect(layout.inputHeight).toBeGreaterThanOrEqual(48);
    expect(layout.quantityWidth).toBeGreaterThanOrEqual(36);
    expect(layout.quantityHeight).toBeGreaterThanOrEqual(36);
    expect(layout.removeWidth).toBeGreaterThanOrEqual(44);
    expect(layout.removeHeight).toBeGreaterThanOrEqual(44);
    await page.locator('#bagClose').click();
  }
});

test('mobile primary controls meet 44px touch-target dimensions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const controls = page.locator('.filters button, #bagOpen, #menuOpen, .search input');
  const sizes = await controls.evaluateAll(nodes => nodes.map(node => ({
    label: node.getAttribute('aria-label') || node.textContent.trim() || node.getAttribute('placeholder'),
    width: node.getBoundingClientRect().width,
    height: node.getBoundingClientRect().height,
  })));
  expect(sizes.length).toBeGreaterThan(5);
  for (const item of sizes) {
    expect(item.width, `${item.label} should be at least 44px wide`).toBeGreaterThanOrEqual(44);
    expect(item.height, `${item.label} should be at least 44px high`).toBeGreaterThanOrEqual(44);
  }
  await page.locator('#bagOpen').click();
  const drawerClose = await page.locator('#bagClose').boundingBox();
  expect(drawerClose.width).toBeGreaterThanOrEqual(44);
  expect(drawerClose.height).toBeGreaterThanOrEqual(44);
  await page.locator('#bagClose').click();
  await page.locator('.product-visual[data-id="SC-001"]').click();
  const dialogClose = await page.locator('#detailClose').boundingBox();
  expect(dialogClose.width).toBeGreaterThanOrEqual(44);
  expect(dialogClose.height).toBeGreaterThanOrEqual(44);
});

test('mobile navigation opens and closes accessibly', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const trigger = page.locator('#menuOpen');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobileNav')).not.toHaveAttribute('inert', '');
  await page.locator('#mobileNav a[href="#collection"]').click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#mobileNav')).toHaveAttribute('inert', '');
});

test('drawer traps focus and restores it to the opening control', async ({ page }) => {
  const trigger = page.locator('#bagOpen');
  await trigger.focus();
  await trigger.click();
  await expect(page.locator('#drawer')).toBeVisible();
  await expect(page.locator('#bagClose')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#send')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#drawer')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('#drawer')).toHaveAttribute('inert', '');
  await expect(trigger).toBeFocused();
});

for (const viewport of widths) {
  test(`responsive layout has no horizontal overflow at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('.product-card')).toHaveCount(14);
    await page.locator('#prelude.done').waitFor({ timeout: 3000 });
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto';
      const step = Math.max(320, window.innerHeight * 0.7);
      const height = document.documentElement.scrollHeight;
      for (let y = 0; y < height; y += step) {
        window.scrollTo(0, y);
        await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 100)));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);
    const revealedCards = await page.locator('.product-card').evaluateAll(nodes =>
      nodes.filter(node => Number(getComputedStyle(node).opacity) > 0.9).length
    );
    expect(revealedCards, 'all catalogue cards should reveal during a full-page scroll').toBe(14);
    const decodedImages = await page.locator('.product-card .product-visual img').evaluateAll(async nodes => {
      await Promise.all(nodes.map(img => {
        img.loading = 'eager';
        return img.decode();
      }));
      return nodes.map(img => ({
        source: new URL(img.currentSrc || img.src).pathname,
        width: img.naturalWidth,
        height: img.naturalHeight,
      }));
    });
    expect(decodedImages).toHaveLength(14);
    expect(decodedImages.every(img => img.width > 0 && img.height > 0), 'all product images must be decoded before screenshots').toBe(true);
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      page: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    expect(dimensions.page, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport + 1);
    expect(dimensions.body, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport + 1);
    await page.screenshot({ path: `test-results/${viewport.name}.png`, fullPage: true });
  });
}


test('product detail remains readable and contained on mobile, tablet and desktop', async ({ page }) => {
  for (const viewport of widths) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.locator('.product-visual[data-id="SC-003"]').click();
    const dialog = page.locator('#detail');
    await expect(dialog).toBeVisible();
    const layout = await dialog.evaluate(node => {
      const rect = node.getBoundingClientRect();
      const copy = node.querySelector('.dialog-copy>.price-note');
      const provenance = node.querySelector('#detailView');
      const image = node.querySelector('.dialog-image>img');
      return {
        left: rect.left,
        right: rect.right,
        width: rect.width,
        viewport: document.documentElement.clientWidth,
        scrollWidth: node.scrollWidth,
        clientWidth: node.clientWidth,
        copyFontSize: parseFloat(getComputedStyle(copy).fontSize),
        provenanceFontSize: parseFloat(getComputedStyle(provenance).fontSize),
        imageLoaded: image.complete && image.naturalWidth > 0,
        imageFit: getComputedStyle(image).objectFit,
      };
    });
    expect(layout.left).toBeGreaterThanOrEqual(-1);
    expect(layout.right).toBeLessThanOrEqual(layout.viewport + 1);
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
    expect(layout.copyFontSize).toBeGreaterThanOrEqual(12);
    expect(layout.provenanceFontSize).toBeGreaterThanOrEqual(9);
    expect(layout.imageLoaded).toBe(true);
    expect(layout.imageFit).toBe('contain');
    await page.locator('#detailClose').click();
  }
});
