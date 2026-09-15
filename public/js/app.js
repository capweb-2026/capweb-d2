import { validateMessage, replyTo } from './brain.js';

const formulaire = document.querySelector('#chat-form');
const statut = document.querySelector('#status');
const champ = document.querySelector('#message');
const liste = document.querySelector('#messages');
const versionElt = document.querySelector('#version');

formulaire?.addEventListener('submit', (event) => {
  event.preventDefault();

  const validation = validateMessage(champ.value);
  if (!validation.ok) {
    statut.textContent = validation.error;
    champ.focus();
    return;
  }

  const message = document.createElement('li');
  message.textContent = `Vous : ${validation.value}`;
  liste.append(message);

  const reponse = document.createElement('li');
  reponse.textContent = `Cap Web : ${replyTo(validation.value)}`;
  liste.append(reponse);

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
