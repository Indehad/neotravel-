# L1 — Dossier de Cadrage
## Automatisation de la Chaîne Commerciale — NeoTravel

**Formation :** MBA1 — Epitech
**Groupe :** Gendell Friolanita · Inde · Yahia
**Date de rendu :** 24 juin 2026
**Entreprise partenaire :** NeoTravel (autocar-location.com)

---

## 1. Présentation de l'entreprise

NeoTravel est un intermédiaire spécialisé dans le transport de groupe, fondé en 2010 et basé à Levallois-Perret (92). L'entreprise opère sur un modèle d'intermédiation : elle ne possède aucun véhicule propre, mais coordonne un réseau de prestataires (affréteurs de cars et autocars) pour répondre aux demandes de particuliers, d'entreprises et d'organismes publics sur l'ensemble du territoire français — 647 villes prioritaires dans 98 départements.

L'équipe commerciale traite les demandes entrantes, qualifie les prospects, élabore les propositions tarifaires et gère la relation client. Une équipe de réservation prend ensuite le relais pour trouver les transporteurs partenaires disponibles.

---

## 2. Problématique Métier

### 2.1 Situation actuelle

NeoTravel reçoit environ **60 demandes par jour** via ses canaux digitaux (publicités en ligne, formulaire web, téléphone). Ce flux est entièrement traité manuellement par les commerciaux. Or, ces derniers étant rémunérés à la commission, ils privilégient naturellement les demandes à fort potentiel (groupes importants, trajets longue distance) au détriment des autres.

Résultat : une portion significative des leads issus des campagnes publicitaires payantes ne sont jamais contactés. Ces opportunités non traitées représentent une perte de chiffre d'affaires directe, d'autant plus préjudiciable que les coûts d'acquisition de ces leads ont déjà été engagés.

### 2.2 Problèmes identifiés

| Problème | Impact |
|---|---|
| Leads non traités par les commerciaux | Perte de CA sur des leads déjà payés |
| Délais de réponse trop longs | Perte de clients au profit de concurrents plus réactifs |
| Absence de relances systématiques | Opportunités abandonnées faute de suivi |
| Qualification manuelle chronophage | Temps commercial gaspillé sur des tâches à faible valeur ajoutée |
| Aucune traçabilité du pipeline | Direction sans visibilité sur le volume et l'état des opportunités |
| Tarification calculée manuellement | Risque d'erreur, incohérence entre commerciaux, lenteur |

### 2.3 Enjeu

Le problème de NeoTravel n'est pas un manque de leads — c'est une **sous-exploitation du flux existant**. Les budgets publicitaires sont contraints par la capacité opérationnelle : plus de leads génèrent plus de pression sans générer plus de revenus, tant que le traitement reste manuel. L'automatisation permet de traiter davantage d'opportunités sans augmenter les effectifs.

**La question centrale :** Comment traiter 100 % des leads entrants, de manière rapide, cohérente et traçable, sans déshumaniser la relation commerciale ?

---

## 3. Solution Proposée

### 3.1 Vision

Nous proposons de développer un **prototype fonctionnel automatisant l'intégralité de la chaîne commerciale de NeoTravel**, de la capture de la demande jusqu'au suivi post-devis, en maintenant une intervention humaine pour les cas complexes.

### 3.2 Périmètre fonctionnel

Le prototype couvre les 10 fonctions suivantes :

| #   | Fonction                  | Description                                                                        |
| --- | ------------------------- | ---------------------------------------------------------------------------------- |
| 1   | Capture de la demande     | Formulaire conversationnel multi-étapes accessible en ligne                        |
| 2   | Centralisation CRM        | Chaque lead est enregistré automatiquement, sans exception                         |
| 3   | Qualification automatique | L'agent IA évalue la complétude et la faisabilité de la demande                    |
| 4   | Calcul de devis           | Fonction déterministe `calculer_devis()` — tarification cohérente et fiable        |
| 5   | Génération du PDF         | Document de devis professionnel généré automatiquement                             |
| 6   | Envoi par email           | Le devis est transmis au client par email dans les minutes suivant la demande      |
| 7   | Relances automatiques     | Suivi programmé selon les délais d'urgence (J+2 ou J+3/J+7)                        |
| 8   | Escalade humaine          | Les cas complexes (>85 passagers, cas atypiques) sont redirigés vers un commercial |
| 9   | Tableau de bord           | Vision pipeline en temps réel pour la direction et les commerciaux                 |
| 10  | Traçabilité               | Chaque action est horodatée et liée au lead correspondant                          |

