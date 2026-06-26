/**
 * POST /api/calculer-devis
 *
 * Appelé par n8n WF1 comme outil HTTP Request.
 * Reçoit un DevisInput JSON, retourne un DevisOutput JSON.
 *
 * RÈGLE D'OR : Ce endpoint ne contient aucune logique de prix.
 * Il délègue entièrement à calculer_devis() qui est déterministe.
 *
 * RÈGLE 8 : Les coefficients sont lus depuis Airtable (Matrices tables) avant
 * chaque calcul. Si la lecture échoue, les valeurs codées en dur servent de
 * fallback. Cache 60 s pour limiter les appels Airtable.
 *
 * Exemple de body n8n :
 * {
 *   "nb_passagers": 45,
 *   "date_depart": "2026-08-20",
 *   "date_demande": "2026-06-26",
 *   "distance_km": 120,
 *   "aller_retour": false,
 *   "options": ["guide"],
 *   "peages_flat_rate": 0
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculer_devis, type DevisInput, type ExternalMatrices } from '@/lib/calculer-devis';

// ---------------------------------------------------------------------------
// Secret optionnel pour sécuriser le webhook n8n → API
// ---------------------------------------------------------------------------

const WEBHOOK_SECRET = process.env.CALCULER_DEVIS_SECRET;

// ---------------------------------------------------------------------------
// Lecture des matrices depuis Airtable — cache 60 s
// ---------------------------------------------------------------------------

const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID ?? 'apphcmnoff5FWbIX4';
const AIRTABLE_API  = 'https://api.airtable.com/v0';

// Table IDs (stables — les noms peuvent changer, pas les IDs)
const TABLE_SAISON   = 'tblCbxzPXuZyYUe6x';
const TABLE_URGENCE  = 'tblD7zzVlj9ryOXCk';
const TABLE_CAPACITE = 'tbl2esvrFXZw4scLb';
const TABLE_OPTIONS  = 'tblUg6GETOz04KWj1';
const TABLE_PARAMS   = 'tblzng0gNx54Jl2qR';

// Noms de mois français → numéro (1–12)
const MOIS_FR: Record<string, number> = {
  Janvier: 1, Février: 2, Mars: 3, Avril: 4,
  Mai: 5, Juin: 6, Juillet: 7, Août: 8,
  Septembre: 9, Octobre: 10, Novembre: 11, Décembre: 12,
};

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

async function airtableFetch(tableId: string, apiKey: string): Promise<AirtableRecord[]> {
  const url = `${AIRTABLE_API}/${AIRTABLE_BASE}/${tableId}?pageSize=100`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    // Next.js cache: revalidate every 60 s so Airtable edits take effect quickly
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Airtable ${tableId} → HTTP ${res.status}`);
  const json = await res.json() as { records: AirtableRecord[] };
  return json.records;
}

// Module-level cache (runtime memory — survives across requests in the same process)
let matricesCache: { data: ExternalMatrices; expiry: number } | null = null;

async function fetchMatrices(apiKey: string): Promise<ExternalMatrices> {
  if (matricesCache && Date.now() < matricesCache.expiry) {
    return matricesCache.data;
  }

  // Fetch all tables in parallel
  const [saisonRecs, urgenceRecs, capaciteRecs, optionsRecs, paramsRecs] =
    await Promise.all([
      airtableFetch(TABLE_SAISON, apiKey),
      airtableFetch(TABLE_URGENCE, apiKey),
      airtableFetch(TABLE_CAPACITE, apiKey),
      airtableFetch(TABLE_OPTIONS, apiKey),
      airtableFetch(TABLE_PARAMS, apiKey),
    ]);

  // --- Saison ---
  const saison: ExternalMatrices['saison'] = saisonRecs
    .map((r) => {
      // mois field is a singleSelect object: { name: "Octobre", ... }
      const moisRaw = r.fields['mois'] as { name?: string } | string | undefined;
      const moisName = typeof moisRaw === 'object' ? moisRaw?.name : moisRaw;
      const moisNum = moisName ? (MOIS_FR[moisName] ?? null) : null;
      const coeff = r.fields['coefficient'] as number | undefined;
      if (!moisNum || coeff === undefined) return null;
      return { mois: moisNum, coefficient: coeff };
    })
    .filter((x): x is { mois: number; coefficient: number } => x !== null);

  // --- Urgence ---
  const urgence: ExternalMatrices['urgence'] = urgenceRecs
    .map((r) => {
      const code   = r.fields['delai_label']     as string  | undefined;
      const min_h  = r.fields['delai_min_heures'] as number | undefined;
      const max_h  = r.fields['delai_max_heures'] as number | undefined;
      const coeff  = r.fields['coefficient']      as number | undefined;
      if (!code || min_h === undefined || max_h === undefined || coeff === undefined) return null;
      return { code, min_h, max_h, coefficient: coeff };
    })
    .filter(
      (x): x is { code: string; min_h: number; max_h: number; coefficient: number } => x !== null,
    );

  // --- Capacite ---
  const capacite: ExternalMatrices['capacite'] = capaciteRecs
    .map((r) => {
      const pax_min = r.fields['pax_min']     as number | undefined;
      const pax_max = r.fields['pax_max']     as number | undefined;
      const coeff   = r.fields['coefficient'] as number | undefined;
      if (pax_min === undefined || pax_max === undefined || coeff === undefined) return null;
      return { pax_min, pax_max, coefficient: coeff };
    })
    .filter((x): x is { pax_min: number; pax_max: number; coefficient: number } => x !== null);

  // --- Options (guide, chauffeur_nuit) ---
  const optionsMap: Record<string, number> = {};
  for (const r of optionsRecs) {
    const code   = r.fields['option_code']  as string | undefined;
    const montant = r.fields['montant_fixe'] as number | undefined;
    if (code && montant !== undefined) optionsMap[code] = montant;
  }

  // --- Parametres_Globaux (marge, tva) ---
  let marge: number | undefined;
  for (const r of paramsRecs) {
    const cle   = r.fields['cle']   as string | undefined;
    const valeur = r.fields['valeur'] as string | undefined;
    if (cle === 'marge_pct' && valeur) {
      const parsed = parseFloat(valeur);
      if (!isNaN(parsed)) marge = 1 + parsed / 100; // ex. "15" → 1.15
    }
    if (cle === 'marge' && valeur) {
      const parsed = parseFloat(valeur);
      if (!isNaN(parsed)) marge = parsed; // ex. "1.15" → 1.15
    }
  }

  const matrices: ExternalMatrices = {
    saison:   saison.length   > 0 ? saison   : undefined,
    urgence:  urgence.length  > 0 ? urgence  : undefined,
    capacite: capacite.length > 0 ? capacite : undefined,
    options: {
      guide:          optionsMap['guide']          ?? undefined,
      chauffeur_nuit: optionsMap['chauffeur_nuit'] ?? undefined,
    },
    marge,
  };

  matricesCache = { data: matrices, expiry: Date.now() + 60_000 };
  return matrices;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  // Vérification du secret si configuré
  if (WEBHOOK_SECRET) {
    const authHeader = req.headers.get('x-webhook-secret');
    if (authHeader !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  let body: DevisInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Validation des champs obligatoires
  const required: (keyof DevisInput)[] = [
    'nb_passagers',
    'date_depart',
    'date_demande',
    'distance_km',
    'aller_retour',
    'options',
  ];

  for (const field of required) {
    if (body[field] === undefined || body[field] === null) {
      return NextResponse.json(
        { error: `Champ obligatoire manquant : ${field}` },
        { status: 422 },
      );
    }
  }

  // Validation des types
  if (typeof body.nb_passagers !== 'number' || body.nb_passagers < 1) {
    return NextResponse.json({ error: 'nb_passagers doit être un entier ≥ 1' }, { status: 422 });
  }

  if (typeof body.distance_km !== 'number' || body.distance_km <= 0) {
    return NextResponse.json({ error: 'distance_km doit être un nombre positif' }, { status: 422 });
  }

  if (!Array.isArray(body.options)) {
    return NextResponse.json({ error: 'options doit être un tableau' }, { status: 422 });
  }

  const validOptions = ['guide', 'chauffeur_nuit', 'peages'];
  for (const opt of body.options) {
    if (!validOptions.includes(opt)) {
      return NextResponse.json(
        { error: `Option invalide : "${opt}". Valeurs acceptées : ${validOptions.join(', ')}` },
        { status: 422 },
      );
    }
  }

  if (body.options.includes('peages') && body.peages_flat_rate === undefined) {
    return NextResponse.json(
      { error: 'peages_flat_rate est requis quand options inclut "peages"' },
      { status: 422 },
    );
  }

  // Règle 8 — lire les matrices depuis Airtable, avec fallback gracieux
  let matrices: ExternalMatrices | undefined;
  const apiKey = process.env.AIRTABLE_API_KEY;
  if (apiKey) {
    try {
      matrices = await fetchMatrices(apiKey);
    } catch (err) {
      // Fallback silencieux : on utilise les valeurs codées en dur
      console.warn('[calculer-devis] Airtable matrices fetch failed, using built-in defaults:', err);
    }
  }

  // Calcul déterministe — zéro LLM
  const result = calculer_devis(body, matrices);

  return NextResponse.json(result, { status: 200 });
}
