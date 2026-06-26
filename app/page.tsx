'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ── Types ───────────────────────────────────────────────────────────────────
type Option = 'guide' | 'chauffeur_nuit' | 'peages';

interface FormData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ville_depart: string;
  ville_arrivee: string;
  date_depart: string;
  nb_passagers: string;
  distance_km: string;
  aller_retour: boolean | null;
  options: Option[];
  notes: string;
}

// ── Steps config ─────────────────────────────────────────────────────────────
const TOTAL_STEPS = 12;

const initialData: FormData = {
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  ville_depart: '',
  ville_arrivee: '',
  date_depart: '',
  nb_passagers: '',
  distance_km: '',
  aller_retour: null,
  options: [],
  notes: '',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function validateStep(step: number, data: FormData): string | null {
  switch (step) {
    case 1: return (!data.prenom.trim() || !data.nom.trim()) ? 'Veuillez entrer votre prénom et nom.' : null;
    case 2: return !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? 'Adresse email invalide.' : null;
    case 3: return !data.telephone.match(/^[0-9+\s\-().]{7,20}$/) ? 'Numéro de téléphone invalide.' : null;
    case 4: return !data.ville_depart.trim() ? 'Veuillez indiquer la ville de départ.' : null;
    case 5: return !data.ville_arrivee.trim() ? 'Veuillez indiquer la ville d\'arrivée.' : null;
    case 6: {
      if (!data.date_depart) return 'Veuillez sélectionner une date.';
      if (data.date_depart < getTodayString()) return 'La date doit être dans le futur.';
      return null;
    }
    case 7: {
      const n = parseInt(data.nb_passagers);
      if (!data.nb_passagers || isNaN(n) || n < 1) return 'Veuillez indiquer au moins 1 passager.';
      if (n > 500) return 'Maximum 500 passagers.';
      return null;
    }
    case 8: {
      const d = parseFloat(data.distance_km);
      if (!data.distance_km || isNaN(d) || d < 1) return 'Veuillez indiquer une distance valide.';
      if (d > 5000) return 'Distance maximum 5 000 km.';
      return null;
    }
    case 9: return data.aller_retour === null ? 'Veuillez choisir une option.' : null;
    case 10: return null; // options — optional
    case 11: return null; // notes — optional
    default: return null;
  }
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: number }) {
  const pct = Math.round(((step - 1) / TOTAL_STEPS) * 100);
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div
        className="h-full bg-blue-600 transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Option pill ────────────────────────────────────────────────────────────────
function OptionPill({
  label, value, selected, onClick,
}: { label: string; value: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-2 px-5 py-3 rounded-full border-2 text-sm font-medium transition-all duration-150
        ${selected
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'}
      `}
    >
      {selected && <span>✓</span>}
      {label}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function NeoTravelForm() {
  const [step, setStep] = useState(0); // 0 = welcome
  const [data, setData] = useState<FormData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Focus input on step change
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, [step]);

  const update = (field: keyof FormData, value: unknown) => {
    setData((d) => ({ ...d, [field]: value }));
    setError(null);
  };

  const goNext = useCallback(() => {
    const err = validateStep(step, data);
    if (err) { setError(err); return; }
    setError(null);
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setAnimating(false);
    }, 200);
  }, [step, data]);

  const goPrev = useCallback(() => {
    if (step === 0) return;
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s - 1);
      setError(null);
      setAnimating(false);
    }, 200);
  }, [step]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && step > 0 && step < TOTAL_STEPS) {
        e.preventDefault();
        goNext();
      }
    },
    [goNext, step]
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        prenom: data.prenom.trim(),
        nom: data.nom.trim(),
        email: data.email.trim().toLowerCase(),
        telephone: data.telephone.trim(),
        ville_depart: data.ville_depart.trim(),
        ville_arrivee: data.ville_arrivee.trim(),
        date_depart: data.date_depart,
        nb_passagers: parseInt(data.nb_passagers),
        distance_km: parseFloat(data.distance_km),
        aller_retour: data.aller_retour ?? false,
        options: data.options,
        notes: data.notes.trim(),
      };
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Erreur réseau');
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleOption = (opt: Option) => {
    setData((d) => ({
      ...d,
      options: d.options.includes(opt)
        ? d.options.filter((o) => o !== opt)
        : [...d.options, opt],
    }));
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Demande envoyée !</h1>
          <p className="text-gray-600 mb-2">
            Merci <strong>{data.prenom}</strong>, votre devis est en cours de préparation.
          </p>
          <p className="text-gray-500 text-sm">
            Vous recevrez une réponse à <strong>{data.email}</strong> dans les plus brefs délais.
          </p>
          <div className="mt-8 p-4 bg-blue-50 rounded-xl text-left">
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-2">Récapitulatif</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>🚌 {data.ville_depart} → {data.ville_arrivee}</li>
              <li>📅 {new Date(data.date_depart + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</li>
              <li>👥 {data.nb_passagers} passager{parseInt(data.nb_passagers) > 1 ? 's' : ''}</li>
              <li>📏 ~{data.distance_km} km — {data.aller_retour ? 'Aller-retour' : 'Aller simple'}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ── Step content ───────────────────────────────────────────────────────────
  const stepContent = () => {
    const inputClass =
      'w-full max-w-md border-0 border-b-2 border-gray-300 focus:border-blue-600 outline-none text-xl py-2 bg-transparent text-gray-900 placeholder-gray-400 transition-colors';

    switch (step) {
      // Welcome
      case 0:
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <span className="text-white text-2xl font-bold">N</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Obtenez votre devis transport</h1>
            <p className="text-lg text-gray-500 mb-10 max-w-sm mx-auto">
              NeoTravel organise vos déplacements de groupe en France depuis 2010.
              Répondez à quelques questions — votre devis arrive par email.
            </p>
            <button
              onClick={() => setStep(1)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-colors shadow-md"
            >
              Commencer →
            </button>
            <p className="mt-4 text-xs text-gray-400">⏱ Environ 2 minutes</p>
          </div>
        );

      // Step 1 — Identité
      case 1:
        return (
          <div>
            <p className="text-blue-600 text-sm font-semibold mb-2">Question 1 / {TOTAL_STEPS}</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Comment vous appelez-vous ?</h2>
            <div className="space-y-6 max-w-md">
              <input
                ref={inputRef as React.Ref<HTMLInputElement>}
                className={inputClass}
                placeholder="Prénom"
                value={data.prenom}
                onChange={(e) => update('prenom', e.target.value)}
                onKeyDown={handleKey}
                autoComplete="given-name"
              />
              <input
                className={inputClass}
                placeholder="Nom"
                value={data.nom}
                onChange={(e) => update('nom', e.target.value)}
                onKeyDown={handleKey}
                autoComplete="family-name"
              />
            </div>
          </div>
        );

      // Step 2 — Email
      case 2:
        return (
          <div>
            <p className="text-blue-600 text-sm font-semibold mb-2">Question 2 / {TOTAL_STEPS}</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Votre adresse email ?</h2>
            <p className="text-gray-500 mb-8">Nous y enverrons votre devis.</p>
            <input
              ref={inputRef as React.Ref<HTMLInputElement>}
              type="email"
              className={inputClass}
              placeholder="prenom@exemple.fr"
              value={data.email}
              onChange={(e) => update('email', e.target.value)}
              onKeyDown={handleKey}
              autoComplete="email"
            />
          </div>
        );

      // Step 3 — Téléphone
      case 3:
        return (
          <div>
            <p className="text-blue-600 text-sm font-semibold mb-2">Question 3 / {TOTAL_STEPS}</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Votre numéro de téléphone ?</h2>
            <p className="text-gray-500 mb-8">Pour vous contacter si nécessaire.</p>
            <input
              ref={inputRef as React.Ref<HTMLInputElement>}
              type="tel"
              className={inputClass}
              placeholder="06 12 34 56 78"
              value={data.telephone}
              onChange={(e) => update('telephone', e.target.value)}
              onKeyDown={handleKey}
              autoComplete="tel"
            />
          </div>
        );

      // Step 4 — Départ
      case 4:
        return (
          <div>
            <p className="text-blue-600 text-sm font-semibold mb-2">Question 4 / {TOTAL_STEPS}</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Quelle est la ville de départ ?</h2>
            <input
              ref={inputRef as React.Ref<HTMLInputElement>}
              className={inputClass}
              placeholder="Ex. Paris"
              value={data.ville_depart}
              onChange={(e) => update('ville_depart', e.target.value)}
              onKeyDown={handleKey}
            />
          </div>
        );

      // Step 5 — Arrivée
      case 5:
        return (
          <div>
            <p className="text-blue-600 text-sm font-semibold mb-2">Question 5 / {TOTAL_STEPS}</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Et la ville d'arrivée ?</h2>
            <input
              ref={inputRef as React.Ref<HTMLInputElement>}
              className={inputClass}
              placeholder="Ex. Lyon"
              value={data.ville_arrivee}
              onChange={(e) => update('ville_arrivee', e.target.value)}
              onKeyDown={handleKey}
            />
          </div>
        );

      // Step 6 — Date
      case 6:
        return (
          <div>
            <p className="text-blue-600 text-sm font-semibold mb-2">Question 6 / {TOTAL_STEPS}</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Quelle est la date de départ ?</h2>
            <input
              ref={inputRef as React.Ref<HTMLInputElement>}
              type="date"
              className={inputClass + ' cursor-pointer'}
              min={getTodayString()}
              value={data.date_depart}
              onChange={(e) => update('date_depart', e.target.value)}
              onKeyDown={handleKey}
            />
          </div>
        );

      // Step 7 — Passagers
      case 7:
        return (
          <div>
            <p className="text-blue-600 text-sm font-semibold mb-2">Question 7 / {TOTAL_STEPS}</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Combien de passagers ?</h2>
            <p className="text-gray-500 mb-8">
              Au-delà de 85 passagers, un commercial vous contactera personnellement.
            </p>
            <input
              ref={inputRef as React.Ref<HTMLInputElement>}
              type="number"
              className={inputClass}
              placeholder="Ex. 45"
              min={1}
              max={500}
              value={data.nb_passagers}
              onChange={(e) => update('nb_passagers', e.target.value)}
              onKeyDown={handleKey}
            />
          </div>
        );

      // Step 8 — Distance
      case 8:
        return (
          <div>
            <p className="text-blue-600 text-sm font-semibold mb-2">Question 8 / {TOTAL_STEPS}</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Distance estimée du trajet ?</h2>
            <p className="text-gray-500 mb-8">En kilomètres. Une estimation suffit.</p>
            <div className="flex items-baseline gap-3 max-w-md">
              <input
                ref={inputRef as React.Ref<HTMLInputElement>}
                type="number"
                className={inputClass}
                placeholder="Ex. 250"
                min={1}
                value={data.distance_km}
                onChange={(e) => update('distance_km', e.target.value)}
                onKeyDown={handleKey}
              />
              <span className="text-xl text-gray-500 font-medium">km</span>
            </div>
          </div>
        );

      // Step 9 — Aller-retour
      case 9:
        return (
          <div>
            <p className="text-blue-600 text-sm font-semibold mb-2">Question 9 / {TOTAL_STEPS}</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Aller simple ou aller-retour ?</h2>
            <div className="flex gap-4">
              {[
                { label: '🚌 Aller simple', value: false },
                { label: '🔄 Aller-retour', value: true },
              ].map(({ label, value }) => (
                <button
                  key={String(value)}
                  type="button"
                  onClick={() => { update('aller_retour', value); setTimeout(goNext, 250); }}
                  className={`
                    flex-1 max-w-xs py-5 px-6 rounded-xl border-2 text-base font-semibold transition-all
                    ${data.aller_retour === value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'}
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        );

      // Step 10 — Options
      case 10:
        return (
          <div>
            <p className="text-blue-600 text-sm font-semibold mb-2">Question 10 / {TOTAL_STEPS}</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Options souhaitées ?</h2>
            <p className="text-gray-500 mb-8">Sélectionnez tout ce qui s'applique (facultatif).</p>
            <div className="flex flex-wrap gap-3">
              <OptionPill
                label="🎤 Guide / accompagnateur"
                value="guide"
                selected={data.options.includes('guide')}
                onClick={() => toggleOption('guide')}
              />
              <OptionPill
                label="🌙 Hébergement chauffeur"
                value="chauffeur_nuit"
                selected={data.options.includes('chauffeur_nuit')}
                onClick={() => toggleOption('chauffeur_nuit')}
              />
              <OptionPill
                label="🛣️ Péages inclus"
                value="peages"
                selected={data.options.includes('peages')}
                onClick={() => toggleOption('peages')}
              />
            </div>
          </div>
        );

      // Step 11 — Notes
      case 11:
        return (
          <div>
            <p className="text-blue-600 text-sm font-semibold mb-2">Question 11 / {TOTAL_STEPS}</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Informations complémentaires ?</h2>
            <p className="text-gray-500 mb-8">Type de groupe, horaires précis, contraintes particulières… (facultatif)</p>
            <textarea
              ref={inputRef as React.Ref<HTMLTextAreaElement>}
              className="w-full max-w-md border-2 border-gray-200 focus:border-blue-600 outline-none text-base p-3 rounded-xl bg-white text-gray-900 placeholder-gray-400 transition-colors resize-none"
              rows={4}
              placeholder="Ex. Groupe scolaire, départ à 8h, retour avant 20h..."
              value={data.notes}
              onChange={(e) => update('notes', e.target.value)}
            />
          </div>
        );

      // Step 12 — Recap + Submit
      case 12:
        return (
          <div>
            <p className="text-blue-600 text-sm font-semibold mb-2">Récapitulatif</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Tout est correct ?</h2>
            <div className="max-w-md bg-gray-50 rounded-2xl p-5 space-y-3 text-sm text-gray-700 mb-8">
              <div className="flex justify-between"><span className="text-gray-400">Nom</span><span className="font-medium">{data.prenom} {data.nom}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Email</span><span className="font-medium">{data.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Téléphone</span><span className="font-medium">{data.telephone}</span></div>
              <hr className="border-gray-200" />
              <div className="flex justify-between"><span className="text-gray-400">Départ</span><span className="font-medium">{data.ville_depart}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Arrivée</span><span className="font-medium">{data.ville_arrivee}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Date</span><span className="font-medium">{new Date(data.date_depart + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Passagers</span><span className="font-medium">{data.nb_passagers}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Distance</span><span className="font-medium">~{data.distance_km} km</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Type</span><span className="font-medium">{data.aller_retour ? 'Aller-retour' : 'Aller simple'}</span></div>
              {data.options.length > 0 && (
                <div className="flex justify-between"><span className="text-gray-400">Options</span><span className="font-medium">{data.options.join(', ')}</span></div>
              )}
              {data.notes && (
                <div><span className="text-gray-400">Notes</span><p className="font-medium mt-1">{data.notes}</p></div>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`
                w-full max-w-md py-4 rounded-xl font-semibold text-lg transition-all
                ${submitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'}
              `}
            >
              {submitting ? 'Envoi en cours…' : 'Envoyer ma demande →'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {step > 0 && step <= TOTAL_STEPS && <ProgressBar step={step} />}

      <div
        className={`
          flex-1 flex flex-col items-start justify-center px-6 py-16 max-w-2xl mx-auto w-full
          transition-opacity duration-200
          ${animating ? 'opacity-0' : 'opacity-100'}
        `}
      >
        {stepContent()}

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-600 text-sm max-w-md">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Nav buttons */}
        {step > 0 && step < TOTAL_STEPS && (
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={goNext}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Continuer →
            </button>
            {step > 1 && (
              <button
                onClick={goPrev}
                className="text-gray-500 hover:text-gray-700 text-sm underline transition-colors"
              >
                ← Retour
              </button>
            )}
            <span className="text-xs text-gray-400 hidden sm:block">ou appuyez sur Entrée</span>
          </div>
        )}

        {/* Recap back button */}
        {step === TOTAL_STEPS && (
          <button
            onClick={goPrev}
            className="mt-4 text-gray-500 hover:text-gray-700 text-sm underline"
          >
            ← Modifier
          </button>
        )}
      </div>

      {/* Footer */}
      {step > 0 && (
        <div className="text-center pb-4 text-xs text-gray-400">
          NeoTravel — Transport de groupe en France depuis 2010
        </div>
      )}
    </div>
  );
}
