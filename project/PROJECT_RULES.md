# NeoTravel — Règles & Checklist du Projet

> À consulter avant chaque session de code et chaque décision architecturale.
> Ces règles sont dérivées du brief complet du projet, de la FAQ, du livret technique et du transcript de lancement.

---

## 🔴 Règles Non Négociables (Les enfreindre fait échouer le projet)

### Règle 1 : Le LLM Ne Calcule Jamais les Prix
- `calculer_devis()` est du code déterministe pur
- L'agent appelle uniquement cette fonction comme outil et transmet le résultat
- L'agent N'ESTIME, N'APPROXIME, NI NE CALCULE JAMAIS les prix en langage naturel
- Explicitement noté sous "Fiabilité & Garde-fous" (10 pts)

**Comment vérifier :** Si vous retirez le LLM et appelez `calculer_devis()` directement, le résultat doit être identique. Si le prix change selon la formulation du client, c'est un bug.

### Règle 2 : Choisir UN SEUL Orchestrateur
- Soit n8n AI Agent (cerveau) SOIT Vercel AI SDK (cerveau)
- Pas les deux
- n8n peut toujours être utilisé dans l'Option B pour la planification et les écritures CRM — mais ce n'est pas le cerveau IA dans ce cas
- Les configurations bi-agent créent un état cassé et sont impossibles à déboguer en une semaine

### Règle 3 : La Démo Doit Être Live
- Le jury attend un système réel et fonctionnel pendant la démo
- Les captures d'écran, vidéos Loom ou "voici ce que ça donnerait" ne sont pas acceptables
- n8n doit être accessible depuis internet pendant la démo (tunnel ngrok/cloudflare ou n8n cloud)
- Tester le parcours complet de démo au moins deux fois la veille

### Règle 4 : Les Trois Membres de l'Équipe Doivent Parler
- Le bloc C oral (25 pts) requiert que tous les membres présentent
- Planifier les attributions de parole MAINTENANT
- Ceux qui ne parlent pas ne peuvent pas être notés sur le bloc oral

### Règle 5 : Pas de Rendu en Retard
- Le système n'accepte pas les travaux en retard
- Soumettre le L1 avant le 24 juin à 23h59 même si incomplet
- Soumettre le L2+L3 avant le 29 juin à 23h59 même si incomplet

### Règle 6 : L'Interface Conversationnelle Est l'Interface Centrale
- Le chat/formulaire EST la page principale — pas un widget dans un coin
- Inspiration : Mindtrip.ai (à consulter)
- Page de destination classique + bulle chatbot flottante = mauvaise interprétation du brief

### Règle 7 : Gérer >85 Passagers
- Un nombre de passagers >85 doit basculer en statut "Cas Complexe"
- Afficher un message expliquant que le lead sera traité par un commercial
- Ne pas générer de devis pour les groupes >85

### Règle 8 : Les Coefficients Tarifaires Doivent Être Modifiables dans la Base de Données
- Les coefficients de saisonnalité, urgence et capacité vivent dans la table Matrices
- Le client doit pouvoir les modifier sans toucher au code
- Explicitement mentionné dans le document des règles de tarification

---

## 🟡 Checklist Architecture

### Conception de l'Agent
- [ ] Le prompt système définit : rôle, garde-fous (pas de calcul de prix), ton, conditions d'escalade
- [ ] La température est BASSE (0,0–0,2) pour les étapes d'extraction de données
- [ ] La liste d'outils est définie et minimale (moindre privilège)
- [ ] L'agent extrait des données structurées (schéma JSON/Zod) AVANT d'appeler un outil
- [ ] La mémoire de session est maintenue dans une conversation (tableau de messages transmis au LLM)
- [ ] Déclencheurs HITL : >85 pax, complétude < 70% (un email de clarification puis prise en charge humaine), conditions spéciales mentionnées par le client

### Modèle de Données
- [ ] Table Demandes : tous les champs requis (voir liste dans CLAUDE.md)
- [ ] Table Matrices : saisonnalité, urgence, capacité, marge, options — tous modifiables
- [ ] Table Devis : prix_ht, tva, prix_ttc, lignes, statut, url_pdf, date_envoi, relance_count
- [ ] Table Clients : identité + historique
- [ ] Le statut est mis à jour à chaque transition du pipeline

