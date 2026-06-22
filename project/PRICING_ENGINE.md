# NeoTravel — Référence du Moteur de Tarification

> Source : "REGLES DE CALCUL COTATION DEVIS NEOTRAVEL" (document officiel de tarification)
> Il s'agit de la référence faisant autorité pour l'implémentation de `calculer_devis()`.
> Tous les coefficients doivent également être stockés dans la table Matrices de la base de données.

---

## La Règle d'Or

```
L'AGENT LIT LES RÈGLES → LE CODE EXÉCUTE CALCULER_DEVIS() → LE CODE RETOURNE LE PRIX
LE LLM NE VOIT JAMAIS LES CALCULS INTERMÉDIAIRES. IL REÇOIT UNIQUEMENT LE RÉSULTAT FINAL.
```

---

## Formule 1 — Transfert Simple (Aller Simple)

### Étape 1 : Obtenir le Prix de Base

**Jusqu'à 180 km — utiliser le barème forfaitaire :**

| Distance | Prix de Base (€ HT) |
|----------|---------------------|
| ≤ 10 km | 250 € |
| 20 km | 250 € |
| 30 km | 250 € |
| 40 km | 320 € |
| 50 km | 350 € |
| 60 km | 390 € |
| 70 km | 430 € |
| 80 km | 500 € |
| 90 km | 540 € |
| 100 km | 580 € |
| 110 km | 620 € |
| 120 km | 660 € |
| 130 km | 700 € |
| 140 km | 740 € |
| 150 km | 780 € |
| 160 km | 820 € |
| 170 km | 860 € |
| 180 km | 900 € |

> Pour les distances entre deux paliers (ex. 45 km), utiliser le palier supérieur ou interpoler. À confirmer avec l'équipe.

**Au-delà de 180 km — calculer directement :**
```
prix_base = (distance_km × 2) × 2,50
```

Exemple : 250 km → (250 × 2) × 2,50 = 500 × 2,50 = **1 250 € HT**

---

## Formule 2 — Aller-Retour

```
prix_aller_retour = prix_transfert_simple × 2
```

S'applique AVANT l'ajout des options.

---

## Étape 2 : Appliquer les Coefficients (dans l'ordre)

### Coefficient 1 — Saisonnalité (basé sur le mois de `date_depart`)

| Saison | Mois | Coefficient |
|--------|------|-------------|
| Basse | Novembre, Janvier, Février, Août | −7% (× 0,93) |
| Moyenne | Décembre, Octobre, Septembre | 0% (× 1,00) |
| Haute | Mars, Avril, Juillet | +10% (× 1,10) |
| Très Haute | Mai, Juin | +15% (× 1,15) |

### Coefficient 2 — Urgence (basé sur l'écart entre `date_demande` et `date_depart`)

| Catégorie | Écart | Coefficient |
|-----------|-------|-------------|
| DD_PRIORITAIRE | < 24 heures | +10% (× 1,10) |
| DD_URGENT | 1–3 jours | +5% (× 1,05) |
| DD_NORMAL | 4 jours – 3 mois | −5% (× 0,95) |
| DD_3MOISETPLUS | > 3 mois | −10% (× 0,90) |

### Coefficient 3 — Capacité (basé sur `nb_passagers`)

| Nombre de Passagers | Coefficient |
|--------------------|-------------|
| ≤ 19 | −5% (× 0,95) |
| 20 – 53 | 0% (× 1,00) |
| 54 – 63 | +15% (× 1,15) |
| 64 – 67 | +20% (× 1,20) |
| 68 – 85 | +40% (× 1,40) |
| > 85 | **STOP — orienter vers le commercial** |

### Coefficient 4 — Marge

Toujours appliquer :
```
× 1,15  (+15% de marge commerciale)
```

### Étape 3 : Ajouter les Options (montants forfaitaires par option)

| Option | Coût |
|--------|------|
| Guide ou accompagnateur | +80 € / jour |
| Hébergement chauffeur nuit | +120 € / nuit |
| Péages | Forfait par route (récupérer en BDD) |

### Étape 4 : Appliquer la TVA

```
TVA = 10%
prix_ttc = prix_ht × 1,10
```

---

## Formule de Calcul Complète

```
prix_base = barème_forfaitaire(distance_km)   // ou (km × 2) × 2,50 si > 180 km
            × (2 si aller_retour sinon 1)
            × coeff_saisonnalité
            × coeff_urgence
            × coeff_capacité
            × 1,15                            // marge

total_options = somme(coûts_options)

prix_ht = prix_base + total_options
tva = prix_ht × 0,10
prix_ttc = prix_ht + tva
```

---

## Squelette d'Implémentation TypeScript

