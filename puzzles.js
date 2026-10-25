window.SQD_PUZZLES = [

{ tag:'SELECT', titre:`Premier contact`,
  enonce:`Le dossier est ouvert. Sors la liste complète des suspects : leur <b>nom</b> et leur <b>ville</b>.`,
  indice:`SELECT nom, ville FROM suspects`,
  ref:`SELECT nom, ville FROM suspects` },

{ tag:'WHERE', titre:`Le portefeuille vidé`,
  enonce:`Un vol au Café du Port. Les témoins jurent que le voleur habite Marseille. Renvoie le <b>nom</b> des suspects marseillais.`,
  indice:`SELECT nom FROM suspects WHERE ville = '…'`,
  ref:`SELECT nom FROM suspects WHERE ville='Marseille'` },

{ tag:'WHERE', titre:`Le signalement`,
  enonce:`Le témoin a vu un homme grand : plus de 180 cm. Renvoie <b>nom</b> et <b>taille_cm</b>.`,
  indice:`Opérateur > sur taille_cm`,
  ref:`SELECT nom, taille_cm FROM suspects WHERE taille_cm > 180` },

{ tag:'WHERE', titre:`Les jeunes`,
  enonce:`Le complice serait jeune. Renvoie <b>nom</b> et <b>age</b> des suspects de moins de 30 ans.`,
  indice:`Opérateur < sur age`,
  ref:`SELECT nom, age FROM suspects WHERE age < 30` },

{ tag:'AND', titre:`Le portrait-robot`,
  enonce:`Grand (au moins 180 cm) <b>et</b> jeune (moins de 40 ans). Renvoie <b>nom</b>, <b>taille_cm</b> et <b>age</b>.`,
  indice:`Deux conditions reliées par AND`,
  ref:`SELECT nom, taille_cm, age FROM suspects WHERE taille_cm >= 180 AND age < 40` },

{ tag:'OR', titre:`Hors Marseille`,
  enonce:`Le suspect a fui la région. Renvoie <b>nom</b> et <b>ville</b> des suspects qui habitent Lille <b>ou</b> Paris.`,
  indice:`OR entre les deux villes`,
  ref:`SELECT nom, ville FROM suspects WHERE ville='Lille' OR ville='Paris'` },

{ tag:'IN', titre:`Les métiers du milieu`,
  enonce:`Le commanditaire exerce l'un de ces métiers : Ingénieur, Comptable, Mécanicien. Renvoie <b>nom</b> et <b>profession</b>.`,
  indice:`WHERE profession IN ('a','b','c')`,
  ref:`SELECT nom, profession FROM suspects WHERE profession IN ('Ingénieur','Comptable','Mécanicien')` },

{ tag:'NOT', titre:`Écarter les témoins`,
  enonce:`Tout le monde sauf Marseille. Renvoie <b>nom</b> et <b>ville</b> des suspects qui n'habitent pas Marseille.`,
  indice:`Opérateur !=`,
  ref:`SELECT nom, ville FROM suspects WHERE ville != 'Marseille'` },

{ tag:'LIKE', titre:`L'initiale du nom`,
  enonce:`On cherche un nom de famille commençant par D. Renvoie <b>nom</b> et <b>ville</b>.`,
  indice:`Le prénom est devant : LIKE 'D%' ne suffit pas. Essaie LIKE '% D%'.`,
  ref:`SELECT nom, ville FROM suspects WHERE nom LIKE '% D%'` },

{ tag:'BETWEEN', titre:`La tranche d'âge`,
  enonce:`Entre 30 et 40 ans inclus. Renvoie <b>nom</b> et <b>age</b>.`,
  indice:`BETWEEN a AND b`,
  ref:`SELECT nom, age FROM suspects WHERE age BETWEEN 30 AND 40` },

{ tag:'ORDER BY', titre:`Par ordre d'arrivée`,
  enonce:`Trie tous les suspects du plus jeune au plus âgé. Renvoie <b>nom</b> et <b>age</b>.`,
  indice:`ORDER BY age ASC`,
  ref:`SELECT nom, age FROM suspects ORDER BY age ASC`, ordered:true },

{ tag:'LIMIT', titre:`Les trois colosses`,
  enonce:`Le complice dépassait tout le monde. Renvoie <b>nom</b> et <b>taille_cm</b> des 3 plus grands, du plus grand au plus petit.`,
  indice:`ORDER BY taille_cm DESC puis LIMIT 3`,
  ref:`SELECT nom, taille_cm FROM suspects ORDER BY taille_cm DESC LIMIT 3`, ordered:true },

{ tag:'ORDER BY', titre:`Le bureau de Lyon`,
  enonce:`Tous les suspects de Lyon, du plus âgé au plus jeune. Renvoie <b>nom</b> et <b>age</b>.`,
  indice:`WHERE ville='Lyon' puis ORDER BY age DESC`,
  ref:`SELECT nom, age FROM suspects WHERE ville='Lyon' ORDER BY age DESC`, ordered:true },

{ tag:'DISTINCT', titre:`La carte du territoire`,
  enonce:`Liste chaque ville une seule fois. Renvoie la colonne <b>ville</b>.`,
  indice:`SELECT DISTINCT ville FROM suspects`,
  ref:`SELECT DISTINCT ville FROM suspects` },

{ tag:'COUNT', titre:`L'effectif`,
  enonce:`Combien de suspects au total ? Renvoie une seule valeur.`,
  indice:`SELECT COUNT(*) FROM suspects`,
  ref:`SELECT COUNT(*) FROM suspects` },

{ tag:'COUNT', titre:`Compter Marseille`,
  enonce:`Combien de suspects habitent Marseille ?`,
  indice:`COUNT(*) accompagné d'un WHERE`,
  ref:`SELECT COUNT(*) FROM suspects WHERE ville='Marseille'` },

{ tag:'COUNT', titre:`Combien de villes`,
  enonce:`Combien de villes différentes apparaissent dans la base ?`,
  indice:`COUNT(DISTINCT ville)`,
  ref:`SELECT COUNT(DISTINCT ville) FROM suspects` },

{ tag:'AVG', titre:`La taille moyenne`,
  enonce:`Taille moyenne des suspects, arrondie à une décimale.`,
  indice:`ROUND(AVG(taille_cm), 1)`,
  ref:`SELECT ROUND(AVG(taille_cm),1) FROM suspects` },

{ tag:'MIN / MAX', titre:`Les extrêmes`,
  enonce:`Renvoie la plus petite et la plus grande taille de la base, dans cet ordre.`,
  indice:`MIN et MAX dans le même SELECT`,
  ref:`SELECT MIN(taille_cm), MAX(taille_cm) FROM suspects` },

{ tag:'GROUP BY', titre:`Quadrillage`,
  enonce:`Nombre de suspects par ville, de la plus fournie à la moins fournie. Renvoie <b>ville</b> et <b>effectif</b>.`,
  indice:`GROUP BY ville, ORDER BY COUNT(*) DESC`,
  ref:`SELECT ville, COUNT(*) FROM suspects GROUP BY ville ORDER BY COUNT(*) DESC, ville ASC`, ordered:true },

{ tag:'GROUP BY', titre:`Profil type`,
  enonce:`Taille moyenne par ville, de la plus élevée à la plus faible. Renvoie <b>ville</b> et la moyenne arrondie à une décimale.`,
  indice:`GROUP BY ville, ORDER BY AVG(taille_cm) DESC`,
  ref:`SELECT ville, ROUND(AVG(taille_cm),1) FROM suspects GROUP BY ville ORDER BY AVG(taille_cm) DESC, ville ASC`, ordered:true },

{ tag:'HAVING', titre:`Les villes garnies`,
  enonce:`Uniquement les villes comptant <b>au moins 3 suspects</b>. Renvoie <b>ville</b> et <b>effectif</b>, du plus fourni au moins fourni.`,
  indice:`HAVING filtre après le GROUP BY`,
  ref:`SELECT ville, COUNT(*) FROM suspects GROUP BY ville HAVING COUNT(*) >= 3 ORDER BY COUNT(*) DESC, ville ASC`, ordered:true },

{ tag:'JOIN', titre:`Le garage`,
  enonce:`Croise suspects et vehicules : renvoie le <b>nom</b> du suspect et la <b>marque</b> de son véhicule.`,
  indice:`JOIN vehicules ON v.suspect_id = s.id`,
  ref:`SELECT s.nom, v.marque FROM suspects s JOIN vehicules v ON v.suspect_id = s.id` },

{ tag:'JOIN', titre:`L'alibi qui tient pas`,
  enonce:`Trois suspects prétendent avoir été au Café du Port. Renvoie leur <b>nom</b> et l'<b>heure</b> de leur alibi.`,
  indice:`JOIN alibis, puis WHERE lieu='Café du Port'`,
  ref:`SELECT s.nom, a.heure FROM suspects s JOIN alibis a ON a.suspect_id = s.id WHERE a.lieu='Café du Port'` },

{ tag:'LEFT JOIN', titre:`Le suspect sans voiture`,
  enonce:`Tous les suspects avec leur véhicule, y compris ceux qui n'en ont pas (valeur NULL). Renvoie <b>nom</b> et <b>marque</b>, trié par identifiant de suspect croissant.`,
  indice:`LEFT JOIN conserve les lignes sans correspondance`,
  ref:`SELECT s.nom, v.marque FROM suspects s LEFT JOIN vehicules v ON v.suspect_id = s.id ORDER BY s.id ASC`, ordered:true },

{ tag:'JOIN + GROUP BY', titre:`Les marques`,
  enonce:`Nombre de véhicules par marque, de la plus représentée à la moins représentée. Renvoie <b>marque</b> et <b>nombre</b>.`,
  indice:`GROUP BY marque sur la table vehicules`,
  ref:`SELECT marque, COUNT(*) FROM vehicules GROUP BY marque ORDER BY COUNT(*) DESC, marque ASC`, ordered:true },

{ tag:'Sous-requête', titre:`Au-dessus de la moyenne`,
  enonce:`Suspects plus grands que la taille moyenne. Renvoie <b>nom</b> et <b>taille_cm</b>.`,
  indice:`WHERE taille_cm > (SELECT AVG(taille_cm) FROM suspects)`,
  ref:`SELECT nom, taille_cm FROM suspects WHERE taille_cm > (SELECT AVG(taille_cm) FROM suspects)` },

{ tag:'JOIN', titre:`Le flux d'argent`,
  enonce:`Un virement de plus de 50 000 €. Renvoie le <b>nom</b> de chaque suspect concerné, une seule fois par suspect.`,
  indice:`JOIN transactions, WHERE montant > 50000, puis DISTINCT`,
  ref:`SELECT DISTINCT s.nom FROM suspects s JOIN transactions t ON t.suspect_id = s.id WHERE t.montant > 50000` },

{ tag:'SUM', titre:`Le tableau des comptes`,
  enonce:`Total reçu par suspect, du plus gros montant au plus petit. Renvoie <b>nom</b> et <b>total</b>.`,
  indice:`GROUP BY s.nom avec SUM(t.montant)`,
  ref:`SELECT s.nom, SUM(t.montant) FROM suspects s JOIN transactions t ON t.suspect_id = s.id GROUP BY s.nom ORDER BY SUM(t.montant) DESC`, ordered:true },

{ tag:'Final', titre:`Le commanditaire`,
  enonce:`Dernière étape. Les suspects marseillais ayant reçu <b>au moins 50 000 €</b> au total. Renvoie <b>nom</b> et <b>total</b>, du plus gros au plus petit.`,
  indice:`WHERE ville='Marseille', GROUP BY, puis HAVING SUM(...) >= 50000`,
  ref:`SELECT s.nom, SUM(t.montant) FROM suspects s JOIN transactions t ON t.suspect_id = s.id WHERE s.ville='Marseille' GROUP BY s.nom HAVING SUM(t.montant) >= 50000 ORDER BY SUM(t.montant) DESC`, ordered:true }

];

