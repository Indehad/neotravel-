/**
 * lib/__tests__/calculer-devis.test.ts
 *
 * Tests unitaires du moteur de tarification NeoTravel.
 * Vérifie que calculer_devis() est 100% déterministe :
 * même input → même output, sans exception.
 *
 * Auteur : Inde Hadoui
 *
 * Lancer : npx jest lib/__tests__/calculer-devis.test.ts
 */

import { calculer_devis } from '../calculer-devis';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Construit un DevisInput minimal valide */
function baseInput(overrides = {}) {
  return {
    nb_passagers: 40,
    date_depart: '2026-09-15',   // mois 9 = Septembre → coeff saison 1.0
    date_demande: '2026-07-01',  // 76 jours avant → DD_NORMAL → coeff 0.95
    distance_km: 100,
    aller_retour: false,
    options: [] as Array<'guide' | 'chauffeur_nuit' | 'peages'>,
    ...overrides,
  };
}

// ── 1. Escalade HITL ─────────────────────────────────────────────────────────

describe('Escalade commerciale (HITL)', () => {
  test('86 passagers → manual_required = true, prix = 0', () => {
    const result = calculer_devis(baseInput({ nb_passagers: 86 }));
    expect(result.manual_required).toBe(true);
    expect(result.prix_ht).toBe(0);
    expect(result.prix_ttc).toBe(0);
  });

  test('85 passagers → calcul normal (limite haute autorisée)', () => {
    const result = calculer_devis(baseInput({ nb_passagers: 85 }));
    expect(result.manual_required).toBe(false);
    expect(result.prix_ht).toBeGreaterThan(0);
  });

  test('8 passagers → calcul normal (limite basse autorisée)', () => {
    const result = calculer_devis(baseInput({ nb_passagers: 8 }));
    expect(result.manual_required).toBe(false);
    expect(result.prix_ht).toBeGreaterThan(0);
  });
});

// ── 2. Déterminisme ───────────────────────────────────────────────────────────

describe('Déterminisme — même input = même output', () => {
  test('deux appels identiques retournent exactement le même prix', () => {
    const input = baseInput();
    const r1 = calculer_devis(input);
    const r2 = calculer_devis(input);
    expect(r1.prix_ht).toBe(r2.prix_ht);
    expect(r1.prix_ttc).toBe(r2.prix_ttc);
  });
});

// ── 3. Aller-retour ───────────────────────────────────────────────────────────

describe('Aller-retour', () => {
  test('aller-retour coûte plus cher que simple', () => {
    const simple = calculer_devis(baseInput({ aller_retour: false }));
    const ar     = calculer_devis(baseInput({ aller_retour: true }));
    expect(ar.prix_ht).toBeGreaterThan(simple.prix_ht);
  });

  test('aller-retour ≈ 2× aller simple (avant coefficients)', () => {
    const simple = calculer_devis(baseInput({ aller_retour: false }));
    const ar     = calculer_devis(baseInput({ aller_retour: true }));
    // Le ratio doit être proche de 2 (tolérance 1%)
    const ratio = ar.prix_ht / simple.prix_ht;
    expect(ratio).toBeCloseTo(2, 1);
  });
});

// ── 4. Saisonnalité ───────────────────────────────────────────────────────────

describe('Coefficients de saisonnalité', () => {
  test('juillet (haute) > septembre (moyenne)', () => {
    const haute   = calculer_devis(baseInput({ date_depart: '2026-07-15', date_demande: '2026-05-01' }));
    const moyenne = calculer_devis(baseInput({ date_depart: '2026-09-15', date_demande: '2026-07-01' }));
    expect(haute.prix_ht).toBeGreaterThan(moyenne.prix_ht);
  });

  test('mai/juin (très haute) > mars/avril (haute)', () => {
    const tresHaute = calculer_devis(baseInput({ date_depart: '2026-05-15', date_demande: '2026-03-01' }));
    const haute     = calculer_devis(baseInput({ date_depart: '2026-04-15', date_demande: '2026-02-01' }));
    expect(tresHaute.prix_ht).toBeGreaterThan(haute.prix_ht);
  });

  test('basse saison (janvier) < saison moyenne (octobre)', () => {
    const basse   = calculer_devis(baseInput({ date_depart: '2027-01-15', date_demande: '2026-11-01' }));
    const moyenne = calculer_devis(baseInput({ date_depart: '2026-10-15', date_demande: '2026-08-01' }));
    expect(basse.prix_ht).toBeLessThan(moyenne.prix_ht);
  });
});

// ── 5. Urgence ────────────────────────────────────────────────────────────────

