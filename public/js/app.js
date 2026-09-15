import { validateMessage, replyTo } from './brain.js';
import { renderMessages } from './view.js';

const formulaire = document.querySelector('#chat-form');
const statut = document.querySelector('#status');
const champ = document.querySelector('#message');
const liste = document.querySelector('#messages');
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

charger();
renderMessages(historique, liste);

formulaire?.addEventListener('submit', (event) => {
  event.preventDefault();

  const validation = validateMessage(champ.value);
  if (!validation.ok) {
    statut.textContent = validation.error;
    champ.focus();
    return;
  }

  historique.push({ role: 'user', text: validation.value });
  historique.push({ role: 'assistant', text: replyTo(validation.value) });
  renderMessages(historique, liste);
  sauvegarder();

  champ.value = '';
  statut.textContent = '';
  champ.focus();
});

boutonEffacer?.addEventListener('click', () => {
  if (!confirm('Effacer toute la conversation ?')) {
    return;
  }
  historique.length = 0;
  localStorage.removeItem(CLE_HISTORIQUE);
  renderMessages(historique, liste);
});

fetch('/version.json', { headers: { accept: 'application/json' } })
  .then((reponse) => (reponse.ok ? reponse.json() : null))
  .then((donnees) => {
    if (donnees && typeof donnees.version === 'string' && versionElt) {
      versionElt.textContent = `version ${donnees.version}`;
    }
  })
  .catch(() => {});
