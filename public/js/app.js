const formulaire = document.querySelector('#chat-form');
const statut = document.querySelector('#status');
const champ = document.querySelector('#message');
const liste = document.querySelector('#messages');
const versionElt = document.querySelector('#version');

formulaire?.addEventListener('submit', (event) => {
  event.preventDefault();

  const texte = champ.value.trim();
  if (texte === '') {
    statut.textContent = 'Le message ne doit pas être vide';
    champ.focus();
    return;
  }

  const message = document.createElement('li');
  message.textContent = `Vous : ${texte}`;
  liste.append(message);

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
