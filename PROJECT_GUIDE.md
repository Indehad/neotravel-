# NeoTravel — Guide Complet du Projet
> **MBA1 Epitech · Automatisation des Processus Commerciaux**
> Équipe : Gendell, Inde, Yahia | Lancement : 22 juin 2026 | Présentation : 1er juillet 2026

---

## Table des Matières

1. [Résumé du Projet](#1-résumé-du-projet)
2. [Contexte de l'Entreprise et du Secteur](#2-contexte-de-lentreprise-et-du-secteur)
3. [Ce Que Vous Construisez Réellement](#3-ce-que-vous-construisez-réellement)
4. [Concepts et Sujets à Apprendre](#4-concepts-et-sujets-à-apprendre)
5. [Ressources](#5-ressources)
6. [Priorités](#6-priorités)
7. [Guide des Outils](#7-guide-des-outils)
8. [Règles, Recommandations et Checklist](#8-règles-recommandations-et-checklist)
9. [Règles Critiques Qui Peuvent Faire Échouer le Projet](#9-règles-critiques-qui-peuvent-faire-échouer-le-projet)
10. [Lire Entre les Lignes](#10-lire-entre-les-lignes)
11. [Décisions à Prendre Avant de Construire](#11-décisions-à-prendre-avant-de-construire)
12. [Phases du Projet et Organisation des Tâches](#12-phases-du-projet-et-organisation-des-tâches)
13. [Configuration de l'Espace de Travail](#13-configuration-de-lespace-de-travail)
14. [Chatbot vs Formulaire](#14-chatbot-vs-formulaire)
15. [Répartition des Notes](#15-répartition-des-notes)
16. [Échéances](#16-échéances)

---

## 1. Résumé du Projet

NeoTravel est un intermédiaire en transport de groupe fondé en 2010 (Levallois-Perret, France). Il coordonne des partenaires autocaristes pour des particuliers, des entreprises et des organisations publiques — mais ne possède aucun véhicule.

**Le problème :** NeoTravel reçoit ~60 leads/jour. Les commerciaux sont commissionnés, donc ils privilégient naturellement les plus grosses affaires. De nombreux leads issus de publicités payantes ne sont jamais contactés. Le processus commercial est manuel, lent, et génère des pertes de revenus.

**Votre mission :** Construire un prototype fonctionnel qui automatise la chaîne commerciale complète :

```
Capture du lead → Qualification → Génération du devis → Envoi du devis → Relance → Tableau de bord
```

Noté sur 100 points :
- **50 pts** — Livrables + prototype (L1, L2, L3)
- **25 pts** — Démo live devant le jury
- **25 pts** — Soutenance orale

**La question clé pour chaque décision :** *"Est-ce que ça aide NeoTravel à mieux traiter ses leads, plus vite, avec plus de traçabilité, sans affaiblir la relation humaine ?"*

---

## 2. Contexte de l'Entreprise et du Secteur

### NeoTravel en Bref

| Détail | Info |
|--------|------|
| Fondée | 2010 |
| Modèle | Intermédiation — pas de flotte propre |
| Adresse | 55 Rue Raspail, 92300 Levallois-Perret |
| Site web | autocar-location.com |
| Téléphone | 09 80 40 04 84 |
| Email | reservation@autocar-location.com |
| Couverture | 647 villes prioritaires sur 98 départements français |

### Catégories de Véhicules
- **Minibus** : 9–19 passagers
- **Midibus** : 20–30 passagers
- **Autocar standard** : 30–45 passagers
- **Grand autocar** : 50–60 passagers
- **Plus de 85 passagers** : Traitement commercial manuel obligatoire (pas d'automatisation)

### Équipes Internes
- **Équipe commerciale** : Reçoit les leads, qualifie, fait la première proposition, gère la relation client
- **Agents de réservation** : Trouvent les transporteurs partenaires, vérifient la qualité, confirment, coordonnent la logistique

### Contraintes Métier
- Dépendance aux partenaires : disponibilité variable des transporteurs
- Tarification complexe (saisonnalité, urgence, capacité, options)
- Réglementation transport (heures de conduite, temps de repos des chauffeurs)
- Pression sur les marges + risque de désintermédiation (clients trouvant les transporteurs directement)
- Budget : **les outils doivent rester sous 1 000 €/mois**
- Budget IA : **10–15 € par groupe** (utiliser des modèles abordables, pas GPT-4o ou Claude Opus pour tout)

### Valeurs Métier Fondamentales (à préserver dans le système)
Conseil humain · Expertise métier · Fiabilité · Réactivité · Transparence · Responsabilité

**La devise :** "Digitaliser sans déshumaniser."

### Pourquoi Ce Problème Est Important
- Le problème n'est PAS un manque de leads — c'est la sous-exploitation du flux existant
- Les commerciaux commissionnés sélectionnent les leads à haute valeur → les leads publicitaires payants sont ignorés → perte de revenus
- Les budgets publicitaires sont limités par la capacité opérationnelle : plus de leads = plus de pression, pas plus de revenus
- L'automatisation permet de traiter plus d'opportunités sans agrandir l'équipe

---

## 3. Ce Que Vous Construisez Réellement

### Les 10 Fonctions à Couvrir

1. **Capture du lead/demande** — interface conversationnelle ou formulaire
2. **Centralisation auto dans le CRM** — chaque lead enregistré, sans exception
3. **Qualification de la demande** — les données sont-elles complètes ? Qu'est-ce qui manque ?
4. **Détection des infos manquantes** — inviter le client à compléter la demande
5. **Calcul auto/semi-auto du devis** — fonction déterministe `calculer_devis()`
6. **Génération du devis/proposition commerciale** — document PDF
7. **Envoi du devis** — email automatique avec PDF en pièce jointe
8. **Système de relances** — relances planifiées selon l'urgence
9. **Suivi du pipeline commercial** — tableau de bord avec statuts
10. **Reporting des indicateurs commerciaux clés** — métriques pour le manager

### Statuts Commerciaux (le pipeline)

```
Nouveau Lead → Incomplet → Qualifié → Devis Envoyé → Relance 1 → Relance 2 → Accepté / Refusé / Cas Complexe → Clôturé
```

### Champs de Données Requis

| Champ | Pourquoi il est nécessaire |
|-------|---------------------------|
| Type de client | Particulier / entreprise / organisation publique |
| Nom / Société | Identité |
| Email | Envoi du devis + relances |
| Téléphone | Contact |
| Ville de départ | Calcul du trajet |
| Ville de destination | Calcul du trajet |
| Dates de voyage | Coefficient de saisonnalité |
| Nombre de passagers | Type de véhicule + coefficient de capacité |
| Type de trajet | Aller simple / aller-retour |
| Urgence | Coefficient d'urgence |
| Commentaire libre | Contexte pour les cas complexes |
| Statut de la demande | Suivi du pipeline |

### Règles de Timing des Relances

| Urgence | Première relance | Deuxième relance | Après 2 relances |
|---------|-----------------|------------------|-----------------|
| **Urgent** | J+2 | — | Clôture |
| **Standard** | J+3 | J+7 | Clôture |

### L'Architecture Cible

```
Page d'atterrissage + Chat/Formulaire
        ↓
    Agent IA
   ↙  ↓  ↓  ↘
Lookup  calculer_  Génération  Écriture  Planif.
règles  devis()    PDF         CRM       relances
        ↓
    Couche de données (Airtable ou Supabase)
        ↓
    Tableau de bord
```

**Distinction clé :** L'agent **lit** les règles (lookup). Le **code calcule** le prix.

---

## 4. Concepts et Sujets à Apprendre

### Concepts IA Fondamentaux

| Terme | Ce que ça signifie pour ce projet |
|-------|----------------------------------|
| **LLM** | Le cerveau (GPT-4o-mini, Claude Haiku) — comprend les conversations, route vers les outils |
| **Token** | Unité de texte consommée/produite — affecte le coût et le budget 10–15 € par groupe |
| **Fenêtre de contexte** | Ce que le LLM mémorise dans une session — gérer la mémoire de session |
| **Température** | Degré d'aléatoire/créativité — utiliser BASSE (0,0–0,2) pour l'extraction de données |
| **Prompt / Prompt système** | Instructions au LLM — définit le rôle, les règles, les garde-fous, le ton |
| **Prompt Engineering** | Rédiger des prompts système pour que l'agent fasse exactement ce qu'on veut |
| **Agent** | LLM + capacité d'appeler des outils + boucle jusqu'à la fin de la tâche |
| **Appel d'outil / Function Calling** | L'agent appelle `calculer_devis()`, l'écriture CRM, la génération PDF comme outils |
| **Sorties structurées / JSON Schema** | Forcer le LLM à produire des données typées valides avant d'appeler les outils |
| **Mémoire de session** | Historique de conversation maintenu dans une session (pas entre sessions — c'est le bonus) |
| **Streaming** | Afficher la réponse du LLM mot par mot dans l'UI au fur et à mesure |
| **Orchestration** | Contrôler la séquence : recevoir → qualifier → calculer → générer → envoyer |
| **MCP** | Model Context Protocol — interface d'outil standardisée (avancé) |
| **RAG** | Récupérer du contexte depuis une base de connaissances — ex. lire les règles de tarification |
| **Hallucination** | LLM inventant des prix ou des données — éliminé par le garde-fou `calculer_devis()` |
| **Garde-fou** | Règle empêchant le LLM de faire quelque chose de faux |
| **Déterministe vs Non-déterministe** | Le code donne toujours le même résultat (déterministe) ; le LLM varie (non-déterministe) |
| **HITL (Human-in-the-Loop)** | Escalader vers le commercial humain pour les cas complexes/haute valeur |
| **Injection de prompt** | Un attaquant met des instructions dans le message client pour détourner l'agent |
| **Observabilité/Traçage** | Logger chaque appel LLM : prompt, réponse, tokens, coût, latence |
| **Évals** | Tester l'IA : évals de code pour `calculer_devis()`, juge-LLM pour la conversation |
| **Jeu de données de référence** | Un ensemble de cas de test aux résultats connus pour valider votre système |
| **Idempotence** | Exécuter la même action deux fois n'envoie pas deux emails ou deux relances |
| **Webhook** | Endpoint HTTP qui reçoit des événements (ex. nouvelle soumission de formulaire déclenche n8n) |

### Concepts de la Stack Technique

| Terme | Ce que c'est |
|-------|-------------|
| **n8n** | Outil d'automatisation de workflows visuel — peut héberger des agents IA, appeler des APIs, planifier des tâches |
| **Vercel AI SDK** | SDK TypeScript pour créer des apps IA avec Next.js — streaming, appel d'outils |
| **Next.js** | Framework React pour apps web full-stack — utilisé pour l'UI frontend |
| **Airtable** | Base de données no-code avec UI tableau de bord intégré |
| **Supabase** | Postgres open-source avec API REST, temps réel, auth |
| **Resend / Brevo** | APIs d'envoi d'emails — pour les devis et relances |
| **Vercel** | Plateforme pour déployer des apps Next.js (tier gratuit suffisant) |
| **Zod** | Validation de schéma TypeScript — imposer des sorties structurées au LLM |
| **Pydantic** | Équivalent Python de Zod — non utilisé ici (stack Node) |

---

## 5. Ressources

### À Lire Absolument (depuis les fichiers du projet)

| Document | Objectif | Priorité |
|----------|---------|----------|
| `Automatisation-des-processus-commerciaux-v4.pdf` | Contexte complet du projet, matrices de tarification, 10 fonctions | **LIRE EN PREMIER** |
| `4-brief-demarrage-neotravel-v5.pdf` | Brief de démarrage, architecture, plan hebdomadaire, modèle de données | **LIRE EN DEUXIÈME** |
| `5-Mot_du_president_Neotravel.pdf` | Contexte métier, contraintes, valeurs | Essentiel |
| `2-faq-neotravel-v3.pdf` | 25 questions répondues sur le projet | Essentiel |
| `3-stack-technique-neotravel.pdf` | Comparaison Stack A vs B, matrice des outils | Avant de coder |
| `REGLES DE CALCUL COTATION DEVIS NEOTRAVEL.pdf` | Tables et formules de tarification exactes | Avant de coder `calculer_devis()` |
| `6-livret-technique-points-d-attention.pdf` | 7 avertissements techniques clés | Avant de coder |
| `1-glossaire-neotravel.pdf` | Glossaire IA/tech | En cas de terme incompris |

### Ressources Externes

**n8n**
- https://n8n.io/integrations/ — liste des intégrations
- https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.airtable/ — nœud Airtable
- https://docs.n8n.io/advanced-ai/ — docs du nœud AI Agent

**Vercel AI SDK (Option B)**
- https://sdk.vercel.ai/docs — documentation principale
- https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling — appel d'outils

**Inspiration**
- https://mindtrip.ai — interface de voyage conversationnelle (l'ambiance visée pour la landing)

**Email**
- https://resend.com/docs — API Resend (recommandé, tier gratuit généreux)
- https://www.brevo.com/fr/ — alternative Brevo

**Génération PDF**
- https://pptr.dev/ — Puppeteer (HTML → PDF dans l'Option B)
- https://react-pdf.org/ — bibliothèque React PDF

**Airtable**
- https://airtable.com/developers/web/api/introduction — docs API

**Supabase**
- https://supabase.com/docs — documentation principale
- https://supabase.com/docs/guides/database/tables — créer des tables

**Référence du barème de notation**
- Fichier : `7-livrables-attendus-et-modalites-soutenance-v4.pdf`

---

## 6. Priorités

### 🔴 À Comprendre Absolument (Le Projet Ne Peut Pas Fonctionner Sans Ça)

1. **Le moteur de tarification `calculer_devis()`** — formule exacte, tous les coefficients, table de forfaits. Doit être codé en JavaScript/TypeScript pur sans aucune implication du LLM. Le tester isolément avant de connecter quoi que ce soit.

2. **Le garde-fou déterministe** — le LLM ne calcule jamais les prix. Le LLM décide QUAND appeler `calculer_devis()` et QUOI lui passer. Le code fait les calculs. Toujours.

3. **Le pipeline commercial complet** — 8 statuts, ce qui déclenche chaque transition, qui agit à chaque étape.

4. **Appel d'outil / Function calling** — comment l'agent appelle `calculer_devis()`, l'écriture CRM, la génération PDF comme outils. C'est l'architecture centrale.

5. **Seuils HITL** — quand l'automatisation passe la main à un humain ? (montant élevé, faible certitude, >85 passagers, données incomplètes, cas complexe).

6. **Mémoire de session** — comment l'agent se souvient de ce que l'utilisateur a dit plus tôt dans la même conversation.

7. **Idempotence pour les relances** — empêcher d'envoyer le même email de relance deux fois. Dédupliquer.

8. **Le modèle de données** — tables Demandes, Matrices, Devis, Clients. Savoir quels champs vont où.

### 🟡 Important (Affecte la Qualité et la Note)

9. **Sorties structurées avec JSON Schema / Zod** — extraire les données de lead typées depuis la conversation avant d'appeler les outils.

10. **Défense contre l'injection de prompt** — séparer le texte client non fiable des instructions système.

11. **Bases RGPD** — justifier chaque champ de données collecté, informer l'utilisateur de la finalité, ne pas logger de PII dans les tests.

12. **Observabilité** — tracer chaque appel LLM (prompt, réponse, tokens, coût, latence). Compte pour les points bonus.

13. **Conception du prompt système** — définition du rôle, garde-fous, ton, ce que l'agent peut et ne peut pas faire.

14. **La différence entre n8n Option A et Vercel AI SDK Option B** — vous devez choisir UN et rester dessus. N'implémenter pas les deux.

15. **Évals** — tester `calculer_devis()` avec des entrées/sorties connues est simple. Tester la conversation LLM demande plus de réflexion.

16. **Génération du devis PDF** — template HTML rendu en PDF, joint à l'email.

### 🟢 Bien à Avoir (Points Bonus)

17. Prototype entièrement hébergé (Vercel + n8n cloud)
18. Tableau de bord d'observabilité (tokens, coût, latence par appel)
19. Système d'évals LLM-as-judge pour la qualité conversationnelle
20. Intégration WhatsApp (hors scope pour 1 semaine, mais impressionnant si fait)
21. Tableau de bord Next.js personnalisé au lieu d'Airtable Interface
22. Mémoire inter-sessions (se souvenir d'un client d'une conversation précédente)

---

## 7. Guide des Outils

### Matrice de Décision des Outils

| Outil                     | Requis ?       | Option A             | Option B         | Tier Gratuit              | Notes                            |
| ------------------------- | -------------- | -------------------- | ---------------- | ------------------------- | -------------------------------- |
| **GitHub**                | ✅ Oui          | Oui                  | Oui              | Gratuit                   | Le versioning est noté           |
| **n8n**                   | ✅ Oui          | Cerveau              | Back-office      | Gratuit (auto-hébergé)    | Lancer en local avec tunnel démo |
| **Next.js / React**       | ✅ Oui          | Frontend             | Frontend + cerveau | Gratuit                  | La couche UI                     |
| **Vercel**                | ✅ Oui          | Déploiement          | Déploiement      | Tier gratuit              | Déploiement auto depuis GitHub   |
| **Airtable**              | Option A seul  | BDD + tableau bord   | Non              | Tier gratuit              | Tableau de bord no-code          |
| **Supabase**              | Option B seul  | Non                  | Base de données  | Tier gratuit              | Postgres + API REST              |
| **Resend ou Brevo**       | ✅ Oui          | Email                | Email            | Gratuit (Resend: 3k/mois) | Envoi devis + relances           |
| **API LLM**               | ✅ Oui          | OpenAI/Anthropic     | OpenAI/Anthropic | Payant (budget 10–15 €)   | GPT-4o-mini ou Claude Haiku      |
| **Notion**                | ❌ Non requis   | Optionnel            | Optionnel        | Gratuit                   | Les fichiers MD GitHub suffisent |
| **Puppeteer / react-pdf** | Option B       | Non                  | Génération PDF   | Gratuit                   | Génération des devis PDF         |

### GitHub — Configuration

```bash
# Une personne crée le repo, les autres sont ajoutés comme collaborateurs
git init
git remote add origin https://github.com/[team-org]/neotravel
git branch -M main
git push -u origin main

# Stratégie de branches (simple, pour 1 semaine)
main          # stable, prêt pour la démo
dev           # branche d'intégration
feat/[nom]    # branches de fonctionnalités individuelles
```

**Fichiers requis dans le repo :**
- `README.md` — présentation du projet, instructions de config, schéma d'architecture
- `project/PROJECT_RULES.md` — règles et checklist
- `project/PRICING_ENGINE.md` — référence de tarification

### n8n — Configuration (Local avec Tunnel)

```bash
# Installer n8n globalement
npm install n8n -g

# Démarrer n8n
n8n start

# Accessible sur http://localhost:5678
# Pour la démo : utiliser ngrok ou cloudflare tunnel pour exposer publiquement
npx ngrok http 5678
```

**n8n gratuit auto-hébergé :** Pas de limites sur les workflows. Pour la production : n8n cloud ~20 $/mois (pas nécessaire pour ce projet).

**Nœuds clés que vous utiliserez :**
- Webhook (déclencheur depuis le formulaire/Next.js)
- AI Agent + OpenAI Chat Model
- Nœud Airtable (Option A)
- Nœud HTTP Request (appeler votre endpoint `calculer_devis()`)
- Nœud Code (exécuter du JS — où vit `calculer_devis()` dans l'Option A)
- Schedule Trigger (pour les relances)
- Send Email (Resend/SMTP)
- If/Switch (routing : complet ? urgent ? >85 pax ?)

### Vercel — Configuration

```bash
# Installer Vercel CLI
npm install -g vercel

# Dans votre projet Next.js
vercel login
vercel         # déployer (suit les prompts)
vercel --prod  # déployer en URL de production
```

**Tier gratuit :** Déploiements illimités, domaine personnalisé, HTTPS. Largement suffisant.

### Airtable — Configuration (Option A)

1. Créer un compte gratuit sur airtable.com
2. Créer une nouvelle base : "NeoTravel CRM"
3. Créer les tables : Demandes, Matrices, Devis, Clients, Logs
4. Obtenir la clé API : Compte → API → Générer une clé
5. Obtenir l'ID de la base : depuis l'URL lors de la consultation de votre base
6. Dans n8n : ajouter les identifiants Airtable avec la clé API

**Matrices tarifaires dans Airtable :** Créer la table Matrices pour que le client puisse mettre à jour les coefficients sans toucher au code. Voir [project/PRICING_ENGINE.md](project/PRICING_ENGINE.md) pour la structure exacte.

### Supabase — Configuration (Option B)

1. Créer un compte sur supabase.com
2. Créer un nouveau projet : "NeoTravel"
3. Obtenir l'URL et la clé anon depuis Paramètres → API
4. Exécuter le SQL pour créer les tables (voir modèle de données ci-dessous)
5. Dans Next.js : `npm install @supabase/supabase-js`

```typescript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
```

### Resend — Configuration (Recommandé)

1. Créer un compte sur resend.com (gratuit : 3 000 emails/mois)
2. Ajouter et vérifier un domaine expéditeur (ou utiliser le domaine de test pour la démo)
3. Obtenir la clé API depuis le tableau de bord
4. `npm install resend`

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: 'devis@votredomaine.com',
  to: client.email,
  subject: 'Votre devis NeoTravel',
  attachments: [{ filename: 'devis.pdf', content: pdfBuffer }]
});
```

### Notion — Est-ce Nécessaire ?

**Non.** GitHub avec des fichiers `.md` est suffisant pour la gestion de projet et la documentation. Cependant :
- Notion est mieux pour des docs vivants que les membres non-techniques de l'équipe modifient
- Le dossier de cadrage L1 peut être un PDF ou une page Notion — les deux fonctionnent
- Si vous utilisez déjà Notion, gardez-le. Sinon, ne perdez pas de temps à le configurer.

**Recommandation :** Utiliser les fichiers MD GitHub + un Kanban simple dans GitHub Projects (gratuit). C'est suffisant.

---

## 8. Règles, Recommandations et Checklist

### Règles d'Architecture

- [ ] Choisir UN orchestrateur : n8n AI Agent OU Vercel AI SDK. Jamais les deux.
- [ ] `calculer_devis()` est du code déterministe pur. Le LLM n'appelle jamais une formule mathématique.
- [ ] Les coefficients de tarification vivent dans la base de données (Airtable/Supabase), pas codés en dur.
- [ ] Le LLM utilise des outils pour chaque action réelle (écriture BDD, calcul de prix, génération PDF, envoi email).
- [ ] L'UI conversationnelle est l'expérience principale — pas un widget chatbot dans un coin.

### Règles de Données

- [ ] Chaque lead est stocké dans le CRM immédiatement à la capture.
- [ ] Le statut est mis à jour à chaque transition du pipeline.
- [ ] >85 passagers → orienter vers le statut "Cas Complexe" → traitement humain.
- [ ] Chaque champ de données a une finalité documentée (RGPD : spécification de finalité).
- [ ] Les données de test ne contiennent pas de vraie PII — utiliser des données anonymisées ou fictives.

### Règles de Relance

- [ ] Maximum 2 relances par lead. Après : clôturer le dossier.
- [ ] Lead urgent : première relance J+2.
- [ ] Lead standard : première relance J+3, deuxième J+7.
- [ ] Le déclencheur de relance est idempotent — le même lead ne peut pas recevoir la même relance deux fois.
- [ ] Pour la démo : configurer un délai de 2 minutes au lieu de jours pour montrer la relance en live.

### Règles de Qualité du Code

- [ ] Repo git initialisé avant d'écrire la première ligne de code.
- [ ] Messages de commit significatifs (ex. `feat: ajouter calculer_devis() avec table forfaitaire`).
- [ ] README.md inclut : description du projet, schéma d'architecture, instructions de configuration.
- [ ] `calculer_devis()` dispose de tests unitaires avec des paires entrée/sortie connues.
- [ ] Variables d'environnement dans `.env.local`, jamais commitées dans Git.

### Règles de Sécurité

- [ ] Texte du message client séparé des instructions système dans les prompts.
- [ ] Les outils suivent le moindre privilège : l'agent ne peut lire/écrire que ce dont il a besoin.
- [ ] Aucune donnée client sensible loggée en clair.

### Règles de Budget

- [ ] Tous les outils ensemble : <1 000 €/mois (contrainte client).
- [ ] Appels LLM : budget 10–15 € par projet de groupe (utiliser des modèles mini/haiku).
- [ ] Ne pas utiliser l'IA pour le calcul de prix (gaspille des tokens, introduit des erreurs).
- [ ] Ne pas tester avec des modèles coûteux pendant le développement.

---

## 9. Règles Critiques Qui Peuvent Faire Échouer le Projet

Ces règles, si enfreintes, coûtent directement des points ou compromettent la démo live.

### ❌ RÈGLE 1 : Ne Jamais Laisser le LLM Calculer les Prix
Si une IA hallucine "2 400 €" au lieu de "1 850 €" et que le jury s'en aperçoit → crédibilité du projet détruite. Le garde-fou déterministe est explicitement noté sous "Fiabilité & Garde-fous" (10 points). **Tolérance zéro.**

### ❌ RÈGLE 2 : Ne Pas Dupliquer la Logique Agent dans les Deux Outils
Si vous commencez avec n8n AI Agent et câblez aussi Vercel AI SDK pour faire la même chose, vous aurez deux agents en conflit, un état cassé, et un système impossible à déboguer. **Choisir un orchestrateur et utiliser l'autre uniquement pour son rôle non-cerveau.**

### ❌ RÈGLE 3 : La Démo Doit Vraiment Fonctionner en Live
15/25 points de démo requièrent un parcours live fonctionnel : lead entrant → devis sortant → relance déclenchée. Un diaporama de captures d'écran ne passera pas. Si vous faites la démo avec n8n : avoir le service actif et accessible via une URL publique. **Si le système est down pendant la démo, vous perdez le maximum de points.**

### ❌ RÈGLE 4 : Tout le Monde Doit Parler à la Présentation
"Tous les membres doivent parler — ceux qui ne parlent pas ne peuvent pas être notés sur le bloc oral." Ça représente 25 points à risque. Planifier les parties de discours pour vous trois MAINTENANT.

### ❌ RÈGLE 5 : Ne Pas Manquer l'Échéance du L1
Le L1 (dossier de cadrage) est dû le 24 juin à 23h59. Aucun rendu tardif accepté. Soumettre ce que vous avez. Le L1 vaut 15 points et est le seul livrable dû avant le build principal.

### ❌ RÈGLE 6 : L'UI Conversationnelle Doit Être Centrale
"Nous ne voulons pas d'un chatbot dans un coin." Si vous construisez une bulle chatbot en bas à droite d'une page de destination normale, vous avez mal compris le projet. La conversation EST l'interface principale. Inspiration : Mindtrip.ai.

### ❌ RÈGLE 7 : Gérer le Cas Limite des >85 Passagers
Si une demande arrive pour 100 passagers et que votre système plante ou envoie un mauvais devis, le jury le remarquera. C'est une contrainte connue — orienter vers "Cas Complexe" et montrer un message de passation humaine approprié.

### ❌ RÈGLE 8 : Le README Doit Exister et Être Lisible
La qualité du code (6 points) inclut le repo Git et le README. Un README manquant, c'est des points faciles jetés à la poubelle.

---

## 10. Lire Entre les Lignes

Ce sont des choses qui ont été implicites mais non dites directement.

**L'évaluateur a été un vrai consultant NeoTravel.** Julien (le président dans le brief) n'est pas qu'un personnage fictif — le présentateur a confirmé une familiarité profonde avec les points de douleur exacts. Ils savent quand votre système est réaliste ou théoriquement plausible. Une fausse démo ou un système qui "fonctionne en slides" sera transparent.

**Le jury vous évalue comme consultants numériques, pas seulement comme développeurs.** Le bloc C (oral) demande un raisonnement métier : qu'est-ce que ça économise ? Quels sont les KPIs ? Quel risque avez-vous atténué ? Vous devez pouvoir parler ROI métier, pas seulement architecture technique. Préparer : "Que se passerait-il si NeoTravel traitait 20% de leads en plus avec la même équipe ?"

**Le HITL est explicitement noté.** Human-in-the-loop est listé sous "Fiabilité & Garde-fous" (10 pts). Ce n'est pas un nice-to-have. Vous DEVEZ montrer un scénario où le système escalade à un humain : soit un flag de cas complexe, un seuil de devis haute valeur, ou des données incomplètes.

**Le L3 passation (doc de transfert) vaut 7 points que la plupart des équipes ignorent.** C'est une procédure technique (comment lancer/déployer le système) + une procédure équipe (comment un commercial l'utilise). L'écrire en dernier mais ne pas l'oublier.

**Les matrices de tarification doivent être modifiables sans toucher au code.** Le brief dit "tous ces éléments doivent être contrôlables pour être ajustés en temps réel." Les stocker dans Airtable/Supabase. Le jury peut demander : "Comment le client met-il à jour les coefficients saisonniers ?" Vous devez avoir une réponse.

**"Un formulaire est acceptable si justifié" est réel — mais l'accent est sur "justifié."** Si vous soumettez un formulaire HTML ordinaire sans expliquer pourquoi vous l'avez choisi plutôt qu'une UI conversationnelle, vous perdez en cohérence narrative. Si vous dites "nous avons choisi un formulaire structuré pour une meilleure qualité de données et l'avons combiné avec un assistant pour la clarification des champs ambigus," vous avez une position défendable.

**L'historique de session est requis ; la mémoire inter-sessions est un bonus.** Ne pas confondre les deux. Dans une session, l'agent doit se souvenir de ce que l'utilisateur a dit 5 messages avant. Entre sessions — s'ils reviennent demain — vous n'avez pas besoin de les reconnaître (mais c'est un bonus).

**Le délai de 2 minutes pour les relances en démo n'est pas un hack — le brief le suggère.** Reconfigurer votre Schedule Trigger n8n pour se déclencher toutes les 2 minutes pour la démo au lieu de tous les jours. Remettre à la normale avant la soumission.

**Le crédit IA de 10–15 € est par groupe, pas par personne.** C'est votre budget total pour les appels API LLM sur tout le projet. Utiliser des modèles bon marché (GPT-4o-mini ≈ 0,15 $/1M tokens en entrée, Claude Haiku ≈ 0,25 $/1M). Ne pas utiliser GPT-4o ou Claude Sonnet pour tout.

**Les 4 points agile concernent le processus, pas seulement les commits.** Ils veulent voir : backlog créé tôt, tâches assignées, progression suivie. Un tableau Kanban GitHub Projects avec des cartes créées dès le Jour 1 le démontre.

---

## 11. Décisions à Prendre Avant de Construire

Ce sont les choses sur lesquelles votre équipe doit s'aligner. Chacune est un carrefour — mauvais choix, et vous perdez des jours.

### Décision 1 : Stack Option A (n8n) ou Option B (Vercel AI SDK) ?

|                | Option A — n8n AI Agent                      | Option B — Vercel AI SDK             |
| -------------- | -------------------------------------------- | ------------------------------------ |
| Pour qui       | À l'aise avec le no-code/low-code            | À l'aise en TypeScript/React         |
| Cerveau IA     | Nœud n8n AI Agent                            | Vercel AI SDK dans Next.js           |
| Rôle de n8n    | Tout                                         | Back-office (relances, écritures CRM)|
| Tableau bord   | Airtable Interface (no-code)                 | Page React/Next.js personnalisée     |
| Difficulté     | Plus faible                                  | Plus élevée                          |
| Recommandation | Fonctionne seul, Claude est aveugle à l'UI n8n | **✅ RECOMMANDÉ avec Claude Cowork** |

**Note :** La stack est verrouillée sur l'Option A (n8n + Airtable). Voir CLAUDE.md pour les décisions verrouillées.

### Décision 2 : Interface Chatbot ou Formulaire ?

**Utiliser l'approche hybride** — formulaire structuré pour les champs requis, puis assistant IA pour la clarification. Pourquoi : un pur chatbot doit extraire des données structurées du texte libre ("J'ai besoin d'un bus pour 45 personnes à Lyon vendredi prochain"). Cette extraction peut échouer, et quand elle échoue, toute la chaîne (tarification, PDF, email) casse. Un formulaire garantit des données propres dans `calculer_devis()`. L'IA gère la partie humaine ensuite.

Voir [Section 14](#14-chatbot-vs-formulaire) pour l'analyse complète.

### Décision 3 : Qui Possède Quel Composant ?

Répartition suggérée :
- **Gendell** : backend/n8n — workflows, `calculer_devis()`, outils, intégrations
- **Inde** : frontend/docs — formulaire Next.js, UI, L1/L3
- **Yahia** : slides/tests — présentation, scénarios de test

### Décision 4 : Quel Est Votre Seuil HITL ?

Décider des seuils spécifiques maintenant, avant de construire :
- Nombre de passagers >85 → cas complexe
- Score de complétude <70% après 1 tentative de clarification → escalader
- Le client mentionne explicitement "urgent" ou "contrat personnalisé" → escalader

### Décision 5 : Quel Modèle LLM Utiliser ?

- Gemini 2.0 Flash (Google) — tier gratuit, 1 500 req/jour, bien supporté par n8n
- NE PAS utiliser GPT-4o ou Claude Sonnet pour chaque appel — brûle le budget

### Décision 6 : Airtable ou Supabase ?

Stack verrouillée sur Airtable (Option A). L'Airtable Interface fournit le tableau de bord no-code.

---

## 12. Phases du Projet et Organisation des Tâches

### Phase 0 — Alignement & Configuration (22 juin, aujourd'hui)
**Objectif :** Tout le monde comprend le projet et les outils sont prêts.

- [x] Lire les documents du projet (les trois membres)
- [x] Décider : Stack A ou B ?
- [x] Décider : Chatbot ou formulaire ?
- [ ] Définir les seuils HITL
- [ ] Créer le repo GitHub + inviter les collaborateurs
- [ ] Créer les comptes : API LLM, Airtable, Resend, Vercel
- [ ] Configurer n8n en local (lancer `n8n start`)
- [ ] Initialiser le projet Next.js : `npx create-next-app@latest neotravel`
- [ ] Créer le tableau Kanban GitHub Projects avec les cartes initiales
- [ ] Configurer `.env.local` avec toutes les clés API

### Phase 1 — Cadrage & L1 (22–24 juin)
**Objectif :** Dossier de cadrage L1 soumis avant le 24 juin à 23h59.

- [ ] Rédiger le L1 : analyse du problème métier
- [ ] Rédiger le L1 : cadrage technique (choix de stack + justification)
- [ ] Rédiger le L1 : schéma d'architecture
- [ ] Rédiger le L1 : 2–3 scénarios d'utilisation (parcours nominal, cas limite, HITL)
- [ ] Rédiger le L1 : modèle de données (tables + champs)
- [ ] Réviser + soumettre le L1 avant le 23h59 du 24 juin

**Le L1 vaut 15 points. Ne pas sauter cette étape.**

### Phase 2 — Moteur de Tarification (24–25 juin)
**Objectif :** `calculer_devis()` fonctionne parfaitement avant de connecter quoi que ce soit à l'IA.

- [ ] Implémenter `calculer_devis()` en TypeScript/JavaScript pur
- [ ] Implémenter la table de forfaits (jusqu'à 180 km)
- [ ] Implémenter la formule pour >180 km : `(km × 2) × 2,50 €`
- [ ] Implémenter l'aller-retour : transfert simple × 2
- [ ] Implémenter tous les coefficients : saisonnalité, urgence, capacité, marge
- [ ] Écrire des tests unitaires : au moins 5 paires entrée/sortie connues
- [ ] Stocker les matrices tarifaires dans Airtable (modifiables sans code)
- [ ] Tester isolément : appeler la fonction directement, vérifier que les résultats correspondent au PDF de tarification

### Phase 3 — Modèle de Données & CRM (25–26 juin)
**Objectif :** Base de données prête, formulaires fonctionnels, données qui circulent.

- [ ] Créer la table Demandes avec tous les champs requis
- [ ] Créer la table Matrices (coefficients, modifiables)
- [ ] Créer la table Devis (enregistrements de devis)
- [ ] Créer la table Clients
- [ ] Créer la table Logs (pour l'observabilité)
- [ ] Tester les opérations CRUD manuellement

### Phase 4 — Agent & Orchestration (26–27 juin)
**Objectif :** L'agent IA qualifie les leads et appelle les outils.

- [ ] Rédiger le prompt système (rôle, règles, garde-fous, ton)
- [ ] Connecter Gemini 2.0 Flash à l'AI Agent n8n
- [ ] Implémenter l'outil : appel à `calculer_devis()`
- [ ] Implémenter l'outil : écriture CRM (sauvegarder le lead dans Airtable)
- [ ] Implémenter l'outil : mise à jour du statut
- [ ] Implémenter l'outil : escalade HITL
- [ ] Tester : parcours nominal complet de la capture du lead à la génération du devis
- [ ] Tester : cas limite — >85 passagers → cas complexe
- [ ] Tester : données incomplètes → email de clarification

### Phase 5 — PDF & Email (27–28 juin)
**Objectif :** Devis PDF généré et envoyé par email.

- [ ] Construire le template PDF du devis
- [ ] Implémenter la génération PDF à partir de la sortie de `calculer_devis()`
- [ ] Connecter Resend pour l'envoi d'emails
- [ ] Envoyer un email de test avec pièce jointe PDF
- [ ] Tester le parcours complet : lead → devis → PDF → email envoyé

### Phase 6 — Relances & Tableau de Bord (28–29 juin)
**Objectif :** Les relances fonctionnent, le pipeline est visible.

- [ ] Construire le Workflow 2 n8n (Schedule Trigger pour les relances)
- [ ] Implémenter le timing basé sur l'urgence (J+2 vs J+3/J+7)
- [ ] Implémenter la vérification d'idempotence (ne pas envoyer la relance deux fois)
- [ ] Implémenter le plafond de 2 relances maximum → clôture auto
- [ ] Configurer l'Airtable Interface comme tableau de bord
- [ ] Configurer le mode démo : délai de 2 minutes pour les relances

### Phase 7 — L2, L3 & Stabilisation (29 juin)
**Objectif :** Livrables soumis avant le 29 juin à 23h59.

- [ ] Rédiger le L3 : procédure technique (comment déployer et lancer le système)
- [ ] Rédiger le L3 : procédure équipe (comment un commercial utilise le tableau de bord)
- [ ] Finaliser le README
- [ ] Parcourir les 7 scénarios de démo
- [ ] Tester les cas limites : >85 passagers, demande urgente, données manquantes
- [ ] Tester l'idempotence : déclencher une relance deux fois, confirmer qu'un seul email est envoyé
- [ ] Soumettre L2 (prototype) + L3 (doc de passation)

### Phase 8 — Slides & Préparation Orale (30 juin)
**Objectif :** Slides soumis, tout le monde sait ce qu'il dit.

- [ ] Construire le jeu de diapositives (slides dus le 30 juin à 23h59)
- [ ] Inclure : problème, solution, captures d'écran démo, architecture, KPIs/valeur métier
- [ ] Attribuer les sections de discours à chaque membre (tous doivent parler)
- [ ] Répéter la démo live au moins deux fois
- [ ] Préparer les réponses aux questions probables du jury (voir ci-dessous)

### Phase 9 — Présentation (1er juillet)
**Objectif :** Démo convaincante + soutenance orale confiante.

**Questions probables du jury à préparer :**
- "Pourquoi avez-vous choisi n8n ?"
- "Comment le client met-il à jour les coefficients de tarification ?"
- "Que se passe-t-il si quelqu'un saisit 200 passagers ?"
- "Comment empêchez-vous l'envoi de la même relance deux fois ?"
- "Quel est l'impact métier ? Quels KPIs suivriez-vous ?"
- "Comment votre système préserve-t-il la relation humaine ?"
- "Que construiriez-vous ensuite si vous aviez 3 semaines de plus ?"

---

## 13. Configuration de l'Espace de Travail

### Étape par étape : Configuration du Jour 1

**1. Créer le repo GitHub**
```bash
# La Personne A crée le repo sur github.com, le met en privé
# Invite la Personne B et la Personne C comme collaborateurs
# Tout le monde clone :
git clone https://github.com/boolshyt/neotravel.git
cd neotravel
```

**2. Initialiser le projet Next.js**
```bash
npx create-next-app@latest . --typescript --tailwind --app
npm install
npm run dev  # vérifier que http://localhost:3000 fonctionne
```

**3. Créer le Kanban GitHub Projects**
- Aller sur github.com/boolshyt/neotravel → Projects → New Project
- Utiliser la mise en page "Board"
- Colonnes : Backlog → En cours → Révision → Terminé
- Ajouter des cartes pour chaque tâche de phase ci-dessus

**4. Configurer le compte API LLM**
- Google AI Studio : aistudio.google.com → Get API key (Gemini 2.0 Flash, gratuit)

**5. Configurer n8n en local**
```bash
npm install -g n8n
n8n start
# S'ouvre sur http://localhost:5678
# Créer un compte gratuit à l'invite
```

**6. Configurer Airtable**
- airtable.com → Créer une nouvelle base → "NeoTravel CRM"
- Créer les tables : Demandes, Matrices, Devis, Clients, Logs

**7. Configurer Resend**
- resend.com → Créer un compte → Clés API → Créer une clé
- Pour la démo : utiliser le domaine de test (pas de configuration DNS nécessaire pour les tests)

**8. Configurer Vercel**
```bash
npm install -g vercel
vercel login  # s'authentifier avec GitHub
# Quand prêt à déployer :
vercel  # suit les prompts, se connecte à votre repo GitHub
```

**9. Créer `.env.local` à la racine du projet**
```bash
# Ne jamais commiter ce fichier dans Git
GEMINI_API_KEY=...
RESEND_API_KEY=re_...
AIRTABLE_API_KEY=...
AIRTABLE_BASE_ID=app...
N8N_WEBHOOK_URL=http://localhost:5678/webhook/neotravel
```

**10. Créer `.gitignore`** (create-next-app le fait, vérifier simplement)
```
.env.local
.env
node_modules/
.next/
```

### Ce Qui Doit Être Convenu Avant le Premier Commit

1. ✅ Stack A (n8n + Airtable)
2. ✅ Formulaire multi-étapes conversationnel (style Typeform)
3. ✅ Seuils HITL (>85 pax, complétude <70%)
4. ✅ Propriété des tâches par personne
5. ✅ Convention des messages de commit

---

## 14. Chatbot vs Formulaire

### La Réponse Courte

**Les deux sont acceptables. Un formulaire seul est valide si justifié. Un hybride est aussi acceptable.**

Depuis le document FAQ (verbatim) : *"Oui, si vous le justifiez. Un formulaire peut être plus fiable pour collecter des données structurées. Un parcours hybride (formulaire pour les informations obligatoires + assistant pour clarifier) est aussi recevable."*

### La Réponse Longue

L'approche **chatbot** :
- Collecte les données de façon conversationnelle — ressemble à un conseiller voyage
- S'aligne avec l'inspiration Mindtrip.ai citée par le professeur
- Plus impressionnant techniquement
- Plus difficile à implémenter : doit gérer l'état, extraire des données structurées du langage naturel
- Risque : si le flux de conversation est buggé, tout le système casse pendant la démo

L'approche **formulaire** :
- Plus fiable pour la collecte de données structurées
- Plus simple à construire et moins susceptible de tomber en panne pendant la démo
- Moins impressionnant, mais démontre la même chaîne d'automatisation
- Doit être justifié dans le dossier de cadrage L1

L'approche **hybride — formulaire multi-étapes conversationnel (style Typeform)** (choisie) :
- Une question par écran, copie friendly, progression visuelle
- Sortie structurée garantie pour `calculer_devis()`
- L'IA intervient pour la qualification, la clarification, et la personnalisation du devis
- Évite le risque d'un LLM échouant à extraire `nb_passagers` d'une saisie en texte libre
- Montre les deux capacités techniques

### Ce Qui Compte Plus Que l'Interface

L'interface est le point d'entrée. Ce qui est noté c'est la chaîne complète qui suit :
- Les données arrivent-elles dans le CRM ? ✓
- Le devis est-il calculé de façon déterministe ? ✓
- Le PDF est-il généré ? ✓
- L'email est-il envoyé ? ✓
- Les relances sont-elles déclenchées selon le calendrier ? ✓
- Le HITL fonctionne-t-il ? ✓

Un beau chatbot qui casse à l'étape 3 obtient une note inférieure à un formulaire ordinaire qui complète la chaîne entière.

---

## 15. Répartition des Notes

### Bloc A — Livrables (50 points)

**L1 — Dossier de cadrage (15 points)** · Rendu le 24 juin
- Analyse du problème + priorisation : **7 pts**
  - Cadrage métier, frictions identifiées, KPIs
- Cadrage technique + scénarios : **8 pts**
  - Architecture, justification de la stack, 2–3 scénarios d'utilisation, modèle de données

**L2 — Prototype + Artefacts (28 points)** · Rendu le 29 juin
- Prototype fonctionnel : **8 pts**
  - SOCLE (requis) : Chaîne complète fonctionnelle + n8n accessible de l'extérieur
  - BONUS : Entièrement hébergé (Vercel + n8n cloud)
- Fiabilité + garde-fous : **10 pts**
  - Calcul de prix déterministe
  - Cas de test pour `calculer_devis()`
  - HITL implémenté
  - Conformité RGPD de base
  - Protection contre l'injection de prompt
  - BONUS : Observabilité/traçage
- Qualité du code : **6 pts**
  - Repo Git avec historique
  - README (config + architecture)
  - Tests
- Approche agile : **4 pts**
  - Backlog créé tôt
  - Tâches suivies
  - Commits montrant une progression progressive

**L3 — Documentation de Passation (7 points)** · Rendu le 29 juin
- Procédure technique : comment déployer et lancer le système
- Procédure équipe : comment un commercial utilise le tableau de bord et les outils

### Bloc B — Démo (25 points)

- Parcours live complet (lead → devis → email → relance) : **15 pts**
- Robustesse sur les cas non-scriptés/limites : **6 pts**
- Maîtrise des outils (vous savez ce que vous avez construit) : **4 pts**

### Bloc C — Oral (25 points)

- Pitch + clarté : **7 pts**
- Soutenance technique : **8 pts**
- Q&A du jury : **5 pts**
- Posture + professionnalisme : **5 pts**

**Important :** Ceux qui ne parlent pas ne peuvent pas être notés sur le Bloc C (25 pts).

---

## 16. Échéances

| Livrable | Échéance | Points en Jeu |
|----------|----------|---------------|
| **L1 — Dossier de cadrage** | **24 juin 2026 à 23h59** | 15 pts |
| **L2 — Prototype + artefacts** | **29 juin 2026 à 23h59** | 28 pts |
| **L3 — Documentation de passation** | **29 juin 2026 à 23h59** | 7 pts |
| **Diapositives de présentation** | **30 juin 2026 à 23h59** | — |
| **Présentation live** | **1er juillet 2026** | 25 + 25 pts |

**Aucun rendu tardif accepté.**

---

*Dernière mise à jour : 22 juin 2026 | Généré à partir des 12 documents sources du projet*
