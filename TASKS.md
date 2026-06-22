# NeoTravel — Tableau des Tâches

> **Équipe :** Gendell · Inde · Yahia | **Dépôt :** github.com/boolshyt/neotravel

---

## Échéances

| Date | Livrable | Qui |
|---|---|---|
| **24 juin à 23h59** | L1 — Dossier de cadrage | Tous les 3 |
| **29 juin à 23h59** | L2 — Prototype + L3 — Documentation de passation | Gendell + Inde |
| **30 juin à 23h59** | Diapositives de présentation | Yahia + Inde |
| **1er juillet** | Présentation live + démo | Tous les 3 |

---

## PHASE 0 — Dossier de Cadrage L1 _(rendu le 24 juin à 23h59)_

> Aucun outil ni configuration nécessaire — c'est une tâche de rédaction. Le brouillon est déjà dans `L1_DOSSIER_DE_CADRAGE.md`.
> Chaque personne rédige sa section et fait un push. Gendell soumet le PDF final.

| #   | Qui         | Tâche                          | Détail                                                                                                                                                              |
| --- | ----------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Gendell** | Lire le brouillon complet      | Ouvrir `L1_DOSSIER_DE_CADRAGE.md` et lire les 9 sections                                                                                                            |
| 2   | **Gendell** | Pousser sur GitHub             | `git add . && git commit -m "docs: brouillon L1" && git push` pour que l'équipe puisse y accéder                                                                    |
| 3   | **Inde**    | Récupérer le dépôt             | `git pull` pour obtenir la dernière version                                                                                                                          |
| 4   | **Inde**    | Rédiger la Section 2.1         | Ajouter 2–3 paragraphes en français dans la Section 2.1 : ce que fait NeoTravel aujourd'hui, pourquoi le processus manuel est un problème, ce que l'automatisation change |
| 5   | **Inde**    | Pousser ses modifications      | `git add L1_DOSSIER_DE_CADRAGE.md && git commit -m "docs: ajout analyse métier" && git push`                                                                         |
| 6   | **Yahia**   | Récupérer le dépôt             | `git pull` pour obtenir la dernière version                                                                                                                          |
| 7   | **Yahia**   | Rédiger la section concurrents | Dans la Section 9, ajouter 2–3 exemples de concurrents (nom + une ligne chacun — ex. GetTransfer, Mozio, Autocars.com)                                              |
| 8   | **Yahia**   | Pousser ses modifications      | `git add L1_DOSSIER_DE_CADRAGE.md && git commit -m "docs: ajout veille concurrentielle" && git push`                                                                 |
| 9   | **Gendell** | Relecture finale               | Récupérer la dernière version, lire le document complet avec tous les ajouts, corriger ce qui ne va pas                                                              |
| 10  | **Gendell** | Soumettre                      | Exporter en PDF et soumettre sur la plateforme Epitech avant le **24 juin à 23h59**                                                                                  |

---

## PHASE 1 — Configuration Dev _(24–25 juin, après soumission du L1)_

> Configuration unique pour que tout le monde puisse lancer le projet en local. Tout est gratuit — pas de carte bancaire nécessaire.

