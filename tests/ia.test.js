import test from 'node:test';
import assert from 'node:assert/strict';
import { validateMessage } from '../public/js/brain.js';
import { createApp } from '../server/app.js';

function demarrerApp(options = {}) {
  const serveur = createApp(options);

  return new Promise((resolve) => {
    serveur.listen(0, '127.0.0.1', () => {
      const { port } = serveur.address();

      resolve({
        serveur,
        url: `http://127.0.0.1:${port}`,
      });
    });
  });
}

test('validateMessage refuse un message vide', () => {
  const resultat = validateMessage('   ');

  assert.equal(resultat.ok, false);
});

test('POST /api/chat répond avec un fallback sans clé', async () => {
  const { serveur, url } = await demarrerApp();

  try {
    const reponse = await fetch(`${url}/api/chat`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Comment préparer un entretien technique ?',
      }),
    });

    assert.equal(reponse.status, 200);

    const donnees = await reponse.json();

    assert.equal(donnees.source, 'regles');
    assert.equal(typeof donnees.text, 'string');
    assert.notEqual(donnees.text, '');
  } finally {
    serveur.close();
  }
});

test('le module IA utilise le fournisseur quand il répond', async () => {
  const { getReply } = await import('../server/ia.js');

  const resultat = await getReply('Comment préparer un entretien technique ?', {
    provider: async () => 'Réponse IA',
  });

  assert.deepEqual(resultat, {
    text: 'Réponse IA',
    source: 'ia',
  });
});

test('le module IA utilise les règles si le fournisseur échoue', async () => {
  const { getReply } = await import('../server/ia.js');

  const resultat = await getReply('Comment préparer un entretien technique ?', {
    provider: async () => {
      throw new Error('erreur fournisseur');
    },
  });

  assert.equal(resultat.source, 'regles');
  assert.equal(typeof resultat.text, 'string');
  assert.notEqual(resultat.text, '');
});

test('le module IA utilise les règles si le fournisseur est trop lent', async () => {
  const { getReply } = await import('../server/ia.js');

  const debut = Date.now();

  const resultat = await getReply('Comment préparer un entretien technique ?', {
    maxDelay: 50,
    provider: async () =>
      new Promise((resolve) => {
        setTimeout(() => resolve('Réponse IA'), 200);
      }),
  });

  const duree = Date.now() - debut;

  assert.equal(resultat.source, 'regles');
  assert.ok(duree < 150);
});