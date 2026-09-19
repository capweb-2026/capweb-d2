# SPEC — L'identité de l'assistant Cap Web

## Objectif

Donner une identité à l'assistant : un nom, un emoji, un message d'accueil et trois questions suggérées, dans notre thème : apprendre le web et préparer un entretien technique. L'assistant reste un programme à règles, pas une vraie IA.

Identité retenue :

- **Nom** : `Cap Web`
- **Emoji** : `🚀`
- **Accueil** : `Salut ! Je suis Cap Web, ton assistant pour apprendre le web et préparer ton entretien technique. Je suis un programme à règles, pas une vraie IA.`
- **Questions suggérées** :
  1. `Comment préparer un entretien technique ?`
  2. `Que veut dire HTML sémantique ?`
  3. `Comment tester une fonction JavaScript ?`

## Critères d'acceptation

1. Quand l'identité est chargée, le système vérifie que le nom, sans les espaces autour, fait de 2 à 20 caractères, et refuse tout nom qui ne respecte pas cette longueur.
2. Quand l'identité est chargée, le système vérifie que l'emoji est un seul caractère visible (un emoji comme 🛡️ compte pour un, même si sa longueur JavaScript est supérieure), et refuse du texte ou deux emojis.
3. Quand la conversation est vide, le système affiche dans `#accueil` un message d'accueil qui contient le nom ; dès qu'un message est envoyé, l'accueil disparaît.
4. Quand la page s'affiche, le système montre exactement trois questions suggérées sous forme de boutons dans `#suggestions` ; après un clic sur l'une d'elles, `#message` contient cette question et `#messages` n'a aucune ligne de plus.
5. Quand l'assistant répond, sa ligne dans `#messages` commence par son emoji suivi de son nom (`🚀 Cap Web : …`), et la ligne de l'utilisateur commence par `Vous : `.
6. Quand on lance `npm run verify`, le système reste vert : le contrat du CP1 (`tests/contrat/` et `browser/contrat.spec.js`) passe sans avoir été modifié.

## Hors périmètre

- Aucune vraie IA, aucun appel réseau, aucune clé : les réponses restent des règles dans `brain.js`.
- Aucune donnée personnelle dans l'identité, l'historique ou le code.
- Pas de nouvelles réponses du cerveau pour les questions suggérées (repli pour l'instant).
- Aucune dépendance ajoutée, aucune modification du contrat, de la chaîne ni des scripts.

## Données et fonctions attendues

- **`public/js/persona.js`** (nouveau) exporte :
  - `PERSONA` : objet `{ name, emoji, greeting, suggestions }` avec les valeurs ci-dessus ; `suggestions` est un tableau de trois textes.
  - `validatePersona(persona)` : renvoie `{ ok: true }` si le nom (après `trim()`) fait de 2 à 20 caractères, si l'emoji est un seul caractère visible (mesuré avec `Intl.Segmenter`, un seul segment contenant un pictogramme), si l'accueil contient le nom, et s'il y a exactement trois suggestions non vides de 280 caractères au plus ; sinon `{ ok: false, error: '…' }` avec un message en français, sans lever d'exception, même si l'argument n'est pas un objet.
  - `signature(persona)` : renvoie `'🚀 Cap Web'` (l'emoji, une espace, le nom) pour `PERSONA`.
- **`public/js/persona.js`** ne touche pas à la page : ni `document`, ni `window`, ni `localStorage`.
- **`public/js/view.js`** : `renderMessages(messages, container)` préfixe les lignes de l'assistant par la signature et celles de l'utilisateur par `Vous`, avec `textContent` uniquement. Ajoute `renderAccueil(persona, conteneur, visible)` et `renderSuggestions(persona, conteneur, surClic)` qui fabriquent leurs éléments sans `innerHTML`.
- **`public/js/app.js`** : branche ces fonctions ; l'historique stocké sous `capweb.historique` ne change pas de forme (`{ role, text }`) : la signature est ajoutée à l'affichage, pas au stockage.
- **`public/index.html`** : ajoute `#accueil` et `#suggestions` en dehors de `#messages`.
- **`server/app.js`** : ajoute `js/persona.js` à `FICHIERS` (`/js/persona.js`) et à `TYPES` (`text/javascript; charset=utf-8`), sans autre changement.
- **Tests** : `tests/persona.test.js` (Node) pour les critères 1 et 2 ; les critères 3 à 5 par des tests navigateur ajoutés dans un nouveau fichier de `browser/`, sans toucher à `browser/contrat.spec.js`.

## Questions ouvertes

- Que répond le cerveau aux trois questions suggérées ? Pour l'instant, le repli « Je ne connais pas encore cette question ». À trancher avant de les considérer comme utiles.
- Un nom composé uniquement de chiffres ou de ponctuation est-il accepté ? La spec ne dit que la longueur : l'agent doit poser la question plutôt que choisir.
- Faut-il mettre l'emoji dans l'accueil ? Pour l'instant non (l'emoji apparaît dans la signature).
