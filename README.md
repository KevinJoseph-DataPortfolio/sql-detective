# SQL Detective

Jeu web statique pour apprendre SQL par des enquêtes quotidiennes.

## Profil et niveaux
Au premier lancement, choisis un nom (20 caractères maximum), un avatar DiceBear
et un niveau. « Passer » crée un profil Détective avec un avatar aléatoire et le
niveau Débutant. Le profil est conservé dans `localStorage` sous `sqd_profile` ;
l’accueil ne revient pas tant que ce profil valide est conservé.

Débutant débloque les dossiers 1 à 10, Intermédiaire 1 à 20 et Avancé 1 à 30.
Le dossier quotidien utilise `(jour_de_l_annee % 10) + niveau * 10` (index à zéro,
niveaux 0, 1, 2). Le bouton de l’en-tête permet de changer de niveau et d’ouvrir
le dossier du jour correspondant sans effacer les affaires résolues.

Les cinq styles d’avatar sont notionists, avataaars, bottts, pixel-art et adventurer.
Le bouton Mélanger change la graine, conservée avec le style dans le profil.
Si DiceBear ne répond pas, les initiales remplacent l’image automatiquement.

## Lancer en local
    python3 -m http.server 8000
    # puis ouvrir http://localhost:8000

Le double-clic sur index.html ne suffit pas : sql.js charge un fichier .wasm
que le protocole file:// bloque.

## Déployer
Settings → Pages → branch main → / (root)

## Ajouter des dossiers
Édite puzzles.js. Chaque entrée : { tag, titre, enonce, indice, ref, ordered }.
`ref` est la requête de référence : elle est exécutée au démarrage pour
déterminer la réponse attendue. Mets `ordered: true` si l'ordre des lignes compte.

## Brancher AdSense
Décommenter le bloc dans index.html et remplacer ca-pub-XXXX par ton identifiant.
Deux emplacements sont prévus : sous le jeu, sous le rapport d'enquête.
