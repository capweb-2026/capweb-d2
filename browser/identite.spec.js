import { test, expect } from '@playwright/test';
import { replyTo } from '../public/js/brain.js';
import { PERSONA } from '../public/js/persona.js';
/* global localStorage -- callbacks exécutés dans la page */

async function pageNeuve(page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function envoyer(page, texte) {
  await page.locator('#message').fill(texte);
  await page.getByRole('button', { name: /envoyer/i }).click();
}

const lignes = (page) => page.locator('#messages li');
const suggestions = (page) => page.locator('#suggestions button');

test.describe('Identité — critère 3 : l’accueil', () => {
  test('conversation vide : #accueil est visible et contient le nom', async ({ page }) => {
    await pageNeuve(page);
    await expect(page.locator('#accueil')).toBeVisible();
    await expect(page.locator('#accueil')).toContainText(PERSONA.name);
    await expect(page.locator('#accueil')).toHaveText(PERSONA.greeting);
  });

  test('l’accueil est en dehors de #messages', async ({ page }) => {
    await pageNeuve(page);
    await expect(page.locator('#messages #accueil')).toHaveCount(0);
    await expect(lignes(page)).toHaveCount(0);
  });

  test('dès qu’un message est envoyé, l’accueil disparaît', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    await expect(page.locator('#accueil')).toBeHidden();
  });

  test('l’accueil reste caché après rechargement d’une conversation non vide', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    await page.reload();
    await expect(lignes(page)).toHaveCount(2);
    await expect(page.locator('#accueil')).toBeHidden();
  });

  test('l’accueil revient quand on efface la conversation', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    page.once('dialog', (d) => d.accept());
    await page.locator('#effacer').click();
    await expect(lignes(page)).toHaveCount(0);
    await expect(page.locator('#accueil')).toBeVisible();
  });
});

test.describe('Identité — critère 4 : les suggestions', () => {
  test('exactement trois boutons dans #suggestions, avec les trois questions', async ({ page }) => {
    await pageNeuve(page);
    await expect(suggestions(page)).toHaveCount(3);
    await expect(suggestions(page)).toHaveText(PERSONA.suggestions);
  });

  test('un clic met la question dans #message et n’ajoute aucune ligne', async ({ page }) => {
    await pageNeuve(page);
    await suggestions(page).nth(1).click();
    await expect(page.locator('#message')).toHaveValue(PERSONA.suggestions[1]);
    await expect(lignes(page)).toHaveCount(0);
  });

  test('chaque suggestion remplit #message avec sa propre question', async ({ page }) => {
    await pageNeuve(page);
    for (const [i, question] of PERSONA.suggestions.entries()) {
      await suggestions(page).nth(i).click();
      await expect(page.locator('#message')).toHaveValue(question);
    }
    await expect(lignes(page)).toHaveCount(0);
  });

  test('il y a toujours trois suggestions, même après un message', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    await expect(suggestions(page)).toHaveCount(3);
  });
});

test.describe('Identité — critère 5 : les réponses signées', () => {
  test('la réponse commence par l’emoji et le nom, celle de l’utilisateur par « Vous : »', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    await expect(lignes(page).nth(0)).toHaveText('Vous : salut');
    await expect(lignes(page).nth(1)).toHaveText(`🚀 Cap Web : ${replyTo('salut')}`);
  });

  test('la signature est encore là après un rechargement', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'aide');
    await expect(lignes(page)).toHaveCount(2);
    await page.reload();
    await expect(lignes(page).nth(0)).toHaveText('Vous : aide');
    await expect(lignes(page).nth(1)).toHaveText(`🚀 Cap Web : ${replyTo('aide')}`);
  });

  test('la signature s’ajoute à l’affichage, pas à l’historique stocké', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    const memoire = await page.evaluate(() => JSON.parse(localStorage.getItem('capweb.historique')));
    expect(memoire[0]).toEqual({ role: 'user', text: 'salut' });
    expect(memoire[1]).toEqual({ role: 'assistant', text: replyTo('salut') });
  });

  test('le texte de l’utilisateur reste du texte, signature comprise', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, '<b>gras</b>');
    await expect(page.locator('#messages b')).toHaveCount(0);
    await expect(lignes(page).nth(0)).toHaveText('Vous : <b>gras</b>');
  });
});
