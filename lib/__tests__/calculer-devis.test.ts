/**
 * Tests unitaires pour calculer_devis()
 * Source des cas de test : project/PRICING_ENGINE.md
 *
 * Lancer : npx jest lib/__tests__/calculer-devis.test.ts
 */

import { calculer_devis } from '../calculer-devis';

// Input de base réutilisé dans plusieurs tests
// Octobre = saison Moyenne (×1.00)
// 92 jours avant départ = DD_3MOISETPLUS (×0.90)
const BASE_INPUT = {
  date_depart: '2026-10-15',
  date_demande: '2026-07-15',
  aller_retour: false,
  options: [] as ('guide' | 'chauffeur_nuit' | 'peages')[],
};

describe('calculer_devis()', () => {
  // -------------------------------------------------------------------------
  // Test 1 — Cas nominal : 50 km, 30 pax, aller simple, saison moyenne, >3 mois
  // base=350 × saison1.00 × urgence0.90 × capa1.00 × marge1.15 = 362.25
  // -------------------------------------------------------------------------
  test('50 km, 30 pax, aller simple, saison moyenne, >3 mois', () => {
    const result = calculer_devis({ ...BASE_INPUT, distance_km: 50, nb_passagers: 30 });

    expect(result.manual_required).toBe(false);
    expect(result.devise).toBe('EUR');
    expect(result.prix_ht).toBeCloseTo(362.25, 1);
    expect(result.tva).toBeCloseTo(36.23, 1);
    expect(result.prix_ttc).toBeCloseTo(398.48, 1);
  });

  // -------------------------------------------------------------------------
  // Test 2 — Aller-retour double le prix de base
  // -------------------------------------------------------------------------
  test("aller-retour double le prix de base", () => {
    const oneWay = calculer_devis({ ...BASE_INPUT, distance_km: 100, nb_passagers: 30, aller_retour: false });
    const roundTrip = calculer_devis({ ...BASE_INPUT, distance_km: 100, nb_passagers: 30, aller_retour: true });

    expect(roundTrip.prix_ht).toBeCloseTo(oneWay.prix_ht * 2, 1);
    expect(roundTrip.prix_ttc).toBeCloseTo(oneWay.prix_ttc * 2, 1);
  });

  // -------------------------------------------------------------------------
  // Test 3 — >85 passagers → manual_required: true, prix = 0
  // -------------------------------------------------------------------------
  test('>85 passagers retourne manual_required: true', () => {
    const result = calculer_devis({ ...BASE_INPUT, distance_km: 100, nb_passagers: 86 });

    expect(result.manual_required).toBe(true);
    expect(result.prix_ht).toBe(0);
    expect(result.prix_ttc).toBe(0);
    expect(result.lignes).toHaveLength(0);
  });

  // -------------------------------------------------------------------------
  // Test 4 — >180 km utilise la formule (km × 2) × 2.50
  // 200 km → base = (200×2)×2.50 = 1000
  // ×0.90 (urgence) ×1.00 (capa) ×1.15 (marge) = 1035
  // -------------------------------------------------------------------------
  test('200 km utilise la formule (km×2)×2.50', () => {
    const result = calculer_devis({ ...BASE_INPUT, distance_km: 200, nb_passagers: 30 });

    expect(result.prix_ht).toBeCloseTo(1035, 0);
  });

  // -------------------------------------------------------------------------
  // Test 5 — Saison Très Haute (juin) applique ×1.15
  // 50 km, base=350 × saison1.15 × urgence0.90 × capa1.00 × marge1.15
  // = 350 × 1.15 × 0.90 × 1.15 = 416.99
  // -------------------------------------------------------------------------
  test('saison Très Haute (juin) applique ×1.15', () => {
    const result = calculer_devis({
      ...BASE_INPUT,
      date_depart: '2026-06-15',
      date_demande: '2026-01-01', // >3 mois → DD_3MOISETPLUS ×0.90
      distance_km: 50,
      nb_passagers: 30,
    });

    expect(result.prix_ht).toBeCloseTo(416.99, 0);
  });

  // -------------------------------------------------------------------------
  // Test 6 — Coefficient capacité ≤19 pax applique ×0.95
  // -------------------------------------------------------------------------
  test('≤19 passagers applique le coefficient capacité ×0.95', () => {
    const small = calculer_devis({ ...BASE_INPUT, distance_km: 50, nb_passagers: 15 });
    const medium = calculer_devis({ ...BASE_INPUT, distance_km: 50, nb_passagers: 20 });

    // 15 pax (×0.95) doit être moins cher que 20 pax (×1.00)
    expect(small.prix_ht).toBeLessThan(medium.prix_ht);
  });

  // -------------------------------------------------------------------------
  // Test 7 — Cas limite 85 passagers : doit passer (coeff ×1.40), pas HITL
  // -------------------------------------------------------------------------
  test('85 passagers exactement : pas de HITL, coeff ×1.40', () => {
    const result = calculer_devis({ ...BASE_INPUT, distance_km: 50, nb_passagers: 85 });

    expect(result.manual_required).toBe(false);
    const coeffCapa = result.coefficients.find((c) => c.name === 'capacité');
    expect(coeffCapa?.value).toBe(1.4);
  });

  // -------------------------------------------------------------------------
  // Test 8 — Urgence DD_PRIORITAIRE (<24h) applique ×1.10
  // -------------------------------------------------------------------------
  test('urgence <24h applique DD_PRIORITAIRE ×1.10', () => {
    const urgent = calculer_devis({
      ...BASE_INPUT,
      date_depart: '2026-10-15',
      date_demande: '2026-10-15', // même jour → <24h
      distance_km: 50,
      nb_passagers: 30,
    });
    const normal = calculer_devis({ ...BASE_INPUT, distance_km: 50, nb_passagers: 30 }); // ×0.90

    // Prioritaire (×1.10) doit être plus cher que normal (×0.90)
    expect(urgent.prix_ht).toBeGreaterThan(normal.prix_ht);

    const urgCoeff = urgent.coefficients.find((c) => c.name.startsWith('urgence'));
    expect(urgCoeff?.value).toBe(1.1);
  });

  // -------------------------------------------------------------------------
  // Test 9 — Options ajoutées AVANT la marge
  // 50 km, 30 pax, saison moy, >3 mois + guide(80€) + nuit(120€)
  // base_coeff = 350 × 0.90 × 1.00 = 315
  // sous_total = 315 + 80 + 120 = 515
  // prix_ht = 515 × 1.15 = 592.25
  // -------------------------------------------------------------------------
  test('options guide + nuit chauffeur ajoutées avant la marge', () => {
    const withOptions = calculer_devis({
      ...BASE_INPUT,
      distance_km: 50,
      nb_passagers: 30,
      options: ['guide', 'chauffeur_nuit'],
    });
    const withoutOptions = calculer_devis({ ...BASE_INPUT, distance_km: 50, nb_passagers: 30 });

    // Avec options : +80+120 = +200 AVANT marge → différence de 200×1.15 = 230
    expect(withOptions.prix_ht).toBeCloseTo(withoutOptions.prix_ht + 200 * 1.15, 1);
    expect(withOptions.lignes.length).toBeGreaterThan(withoutOptions.lignes.length);
  });

  // -------------------------------------------------------------------------
  // Test 10 — Cas limite <30 km utilise le palier 30 km → base 250€
  // -------------------------------------------------------------------------
  test('<30 km utilise le palier 30 km (base 250€)', () => {
    const result25 = calculer_devis({ ...BASE_INPUT, distance_km: 25, nb_passagers: 30 });
    const result30 = calculer_devis({ ...BASE_INPUT, distance_km: 30, nb_passagers: 30 });

    // Les deux doivent avoir le même prix (arrondi au palier supérieur)
    expect(result25.prix_ht).toBe(result30.prix_ht);
  });
});
