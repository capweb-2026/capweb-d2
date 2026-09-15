export function validateMessage(raw) {
  if (typeof raw !== 'string') {
    return { ok: false, error: 'Le message doit être un texte' };
  }

  const value = raw.trim();
  if (value === '') {
    return { ok: false, error: 'Le message ne doit pas être vide' };
  }
  if (value.length > 280) {
    return { ok: false, error: 'Le message ne doit pas dépasser 280 caractères' };
  }

  return { ok: true, value };
}

export function replyTo(message) {
  const question = message.trim().toLowerCase();

  if (question === 'salut' || question === 'bonjour') {
    return 'Bonjour ! Prêt à préparer ton entretien technique ?';
  }
  if (question === 'aide') {
    return 'Tu peux écrire salut, aide ou test.';
  }
  if (question === 'test') {
    return 'Bonne réponse : explique ton raisonnement avant de proposer une solution.';
  }

  return 'Je ne connais pas encore cette question. Essaie « aide ».';
}
