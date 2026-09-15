# Suivi — après-midi J1

- Nom : Shun
- Binôme : Jean-Jacques
- Atelier utilisé : capweb-d2

## TP07 — Afficher le message

- J'ai prédit : que le message envoyé s'afficherait dans la liste.
- Nous avons fait : lu le champ et la liste, puis créé un `li` « Vous : … ».
- J'ai observé : le message apparaît et le champ se vide.
- J'ai compris : `event.preventDefault()` bloque le rechargement, `textContent` affiche le texte brut.
- Je n'ai pas compris : pourquoi il fallait `trim()`.
- Réponse : avec `innerHTML`, `<b>gras</b>` deviendrait du HTML ; `textContent` l'affiche tel quel.

## TP08 — Un cerveau à règles

- J'ai prédit : que le bot choisirait une réponse selon le mot.
- Nous avons fait : créé `brain.js` avec `validateMessage` et `replyTo`.
- J'ai observé : « salut », « aide » et « test » donnent des réponses différentes.
- J'ai compris : `brain.js` ne doit pas utiliser `document`, il ne touche pas à la page.
- Je n'ai pas compris : pourquoi le serveur doit autoriser `brain.js`.
- Réponse : sinon le serveur pourrait exposer des fichiers privés.

## TP09 — Modules

-

## TP10 — Mémoire

- 

## TP11 — Premier test automatique

- 

## TP12 — Bilan et sauvegarde

- J'ai prédit : que le bilan servirait à dire ce qui est compris.
- Nous avons fait : sauvegarde git (`J1 : Cap Web répond`) et push sur GitHub.
- J'ai observé : le dépôt est à jour (branche `tp12`).
- J'ai compris : il faut sauvegarder avant la fin.
- Je n'ai pas compris : —
- Réponse : —

## Trois questions

1. Pourquoi `textContent` et pas `innerHTML` ?
   `textContent` affiche le texte tel quel, donc pas de HTML interprété.
2. Pourquoi trois fichiers plutôt qu'un seul ?
   Pour séparer les règles, l'affichage et la coordination.
3. Si une IA écrit du code, comment savoir s'il est correct ?
   Je lis le code, je lance les tests et je fais relire avant de fusionner.

## Aides utilisées

- Indices, aide-mémoire, binôme : consignes des TP et `npm test`.
- Ce que j'ai demandé à une IA : comprendre les erreurs ; vérifié avec les tests et le navigateur.