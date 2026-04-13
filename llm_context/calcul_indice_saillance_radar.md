# Calcul de l'Indice de Saillance RADAR+ — Hot 20 & Salient Index

Ce document explique en détail comment l'indice de saillance est calculé dans le pipeline RADAR+, en particulier dans les raffineurs `radar-salient-index` et `radar-hot-20`.

**Sources** : `refiners/radar-salient-index/runtime.R` et `refiners/radar-hot-20/runtime.R` dans le repo `aws-refiners`.

---

## 1. La Table de Départ : `salient_headlines_objects`

Tout part de cette table centrale, alimentée 6× par jour par `radar-salient-objects`. Chaque ligne représente **un headline d'un média** avec les champs clés :

| Colonne | Description |
|---|---|
| `media_id` | Identifiant du média (CBC, TVA, CNN, etc.) |
| `country_id` | Pays : CAN, QC, USA |
| `headline_minutes` | **Durée en minutes** que ce headline a passé en Une du média |
| `extracted_objects` | Entités extraites par LLM (CSV dans une colonne) ex: `"trudeau, npd, ottawa"` |
| `headline_stop_utc` | Horodatage de fin de headline (UTC) |
| `title`, `body`, `url` | Contenu textuel |

---

## 2. Pré-traitement des Objets

Les `extracted_objects` sont une chaîne CSV dans une seule colonne. Le code la découpe en une ligne par objet, puis normalise :

```r
tidyr::separate_rows(extracted_objects, sep = ",")
dplyr::mutate(
  extracted_objects = tolower(trimws(extracted_objects)),        # minuscules
  extracted_objects = str_remove_all(extracted_objects, "[[:punct:]]")  # sans ponctuation
)
```

Résultat : chaque ligne représente **une occurrence d'un objet dans un headline d'un média**.

---

## 3. La Pondération par Média

### 3.1 Le problème

Tous les médias n'ont pas le même rythme de rotation des Unes. TVA change ses titres rapidement (durée moyenne courte), GN les garde longtemps. Sans correction, un headline qui reste longtemps en Une d'un média lent serait artificiellement surpondéré.

### 3.2 La table de référence `media_avg_time`

Durée moyenne (en minutes) qu'un headline passe en Une, calculée sur **3 mois** de données historiques :

| Média | `mean_time` (min) |
|---|---|
| TVA | 125.0 |
| LAP | 120.9 |
| JDM | 143.1 |
| FXN | 146.1 |
| RCI | 160.0 |
| CBC | 159.5 |
| TTS | 221.3 |
| CTV | 227.9 |
| LED | 241.8 |
| MG | 241.4 |
| NP | 249.0 |
| CNN | 296.2 |
| GAM | 325.9 |
| GN | 375.4 |
| VS | 505.3 |

### 3.3 Pondération intra-média (`pond_time`)

Ajuste le poids d'un headline **par rapport à la normale de son propre média** :

```
pond_time = headline_minutes / mean_time_du_media
```

- Si un headline reste 2× plus longtemps que la moyenne de TVA → `pond_time = 2.0`
- Si un headline dure exactement la moyenne de GN → `pond_time = 1.0`

### 3.4 Pondération inter-médias (`pond_time_norm`)

Normalise **à travers tous les médias** pour qu'une minute compte pareil peu importe le média :

```
mean_time_global = moyenne(mean_time de tous les 15 médias)  ≈ 239.5 min

pond_time_norm = headline_minutes / mean_time_global
```

C'est cette pondération inter-médias qui est utilisée dans le calcul final de l'indice.

---

## 4. Agrégation par Bloc de 4 Heures

Les données sont groupées par `(country_id, extracted_objects, date_utc, time_interval_utc)` — soit par objet par bloc de 4 heures. Six blocs par jour : `00-04`, `04-08`, `08-12`, `12-16`, `16-20`, `20-24` (UTC).

Pour chaque groupe :

```r
n                  = nombre d'occurrences de l'objet (toutes sources confondues)
total_minutes_objet = somme des headline_minutes
total_pond_time    = somme des pond_time  (pondération intra-média)
total_pond_time_norm = somme des pond_time_norm  (pondération inter-médias)
```

---

## 5. L'Indice de Saillance Absolu

```
absolute_normalized_index = n × total_pond_time_norm
```

