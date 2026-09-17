import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateMessage, replyTo } from '../public/js/brain.js';

describe('validateMessage', () => {
  it('refuse une chaîne vide', () => {
    assert.equal(validateMessage('   ').ok, false);
  });

  it('nettoie les espaces autour du message', () => {
    assert.deepEqual(validateMessage('  salut  '), { ok: true, value: 'salut' });
  });

  it('accepte 280 caractères', () => {
    assert.equal(validateMessage('a'.repeat(280)).ok, true);
  });

  it('refuse 281 caractères', () => {
    assert.equal(validateMessage('a'.repeat(281)).ok, false);
  });
});

describe('replyTo', () => {
  it('ignore la casse : « SALUT » et « salut » donnent la même réponse', () => {
    assert.equal(replyTo('SALUT'), replyTo('salut'));
  });

  it('répond à une phrase inconnue différemment de « aide »', () => {
    assert.notEqual(replyTo('une phrase inconnue'), replyTo('aide'));
  });
});
