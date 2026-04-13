# Vision Design : Nouvelle Mouture Vitrine Démocratique 2026

Ce document définit les standards esthétiques et fonctionnels pour la refonte drastique de la Vitrine Démocratique (VD). L'objectif est de passer d'un tableau de bord classique à une **expérience de données immersive, élégante et hautement informative**.

---

## 1. Fondations Théoriques : L'Approche Edward Tufte (Modernisée)

Pour 2026, nous appliquons les principes de Tufte en les adaptant aux écrans haute densité et aux interactions fluides.

### A. Maximisation du Ratio Données-Encre
*   **Principe :** Chaque pixel doit servir à transmettre une information.
*   **Action :** Supprimer les bordures lourdes, les ombres portées excessives et les arrière-plans de widgets. Utiliser l'espace blanc et une hiérarchie typographique subtile pour séparer les sections.
*   **Style :** Lignes de grille à très bas contraste (ex: `slate-800` sur fond noir) ou suppression totale si l'alignement est clair.

### B. Élimination du "Chartjunk"
*   **Principe :** Pas de décoration inutile.
*   **Action :** Étiquetage direct des données (Direct Labeling) au lieu de légendes séparées. Pas d'effets 3D sur les graphiques de données (pour éviter le "Facteur de Mensonge").

### C. Multiples Petits (Small Multiples)
*   **Principe :** Comparer par la répétition de graphiques simples à la même échelle.
*   **Action :** Au lieu d'un graphique multi-lignes complexe ("spaghetti chart"), utiliser une grille de mini-graphiques (sparklines) pour comparer les partis ou les enjeux d'un coup d'œil.

### D. Lecture Macro/Micro
*   **Principe :** "Pour clarifier, ajoutez du détail."
*   **Action :** Implémenter le **Zoom Sémantique**. Une vue d'ensemble (Macro) qui révèle des détails granulaires (Micro) lors de l'interaction ou du défilement sans changer de contexte.

---

## 2. Inspirations de Designers de Classe Mondiale

Nous nous inspirons des leaders actuels pour élever la qualité visuelle :

1.  **Giorgia Lupi (Data Humanism) :** Pour l'aspect narratif et émotionnel des données. Utilisation de formes organiques et de légendes riches qui racontent une histoire au-delà du chiffre.
2.  **Tobias van Schneider :** Pour le "Story-driven design" et l'esthétique premium minimale. Focus sur une typographie impeccable et des transitions fluides.
3.  **Federica Fragapane :** Pour la complexité esthétique. Ses visualisations ressemblent à des œuvres d'art tout en restant rigoureuses.
4.  **Nicholas Felton (Feltron Reports) :** Pour la densité d'information structurée et l'élégance des rapports annuels.

---

## 3. Tendances Web & DataViz 2025-2026

### A. Bento Grids (Grilles Modulaires)
Organisation de l'interface en tuiles rectangulaires aux coins arrondis (style Apple/Linear). Chaque module est indépendant, réactif et hiérarchisé.

### B. Scrollytelling
Utilisation du défilement pour déclencher des animations qui révèlent les points de données séquentiellement, évitant la surcharge cognitive.

### C. Dark Mode & Neon Accents
Esthétique dominante pour les outils d'analyse de données complexes. Fond sombre profond (`#0a0a0a`), typographie `Inter` ou `Roboto Mono`, et accents de couleurs vives (vert émeraude, bleu électrique, rouge vif) uniquement pour encoder le "Ton" ou la "Saillance".

### D. IA Visualisée
Au lieu de simples graphiques, intégrer des **Résumés Génératifs** (ex: "Le sentiment a chuté de 3% suite à l'événement X") directement dans l'interface, à côté des visualisations.

---

## 4. Exemples de Styles Visuels Cibles

*   **Typographie :** Mélange d'une Serif élégante pour les titres narratifs (ex: `Playfair Display`) et d'une Sans-Serif technique/monospacée pour les données (ex: `JetBrains Mono`).
*   **Micro-interactions :** Halos lumineux (Glow effects) autour des logos qui pulsent légèrement selon l'intensité du sentiment. Transitions de type "Cross-fade" et "Layout Morphing" lors du changement de filtres temporels.
*   **Cartographie :** Cartes 3D discrètes avec extrusion (hauteur) pour représenter la saillance par région, plutôt que de simples aplats de couleurs (Choroplèthes).

---

## 5. Accessibilité Grand Public (Mainstream) : "L'Expertise Narrative"

Pour que ce projet ne soit pas réservé aux analystes, la nouvelle mouture doit transformer la complexité en **récits intuitifs**.

### A. Le "Default to Simple"
*   **Approche :** La vue par défaut doit être épurée, centrée sur une ou deux questions clés (ex: "Qui domine les ondes aujourd'hui ?").
*   **Progressive Disclosure :** Ne révéler les outils experts (filtres granulaires, modes de debug) que sur demande ou via un onglet dédié.

### B. Onboarding Contextuel (Tour Guidé)
*   **Action :** Intégrer un système d'infobulles narratives qui expliquent non seulement "ce que c'est" (ex: "Saillance") mais surtout "pourquoi c'est important" (ex: "La saillance montre à quel point un parti occupe l'espace médiatique par rapport aux autres").

### C. Résumés Narratifs (Natural Language Insights)
*   **Action :** Utiliser l'IA pour traduire les graphiques en phrases simples. Au-dessus de chaque module complexe, une phrase de synthèse doit résumer la tendance (ex: "Cette semaine, l'environnement a surpassé l'économie dans les médias de Montréal").

### D. Design Inclusif
*   **Couleurs :** S'assurer que les codes de couleur (Ton) sont doublés de symboles ou de variations de luminosité pour les utilisateurs daltoniens.
*   **Typographie :** Maintenir des contrastes élevés et des tailles de police lisibles sur mobile, car le public mainstream consulte majoritairement via smartphone.

---

## 6. Lexique Visuel de la Maquette
*   **Saillance :** Hauteur, épaisseur de ligne, intensité lumineuse.
*   **Ton :** Spectre de couleurs (Vert -> Gris -> Rouge) avec gradients de saturation.
*   **Temps :** Axe horizontal fluide, interaction par "scrubbing" (balayage).
