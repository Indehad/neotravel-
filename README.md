# 🚌 NeoTravel — Automatisation des devis de transport de groupe par IA

Ce dépôt contient le prototype technique de la solution d'automatisation des demandes de devis pour **NeoTravel**, entreprise spécialisée dans le transport de groupe par autocar (8 à 85 passagers).

L'objectif : qualifier les besoins clients en langage naturel via un agent IA (Emma), calculer les prix de manière déterministe via un moteur de règles TypeScript, et gérer le passage de relais à un conseiller humain (HITL) pour les dossiers complexes.

**Démo live :** https://neotravel-seven.vercel.app  
**Équipe :** Inde Hadoui· Gendell Janssens · Yahia Baakili ·
**Hackathon :** Epitech Interstellabs — Juillet 2026

---

## 📁 Architecture du dépôt

```
📁 neotravel/
│
├── 📁 app/
│   ├── page.tsx                  # Landing page (dark navy + lime green)
│   ├── 📁 chat/
│   │   └── page.tsx              # Interface Emma (chat conversationnel)
│   └── 📁 api/
│       ├── 📁 chat/
│       │   └── route.ts          # Proxy → webhook n8n Agent Chat
│       ├── 📁 devis/
│       │   └── route.ts          # Endpoint calcul devis + sauvegarde Airtable
│       └── 📁 relance/
│           └── route.ts          # Déclenchement WF2 relances
│
├── 📁 lib/
│   ├── calculer-devis.ts         # Moteur de tarification déterministe
│   └── airtable.ts               # Accès matrices Airtable + save lead/devis
│
├── 📁 lib/__tests__/
│   └── calculer-devis.test.ts    # Suite de tests unitaires
│
├── .env.local                    # Variables d'environnement (non commité)
├── next.config.ts                # Configuration Next.js
└── package.json
```

---

## 🔄 Comment ça fonctionne

```
Client parle à Emma (interface chat)
        ↓
n8n — Agent Chat (Gemini 2.5 Flash via Vercel AI Gateway)
  - collecte les infos : départ, arrivée, date, passagers, options
  - calcule la distance via l'outil calculer_distance
  - calcule le devis via l'outil calculer_devis (déterministe)
  - enregistre le lead via l'outil enregistrer_lead
        ↓
n8n WF1 — Qualification & Devis
  - score de complétude (0–100%)
  - si < 70% : Emma redemande les infos manquantes
  - si > 85 pax : escalade vers un conseiller humain (HITL)
  - sinon : calculer_devis() → email Resend → Airtable
        ↓
n8n WF2 — Relances automatiques J+3 / J+7
```

Le calcul de prix est **entièrement déterministe** — `calculer_devis()` ne passe jamais par l'IA. Même input → même output, garanti. L'IA sert uniquement à comprendre et qualifier la demande client.

---

## 🛠️ Prérequis et Installation

### 1. Cloner le projet

```bash
git clone https://github.com/boolshyt/neotravel.git
cd neotravel
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
AIRTABLE_BASE_ID=apphcmnoff5FWbIX4
AIRTABLE_TOKEN=...
RESEND_API_KEY=...
N8N_WEBHOOK_URL=https://gendellepitech.app.n8n.cloud/webhook/neotravel-chat
```

### 4. Lancer en local

```bash
npm run dev
# → http://localhost:3000
```

### 5. Lancer les tests

```bash
npm test
```

---

## 🤖 Ingénierie de Prompt (Système Emma)

L'agent IA utilise les directives suivantes pour garantir la sécurité commerciale et la fluidité de l'expérience :

```
Tu es Emma, conseillère commerciale de Neotravel.

DIRECTIVES ABSOLUES :
• Prix → TOUJOURS calculer_devis. JAMAIS calculer soi-même.
• Distance → TOUJOURS calculer_distance après avoir les deux villes.
• Une seule question par réponse, dans l'ordre de collecte.
• Ne repose jamais une question déjà répondue.

INFORMATIONS À COLLECTER (ordre strict) :
[1] ville de départ
[2] ville d'arrivée → appelle calculer_distance en silence
[3] date de départ
[4] aller simple ou aller-retour
[5] date de retour (si aller-retour)
[6] nombre de passagers
[7] guide/accompagnateur (nb jours)
[8] nuits chauffeur sur place
[9] estimation péages

ESCALADE HUMAINE (HITL) si :
• > 85 passagers → conseiller spécialisé
• Date < 48h → traitement opérationnel urgent

STYLE : vouvoiement, ton chaleureux, phrases courtes, toujours en français.
```

---

## 🧮 Moteur de tarification (`calculer_devis()`)

Le calcul des prix n'est pas confié au LLM pour éviter toute hallucination. L'agent extrait les variables et appelle l'outil déterministe `calculer_devis()` qui applique les règles suivantes :