### 3.3 Ce que le système ne fait pas

- Il ne remplace pas les commerciaux pour les cas complexes
- Il ne prend pas de décision finale sur les contrats
- Il ne contacte pas les transporteurs partenaires (hors périmètre)
- Il ne calcule jamais un prix par estimation — toujours par `calculer_devis()`

---

## 4. Architecture Technique

### 4.1 Stack technologique

| Composant                   | Outil                     | Justification                                                                                                |
| --------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Frontend / Interface client | Next.js (React)           | Framework standard, déployable en un clic sur Vercel, gratuit                                                |
| Orchestrateur IA            | n8n (self-hosted)         | Moteur de workflow visuel, gestion de l'agent IA, des relances et des connexions aux APIs — gratuit en local |
| Modèle de langage           | Gemini 2.0 Flash (Google) | Gratuit (1 500 requêtes/jour), bien supporté par n8n, suffisant pour la qualification et la conversation     |
| Base de données + Dashboard | Airtable                  | Gratuit, interface no-code pour le pipeline commercial, pas de développement dashboard nécessaire            |
| Envoi d'emails              | Resend                    | Gratuit (3 000 emails/mois), API simple, supporte les pièces jointes PDF                                     |
| Déploiement                 | Vercel                    | Gratuit, déploiement automatique depuis GitHub                                                               |
| Versioning                  | GitHub                    | Gratuit, collaboration entre membres de l'équipe                                                             |

**Coût total estimé : 0 €/mois** pour le prototype et la démonstration.

### 4.2 Architecture Schema

```mermaid
flowchart TD
    A([🖥️ Next.js Form\nname · email · departure · destination · distance · passengers]) -->|POST JSON| B

    subgraph WF1 ["⚙️ n8n — Workflow 1 : Lead Qualification"]
        B[Webhook] --> C[Save to Airtable\nStatus: New Lead]
        C --> D{{"🤖 Gemini AI\nCheck completeness + passenger count"}}

        D -->|passengers > 85| E[❌ Complex Case\nAck email → Alert sales team]
        D -->|score < 70%| F[⚠️ Incomplete\nClarification email → Human takes over]
        D -->|score ≥ 70% AND pax ≤ 85| G

        G[calculer_devis\ndistance · passengers · date · urgency · trip type] --> H[Generate PDF quote]
        H --> I[Send email + PDF via Resend]
        I --> J[Status: Quote Sent\nSet next_followup_at]
    end

    subgraph WF2 ["🕐 n8n — Workflow 2 : Follow-up Scheduler"]
        K[Schedule Trigger\nevery 2 min demo · daily prod] --> L[Fetch Airtable\nStatus = Quote Sent or Follow-up 1\nAND next_followup_at ≤ today]
        L --> M{relance_count < 2?}
        M -->|YES| N[Send follow-up email\nrelance_count + 1 · update status]
        M -->|NO| O[Status: Closed]
    end

    J --> K
    E --> AT
    F --> AT
    J --> AT
    N --> AT
    O --> AT

    AT[("🗄️ Airtable CRM\nCentral state layer\nDashboard via Airtable Interface")]
```

### Explanation

The system runs two n8n workflows connected through Airtable. Workflow 1 fires on form submission: the lead is saved to Airtable immediately, then Gemini evaluates two conditions in sequence — passenger count and completeness score. If either fails, the lead is flagged and a human takes over. If both pass, the qualified path runs: `calculer_devis()` computes the price from the form data (including distance entered by the client), a PDF is generated, and the quote is emailed in under five minutes.

