import { PERSONA, signature } from './persona.js';

export function renderMessages(messages, container) {
  const lignes = messages.map((msg) => {
    const li = document.createElement('li');
    const etiquette = msg.role === 'user' ? 'Vous' : signature(PERSONA);
    li.textContent = `${etiquette} : ${msg.text}`;
    return li;
  });
  container.replaceChildren(...lignes);
}

export function renderEntete(persona, titre) {
  titre.textContent = signature(persona);
}

export function renderAccueil(persona, conteneur, visible) {
  conteneur.textContent = persona.greeting;
  conteneur.hidden = !visible;
}

export function renderSuggestions(persona, conteneur, surClic) {
  const boutons = persona.suggestions.map((question) => {
    const bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.textContent = question;
    bouton.addEventListener('click', () => surClic(question));
    return bouton;
  });
  conteneur.replaceChildren(...boutons);
}