- **≤ 180 km** : grille forfaitaire par paliers de 10 km (250 € à 900 €)
- **> 180 km** : calcul linéaire — `km × 2 × 2,5 €`
- **Coefficients cumulatifs** :
  - Saisonnalité : Basse -7%, Neutre 0%, Haute +10%, Très haute +15%
  - Urgence : < 2 jours +10%, ≤ 7 jours +5%, ≤ 90 jours -5%, > 90 jours -10%
  - Capacité : ≤ 19 pax -5%, 20–53 pax 0%, 54–63 pax +15%, 64–67 pax +20%, 68–85 pax +40%
- **Marge commerciale** : 15% fixe
- **Options** : guide 80 €/jour, nuit chauffeur 120 €/nuit, péages en sus
- **TVA** : 10% (transport)

Les coefficients sont stockés dans Airtable (Matrice_Saison, Matrice_Urgence, Matrice_Capacite, Matrice_Options, Parametres_Globaux) et rechargés toutes les 5 minutes. Si Airtable est indisponible, fallback sur les valeurs codées en dur.

---

## 🧪 Jeu de tests et validation

```bash
npm test
```

| ID | Scénario | Entrées | Résultat attendu | Statut |
|:---|:---------|:--------|:-----------------|:-------|
| **TEST-01** | Cas simple courte distance | 80 km, 30 pax, saison normale | Prix HT calculé | `SUCCÈS` |
| **TEST-02** | Aller-retour haute saison | 120 km A/R, 50 pax, juillet | Prix × 2 + coeff saison | `SUCCÈS` |
| **TEST-03** | Longue distance > 180 km | 250 km, 40 pax | Calcul linéaire km | `SUCCÈS` |
| **TEST-04** | Urgence < 2 jours | 80 km, 20 pax, J+1 | Coeff urgence +10% | `SUCCÈS` |
| **TEST-05** | HITL : > 85 passagers | 100 km, 90 pax | Escalade commerciale | `ESCALADE_HUMAINE` |
| **TEST-06** | Options cumulées | 120 km, 40 pax, guide 2j + 1 nuit | Prix + 160 € + 120 € | `SUCCÈS` |
| **TEST-07** | Donnée invalide (0 passager) | 80 km, 0 pax | Rejet validation | `ERREUR` |

---

## 🎯 Évaluation de l'agent IA (Golden Set)

| Requête client | Comportement Emma | Action |
|:---------------|:------------------|:-------|
| "25 personnes de Lille à Amiens le 12 juillet, aller-retour" | Extraction complète dès le 1er message | `calculer_devis()` appelé |
| "Bus pour 90 personnes pour un voyage scolaire" | Détection > 85 pax | `ESCALADE_HUMAINE` |
| "Il nous faut un car pour demain matin urgemment" | Détection < 48h | `ESCALADE_HUMAINE` |
| "Bonjour je voudrais aller à Paris" | Infos manquantes détectées | Collecte progressive |

**Métriques observées :**
- Taux d'extraction correcte (villes, dates, passagers) : **~90%**
- Fiabilité des garde-fous HITL : **100%**
- Faux positifs : **< 5%**

---

## 📊 CRM Airtable

Base : `apphcmnoff5FWbIX4` — Tables : Demandes · Devis · Clients

Statuts pipeline : `Nouveau Lead → Incomplet → Qualifié → Devis envoyé → Relance 1 → Relance 2 → Accepté → Refusé`

---

## 📋 Backlog & Évolutions

| ID | Fonctionnalité | Priorité | Statut | Impact | Version |
|:---|:---------------|:---------|:-------|:-------|:--------|
| 01 | Cadrage technique et fonctionnel | P1 | ✅ Terminé | Élevé | V1 |
| 02 | Interface chat Emma (Next.js) | P1 | ✅ Terminé | Élevé | V1 |
| 03 | Agent IA Emma + outils n8n | P1 | ✅ Terminé | Critique | V1 |
| 04 | Moteur de tarification `calculer_devis()` | P1 | ✅ Terminé | Critique | V1 |
| 05 | CRM Airtable (Demandes, Devis, Clients) | P1 | ✅ Terminé | Élevé | V1 |
| 06 | WF1 Qualification + scoring complétude | P1 | ✅ Terminé | Critique | V1 |
| 07 | Escalade HITL > 85 pax | P1 | ✅ Terminé | Élevé | V1 |
| 08 | Envoi devis par email (Resend) | P1 | ✅ Terminé | Élevé | V1 |
| 09 | WF2 Relances automatiques J+3/J+7 | P2 | ✅ Terminé | Moyen | V1 |
| 10 | Vue de pilotage (dashboard métriques) | P2 | 🔄 En cours | Élevé | V2 |
| 11 | Calcul distance automatique (Google Maps) | P2 | 📋 À faire | Critique | V2 |
| 12 | Génération PDF devis | P2 | 📋 À faire | Moyen | V3 |
