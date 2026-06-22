# NeoTravel — Automatisation de la Chaîne Commerciale

> MBA1 Epitech — Projet de groupe | Juillet 2026
> **Équipe :** Gendell · Inde · Yahia

---

## Présentation

NeoTravel est un intermédiaire en transport de groupe (France, depuis 2010) qui reçoit ~60 leads/jour mais les traite entièrement à la main — leads manqués, devis lents, aucune relance automatique.

Ce projet automatise la chaîne commerciale complète :

**Capture du lead → Qualification IA → Tarification déterministe → Devis PDF → Email → Relances automatiques → Tableau de bord**

---

## Stack Technique

| Couche | Outil |
|---|---|
| Frontend | Next.js (React) — déployé sur Vercel |
| Automatisation & orchestration IA | n8n (auto-hébergé) |
| Modèle de langage | Gemini 2.0 Flash (Google) — tier gratuit |
| CRM & Tableau de bord | Airtable |
| Envoi d'emails | Resend |

**Coût total : 0 €/mois** — tous en tier gratuit.

---

## Architecture

```mermaid
flowchart TD
    A([🖥️ Formulaire Next.js\nnom · email · départ · destination · distance · passagers]) -->|POST JSON| B

    subgraph WF1 ["⚙️ n8n — Workflow 1 : Qualification des Leads"]
        B[Webhook] --> C[Sauvegarde dans Airtable\nStatut : Nouveau Lead]
        C --> D{{"🤖 Gemini IA\nVérif. complétude + nombre passagers"}}

        D -->|passagers > 85| E[❌ Cas Complexe\nEmail d'accusé → Alerte équipe commerciale]
        D -->|score < 70%| F[⚠️ Incomplet\nEmail de clarification → Prise en charge humaine]
        D -->|score ≥ 70% ET pax ≤ 85| G

        G[calculer_devis\ndistance · passagers · date · urgence · type trajet] --> H[Génération du devis PDF]
        H --> I[Envoi email + PDF via Resend]
        I --> J[Statut : Devis Envoyé\nPlanification prochaine_relance]
    end

    subgraph WF2 ["🕐 n8n — Workflow 2 : Planificateur de Relances"]
        K[Déclencheur Planifié\ntoutes les 2 min démo · quotidien prod] --> L[Récupération Airtable\nStatut = Devis Envoyé ou Relance 1\nET prochaine_relance ≤ aujourd'hui]
        L --> M{relance_count < 2 ?}
        M -->|OUI| N[Envoi email de relance\nrelance_count + 1 · mise à jour statut]
        M -->|NON| O[Statut : Clôturé]
    end

    J --> K
    E --> AT
    F --> AT
    J --> AT
    N --> AT
    O --> AT

    AT[("🗄️ Airtable CRM\nCouche d'état centrale\nTableau de bord via Airtable Interface")]
```

### Règle clé : l'IA ne calcule jamais les prix

Toute la tarification passe par `calculer_devis()` — une fonction déterministe pure. L'IA évalue uniquement la complétude et oriente les leads. Elle n'estime ni n'approxime jamais un prix.

---

## Statuts du Pipeline

```
Nouveau Lead → Incomplet → Devis Envoyé → Relance 1 → Relance 2 → Clôturé
                                                               ↘ Cas Complexe
```

---

## Installation Locale

### Prérequis
- Node.js LTS — [nodejs.org](https://nodejs.org)
- n8n — `npm install n8n -g`
- Git — [git-scm.com](https://git-scm.com)

### Cloner et installer

```bash
git clone https://github.com/boolshyt/neotravel.git
cd neotravel
npm install
```

### Variables d'environnement

Créer un fichier `.env.local` à la racine (ne jamais le committer) :

```
RESEND_API_KEY=votre_clé_resend
N8N_WEBHOOK_URL=votre_url_webhook_n8n
```

### Lancer en local

```bash
# Démarrer n8n (garder ce terminal ouvert)
n8n start

# Démarrer Next.js (dans un second terminal)
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) pour le formulaire.
Ouvrir [http://localhost:5678](http://localhost:5678) pour n8n.

### Pour la démonstration live

Exposer n8n sur internet pour que le formulaire puisse l'atteindre :

```bash
npx ngrok http 5678
```

Copier l'URL ngrok → la coller dans `N8N_WEBHOOK_URL` dans `.env.local`.

---

## Structure du Dépôt

```
neotravel/
├── README.md                    # Ce fichier
├── TASKS.md                     # Tableau des tâches — qui fait quoi et quand
├── L1_DOSSIER_DE_CADRAGE.md     # Livrable L1 (rendu le 24 juin)
├── PROJECT_GUIDE.md             # Guide de référence complet du projet
├── project/
│   ├── PRICING_ENGINE.md        # Spécification calculer_devis() et tables tarifaires
│   └── PROJECT_RULES.md         # Checklist des règles et garde-fous
├── .gitignore
└── .env.local                   # Clés API — local uniquement, jamais commité
```

---

## Livrables

| Date | Livrable |
|---|---|
| 24 juin à 23h59 | L1 — Dossier de cadrage |
| 29 juin à 23h59 | L2 — Prototype + L3 — Documentation de passation |
| 30 juin à 23h59 | Diapositives de présentation |
| 1er juillet | Présentation live + démo |
