import { validateMessage, replyTo } from './brain.js';
import { renderMessages } from './view.js';

const formulaire = document.querySelector('#chat-form');
const statut = document.querySelector('#status');
const champ = document.querySelector('#message');
const liste = document.querySelector('#messages');
const versionElt = document.querySelector('#version');

const historique = [];

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

  champ.value = '';
  statut.textContent = '';
  champ.focus();
});

fetch('/version.json', { headers: { accept: 'application/json' } })
  .then((reponse) => (reponse.ok ? reponse.json() : null))
  .then((donnees) => {
    if (donnees && typeof donnees.version === 'string' && versionElt) {
      versionElt.textContent = `version ${donnees.version}`;
    }
  })
  .catch(() => {});