Workflow 2 runs on a schedule and handles post-quote follow-ups. It fetches leads that are due for a follow-up, checks the relance counter, sends the email if the limit has not been reached, or closes the lead if it has.

The AI does exactly one thing: evaluate completeness. It never touches pricing. Quote acceptance and refusal are updated manually in Airtable by the sales team — this is realistic for the MVP and avoids the complexity of inbound email parsing.

---

### Business Rules and Triggers

- Every lead is saved to Airtable on arrival, before any qualification — no lead is ever lost
- Gemini evaluates completeness on a 0–100 scale; below 70% triggers the incomplete path
- Passenger count above 85 always routes to Complex Case regardless of completeness score
- `calculer_devis()` is the only source of price — the AI never estimates or approximates a figure
- Distance is provided by the client directly in the form as an approximate value in km
- Follow-up timing is set at quote send time: urgent leads (departure within 72h) → J+2; standard leads → J+3 then J+7
- Maximum 2 follow-ups per lead; after the second, the lead is automatically closed
- Quote status (Accepted / Refused) is updated manually by the salesperson in Airtable
- Pricing coefficients (seasonality, urgency, capacity, margin) live in the Airtable `Matrices` table and can be edited without touching code

---

### Lead End States

- **Accepted** — salesperson marks quote accepted in Airtable; human team takes over for booking
- **Refused** — salesperson marks quote refused; lead is closed
- **Closed** — no reply after 2 follow-ups; automatically closed by Workflow 2
- **Complex Case** — passenger count > 85 or data too incomplete; requires human handling
- **Incomplete** — clarification email sent; awaiting client reply; human monitors in Airtable

---

### Workflow Logic by Scenario

**1. Complete standard lead**
Form submitted with all fields including distance_km, ≤ 85 passengers → AI scores ≥ 70% → `calculer_devis()` called → PDF generated → email sent → status: "Quote Sent" → follow-up scheduled at J+3, then J+7 if no reply → closed after 2 follow-ups with no response.

**2. Incomplete lead**
Form submitted with a missing required field → AI scores < 70% → clarification email sent → status: "Incomplete" → workflow stops. Sales team monitors Airtable and follows up manually if needed.

**3. Urgent lead**
Form submitted with departure within 72 hours → qualifies normally → urgency coefficient applied by `calculer_devis()` → quote sent → first follow-up at J+2 instead of J+3.

**4. >85 passengers**
Form submitted with 86+ passengers → AI detects passenger count → no quote generated → status: "Complex Case" → acknowledgment email sent to client → sales team alerted via Airtable.

**5. No response after quote**
Workflow 2 runs → lead is past its follow-up date and relance_count = 0 → follow-up 1 sent → relance_count set to 1. If still no response at J+7 → follow-up 2 sent → relance_count set to 2. Next run: relance_count = 2 → status set to "Closed".

**6. Accepted quote**
Salesperson receives client confirmation by email or phone → manually updates Airtable status to "Accepted" → Workflow 2 will no longer pick up this lead.

**7. Refused quote**
Salesperson learns client declined → manually updates Airtable status to "Refused" → lead closed, data retained for reporting.

---

### 4.3 Principe de la tarification déterministe

La règle la plus importante du système : **l'IA ne calcule jamais un prix.**

Toute tarification passe par la fonction `calculer_devis()`, un bloc de code pur et déterministe qui prend des paramètres en entrée et retourne un prix calculé selon les barèmes officiels de NeoTravel. Cette approche garantit :
- La cohérence des prix (même input = même output, toujours)
- L'absence d'hallucination ou d'estimation de l'IA
- La traçabilité complète du calcul
- La modifiabilité des coefficients sans toucher au code (via Airtable)

---

## 5. Scénarios Fonctionnels

### Scénario 1 — Parcours nominal (happy path)

**Acteur :** Un chargé de communication dans une PME
**Déclencheur :** Il cherche un car pour 45 personnes, trajet Paris → Lyon, dans 3 semaines

