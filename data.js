window.SQD_DATA = {
  TABLES: [
    { name:'suspects',     cols:['id','nom','ville','taille_cm','age','profession'] },
    { name:'alibis',       cols:['id','suspect_id','lieu','heure'] },
    { name:'transactions', cols:['id','suspect_id','montant','date'] },
    { name:'vehicules',    cols:['id','suspect_id','marque','couleur','annee'] }
  ],
  SEED: [
    `CREATE TABLE suspects(id INTEGER PRIMARY KEY, nom TEXT, ville TEXT, taille_cm INTEGER, age INTEGER, profession TEXT);`,
    `CREATE TABLE alibis(id INTEGER PRIMARY KEY, suspect_id INTEGER, lieu TEXT, heure TEXT);`,
    `CREATE TABLE transactions(id INTEGER PRIMARY KEY, suspect_id INTEGER, montant INTEGER, date TEXT);`,
    `CREATE TABLE vehicules(id INTEGER PRIMARY KEY, suspect_id INTEGER, marque TEXT, couleur TEXT, annee INTEGER);`,

    `INSERT INTO suspects VALUES
      (1,'Léa Moreau','Marseille',172,34,'Libraire'),
      (2,'Karim Benali','Lyon',181,41,'Ingénieur'),
      (3,'Sofia Ruiz','Marseille',165,29,'Serveuse'),
      (4,'Tom Lefèvre','Paris',188,37,'Photographe'),
      (5,'Nadia Cherif','Lyon',176,45,'Comptable'),
      (6,'Hugo Petit','Marseille',179,26,'Étudiant'),
      (7,'Inès Fabre','Paris',168,31,'Journaliste'),
      (8,'Marc Dubois','Lyon',191,52,'Chef cuisinier'),
      (9,'Amine Zerrouki','Marseille',184,33,'Mécanicien'),
      (10,'Clara Nguyen','Paris',160,24,'Étudiante'),
      (11,'Yves Lambert','Lille',177,58,'Retraité'),
      (12,'Fatou Diallo','Lille',169,38,'Infirmière');`,

    `INSERT INTO alibis VALUES
      (1,1,'Café du Port','22:15'),(2,2,'Domicile','21:40'),
      (3,3,'Théâtre','23:05'),(4,4,'Café du Port','22:15'),
      (5,5,'Domicile','20:30'),(6,6,'Bibliothèque','21:00'),
      (7,7,'Gare','22:50'),(8,8,'Café du Port','23:20'),
      (9,9,'Théâtre','21:35'),(10,10,'Cinéma','22:00'),
      (11,11,'Domicile','19:45'),(12,12,'Hôpital','23:40');`,

    `INSERT INTO transactions VALUES
      (1,1,12000,'2026-09-02'),(2,2,85000,'2026-09-03'),
      (3,2,3000,'2026-09-07'),(4,4,52000,'2026-09-05'),
      (5,5,9000,'2026-09-08'),(6,9,64000,'2026-09-09'),
      (7,3,1500,'2026-09-10'),(8,6,2100,'2026-09-11'),
      (9,7,75000,'2026-09-12'),(10,8,400,'2026-09-14'),
      (11,1,51000,'2026-09-15'),(12,10,48000,'2026-09-16'),
      (13,11,120000,'2026-09-17'),(14,12,33000,'2026-09-18');`,

    `INSERT INTO vehicules VALUES
      (1,1,'Renault Clio','rouge',2015),(2,2,'Peugeot 308','noire',2019),
      (3,3,'Fiat 500','blanche',2012),(4,4,'Volkswagen Golf','grise',2021),
      (5,5,'Renault Clio','bleue',2018),(6,6,'Citroën C3','rouge',2016),
      (7,7,'Audi A3','noire',2020),(8,8,'Peugeot 308','grise',2014),
      (9,9,'Renault Mégane','noire',2017),(10,10,'Fiat 500','jaune',2013),
      (11,12,'Peugeot 208','blanche',2022);`
  ]
};