```typescript
// project/lib/calculer-devis.ts

interface DevisInput {
  nb_passagers: number;
  date_depart: Date;
  date_demande: Date;
  distance_km: number;
  aller_retour: boolean;
  options: Array<'guide' | 'chauffeur_nuit' | 'peages'>;
  peages_flat_rate?: number;  // récupéré en BDD si option péages sélectionnée
}

interface DevisLine {
  libelle: string;
  montant: number;
}

interface DevisOutput {
  prix_ht: number;
  tva: number;
  prix_ttc: number;
  lignes: DevisLine[];
  coefficients: Array<{ name: string; value: number }>;
  devise: 'EUR';
  manual_required: boolean;  // true si nb_passagers > 85
}

// Barème forfaitaire (jusqu'à 180 km)
const FLAT_RATE_TABLE: [number, number][] = [
  [10, 250], [20, 250], [30, 250], [40, 320], [50, 350],
  [60, 390], [70, 430], [80, 500], [90, 540], [100, 580],
  [110, 620], [120, 660], [130, 700], [140, 740], [150, 780],
  [160, 820], [170, 860], [180, 900],
];

function getBasePrice(distance_km: number): number {
  if (distance_km <= 180) {
    // Trouver le palier le plus proche (arrondi au supérieur)
    const entry = FLAT_RATE_TABLE.find(([km]) => km >= distance_km);
    if (entry) return entry[1];
    return 900; // forfait maximum
  }
  // Au-delà de 180 km
  return (distance_km * 2) * 2.50;
}

function getSeasonalityCoeff(date: Date): number {
  const month = date.getMonth() + 1; // 1-12
  if ([11, 1, 2, 8].includes(month)) return 0.93;  // Basse
  if ([12, 10, 9].includes(month)) return 1.00;    // Moyenne
  if ([3, 4, 7].includes(month)) return 1.10;      // Haute
  if ([5, 6].includes(month)) return 1.15;          // Très Haute
  return 1.00;
}

function getUrgencyCoeff(date_demande: Date, date_depart: Date): number {
  const gapDays = Math.floor((date_depart.getTime() - date_demande.getTime()) / (1000 * 60 * 60 * 24));
  if (gapDays < 1) return 1.10;    // DD_PRIORITAIRE
  if (gapDays <= 3) return 1.05;   // DD_URGENT
  if (gapDays <= 90) return 0.95;  // DD_NORMAL
  return 0.90;                      // DD_3MOISETPLUS
}

function getCapacityCoeff(nb_passagers: number): number | null {
  if (nb_passagers > 85) return null; // signal de routage manuel
  if (nb_passagers <= 19) return 0.95;
  if (nb_passagers <= 53) return 1.00;
  if (nb_passagers <= 63) return 1.15;
  if (nb_passagers <= 67) return 1.20;
  return 1.40; // 68-85
}

export function calculer_devis(input: DevisInput): DevisOutput {
  const capacityCoeff = getCapacityCoeff(input.nb_passagers);
  
  // >85 passagers → traitement manuel
  if (capacityCoeff === null) {
    return {
      prix_ht: 0, tva: 0, prix_ttc: 0,
      lignes: [], coefficients: [],
      devise: 'EUR', manual_required: true,
    };
  }

  const lignes: DevisLine[] = [];
  const coefficients = [];

  // Étape 1 : Prix de base
  let base = getBasePrice(input.distance_km);
  lignes.push({ libelle: `Transport ${input.distance_km}km (${input.aller_retour ? 'aller-retour' : 'aller simple'})`, montant: base });

  // Étape 2 : Aller-retour
  if (input.aller_retour) {
    base *= 2;
  }

  // Étape 3 : Coefficients
  const seasonCoeff = getSeasonalityCoeff(input.date_depart);
  const urgencyCoeff = getUrgencyCoeff(input.date_demande, input.date_depart);

  coefficients.push({ name: 'saisonnalité', value: seasonCoeff });
  coefficients.push({ name: 'urgence', value: urgencyCoeff });
  coefficients.push({ name: 'capacité', value: capacityCoeff });
  coefficients.push({ name: 'marge', value: 1.15 });

  let prix_ht = base * seasonCoeff * urgencyCoeff * capacityCoeff * 1.15;

  // Étape 4 : Options
  if (input.options.includes('guide')) {
    prix_ht += 80; // par jour — l'appelant doit multiplier par nb_jours
    lignes.push({ libelle: 'Guide/accompagnateur', montant: 80 });
  }
  if (input.options.includes('chauffeur_nuit')) {
    prix_ht += 120; // par nuit — l'appelant doit multiplier par nb_nuits
    lignes.push({ libelle: 'Hébergement chauffeur nuit', montant: 120 });
  }
  if (input.options.includes('peages') && input.peages_flat_rate) {
    prix_ht += input.peages_flat_rate;
    lignes.push({ libelle: 'Péages (forfait route)', montant: input.peages_flat_rate });
  }

  // Étape 5 : TVA
  const tva = prix_ht * 0.10;
  const prix_ttc = prix_ht + tva;

  return {
    prix_ht: Math.round(prix_ht * 100) / 100,
    tva: Math.round(tva * 100) / 100,
    prix_ttc: Math.round(prix_ttc * 100) / 100,
    lignes,
    coefficients,
    devise: 'EUR',
    manual_required: false,
  };
}
```

---

