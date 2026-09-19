import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PERSONA, validatePersona, signature } from '../public/js/persona.js';

// Une identité valide dont seul le nom change : l'accueil contient toujours le nom.
const avecNom = (name) => ({ ...PERSONA, name, greeting: `Salut, je suis ${name.trim()}.` });
const avecEmoji = (emoji) => ({ ...PERSONA, emoji });

describe('PERSONA (valeurs de la spec)', () => {
  it('a le nom, l’emoji, l’accueil et les trois questions de SPEC.md', () => {
    assert.equal(PERSONA.name, 'Cap Web');
    assert.equal(PERSONA.emoji, '🚀');
    assert.ok(PERSONA.greeting.includes('Cap Web'));
    assert.deepEqual(PERSONA.suggestions, [
      'Comment préparer un entretien technique ?',
      'Que veut dire HTML sémantique ?',
      'Comment tester une fonction JavaScript ?',
    ]);
  });

  it('est acceptée par validatePersona', () => {
    assert.deepEqual(validatePersona(PERSONA), { ok: true });
  });
});

describe('critère 1 — le nom fait de 2 à 20 caractères', () => {
  it('refuse un nom de 1 caractère, avec un message d’erreur', () => {
    const resultat = validatePersona(avecNom('a'));
    assert.equal(resultat.ok, false);
    assert.equal(typeof resultat.error, 'string');
    assert.notEqual(resultat.error.trim(), '');
  });

  it('accepte un nom de 2 caractères', () => {
    assert.equal(validatePersona(avecNom('ab')).ok, true);
  });

  it('accepte un nom de 20 caractères', () => {
    assert.equal(validatePersona(avecNom('a'.repeat(20))).ok, true);
  });

  it('refuse un nom de 21 caractères', () => {
    assert.equal(validatePersona(avecNom('a'.repeat(21))).ok, false);
  });

  it('mesure le nom sans les espaces autour', () => {
    assert.equal(validatePersona(avecNom('  ab  ')).ok, true);
    assert.equal(validatePersona(avecNom('   a   ')).ok, false);
    assert.equal(validatePersona(avecNom(`  ${'a'.repeat(21)}  `)).ok, false);
  });

  it('refuse un nom vide ou fait d’espaces', () => {
    assert.equal(validatePersona({ ...PERSONA, name: '' }).ok, false);
    assert.equal(validatePersona({ ...PERSONA, name: '     ' }).ok, false);
  });

  it('refuse un nom qui n’est pas du texte', () => {
    assert.equal(validatePersona({ ...PERSONA, name: 42 }).ok, false);
    assert.equal(validatePersona({ ...PERSONA, name: undefined }).ok, false);
  });
});

describe('critère 2 — l’emoji est un seul caractère visible', () => {
  it('accepte un emoji simple', () => {
    assert.equal(validatePersona(avecEmoji('🚀')).ok, true);
  });

  it('accepte 🛡️, qui compte pour un malgré sa longueur JavaScript', () => {
    assert.ok('🛡️'.length > 2);
    assert.equal(validatePersona(avecEmoji('🛡️')).ok, true);
  });

  it('refuse deux emojis', () => {
    assert.equal(validatePersona(avecEmoji('🚀🚀')).ok, false);
    assert.equal(validatePersona(avecEmoji('🚀🛡️')).ok, false);
  });

  it('refuse du texte, une lettre ou un chiffre', () => {
    assert.equal(validatePersona(avecEmoji('a')).ok, false);
    assert.equal(validatePersona(avecEmoji('abc')).ok, false);
    assert.equal(validatePersona(avecEmoji('1')).ok, false);
  });

  it('refuse un emoji vide ou qui n’est pas du texte', () => {
    assert.equal(validatePersona(avecEmoji('')).ok, false);
    assert.equal(validatePersona(avecEmoji(undefined)).ok, false);
    assert.equal(validatePersona(avecEmoji(7)).ok, false);
  });
});

describe('validatePersona — les autres règles de la spec', () => {
  it('refuse un accueil qui ne contient pas le nom', () => {
    assert.equal(validatePersona({ ...PERSONA, greeting: 'Bienvenue !' }).ok, false);
  });

  it('exige exactement trois suggestions', () => {
    const [a, b, c] = PERSONA.suggestions;
    assert.equal(validatePersona({ ...PERSONA, suggestions: [a, b] }).ok, false);
    assert.equal(validatePersona({ ...PERSONA, suggestions: [a, b, c, 'Une de trop ?'] }).ok, false);
  });

  it('refuse une suggestion vide ou de plus de 280 caractères', () => {
    const [a, b] = PERSONA.suggestions;
    assert.equal(validatePersona({ ...PERSONA, suggestions: [a, b, '   '] }).ok, false);
    assert.equal(validatePersona({ ...PERSONA, suggestions: [a, b, 'a'.repeat(281)] }).ok, false);
    assert.equal(validatePersona({ ...PERSONA, suggestions: [a, b, 'a'.repeat(280)] }).ok, true);
  });

  it('ne plante jamais et renvoie une erreur si l’argument n’est pas un objet', () => {
    for (const valeur of [undefined, null, 42, 'texte', true, []]) {
      const resultat = validatePersona(valeur);
      assert.equal(resultat.ok, false);
      assert.equal(typeof resultat.error, 'string');
      assert.notEqual(resultat.error.trim(), '');
    }
  });
});

describe('signature', () => {
  it('donne l’emoji, une espace, puis le nom', () => {
    assert.equal(signature(PERSONA), '🚀 Cap Web');
  });

  it('suit l’identité qu’on lui donne', () => {
    assert.equal(signature({ ...PERSONA, name: 'Boussole', emoji: '🧭' }), '🧭 Boussole');
  });
});

describe('persona.js', () => {
  it('ne touche pas à la page', async () => {
    const code = await readFile(new URL('../public/js/persona.js', import.meta.url), 'utf8');
    assert.doesNotMatch(code, /\b(document|window|localStorage)\b/);
  });
});