**Interprétation** :
- `n` = combien de fois l'objet a été mentionné (fréquence brute)
- `total_pond_time_norm` = combien de "minutes normalisées" au total (intensité pondérée)
- Le produit capture à la fois la **fréquence** et l'**intensité médiatique** de la présence de l'objet

**Exemple** :
- "trudeau" apparaît dans 8 headlines
- Ces headlines totalisent `total_pond_time_norm = 4.5` minutes normalisées
- `absolute_normalized_index = 8 × 4.5 = 36`

Cet indice est publié dans la table `vitrine_datamart.salient_index` par `radar-salient-index`.

---

## 6. Le Hot 20 : De l'Indice Absolu au Classement Hebdomadaire

Le raffineur `radar-hot-20` prend ces données et calcule un classement sur **une semaine complète** (vendredi 16:00 UTC → vendredi suivant 15:59 UTC), pour 3 zones géographiques : **QC**, **CAN**, **USA**.

### 6.1 Agrégation hebdomadaire

Le même calcul que ci-dessus est refait mais sur 7 jours entiers (42 blocs de 4h) :

```
absolute_normalized_index (hebdo) = n_semaine × total_pond_time_norm_semaine
```

### 6.2 Exclusions géographiques

Certains termes trop génériques sont exclus du classement (mais pas du dénominateur avant exclusion) :

- **QC** : `"quebec"`, `"montreal"`, `"canada"`
- **USA** : `"usa"`, `"united states"`, `"fox news"`, `"cnn"`, `"washington dc"`
- **CAN** : `"canada"`, `"ottawa"`

### 6.3 Indice Relatif

L'indice relatif exprime la **part de saillance** d'un objet parmi tous les objets non-exclus de la semaine :

```
relative_normalized_index = (absolute_normalized_index / somme_des_absolus_filtrés) × 100
```

Unité : **pourcentage** (%). Un objet à 15% a capté 15% de toute la saillance médiatique de la semaine dans ce pays.

### 6.4 Classement et Variation

- **Rang** : classement décroissant par `relative_normalized_index`, ignorant les objets exclus
- **Variation** : comparaison du rang par rapport à la semaine précédente dans la table `hot_20_headlines`
  - ▲ N positions (montée)
  - ▼ N positions (chute)
  - ★ Nouveau (entrée inédite dans le top 20)
  - (Retour) (objet absent la semaine précédente qui revient)

### 6.5 Métriques de Persistance

- **Semaines consécutives** : nombre de semaines ininterrompues dans le top 20
- **Total semaines** : nombre cumulatif de semaines ayant figuré dans le top 20
- **Indice cumulatif** : somme de tous les `absolute_normalized_index` historiques de l'objet

---

## 7. Résumé du Pipeline

```
salient_headlines_objects
    │
    ├── [par bloc 4h]
    │   ├── Découpe CSV des extracted_objects
    │   ├── Normalisation (lowercase, sans ponctuation)
    │   ├── Pondération intra-média (pond_time = headline_min / mean_time_media)
    │   ├── Pondération inter-médias (pond_time_norm = headline_min / mean_time_global)
    │   ├── Agrégation : n, total_pond_time_norm
    │   └── absolute_normalized_index = n × total_pond_time_norm
    │
    └── → salient_index (par objet × bloc 4h × country)
            │
            └── [par semaine, dans radar-hot-20]
                ├── Aggrégation sur 7 jours (42 blocs)
                ├── Exclusion termes géographiques génériques
                ├── relative_normalized_index = (absolu / total_filtrés) × 100
                ├── Classement, variation, semaines consécutives
                └── → hot_20_headlines + PNG + HTML + Slack
```

---

## 8. Ce Que l'Indice Capture (et Ce Qu'il Ne Capture Pas)

### Ce qu'il capture
- **Fréquence** : un objet mentionné dans beaucoup de headlines monte
- **Durée** : un headline qui reste longtemps en Une pèse plus
- **Multi-source** : la même présence sur plusieurs médias s'additionne
- **Normalisation inter-médias** : une mention sur TVA (rotation rapide) vaut autant qu'une mention sur GN (rotation lente)

### Ce qu'il ne capture pas
- **Ton** (positif/négatif) : l'indice est neutre, c'est `radar-party-score` qui analyse le sentiment
- **Hiérarchie éditoriale** : une manchette et un article secondaire sont traités pareil si leur durée en Une est identique
- **Pertinence sémantique** : deux headlines très différents peuvent contenir le même objet
