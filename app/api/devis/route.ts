/**
 * POST /api/devis
 *
 * Calcule un devis en temps réel et le sauvegarde dans Airtable :
 *   1. Charge les matrices tarifaires depuis Airtable
 *   2. Appelle calculer_devis() — moteur déterministe, zéro IA
 *   3. Sauvegarde le devis calculé dans la table Airtable "Devis"
 *   4. Retourne le devis structuré
 *
 * Règle absolue : aucune IA ne calcule les prix.
 * Même input → même output, garanti.
 *
 * Auteur : Inde Hadoui
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculer_devis, type DevisInput } from '@/lib/calculer-devis';
import { fetchMatrices, saveDevis } from '@/lib/airtable';

// ── Validation du body ────────────────────────────────────────────────────────

function validateBody(body: unknown): body is DevisInput & { lead_record_id?: string } {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;

  if (typeof b.nb_passagers !== 'number' || b.nb_passagers < 1) return false;
  if (typeof b.distance_km !== 'number' || b.distance_km <= 0) return false;
  if (typeof b.date_depart !== 'string' || !b.date_depart) return false;
  if (typeof b.date_demande !== 'string' || !b.date_demande) return false;
  if (typeof b.aller_retour !== 'boolean') return false;
  if (!Array.isArray(b.options)) return false;

  // Limite NeoTravel : 8–85 passagers
  if (b.nb_passagers < 8) return false;

  return true;
}

// ── Handler principal ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Parsing
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Corps de requête invalide (JSON attendu).' },
      { status: 400 }
    );
  }

  // 2. Validation
  if (!validateBody(body)) {
    return NextResponse.json(
      {
        error: 'Paramètres manquants ou invalides.',
        requis: [
          'nb_passagers (number, 8–85)',
          'distance_km (number, > 0)',
          'date_depart (string ISO 8601)',
          'date_demande (string ISO 8601)',
          'aller_retour (boolean)',
          'options (array)',
        ],
      },
      { status: 422 }
    );
  }

  const { lead_record_id, ...input } = body as DevisInput & { lead_record_id?: string };

  // 3. Escalade immédiate si > 85 passagers (HITL)
  if (input.nb_passagers > 85) {
    return NextResponse.json(
      {
        manual_required: true,
        message: 'Groupe de plus de 85 personnes : demande transmise à un conseiller spécialisé.',
      },
      { status: 200 }
    );
  }

  // 4. Matrices Airtable (fallback silencieux si DB indisponible)
  let matrices;
  try {
    matrices = await fetchMatrices();
  } catch (err) {
    console.warn('[/api/devis] Airtable matrices indisponibles — fallback codé en dur :', err);
    matrices = undefined;
  }

  // 5. Calcul déterministe
  const devis = calculer_devis(input, matrices);

  // 6. Sauvegarde dans Airtable (si un lead_record_id est fourni)
  let devis_record_id: string | undefined;
  if (lead_record_id && !devis.manual_required) {
    try {
      devis_record_id = await saveDevis({
        lead_record_id,
        prix_ht:       devis.prix_ht,
        tva:           devis.tva,
        prix_ttc:      devis.prix_ttc,
        lignes_calcul: JSON.stringify(devis.lignes),
        coefficients:  JSON.stringify(devis.coefficients),
      });
    } catch (err) {
      // Non bloquant : le devis est retourné même si la sauvegarde échoue
      console.warn('[/api/devis] Impossible de sauvegarder le devis dans Airtable :', err);
    }
  }

  // 7. Réponse
  return NextResponse.json(
    { ...devis, devis_record_id },
    { status: 200 }
  );
}

// ── GET — documentation de l'endpoint ─────────────────────────────────────────

export async function GET() {
  return NextResponse.json(
    {
      endpoint: 'POST /api/devis',
      description: 'Calcul de devis NeoTravel (8–85 passagers) + sauvegarde Airtable',
      exemple: {
        nb_passagers: 40,
        distance_km: 120,
        date_depart: '2026-08-15',
        date_demande: new Date().toISOString().split('T')[0],
        aller_retour: true,
        options: ['guide'],
        peages_flat_rate: 35,
        lead_record_id: 'recXXXXXXXXXXXXXX', // optionnel — sauvegarde dans Airtable si fourni
      },
    },
    { status: 200 }
  );
}
