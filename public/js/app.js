import { validateMessage } from './brain.js';
import { PERSONA, validatePersona } from './persona.js';
import { renderMessages, renderAccueil, renderSuggestions, renderEntete } from './view.js';

const formulaire = document.querySelector('#chat-form');
const statut = document.querySelector('#status');
const champ = document.querySelector('#message');
const liste = document.querySelector('#messages');
const titre = document.querySelector('#titre-page');
const accueil = document.querySelector('#accueil');
const zoneSuggestions = document.querySelector('#suggestions');
const versionElt = document.querySelector('#version');
const boutonEffacer = document.querySelector('#effacer');

const CLE_HISTORIQUE = 'capweb.historique';
const historique = [];

function sauvegarder() {
  localStorage.setItem(CLE_HISTORIQUE, JSON.stringify(historique));
}

function charger() {
  const brut = localStorage.getItem(CLE_HISTORIQUE);
  if (!brut) {
    return;
  }
  try {
    const donnees = JSON.parse(brut);
    if (Array.isArray(donnees)) {
      historique.push(...donnees);
    }
  } catch {
    statut.textContent = 'Mémoire illisible : conversation vidée.';
  }
}

function afficher() {
  renderMessages(historique, liste);
  renderAccueil(PERSONA, accueil, historique.length === 0);
}

charger();
afficher();

const identite = validatePersona(PERSONA);
if (identite.ok) {
  renderEntete(PERSONA, titre);
  renderSuggestions(PERSONA, zoneSuggestions, (question) => {
    champ.value = question;
    champ.focus();
  });
} else {
  statut.textContent = identite.error;
}

formulaire?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const validation = validateMessage(champ.value);
  if (!validation.ok) {
    statut.textContent = validation.error;
    champ.focus();
    return;
  }

  const message = validation.value;

  historique.push({ role: 'user', text: message });
  afficher();
  sauvegarder();

  champ.value = '';
  statut.textContent = 'Réponse en cours...';

  try {
    const reponse = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!reponse.ok) {
      throw new Error('Réponse serveur invalide');
    }

    const donnees = await reponse.json();

    if (typeof donnees.text !== 'string' || donnees.text.trim() === '') {
      throw new Error('Réponse vide');
    }

    historique.push({
      role: 'assistant',
      text: donnees.text,
    });

    afficher();
    sauvegarder();

    if (donnees.source === 'regles') {
      statut.textContent = 'Mode dégradé : réponse avec les règles.';
    } else {
      statut.textContent = '';
    }
  } catch {
    historique.push({
      role: 'assistant',
      text: 'Je ne peux pas contacter le service IA pour le moment.',
    });

    afficher();
    sauvegarder();

    statut.textContent = 'Mode dégradé : service IA indisponible.';
  }

  champ.focus();
});

boutonEffacer?.addEventListener('click', () => {
  if (!confirm('Effacer toute la conversation ?')) {
    return;
  }
  historique.length = 0;
  localStorage.removeItem(CLE_HISTORIQUE);
  afficher();
});

fetch('/version.json', { headers: { accept: 'application/json' } })
  .then((reponse) => (reponse.ok ? reponse.json() : null))
  .then((donnees) => {
    if (donnees && typeof donnees.version === 'string' && versionElt) {
      versionElt.textContent = `version ${donnees.version}`;
    }
  })
  .catch(() => {});