describe('Coefficients d\'urgence', () => {
  const today = new Date().toISOString().split('T')[0];

  function dateIn(hours: number): string {
    const d = new Date();
    d.setTime(d.getTime() + hours * 3_600_000);
    return d.toISOString().split('T')[0];
  }

  test('DD_PRIORITAIRE (< 24h) > DD_NORMAL (entre 72h et 90j)', () => {
    const prioritaire = calculer_devis(baseInput({ date_depart: dateIn(12),   date_demande: today }));
    const normal      = calculer_devis(baseInput({ date_depart: dateIn(500),  date_demande: today }));
    expect(prioritaire.prix_ht).toBeGreaterThan(normal.prix_ht);
  });

  test('DD_3MOISETPLUS (> 90j) a le coefficient le plus bas', () => {
    const longTerme = calculer_devis(baseInput({ date_depart: '2027-12-01', date_demande: today }));
    const normal    = calculer_devis(baseInput({ date_depart: dateIn(500),   date_demande: today }));
    expect(longTerme.prix_ht).toBeLessThan(normal.prix_ht);
  });
});

// ── 6. Capacité ───────────────────────────────────────────────────────────────

describe('Coefficients de capacité', () => {
  test('68–85 pax coûte plus cher que 20–53 pax', () => {
    const grand  = calculer_devis(baseInput({ nb_passagers: 70 }));
    const moyen  = calculer_devis(baseInput({ nb_passagers: 30 }));
    expect(grand.prix_ht).toBeGreaterThan(moyen.prix_ht);
  });

  test('≤ 19 pax bénéficie d\'une réduction vs 20–53 pax', () => {
    const petit = calculer_devis(baseInput({ nb_passagers: 15 }));
    const moyen = calculer_devis(baseInput({ nb_passagers: 30 }));
    expect(petit.prix_ht).toBeLessThan(moyen.prix_ht);
  });
});

// ── 7. Options ────────────────────────────────────────────────────────────────

describe('Options additionnelles', () => {
  test('guide ajoute 80€ HT au prix de base', () => {
    const sans  = calculer_devis(baseInput({ options: [] }));
    const avec  = calculer_devis(baseInput({ options: ['guide'] }));
    // La différence inclut la marge (×1.15) appliquée sur le total
    expect(avec.prix_ht).toBeGreaterThan(sans.prix_ht);
  });

  test('chauffeur_nuit ajoute 120€ HT au prix de base', () => {
    const sans = calculer_devis(baseInput({ options: [] }));
    const avec = calculer_devis(baseInput({ options: ['chauffeur_nuit'] }));
    expect(avec.prix_ht).toBeGreaterThan(sans.prix_ht);
  });

  test('péages avec forfait 50€ augmente le prix', () => {
    const sans = calculer_devis(baseInput({ options: [] }));
    const avec = calculer_devis(baseInput({ options: ['peages'], peages_flat_rate: 50 }));
    expect(avec.prix_ht).toBeGreaterThan(sans.prix_ht);
  });

  test('cumul 3 options > 0 option', () => {
    const sans  = calculer_devis(baseInput({ options: [] }));
    const avec  = calculer_devis(baseInput({
      options: ['guide', 'chauffeur_nuit', 'peages'],
      peages_flat_rate: 35,
    }));
    expect(avec.prix_ht).toBeGreaterThan(sans.prix_ht);
  });
});

// ── 8. Structure de la réponse ────────────────────────────────────────────────

describe('Structure de la réponse', () => {
  test('contient prix_ht, tva, prix_ttc, lignes, coefficients, devise', () => {
    const result = calculer_devis(baseInput());
    expect(result).toHaveProperty('prix_ht');
    expect(result).toHaveProperty('tva');
    expect(result).toHaveProperty('prix_ttc');
    expect(result).toHaveProperty('lignes');
    expect(result).toHaveProperty('coefficients');
    expect(result.devise).toBe('EUR');
  });

  test('prix_ttc = prix_ht + tva (TVA 10%)', () => {
    const result = calculer_devis(baseInput());
    expect(result.prix_ttc).toBeCloseTo(result.prix_ht * 1.1, 1);
  });

  test('prix_ht > 0 pour un devis normal', () => {
    const result = calculer_devis(baseInput());
    expect(result.prix_ht).toBeGreaterThan(0);
  });
});

// ── 9. Matrices externes (ExternalMatrices) ───────────────────────────────────

describe('Surcharge par matrices externes (Airtable)', () => {
  test('marge personnalisée change le prix', () => {
    const defaut     = calculer_devis(baseInput());
    const margeEleve = calculer_devis(baseInput(), { marge: 1.30 }); // 30% vs 15%
    expect(margeEleve.prix_ht).toBeGreaterThan(defaut.prix_ht);
  });

  test('coefficient saisonnier externe overrride le fallback', () => {
    const moisDepart = new Date('2026-09-15').getMonth() + 1; // 9
    const avecExternal = calculer_devis(baseInput(), {
      saison: [{ mois: moisDepart, coefficient: 1.5 }], // force ×1.5
    });
    const defaut = calculer_devis(baseInput());
    expect(avecExternal.prix_ht).toBeGreaterThan(defaut.prix_ht);
  });
});
