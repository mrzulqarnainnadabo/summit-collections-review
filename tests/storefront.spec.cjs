const { test, expect } = require('@playwright/test');

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

test('all published catalogue photographs load from the repository', async ({ page }) => {
  const paths = Array.from({ length: 14 }, (_, i) => `/products/sc-${String(i + 1).padStart(3, '0')}.webp`);
  const responses = await Promise.all(paths.map(path => page.request.get(baseURL + path)));
  expect(responses.every(response => response.ok())).toBe(true);
  const images = page.locator('.product-card .product-visual img');
  await expect(images).toHaveCount(14);
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
  expect(message).toContain('Mustard Noir');
  expect(message).toContain('Test Customer');
  expect(message).toContain('Abuja');
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
      const step = Math.max(320, window.innerHeight * 0.7);
      const height = document.documentElement.scrollHeight;
      for (let y = 0; y < height; y += step) {
        window.scrollTo(0, y);
        await new Promise(resolve => setTimeout(resolve, 140));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(900);
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
