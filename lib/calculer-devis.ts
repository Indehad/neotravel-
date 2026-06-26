/**
 * calculer_devis() — Moteur de tarification NeoTravel
 *
 * RÈGLE D'OR : Ce fichier ne contient aucun appel LLM, aucun appel réseau.
 * C'est du code déterministe pur. Même input → même output, garanti.
 *
 * Source : project/PRICING_ENGINE.md (document officiel NeoTravel)
 *
 * RÈGLE 8 : Les coefficients peuvent être surchargés via le paramètre `matrices`
 * (alimenté depuis Airtable par l'API route). Si non fourni, les valeurs codées
 * en dur servent de fallback (pour les tests unitaires sans connexion réseau).
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Matrices de coefficients externes — lues depuis Airtable Matrice_Saison,
 * Matrice_Urgence, Matrice_Capacite, Matrice_Options et Parametres_Globaux.
 * Tous les champs sont optionnels : si absent, le fallback codé en dur s'applique.
 */
export interface ExternalMatrices {
  /** Coefficient par mois (1=Janvier … 12=Décembre) */
  saison?: Array<{ mois: number; coefficient: number }>;
  /** Tranches d'urgence en heures */
  urgence?: Array<{ min_h: number; max_h: number; coefficient: number; code: string }>;
  /** Tranches de capacité en nb passagers */
  capacite?: Array<{ pax_min: number; pax_max: number; coefficient: number }>;
  /** Prix HT des options fixes */
  options?: {
    guide?: number;           // défaut 80
    chauffeur_nuit?: number;  // défaut 120
  };
  /** Coefficient de marge (ex. 1.15 pour +15%) — défaut 1.15 */
  marge?: number;
}

export interface DevisInput {
  nb_passagers: number;
  date_depart: string; // ISO 8601 — ex. "2026-08-15"
  date_demande: string; // ISO 8601 — ex. "2026-06-26"
  distance_km: number;
  aller_retour: boolean;
  options: Array<'guide' | 'chauffeur_nuit' | 'peages'>;
  peages_flat_rate?: number; // €HT forfait péages, requis si options inclut 'peages'
}

export interface DevisLine {
  libelle: string;
  montant: number;
}

export interface DevisOutput {
  prix_ht: number;
  tva: number;
  prix_ttc: number;
  lignes: DevisLine[];
  coefficients: Array<{ name: string; value: number }>;
  devise: 'EUR';
  manual_required: boolean; // true si nb_passagers > 85 → Cas Complexe
}

// ---------------------------------------------------------------------------
// Barème forfaitaire ≤ 180 km
// Palier supérieur utilisé pour les distances entre deux seuils.
// ---------------------------------------------------------------------------

const FLAT_RATE_TABLE: [number, number][] = [
  [10, 250],
  [20, 250],
  [30, 250],
  [40, 320],
  [50, 350],
  [60, 390],
  [70, 430],
  [80, 500],
  [90, 540],
  [100, 580],
  [110, 620],
  [120, 660],
  [130, 700],
  [140, 740],
  [150, 780],
  [160, 820],
  [170, 860],
  [180, 900],
];

function getBasePrice(distance_km: number): number {
  if (distance_km <= 180) {
    const entry = FLAT_RATE_TABLE.find(([km]) => km >= distance_km);
    return entry ? entry[1] : 900;
  }
  // > 180 km : formule directe
  return distance_km * 2 * 2.5;
}

// ---------------------------------------------------------------------------
// Coefficient 1 — Saisonnalité (mois du date_depart)
// Fallback codé en dur si matrices.saison non fourni :
//   Basse : nov/jan/fév/août → ×0.93
//   Moyenne : déc/oct/sep → ×1.00
//   Haute : mar/avr/juil → ×1.10
//   Très Haute : mai/jun → ×1.15
// ---------------------------------------------------------------------------

function getSeasonalityCoeff(
  dateDepart: Date,
  saison?: ExternalMatrices['saison'],
): number {
  const month = dateDepart.getMonth() + 1; // 1–12

  // Matrice externe Airtable (Règle 8)
  if (saison && saison.length > 0) {
    const entry = saison.find((s) => s.mois === month);
    return entry ? entry.coefficient : 1.0;
  }

  // Fallback déterministe (tests unitaires sans DB)
  if ([11, 1, 2, 8].includes(month)) return 0.93; // Basse
  if ([12, 10, 9].includes(month)) return 1.0;    // Moyenne
  if ([3, 4, 7].includes(month)) return 1.1;       // Haute
  if ([5, 6].includes(month)) return 1.15;          // Très Haute
  return 1.0;
}

// ---------------------------------------------------------------------------
// Coefficient 2 — Urgence (écart en heures entre date_demande et date_depart)
// Fallback codé en dur si matrices.urgence non fourni :
//   DD_PRIORITAIRE : < 24 h → ×1.10
//   DD_URGENT      : 24–72 h → ×1.05
//   DD_NORMAL      : 72 h–2160 h (90 j) → ×0.95
//   DD_3MOISETPLUS : > 2160 h → ×0.90
// ---------------------------------------------------------------------------