1. Il accède au formulaire en ligne (Next.js) et répond aux questions une par une : type de client, nom, email, téléphone, ville de départ, destination, date, nombre de passagers, type de trajet (aller simple), urgence (standard).
2. À la soumission, les données sont envoyées via webhook à n8n.
3. L'agent IA vérifie la complétude de la demande (score > 70 %) — toutes les informations sont présentes.
4. `calculer_devis()` est appelé avec les paramètres : 45 passagers, distance estimée ~465 km, coefficient saisonnalité juin (×1.15), urgence normale (×0.95), capacité 20-53 (×1.00), marge (×1.15), TVA 10 %.
5. Un PDF de devis est généré et envoyé par email au client dans les 5 minutes.
6. Le lead est enregistré dans Airtable avec le statut "Devis envoyé".
7. Si pas de réponse sous 3 jours : relance automatique J+3, puis J+7 si toujours sans réponse.

**Résultat :** Client contacté et devis reçu en moins de 5 minutes, sans intervention humaine.

---

### Scénario 2 — Données incomplètes

**Acteur :** Un particulier qui organise un voyage scolaire
**Déclencheur :** Il soumet le formulaire sans préciser la ville de destination

1. Le formulaire est soumis avec une destination manquante.
2. L'agent IA détecte un score de complétude insuffisant (champ "Destination" absent).
3. Un email automatique est envoyé au client : "Votre demande est presque complète ! Pourriez-vous nous préciser votre ville de destination ?"
4. Le lead est enregistré dans Airtable avec le statut "Incomplet".
5. Un commercial prend le relais depuis le tableau de bord Airtable pour finaliser la demande manuellement.

**Résultat :** Aucun lead perdu — chaque demande incomplète est visible dans le pipeline et assignée à un commercial.

---

### Scénario 3 — Escalade humaine (cas >85 passagers)

**Acteur :** Un responsable événementiel d'une grande entreprise
**Déclencheur :** Il soumet une demande pour 120 passagers

1. Le formulaire est soumis avec 120 passagers renseignés.
2. L'agent IA détecte que le volume dépasse le seuil de 85 passagers.
3. Le système **ne génère pas de devis automatique** — ce cas nécessite une négociation commerciale et des arrangements logistiques spécifiques (plusieurs véhicules, coordination avancée).
4. Le lead est enregistré dans Airtable avec le statut "Cas Complexe".
5. Un email de confirmation est envoyé au client : "Votre demande a bien été reçue. En raison de la taille du groupe, un conseiller NeoTravel vous contactera sous 24h pour établir une proposition personnalisée."
6. Une alerte interne est créée pour l'équipe commerciale.

**Résultat :** Le client est pris en charge rapidement, la relation humaine est préservée pour les cas à forte valeur.

---

## 6. Modèle de Données

### Table `Demandes` — chaque lead entrant

| Champ | Type | Description |
|---|---|---|
| ID | Auto | Identifiant unique |
| Name | Texte | Nom du contact |
| Company | Texte | Nom de l'entreprise (si applicable) |
| Email | Email | Adresse email du contact |
| Phone | Téléphone | Numéro de téléphone |
| Departure | Texte | Ville de départ |
| Destination | Texte | Ville de destination |
| Date | Date | Date de départ souhaitée |
| Passengers | Nombre | Nombre de passagers |
| TripType | Choix | Aller simple / Aller-retour |
| Urgency | Choix | Urgent (<72h) / Standard / Planifié (>3 mois) |
| Comment | Texte long | Informations complémentaires (optionnel) |
| Status | Choix | Nouveau / Incomplet / Qualifié / Devis envoyé / Relance 1 / Relance 2 / Accepté / Refusé / Cas Complexe / Clôturé |
| CompletenessScore | Nombre | Score de complétude 0–100 calculé par l'agent |
| CreatedAt | Date/Heure | Date et heure de soumission |

### Table `Devis` — chaque devis généré

