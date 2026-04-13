# Architecture Narrative : Page d'Accueil (Public Mainstream)

Ce document définit le "flow" de la page d'accueil de la Vitrine Démocratique. L'objectif est de transformer des données complexes en un récit intuitif et captivant pour un utilisateur non-expert.

---

## 1. La Séquence Narrative (Le "Flow")

L'utilisateur doit parcourir la page dans cet ordre précis pour maximiser la rétention et la compréhension :

### A. Le Crochet Emotionnel (Hero Section)
*   **Rôle :** "Qui domine l'attention en ce moment ?"
*   **Données :** `headline_of_headlines` (Titre + Enjeu principal).
*   **Visuel :** Immersif, cinématique. Un titre fort qui résume la "vibe" médiatique actuelle.
*   **Objectif :** Arrêter le défilement et susciter l'intérêt immédiat.

### B. Le Paysage Politique (Momentum Section)
*   **Rôle :** "Comment se portent les partis ?"
*   **Données :** `federal_parties_score_day` / `provincial_parties_score_day`.
*   **Visuel :** Logos avec halos lumineux (Glow). Vert pour le positif, rouge pour le négatif.
*   **Objectif :** Donner une lecture rapide de la "santé médiatique" des acteurs politiques.

### C. La Carte des Préoccupations (Enjeux du Moment)
*   **Rôle :** "De quoi parle-t-on vraiment ?"
*   **Données :** `issues_score_day`.
*   **Visuel :** Grille Bento. Comparaison visuelle simple (ex: L'économie vs L'environnement).
*   **Objectif :** Montrer la hiérarchie des sujets dans l'espace public.

### D. L'Interprétation Editoriale (Le Reflet)
*   **Rôle :** "Qu'est-ce que ça veut dire ?"
*   **Données :** `reflet_day`.
*   **Visuel :** Texte aéré, typographie élégante (Serif). Résumés en langage naturel.
*   **Objectif :** Apporter de la nuance et expliquer les chiffres par du récit.

### E. La Preuve de Confiance (Méthodologie/Bas de page)
*   **Rôle :** "D'où viennent ces données ?"
*   **Données :** Liens vers les sources (`salient_urls`) et explication du CAPP.
*   **Visuel :** Sobre, technique, académique.
*   **Objectif :** Établir la crédibilité scientifique du projet.

---

## 2. Principes de Rédaction pour l'IA (Natural Language Insights)

Pour chaque section, l'agent doit privilégier des titres narratifs plutôt que techniques :
*   ❌ "Tableau de bord de la saillance"
*   ✅ "Le sujet qui fait vibrer les médias aujourd'hui"
*   ❌ "Score de ton pondéré : -0.8"
*   ✅ "Un climat médiatique tendu pour l'opposition"

---

## 3. Interaction : Le Scrollytelling
*   Les sections ne doivent pas apparaître toutes en même temps.
*   Utiliser des transitions de type "Fade-in" et "Scale-up" légères lors du scroll pour donner l'impression que la donnée "prend vie" au fur et à mesure de la lecture.
