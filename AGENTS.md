# AGENTS — Règles de l'agent pour Cap Web

Projet : un assistant de chat à règles (pas une vraie IA) pour apprendre le web et préparer un entretien technique. Serveur Node local sans dépendance, pages en JavaScript natif.

## Fichiers principaux

- `public/index.html` : la page.
- `public/js/brain.js` : les réponses et la validation des messages (aucun accès à la page).
- `public/js/persona.js` : l'identité (nom, emoji, accueil, suggestions) et sa validation.
- `public/js/view.js` : l'affichage, avec `textContent` uniquement.
- `public/js/app.js` : le branchement de la page, l'historique et le stockage.
- `public/styles.css` : le style.
- `server/app.js` : le serveur local et sa liste blanche de fichiers.
- `SPEC.md` : ce qu'il faut construire. À lire en entier avant chaque tâche.

## Commandes

- `npm run lint` : le lint.
- `npm test` : les tests Node.
- `npm run test:browser` : les tests navigateur.
- `npm run check:deps` : le contrôle des dépendances.
- `npm run verify` : tout le contrôle. Il doit être vert avant de rendre la main.
- `npm start` : le serveur sur `http://127.0.0.1:3000`.

## Ce que tu dois faire

1. Lis `SPEC.md` avant de commencer et ne construis que ce qu'il demande, critère par critère.
2. Écris d'abord les tests du critère, lance-les et montre-moi qu'ils échouent, avant d'écrire le code.
3. Fais la plus petite modification qui fait passer le test.
4. Lance `npm run verify` avant de dire que tu as terminé, et donne-moi le résultat tel quel.
5. Si `SPEC.md` est ambigu ou si une question ouverte se pose, pose-moi la question au lieu de choisir.
6. Écris tout le texte affiché à l'utilisateur en français.

## Ce que tu ne dois jamais faire

1. Ne touche jamais à git : pas de `git add`, `git commit`, `git push`, `git switch`, `git reset`. C'est l'humain qui commite.
2. Ne modifie jamais `SPEC.md` ni `AGENTS.md`.
3. Ne modifie jamais `tests/contrat/` ni `browser/contrat.spec.js`, et ne supprime ni n'affaiblis aucun test existant : on corrige le code, pas le test.
4. Ne modifie jamais `.github/`, `scripts/`, `package.json`, `package-lock.json`, `dependances-autorisees.json`, `eslint.config.js`, `playwright.config.js`, `playwright.smoke.config.js` ni `vercel.json`.
5. N'ajoute aucune dépendance : pas de `npm install`, pas de nouvelle entrée dans `package.json`.
6. N'utilise jamais `innerHTML`, `outerHTML`, `insertAdjacentHTML` ni `eval` : affiche le texte avec `textContent`.
7. Ne mets aucune clé, aucun mot de passe, aucun jeton dans le code, les tests ou les fichiers de configuration, et ne crée pas de fichier `.env`.
8. N'ajoute aucun appel réseau vers l'extérieur et aucune vraie IA.
9. N'ajoute aucune donnée personnelle dans le code, les tests ou les messages.
10. Ne désactive jamais un contrôle : pas de `eslint-disable`, pas de `test.skip`, pas de `--no-verify`.
11. Ne supprime aucun fichier et n'exécute aucune commande destructrice (`rm -rf`, `git clean`) sans que je te l'aie demandé.
12. Ne sors pas du dépôt : ne lis et n'écris que dans ce dossier.

## Limites

- Si un fichier JavaScript est ajouté dans `public/js/`, ajoute-le à `FICHIERS` et à `TYPES` dans `server/app.js`, et rien d'autre dans ce fichier.
- Quand tu as fini, liste les fichiers que tu as modifiés et les critères de `SPEC.md` que ta modification couvre.
