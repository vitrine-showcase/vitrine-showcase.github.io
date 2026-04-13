# État Actuel : Vitrine Démocratique (VD) - Février 2026

Ce document résume l'état du projet **Vitrine Démocratique** basé sur la version BÊTA 1.9.1 (6 février 2026). Il sert de contexte pour les LLM et agents travaillant sur le projet.

## 1. Vue d'ensemble
La **Vitrine Démocratique** est une plateforme numérique et un outil de recherche (CAPP 2026) dédié au suivi et à l'analyse du paysage politique et médiatique. Elle se concentre sur la **saillance** (visibilité) et le **ton** (sentiment) des partis politiques et des enjeux sociaux dans les médias.

*   **Version :** BÊTA 1.9.1
*   **Objectif :** Fournir un "reflet" de la couverture médiatique basé sur les données pour comprendre comment les entités politiques et les enjeux sont perçus.

## 2. Fonctionnalités et Sections Principales

### A. Navigation et Filtrage
*   **Contrôles Temporels :** Sélection de dates et d'intervalles (jour, semaine, mois).
*   **Portée Régionale :** Filtrage par région (ex: Montréal).
*   **Authentification :** Système de connexion sécurisé pour les utilisateurs et experts.

### B. Modules d'Analyse
*   **Une de la une :** Focus sur les titres de presse principaux.
*   **Pointage des enjeux :** Suivi de la proéminence de sujets sociaux ou politiques.
*   **Pointage des partis :** Mesure de la présence médiatique des partis.
*   **Le Reflet par Moment :** Résumés et instantanés de l'état médiatique actuel.

### C. Visualisation des Données (Méthodologie)
*   **Saillance (Visibilité) :** Représentée par la hauteur de lignes verticales.
*   **Le Seuil (Threshold) :** Ligne bleue horizontale (généralement à 0.02) distinguant les partis "suffisamment visibles".
*   **Ton (Sentiment) :** Halos colorés autour des logos :
    *   **Vert :** Ton médiatique positif.
    *   **Rouge :** Ton médiatique négatif.
    *   **Intensité :** Reflète la force du sentiment.
*   **Info-bulles (Tooltips) :** Fournissent les valeurs brutes et les détails du sentiment au survol.

## 3. Outils Experts et Techniques
Un **"Mode Expert"** débloque :
*   **Outils de Debug :** Pour le dépannage et la vérification des données.
*   **Gestion de Fichiers :** Section "Fichiers Tools" pour voir les JSON chargés.
*   **Fonctionnalités Expérimentales :** Modules en développement.
*   **Personnalisation :** Fuseaux horaires et musique d'ambiance.

## 4. Terminologie Clé
*   **Saillance :** Visibilité/proéminence médiatique.
*   **Enjeux :** Sujets politiques ou sociaux suivis.
*   **Ton :** Sentiment qualitatif (positif/négatif) des mentions.
*   **CAPP :** Centre d'analyse des politiques publiques.

## 5. Note pour le Développement
L'interface est dense en données, utilisant probablement des composants de type React (onglets, modales, graphiques interactifs) avec un backend basé sur l'ingestion de fichiers JSON. Le ton est professionnel, académique et transparent sur la méthodologie.