## Cas de Tests Unitaires

Écrire ces tests EN PREMIER, avant de connecter quoi que ce soit à l'IA.

```typescript
// project/lib/__tests__/calculer-devis.test.ts

import { calculer_devis } from '../calculer-devis';

describe('calculer_devis()', () => {
  const BASE_INPUT = {
    date_depart: new Date('2026-10-15'),  // Octobre = saison Moyenne (×1,00)
    date_demande: new Date('2026-07-15'), // 92 jours avant → DD_3MOISETPLUS (×0,90)
    aller_retour: false,
    options: [],
  };

  test('50 km, 30 passagers, aller simple, saison moyenne, >3 mois = base × coefficients', () => {
    const result = calculer_devis({ ...BASE_INPUT, distance_km: 50, nb_passagers: 30 });
    // base = 350, saison 1,00, urgence 0,90, capacité 1,00, marge 1,15
    // 350 × 1,00 × 0,90 × 1,00 × 1,15 = 362,25
    expect(result.manual_required).toBe(false);
    expect(result.prix_ht).toBeCloseTo(362.25, 1);
    expect(result.tva).toBeCloseTo(36.23, 1);
    expect(result.prix_ttc).toBeCloseTo(398.48, 1);
  });

  test("l'aller-retour double le prix de base", () => {
    const one_way = calculer_devis({ ...BASE_INPUT, distance_km: 100, nb_passagers: 30, aller_retour: false });
    const round_trip = calculer_devis({ ...BASE_INPUT, distance_km: 100, nb_passagers: 30, aller_retour: true });
    expect(round_trip.prix_ht).toBeCloseTo(one_way.prix_ht * 2, 1);
  });

  test('>85 passagers retourne manual_required: true', () => {
    const result = calculer_devis({ ...BASE_INPUT, distance_km: 100, nb_passagers: 100 });
    expect(result.manual_required).toBe(true);
    expect(result.prix_ttc).toBe(0);
  });

  test('200 km utilise la formule (km×2)×2,50', () => {
    const result = calculer_devis({ ...BASE_INPUT, distance_km: 200, nb_passagers: 30 });
    // base = (200×2)×2,50 = 1000, ×0,90×1,00×1,15 = 1035
    expect(result.prix_ht).toBeCloseTo(1035, 0);
  });

  test('saison Très Haute (juin) applique +15%', () => {
    const june_input = { ...BASE_INPUT, date_depart: new Date('2026-06-15'), date_demande: new Date('2026-01-01') };
    const result = calculer_devis({ ...june_input, distance_km: 50, nb_passagers: 30 });
    // 350 × 1,15 (saison) × 0,90 (urgence) × 1,00 × 1,15 (marge)
    expect(result.prix_ht).toBeCloseTo(416.99, 0);
  });

  test('≤19 passagers applique le coefficient capacité -5%', () => {
    const result = calculer_devis({ ...BASE_INPUT, distance_km: 50, nb_passagers: 15 });
    const result_20 = calculer_devis({ ...BASE_INPUT, distance_km: 50, nb_passagers: 20 });
    // ≤19 obtient ×0,95 vs 20-53 obtient ×1,00
    expect(result.prix_ht).toBeLessThan(result_20.prix_ht);
  });
});
```

---

## Schéma de la Table Matrices (Base de Données)

Stocker ces données pour que le client puisse les modifier sans toucher au code :

```sql
-- Supabase / PostgreSQL
CREATE TABLE matrices_saisonnalite (
  id SERIAL PRIMARY KEY,
  mois INTEGER NOT NULL,           -- 1-12
  libelle TEXT NOT NULL,           -- 'Basse', 'Moyenne', 'Haute', 'Très Haute'
  coefficient DECIMAL(4,3) NOT NULL -- 0.930, 1.000, 1.100, 1.150
);

CREATE TABLE matrices_urgence (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL,              -- 'DD_PRIORITAIRE', 'DD_URGENT', etc.
  gap_jours_min INTEGER,           -- null = pas de borne inférieure
  gap_jours_max INTEGER,           -- null = pas de borne supérieure
  coefficient DECIMAL(4,3) NOT NULL
);

CREATE TABLE matrices_capacite (
  id SERIAL PRIMARY KEY,
  pax_min INTEGER NOT NULL,
  pax_max INTEGER,                 -- null = >85 (manuel)
  coefficient DECIMAL(4,3),        -- null = routage manuel
  is_manual BOOLEAN DEFAULT FALSE
);

CREATE TABLE matrices_options (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL,              -- 'guide', 'chauffeur_nuit', 'peages_[route]'
  libelle TEXT NOT NULL,
  montant DECIMAL(10,2) NOT NULL,
  unite TEXT NOT NULL              -- 'par_jour', 'par_nuit', 'forfait'
);
```

Pour Airtable : créer une table par type de matrice (Saisonnalité, Urgence, Capacité, Options) avec les mêmes champs.

---

*Source : Document officiel des règles de tarification NeoTravel | Dernière vérification : 22 juin 2026*
