import { getReply } from '../server/ia.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée' });
    return;
  }

  let message = '';

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    message = typeof body?.message === 'string' ? body.message.trim() : '';
  } catch {
    res.status(400).json({
      text: 'Le message doit être un JSON valide.',
      source: 'regles',
    });
    return;
  }

  if (!message || message.length > 280) {
    res.status(400).json({
      text: 'Le message doit contenir entre 1 et 280 caractères.',
      source: 'regles',
    });
    return;
  }

  const resultat = await getReply(message);

  res.status(200).json(resultat);
}