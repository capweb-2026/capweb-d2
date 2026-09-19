export const PERSONA = {
  name: 'Cap Web',
  emoji: '🚀',
  greeting: 'Salut ! Je suis Cap Web, ton assistant pour apprendre le web et préparer ton entretien technique. Je suis un programme à règles, pas une vraie IA.',
  suggestions: [
    'Comment préparer un entretien technique ?',
    'Que veut dire HTML sémantique ?',
    'Comment tester une fonction JavaScript ?',
  ],
};

const NOM_MIN = 2;
const NOM_MAX = 20;
const SUGGESTIONS_NOMBRE = 3;
const SUGGESTION_MAX = 280;

function estUnSeulEmoji(valeur) {
  if (typeof valeur !== 'string') {
    return false;
  }
  const segments = [...new Intl.Segmenter('fr', { granularity: 'grapheme' }).segment(valeur)];
  return segments.length === 1 && /\p{Extended_Pictographic}/u.test(valeur);
}

export function validatePersona(persona) {
  if (persona === null || typeof persona !== 'object' || Array.isArray(persona)) {
    return { ok: false, error: 'L’identité doit être un objet' };
  }

  const { name, emoji, greeting, suggestions } = persona;

  if (typeof name !== 'string') {
    return { ok: false, error: 'Le nom doit être un texte' };
  }
  const nom = name.trim();
  const longueurNom = [...nom].length;
  if (longueurNom < NOM_MIN || longueurNom > NOM_MAX) {
    return { ok: false, error: `Le nom doit faire de ${NOM_MIN} à ${NOM_MAX} caractères` };
  }

  if (!estUnSeulEmoji(emoji)) {
    return { ok: false, error: 'L’emoji doit être un seul emoji' };
  }

  if (typeof greeting !== 'string' || !greeting.includes(nom)) {
    return { ok: false, error: 'Le message d’accueil doit contenir le nom' };
  }

  const suggestionsValides =
    Array.isArray(suggestions) &&
    suggestions.length === SUGGESTIONS_NOMBRE &&
    suggestions.every((s) => typeof s === 'string' && s.trim() !== '' && s.length <= SUGGESTION_MAX);
  if (!suggestionsValides) {
    return { ok: false, error: `Il faut exactement ${SUGGESTIONS_NOMBRE} questions suggérées, de ${SUGGESTION_MAX} caractères au plus` };
  }

  return { ok: true };
}

export function signature(persona) {
  return `${persona.emoji} ${persona.name}`;
}
