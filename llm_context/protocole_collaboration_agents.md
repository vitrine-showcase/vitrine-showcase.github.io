# Protocole de Collaboration "Vibe Coding" (Agents & Humains)

Ce document définit les règles de synchronisation stricte pour le développement en parallèle de la maquette par **Etienne**, **Laurence** et leurs agents respectifs.

## 1. Cycle de Synchronisation Pré-Modification (Pull & Review)
Avant toute modification de code ou de documentation, l'agent doit :
1.  **Récupérer les changements :** Faire un `git fetch` et `git pull origin main`.
2.  **Analyser le travail de Laurence :** Examiner les derniers commits (`git log`) et les nouveaux composants créés.
3.  **Vérifier les PRs :** Lister les Pull Requests GitHub (`gh pr list`). Si une PR est assignée, l'analyser et la fusionner si elle ne crée pas de conflits.

## 2. Développement et Standardisation
1.  **Respecter les styles :** Utiliser exclusivement les variables CSS définies dans `best_practices_ui_ux.md` et le système 8pt de Laurence.
2.  **Modularité :** Ne pas modifier les fichiers en cours d'édition par l'autre binôme (si possible) et privilégier la création de nouveaux composants ou fichiers de contexte.

## 3. Cycle de Publication Post-Modification (Commit & PR)
Après chaque modification (atomique si possible) :
1.  **Commit clair :** Faire un commit avec un message descriptif.
2.  **Pull Request (PR) :** Créer une branche pour la tâche et ouvrir une PR sur GitHub.
3.  **Assignation :** Assigner systématiquement **Laurence** (ou Etienne selon le cas) à la PR.
4.  **Explication contextuelle :** Fournir une explication détaillée des changements, des fichiers touchés et de l'impact visuel pour que l'autre agent puisse s'ajuster immédiatement.

## 4. Communication Inter-Agents
Les agents doivent être proactifs dans la détection des changements de structure (ex: renommage de classes CSS, modification du hook de données `useVitrineSnapshot`) et mettre à jour leurs propres tâches en conséquence.
