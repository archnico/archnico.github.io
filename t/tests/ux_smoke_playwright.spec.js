/* Playwright smoke tests for Torre H-7 UX enhancements.
 *
 * Run with:
 *   npx playwright test t/tests/ux_smoke_playwright.spec.js
 *
 * These tests take screenshots of the main interactive states and assert
 * that key DOM interactions work in a real browser.
 */
const { test, expect } = require('@playwright/test');
const path = require('path');

const indexPath = 'file://' + path.resolve(__dirname, '..', 'index.html');

test.describe('Torre H-7 preview UX smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(indexPath);
    await page.waitForSelector('#c');
    await page.waitForTimeout(600);
  });

  test('index loads and shows canvas + sidebar', async ({ page }, testInfo) => {
    await expect(page.locator('#c')).toBeVisible();
    await expect(page.locator('#left-panel')).toBeVisible();
    await expect(page.locator('#quicktools')).toBeVisible();
    const screenshot = await page.screenshot({ fullPage: false });
    testInfo.attach('initial-load', { body: screenshot, contentType: 'image/png' });
  });

  test('layer toggle works and does not throw', async ({ page }) => {
    const walls = page.locator('[data-layer="pareti"]');
    await walls.click();
    await expect(walls).toHaveAttribute('aria-checked', 'false');
    await walls.click();
    await expect(walls).toHaveAttribute('aria-checked', 'true');
  });

  test('group master toggles all layers in chapter', async ({ page }) => {
    const master = page.locator('[data-group-toggle="contesto"]');
    await master.click();
    await expect(page.locator('[data-layer="pareti"]')).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('[data-layer="finestra"]')).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('[data-layer="mobilio"]')).toHaveAttribute('aria-checked', 'false');
    await master.click();
    await expect(page.locator('[data-layer="pareti"]')).toHaveAttribute('aria-checked', 'true');
  });

  test('selection enables isolate + semi-transparent and shows HUD', async ({ page }, testInfo) => {
    const vp = page.locator('#vp');
    await vp.click({ position: { x: 200, y: 200 } });
    await page.waitForTimeout(200);
    const hud = page.locator('#selection-hud');
    await expect(hud).toHaveClass(/active/);
    await expect(page.locator('[data-layer="semitrasparente"]')).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('[data-layer="isola"]')).toHaveAttribute('aria-checked', 'true');
    const screenshot = await page.screenshot({ fullPage: false });
    testInfo.attach('selection-isolated', { body: screenshot, contentType: 'image/png' });
  });

  test('help panel opens and closes', async ({ page }) => {
    await page.locator('#help-btn').click();
    await expect(page.locator('#help-panel')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-panel')).toBeHidden();
  });

  test('keyboard shortcuts toggle layers', async ({ page }) => {
    await page.keyboard.press('i');
    await expect(page.locator('[data-layer="isola"]')).toHaveAttribute('aria-checked', 'true');
    await page.keyboard.press('x');
    await expect(page.locator('[data-layer="semitrasparente"]')).toHaveAttribute('aria-checked', 'true');
    await page.keyboard.press('l');
    await expect(page.locator('[data-layer="etichette"]')).toHaveAttribute('aria-checked', 'false');
  });

  test('mobile menu toggle hides and shows sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(indexPath);
    await page.waitForTimeout(400);
    const menu = page.locator('#menu-toggle');
    await expect(menu).toBeVisible();
    await menu.click();
    await expect(page.locator('#left-panel')).toHaveClass(/open/);
    await menu.click();
    await expect(page.locator('#left-panel')).not.toHaveClass(/open/);
  });
});
