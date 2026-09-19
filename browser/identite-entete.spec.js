import { test, expect } from '@playwright/test';
import { PERSONA, signature } from '../public/js/persona.js';
/* global localStorage -- callbacks exécutés dans la page */

async function pageNeuve(page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

test.describe('Identité — critères 1 et 2 : le titre principal', () => {
  test('le titre principal montre l’emoji puis le nom, dès l’ouverture', async ({ page }) => {
    await pageNeuve(page);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(signature(PERSONA));
    await expect(page.locator('h1')).toHaveText('🚀 Cap Web');
  });

  test('le titre contient le nom et un seul emoji, avant tout message', async ({ page }) => {
    await pageNeuve(page);
    await expect(page.locator('#messages li')).toHaveCount(0);
    const titre = await page.locator('h1').textContent();
    expect(titre).toContain(PERSONA.name);
    expect(titre.startsWith(PERSONA.emoji)).toBe(true);
    expect(titre.replace(PERSONA.emoji, '').includes(PERSONA.emoji)).toBe(false);
  });

  test('le titre ne change pas après un message ni après un rechargement', async ({ page }) => {
    await pageNeuve(page);
    await page.locator('#message').fill('salut');
    await page.getByRole('button', { name: /envoyer/i }).click();
    await expect(page.locator('#messages li')).toHaveCount(2);
    await expect(page.locator('h1')).toHaveText('🚀 Cap Web');
    await page.reload();
    await expect(page.locator('h1')).toHaveText('🚀 Cap Web');
  });
});