function getUrgencyCoeff(
  dateDemande: Date,
  dateDepart: Date,
  urgence?: ExternalMatrices['urgence'],
): { coeff: number; code: string } {
  const gapMs = dateDepart.getTime() - dateDemande.getTime();
  const gapH = gapMs / (1000 * 60 * 60);

  // Matrice externe Airtable (Règle 8) — triée par min_h croissant
  if (urgence && urgence.length > 0) {
    const sorted = [...urgence].sort((a, b) => a.min_h - b.min_h);
    for (const row of sorted) {
      if (gapH >= row.min_h && gapH < row.max_h) {
        return { coeff: row.coefficient, code: row.code };
      }
    }
    // Dernière tranche (max_h peut être Infinity / 999999)
    const last = sorted[sorted.length - 1];
    if (gapH >= last.min_h) return { coeff: last.coefficient, code: last.code };
  }

  // Fallback déterministe
  if (gapH < 24) return { coeff: 1.1, code: 'DD_PRIORITAIRE' };
  if (gapH < 72) return { coeff: 1.05, code: 'DD_URGENT' };
  if (gapH <= 2160) return { coeff: 0.95, code: 'DD_NORMAL' };
  return { coeff: 0.9, code: 'DD_3MOISETPLUS' };
}

// ---------------------------------------------------------------------------
// Coefficient 3 — Capacité (nb_passagers)
// Fallback codé en dur si matrices.capacite non fourni :
//   ≤ 19 → ×0.95 | 20–53 → ×1.00 | 54–63 → ×1.15
//   64–67 → ×1.20 | 68–85 → ×1.40 | > 85 → null (Cas Complexe)
// ---------------------------------------------------------------------------

function getCapacityCoeff(
  nb_passagers: number,
  capacite?: ExternalMatrices['capacite'],
): number | null {
  if (nb_passagers > 85) return null; // HITL — toujours prioritaire, quelle que soit la DB

  // Matrice externe Airtable (Règle 8)
  if (capacite && capacite.length > 0) {
    const sorted = [...capacite].sort((a, b) => a.pax_min - b.pax_min);
    for (const row of sorted) {
      if (nb_passagers >= row.pax_min && nb_passagers <= row.pax_max) {
        return row.coefficient;
      }
    }
  }

  // Fallback déterministe
  if (nb_passagers <= 19) return 0.95;
  if (nb_passagers <= 53) return 1.0;
  if (nb_passagers <= 63) return 1.15;
  if (nb_passagers <= 67) return 1.2;
  return 1.4; // 68–85
}

// ---------------------------------------------------------------------------
// Fonction principale
// ---------------------------------------------------------------------------

export function calculer_devis(input: DevisInput, matrices?: ExternalMatrices): DevisOutput {
  const dateDepart = new Date(input.date_depart);
  const dateDemande = new Date(input.date_demande);

  // Résolution des paramètres configurables (DB > défauts)
  const guidePrix = matrices?.options?.guide ?? 80;
  const chauffeurNuitPrix = matrices?.options?.chauffeur_nuit ?? 120;
  const margeCoeff = matrices?.marge ?? 1.15;

  // Coefficient capacité d'abord — si null, stop immédiat
  const capacityCoeff = getCapacityCoeff(input.nb_passagers, matrices?.capacite);
  if (capacityCoeff === null) {
    return {
      prix_ht: 0,
      tva: 0,
      prix_ttc: 0,
      lignes: [],
      coefficients: [],
      devise: 'EUR',
      manual_required: true,
    };
  }

  const lignes: DevisLine[] = [];
  const coefficients: Array<{ name: string; value: number }> = [];

  // Étape 1 : Prix de base (barème ou formule >180 km)
  const base = getBasePrice(input.distance_km);
  lignes.push({
    libelle: `Transport ${input.distance_km} km (${input.aller_retour ? 'aller-retour' : 'aller simple'})`,
    montant: input.aller_retour ? base * 2 : base,
  });

  // Étape 2 : Aller-retour — double le prix de base AVANT les coefficients
  const prixBase = input.aller_retour ? base * 2 : base;

  // Étape 3 : Coefficients multiplicatifs
  const seasonCoeff = getSeasonalityCoeff(dateDepart, matrices?.saison);
  const { coeff: urgencyCoeff, code: urgencyCode } = getUrgencyCoeff(dateDemande, dateDepart, matrices?.urgence);

  coefficients.push({ name: 'saisonnalité', value: seasonCoeff });
  coefficients.push({ name: `urgence (${urgencyCode})`, value: urgencyCoeff });
  coefficients.push({ name: 'capacité', value: capacityCoeff });
  coefficients.push({ name: 'marge', value: margeCoeff });

  const prixAvecCoefficients = prixBase * seasonCoeff * urgencyCoeff * capacityCoeff;

  // Étape 4 : Options — coûts fixes ajoutés AVANT la marge
  let totalOptions = 0;

  if (input.options.includes('guide')) {
    totalOptions += guidePrix;
    lignes.push({ libelle: 'Guide / accompagnateur (×1 jour)', montant: guidePrix });
  }

  if (input.options.includes('chauffeur_nuit')) {
    totalOptions += chauffeurNuitPrix;
    lignes.push({ libelle: 'Hébergement chauffeur nuit (×1 nuit)', montant: chauffeurNuitPrix });
  }

  if (input.options.includes('peages')) {
    const montant = input.peages_flat_rate ?? 0;
    totalOptions += montant;
    lignes.push({ libelle: 'Péages (forfait route)', montant });
  }

  // Étape 5 : Marge sur le SOUS-TOTAL COMPLET (coefficients + options)
  // margeCoeff vient de la DB (Parametres_Globaux) ou défaut 1.15
  const sousTotal = prixAvecCoefficients + totalOptions;
  const prix_ht = sousTotal * margeCoeff;

  // Étape 6 : TVA 10%
  const tva = prix_ht * 0.1;
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