| Champ | Type | Description |
|---|---|---|
| LeadID | Lien | Référence vers la table Demandes |
| PrixHT | Nombre | Prix hors taxes calculé par `calculer_devis()` |
| TVA | Nombre | Montant de la TVA (10 %) |
| PrixTTC | Nombre | Prix TTC final |
| Status | Choix | Généré / Envoyé / Accepté / Refusé / Expiré |
| PDFUrl | URL | Lien vers le PDF stocké |
| SentAt | Date/Heure | Date et heure d'envoi du devis |
| RelanceCount | Nombre | Nombre de relances envoyées (0, 1 ou 2) |
| NextRelanceAt | Date | Date prévue pour la prochaine relance |

### Table `Matrices` — coefficients tarifaires (modifiables sans code)

| Champ | Type | Description |
|---|---|---|
| SeasonalityCoeff | Nombre | Coefficient selon le mois (ex: juin = ×1.15) |
| UrgencyCoeff | Nombre | Coefficient selon l'urgence (ex: <24h = ×1.10) |
| CapacityCoeff | Nombre | Coefficient selon le nombre de passagers |
| Margin | Nombre | Marge appliquée sur le prix de base (×1.15) |

> Ces valeurs sont modifiables directement dans Airtable par NeoTravel, sans intervention technique.

### Table `Clients` — base contacts

| Champ | Type | Description |
|---|---|---|
| Name | Texte | Nom complet |
| Company | Texte | Entreprise |
| Email | Email | Email principal |
| Phone | Téléphone | Téléphone |
| History | Lien | Demandes associées à ce client |

---

## 7. Règles Métier et Contraintes

### Seuils de passage en manuel (Human-in-the-Loop)

| Condition | Action |
|---|---|
| Passagers > 85 | Statut "Cas Complexe" + alerte commerciale |
| Score complétude < 70 % après 2 tentatives | Statut "Cas Complexe" + alerte commerciale |
| Client mentionne un contrat personnalisé | Escalade immédiate |

### Règles de relance

- **Délai urgent** (départ < 72h) : relance à J+2
- **Délai standard** : relance à J+3, puis J+7
- **Maximum 2 relances** par lead — au-delà, statut "Clôturé" automatiquement
- **Idempotence** : vérification systématique avant envoi pour éviter les doublons

### Contraintes RGPD

- Chaque champ collecté a une finalité documentée ("utilisé pour générer votre devis de transport")
- Les données de test ne contiennent pas d'informations personnelles réelles
- Durée de conservation définie : les leads clôturés depuis plus de 90 jours sont anonymisés

### Contraintes budgétaires

- Ensemble des outils : **0 €/mois** (tous en tier gratuit)
- Budget API IA : **gratuit** (Gemini 2.0 Flash — 1 500 requêtes/jour, 1 million de tokens/jour)
- Objectif : maintenir le coût en production sous les **€1 000/mois** imposés par le client

---

## 8. Livrables et Planning

| Livrable | Date limite | Responsable |
|---|---|---|
| L1 — Dossier de cadrage (ce document) | 24 juin 2026 à 23:59 | Équipe |
| L2 — Prototype fonctionnel | 29 juin 2026 à 23:59 | Gendell + Inde |
| L3 — Procédures techniques et équipe | 29 juin 2026 à 23:59 | Inde |
| Slides de présentation | 30 juin 2026 à 23:59 | Yahia + Inde |
| Soutenance orale + démonstration live | 1er juillet 2026 | Équipe |

---

## 9. Conclusion

Ce projet répond à un besoin métier concret et mesurable : NeoTravel perd du chiffre d'affaires non pas par manque de demandes, mais par manque de capacité à les traiter toutes. Notre solution automatise les tâches à faible valeur ajoutée (qualification, calcul, envoi, relance) pour libérer les commerciaux et garantir qu'aucun lead ne soit ignoré.

L'architecture retenue (n8n + Next.js + Airtable + Gemini + Resend) repose entièrement sur des outils gratuits, bien documentés et adaptés à une équipe non technique. Le prototype sera pleinement fonctionnel et démontrable le 1er juillet.

La philosophie qui guide chaque décision technique : **"Digitaliser sans déshumaniser"** — automatiser ce qui peut l'être, escalader vers l'humain ce qui doit l'être.
