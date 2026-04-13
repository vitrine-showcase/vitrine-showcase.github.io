# Architecture et Structure des Données des Raffineurs (Vitrine Démocratique)

Ce document décrit la structure exacte des données générées par les raffineurs AWS de la CLESSN (dépôt `aws-refiners`, spécifiquement `vitrine-graph-data`). Il sert de guide de référence pour **mocker les données** dans la maquette Front-End (`vitrine-maquette`) de manière parfaitement conforme à ce que produira l'API ou le bucket S3 en production.

Toutes ces données proviennent de tables de type `datamart` et sont exportées sous forme de fichiers JSON (ex: `reflet_day.json`, `issues_score_month.json`).

---

## 1. Headline of Headlines (`headline_of_headlines.json`)

Contient la "Une des Unes" pour chaque intervalle de temps, identifiant l'enjeu principal du moment.

**Champs à mocker :**
*   `country_id` (string) : ex: "CA"
*   `date_utc` (string, format "YYYY-MM-DD")
*   `time_interval_utc` (string) : ex: "AM", "PM" (si applicable) ou l'heure de début.
*   `date_montreal_tz` (string, format "YYYY-MM-DD")
*   `time_interval_montreal_tz` (string)
*   `main_issue` (string) : ex: "economy_and_labour", "health_and_social_services"
*   `main_issue_text_fr` (string) : Le nom affiché en français de l'enjeu.
*   `main_issue_text_en` (string) : Le nom affiché en anglais.
*   `title` (string) : Titre synthétique ou titre de la Une.
*   `text` (string) : Courte description ou contenu.
*   `objects` (array ou string) : Mots-clés ou entités extraites.
*   `salient_urls` (array of strings) : URLs des articles de presse source.

---

## 2. Reflet Quotidien, Hebdomadaire, Mensuel (`reflet_day.json`, `reflet_week.json`, `reflet_month.json`)

Résumés narratifs générés (possiblement par IA) pour chaque enjeu.
*Note importante lors du mock : Le champ `summary` d'origine est un texte avec des tirets (bullet points). Le raffineur le découpe en tableau de chaînes de caractères (Array de strings) pour le JSON final.*

**Champs à mocker (Quotidien - `day`) :**
*   `date_utc` (string, "YYYY-MM-DD")
*   `pass` (string) : Période de la journée, ex: "AM", "PM"
*   `issue` (string) : Clé de l'enjeu, ex: "environment_and_energy"
*   `summary` (Array of strings) : Liste de phrases résumant l'actualité, ex: `["Le gouvernement a annoncé un nouveau plan...", "L'opposition critique..."]`

**Champs à mocker (Hebdo/Mensuel - `week`, `month`) :**
Même chose, mais sans le champ `pass`.
*   `date_utc` (string, "YYYY-MM-DD")
*   `issue` (string)
*   `summary` (Array of strings)

---

## 3. Scores des Partis (`federal_parties_score_day.json`, `provincial_parties_score_day.json`, etc.)

Mesure la "saillance" (visibilité - `weighted_mentions`) et le "ton" (sentiment - `weighted_tone`) des partis.

**Champs à mocker (Quotidien - `day`) :**
*   `party` (string) : Acronyme du parti, ex: "LPC", "CPC", "CAQ", "PLQ".
*   `date_utc` (string, "YYYY-MM-DD")
*   `date_montreal_tz` (string, "YYYY-MM-DD")
*   `pass` (string) : "AM", "PM"
*   `weighted_mentions` (numeric/float) : Visibilité (Saillance). Ex: 0.15, 0.42. Souvent entre 0 et 1.
*   `weighted_tone` (numeric/float) : Sentiment. Valeur négative (rouge/mauvais) ou positive (vert/bon). Ex: -0.8, 1.2.
*   `threshold` (numeric/float) : Le seuil de pertinence (souvent fixe autour de 0.02 ou 0.05). Permet de tracer la "ligne bleue" dans les graphiques.

**Champs à mocker (Hebdo/Mensuel - `week`, `month`) :**
Même chose, mais sans le champ `pass`.

---

## 4. Ombre Saillante des Partis (Salient Shadow)

Ce sont des tables refactorisées (`parties_salient_shadow_day.json`, etc.) qui calculent les variations (trend) par rapport aux périodes précédentes. Elles utilisent `period_end` au lieu de `date_utc`.

**Champs à mocker (Day, Week, Month) :**
*   `party` (string) : Acronyme du parti.
*   `period_end` (string, "YYYY-MM-DD") : Date de fin de la période analysée.
*   `weighted_mentions` (numeric/float) : Saillance moyenne sur la période.
*   `weighted_tone` (numeric/float) : Ton moyen sur la période.
*   `threshold` (numeric/float) : Seuil de pertinence.
*   `variation_pct` (numeric/float) : Variation en pourcentage par rapport à la période précédente. Ex: 12.5 (pour +12.5%), -5.2 (pour -5.2%).

---

## 5. Scores des Enjeux (`issues_score_day.json`, `issues_score_week.json`, `issues_score_month.json`)

Table pivotée horizontalement où chaque colonne représente un grand enjeu politique/social, et la valeur représente son score (saillance).

**Champs à mocker (Quotidien - `day`) :**
*   `date_utc` (string, "YYYY-MM-DD")
*   `date_montreal_tz` (string, "YYYY-MM-DD")
*   `pass` (string) : "AM", "PM"
*   *[Les valeurs numériques/floats pour chaque enjeu (généralement entre 0 et 1)] :*
    *   `economy_and_labour`
    *   `rights_liberties_minorities_discrimination`
    *   `health_and_social_services`
    *   `public_lands_and_agriculture`
    *   `immigration`
    *   `education`
    *   `environment_and_energy`
    *   `law_and_crime`
    *   `international_affairs_and_defense`
    *   `technology`
    *   `governments_and_governance`
    *   `culture_and_nationalism`

**Champs à mocker (Hebdo/Mensuel - `week`, `month`) :**
Identique, sans le champ `pass`.

---

## 💡 Consignes Générales pour les Mocks (Faker)

1.  **Cohérence Temporelle :** Si vous générez des données pour un tableau de bord, assurez-vous que les dates correspondent à une fenêtre coulissante logique (ex: les 30 derniers jours). Les enregistrements `day` doivent s'additionner/moyenner de manière crédible par rapport aux enregistrements `week`.
2.  **Ton et Saillance :**
    *   `weighted_mentions` (Saillance) est toujours positif (c'est une quantité/visibilité).
    *   `weighted_tone` (Ton) oscille entre le négatif et le positif (ex: de -2.0 à +2.0).
3.  **Arrays dans Reflet :** N'oubliez pas que le backend transforme les textes bruts de `summary` en un `Array` de phrases JSON propres. Ne mockez pas une simple `string` mais bien un `[]`.
4.  **Pass (AM/PM) :** Dans la vitrine, une journée est souvent coupée en deux "snapshots" (AM et PM). Assurez-vous d'avoir deux entrées par `date_utc` pour les fichiers se terminant par `_day`.