| Compte / Outil | Qui | Comment |
|---|---|---|
| **Clé API Gemini** | Gendell | Aller sur [aistudio.google.com](https://aistudio.google.com) → se connecter → Obtenir une clé API → la sauvegarder |
| **Node.js** | Gendell + Inde | Télécharger la version LTS sur [nodejs.org](https://nodejs.org) → installer → vérifier : `node --version` |
| **n8n** | Gendell | Dans le terminal : `npm install n8n -g` puis `n8n start` → ouvrir [localhost:5678](http://localhost:5678) |
| **Compte Airtable** | Gendell | S'inscrire sur [airtable.com](https://airtable.com) → créer une base appelée **"NeoTravel CRM"** |
| **Clé API Airtable** | Gendell | Icône profil → Compte → API → générer un token d'accès personnel → le sauvegarder |
| **Collaborateurs GitHub** | Gendell | Paramètres → Collaborateurs → ajouter les noms GitHub d'Inde et Yahia |
| **Vercel** | Inde | S'inscrire sur [vercel.com](https://vercel.com) avec le compte GitHub |
| **Resend** | Inde | S'inscrire sur [resend.com](https://resend.com) → Clés API → créer une clé → la sauvegarder |
| **Cloner le dépôt** | Inde + Yahia | `git clone https://github.com/boolshyt/neotravel.git` |

---

## PHASE 2 — Base de données + Frontend _(25–26 juin)_

> Gendell construit la base Airtable. Inde initialise le projet Next.js. Ils travaillent en parallèle.

### Gendell — Base de données Airtable

| # | Tâche | Détail |
|---|---|---|
| 1 | Créer la table `Demandes` | Champs : Nom, Société, Email, Téléphone, Départ, Destination, Date, Passagers, TypeTrajet, Urgence, Commentaire, Statut, ScoreComplétude, CréeLe |
| 2 | Créer la table `Matrices` | Champs : CoeffSaisonnalité, CoeffUrgence, CoeffCapacité, Marge — modifiables par le client sans toucher au code |
| 3 | Créer la table `Devis` | Champs : IDLead, PrixHT, TVA, PrixTTC, Statut, URLPdf, EnvoyéLe, NbRelances, ProchaineRelanceLe |
| 4 | Créer la table `Clients` | Champs : Nom, Société, Email, Téléphone, Historique |
| 5 | Configurer l'Interface Airtable | Cliquer sur l'onglet "Interfaces" → créer un tableau de bord avec les vues : leads par statut / nouveaux cette semaine / en attente de relance |

### Inde — Projet Next.js

| # | Tâche | Détail |
|---|---|---|
| 1 | Initialiser le projet | Dans le dossier `neotravel` : `npx create-next-app@latest . --typescript --tailwind --app` |
| 2 | Créer les dossiers | Créer `components/` et `lib/` à la racine |
| 3 | Créer `.env.local` | À la racine (ne jamais committer ce fichier) : ajouter `RESEND_API_KEY=` et `N8N_WEBHOOK_URL=` (obtenir l'URL de Gendell en Phase 3) |
| 4 | Pousser sur GitHub | `git add . && git commit -m "feat: init next.js" && git push` |
| 5 | Connecter à Vercel | vercel.com → Nouveau Projet → Importer depuis GitHub → sélectionner `boolshyt/neotravel` → Déployer |

---

## PHASE 3 — Automatisation + Formulaire Conversationnel _(26–27 juin)_

> Gendell construit les workflows n8n. Inde construit le formulaire multi-étapes. Ils travaillent en parallèle.

### Gendell — Workflows n8n

**Workflow 1 — Qualification des Leads**

| # | Tâche | Détail |
|---|---|---|
| 1 | Créer le workflow | n8n → Nouveau Workflow → le nommer "Qualification des Leads" |
| 2 | Ajouter un nœud Webhook | Point d'entrée — copier l'URL du webhook et la partager avec Inde |
| 3 | Ajouter un nœud Airtable | Sauvegarder le lead immédiatement → base "NeoTravel CRM" → table "Demandes" → Statut : "Nouveau Lead" |
| 4 | Ajouter un nœud Gemini | Google Gemini Chat Model → connecter la clé API → modèle `gemini-2.0-flash` → vérifier le score de complétude + nombre de passagers |
| 5 | Rédiger le prompt système | Rôle, règles, ton (voir `project/PROJECT_RULES.md`) — l'IA évalue uniquement la complétude, ne calcule jamais les prix |
| 6 | Ajouter un nœud If (passagers) | Si passagers > 85 → mettre à jour Statut : "Cas Complexe" → envoyer email d'accusé → arrêter |
| 7 | Ajouter un nœud If (complétude) | Si score < 70% → mettre à jour Statut : "Incomplet" → envoyer email de clarification → arrêter |
| 8 | Ajouter un nœud Code | Implémenter `calculer_devis()` (formule complète dans `project/PRICING_ENGINE.md`) — prend distance_km depuis les données du formulaire |
| 9 | Ajouter la génération PDF | Générer le devis PDF à partir de la sortie de calculer_devis() |
| 10 | Ajouter un nœud Resend | Envoyer l'email + PDF au client |
| 11 | Ajouter un nœud de mise à jour Airtable | Statut : "Devis Envoyé" → définir ProchaineRelanceLe (J+2 si urgent, J+3 si standard) |
| 12 | Tester | Soumettre de fausses données → confirmer le lead dans Airtable + email reçu avec PDF |

**Workflow 2 — Planificateur de Relances**

| # | Tâche | Détail |
|---|---|---|
| 1 | Créer le workflow | Nouveau Workflow → le nommer "Planificateur de Relances" |
| 2 | Ajouter un Déclencheur Planifié | Toutes les 2 minutes (démo) — passer en quotidien pour la production |
| 3 | Ajouter un nœud Airtable | Requête : Statut = "Devis Envoyé" OU "Relance 1" ET ProchaineRelanceLe ≤ aujourd'hui |
| 4 | Ajouter un nœud If | relance_count < 2 → vrai : envoyer email de relance / faux : mettre à jour Statut en "Clôturé" |
| 5 | Ajouter un nœud Resend | Envoyer l'email de relance (branche vraie uniquement) |
| 6 | Ajouter un nœud de mise à jour Airtable | relance_count +1 → mettre à jour le Statut ("Relance 1" ou "Relance 2") → définir la nouvelle ProchaineRelanceLe |

### Inde — Formulaire Conversationnel

| # | Tâche | Détail |
|---|---|---|
| 1 | Construire le formulaire multi-étapes | Une question par écran, barre de progression, copie en français — étapes : type de client → nom → email → téléphone → départ → destination → date → passagers → type de trajet → urgence → **distance approximative (km)** → commentaire → confirmation |
| 2 | Connecter à n8n | À la soumission : envoyer les données du formulaire en JSON via POST à `N8N_WEBHOOK_URL` dans `.env.local` (obtenir l'URL de Gendell) |
| 3 | Tester | Soumettre le formulaire → demander à Gendell de confirmer que le lead est apparu dans Airtable |
| 4 | Pousser | `git add . && git commit -m "feat: ajout formulaire de capture" && git push` |

---

## PHASE 4 — Email + PDF _(27–28 juin)_

> Flux complet : formulaire → IA → devis → PDF → email. Inde rédige les templates, Gendell les intègre.

| Qui | Tâche | Détail |
|---|---|---|
| **Inde** | Rédiger le template email | HTML, français, professionnel : devis HT/TVA/TTC, détails du trajet, CTA pour confirmer ou appeler, coordonnées NeoTravel |
| **Inde** | Rédiger le template PDF | En-tête NeoTravel, coordonnées client, détails du trajet, décomposition complète du prix, date de validité, zone de signature |
| **Inde** | Partager la clé Resend API | L'envoyer à Gendell — il en a besoin pour le nœud email n8n |
| **Gendell** | Connecter l'email dans n8n | Configurer le nœud Resend avec la clé d'Inde → confirmer que les emails s'envoient correctement |
| **Les deux** | Test bout en bout | Soumettre le formulaire → vérifier la réception de l'email avec PDF joint → contrôler que le contenu est correct |

---

## PHASE 5 — Tests + Préparation Démo _(28–29 juin)_

> Les 5 scénarios de démo doivent tourner proprement avant le 29 juin. L2 + L3 soumis le 29 juin à 23h59.

### Scénarios de Démo — passer les 5

| # | Scénario | Ce qu'il faut vérifier |
|---|---|---|
| 1 | **Parcours nominal** — données complètes soumises | Lead dans Airtable, devis généré, email + PDF reçus |
| 2 | **Données incomplètes** — un champ obligatoire manquant | L'IA demande l'info manquante, complété à la relance |
| 3 | **>85 passagers** — saisir 100 passagers | Bascule en "Cas Complexe", aucun devis auto, alerte humaine envoyée |
| 4 | **Relance** — soumettre un lead, attendre 2 minutes | L'email de relance arrive automatiquement |
| 5 | **Tableau de bord** — ouvrir Airtable Interface | Le pipeline affiche les leads par statut, les nouveaux de la semaine, les relances en attente |

### Qui fait quoi

| Qui         | Tâche                        | Détail                                                                                          |
| ----------- | ---------------------------- | ----------------------------------------------------------------------------------------------- |
| **Gendell** | Passer les 5 scénarios       | Corriger tout ce qui casse                                                                      |
| **Gendell** | Configurer ngrok              | `npm install -g ngrok` → `ngrok http 5678` → partager l'URL publique avec Inde pour la démo live |
| **Gendell** | Confirmer le tableau de bord  | L'Interface Airtable affiche le pipeline correctement                                            |
| **Inde**    | Rédiger L3 — doc technique    | Comment installer et lancer le système de zéro : clone, config env, démarrage n8n et next.js    |
| **Inde**    | Rédiger L3 — doc utilisation  | Comment un commercial utilise le tableau de bord Airtable au quotidien (non-technique)           |
| **Inde**    | Soumettre L2 + L3             | Avant le **29 juin à 23h59**                                                                     |
| **Yahia**   | Tester en tant que vrai client | Soumettre 3 demandes (standard, urgente, >85 passagers) → rapporter ce qui a fonctionné et ce qui n'a pas fonctionné |

---

## PHASE 6 — Diapositives + Préparation Oral _(29–30 juin, rendu le 30 juin à 23h59)_

### Structure des Diapositives (Yahia en charge)

| Diapositive | Contenu |
|---|---|
| 1 | Titre — NeoTravel · noms de l'équipe · MBA1 Epitech · 1er juillet 2026 |
| 2–3 | Le problème — 60 leads/jour, processus manuel, chiffre d'affaires manqué |
| 4–5 | La solution — schéma d'architecture + les 10 fonctions |
| 6 | Flux de démo — ce qui se passe quand un client soumet le formulaire |
| 7 | Impact métier — leads traités, temps économisé, taux de relance |
| 8 | Choix techniques et justifications |
| 9 | Ce qu'on construirait ensuite (roadmap) |
| 10 | Questions / Réponses |

### Questions du Jury — préparer les réponses

| Question | Qui répond |
|---|---|
| Quel problème métier ce projet résout-il ? | Yahia |
| Pourquoi n8n plutôt que d'autres outils ? | Gendell |
| Comment le système préserve-t-il la relation humaine ? | Inde |
| Qu'est-ce que NeoTravel devrait faire pour le mettre en production ? | Tous les 3 |
| Décrivez ce qui se passe quand un lead soumet le formulaire | Gendell |

### Préparation à l'oral

| Tâche | Qui | Quand |
|---|---|---|
| Attribuer les parties de discours | Tous les 3 | 29 juin |
| Première répétition (démo live incluse) | Tous les 3 | Matin du 30 juin |
| Deuxième répétition | Tous les 3 | Soir du 30 juin |

---

## Git — Rester Synchronisé

```bash
# Avant de commencer à travailler
git pull

# Après avoir terminé
git add .
git commit -m "description courte de ce que vous avez fait"
git push
```