### Moteur de Tarification
- [ ] `calculer_devis()` est implémenté en TS/JS pur sans dépendance au LLM
- [ ] La table de forfaits (0–180 km) est correctement implémentée
- [ ] Formule >180 km : `(km × 2) × 2,50` est implémentée
- [ ] Aller-retour : transfert simple × 2
- [ ] Tous les coefficients appliqués : saisonnalité, urgence, capacité, marge +15%, TVA 10%
- [ ] Au moins 5 tests unitaires avec entrées et sorties connues
- [ ] La fonction passe tous les tests avant d'être connectée à l'IA

### Système de Relances
- [ ] Déclencheur Planifié n8n configuré (quotidien ou mode démo 2 minutes)
- [ ] Requête : leads avec Statut = "Devis Envoyé" ou "Relance 1" ET prochaine_relance ≤ aujourd'hui
- [ ] Vérifier relance_count < 2 avant d'envoyer — si = 2, mettre le statut "Clôturé" à la place
- [ ] Après envoi : relance_count + 1, mettre à jour prochaine_relance, mettre à jour le statut
- [ ] Accepté / Refusé mis à jour manuellement par le commercial dans Airtable (pas d'analyse d'email entrant)

### Sécurité & Conformité
- [ ] Message client séparé des instructions système dans les prompts
- [ ] Aucune PII dans les données de test (utiliser de faux noms, faux emails)
- [ ] Finalité documentée pour chaque champ de données
- [ ] .env.local jamais commité dans Git
- [ ] Le webhook dispose d'une authentification basique ou d'un token secret

---

## 🟢 Checklist Qualité (Affecte le Score de Qualité du Code)

### Git & Dépôt
- [ ] Dépôt initialisé le Jour 1
- [ ] Messages de commit descriptifs : `feat: implémenter calculer_devis() avec coefficient de capacité`
- [ ] Au moins un commit par session de travail (montrer la progression)
- [ ] README.md existe avec : description du projet, schéma d'architecture, étapes de configuration
- [ ] .gitignore inclut : .env.local, node_modules/, .next/

### Tests
- [ ] Tests unitaires pour `calculer_devis()` rédigés (minimum 5 cas)
- [ ] Tests de cas limites : 85 passagers (frontière), <30 km, >300 km
- [ ] Test pour aller-retour vs aller simple

### Documentation
- [ ] L3 procédure technique : comment lancer le système de zéro
- [ ] L3 procédure équipe : étape par étape pour un commercial
- [ ] Schéma d'architecture dans README (ASCII ou Mermaid)

---

## Scénarios de Démo à Préparer

Tester ces parcours avant le 1er juillet :

1. **Parcours nominal** — Lead standard, données complètes, devis envoyé dans la session
2. **Lead incomplet** — L'agent demande l'information manquante (ex. ville de destination manquante)
3. **Gestion de l'urgence** — "J'ai besoin d'un bus pour demain" → coefficient d'urgence appliqué, relance rapide
4. **>85 passagers** → Cas Complexe → message d'escalade humaine
5. **Déclencheur de relance** — Régler à 2 minutes de délai pour la démo, montrer l'envoi automatique de l'email
6. **Aller-retour** — Appliquer × 2 au prix de base, montrer le détail du calcul
7. **Scénario HITL** — Devis de haute valeur ou demande très complexe → l'agent dit "un commercial vous contactera"

---

## Erreurs Courantes à Éviter

| Erreur | Conséquence |
|---------|------------|
| LLM générant des estimations de prix | Risque d'hallucination, noté sous fiabilité |
| Implémenter n8n ET Vercel AI SDK comme cerveau | Deux agents en conflit, état cassé |
| Construire un chatbot dans un coin au lieu d'une UI centrale | Mauvaise compréhension du brief |
| Coefficients de tarification codés en dur | Le client ne peut pas les mettre à jour, contrevient au brief |
| Ne pas vérifier relance_count avant d'envoyer une relance | Le même lead reçoit des emails en double pendant la démo |
| Ne pas tester avec n8n accessible publiquement | La démo échoue si localhost n'est pas tunnelisé |
| Une seule personne parle à la soutenance | 25 pts perdus pour les membres silencieux |
| Manquer l'échéance du L1 | 15 pts perdus sans récupération possible |
| Commiter .env.local | Clés API exposées, problème de sécurité |
| Tester avec des modèles LLM coûteux | Brûle le budget de 10–15 € avant le jour de la démo |
