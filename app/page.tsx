'use client';

import Link from 'next/link';
import Image from 'next/image';

// ── Landing page NeoTravel ─────────────────────────────────────────────────────
// Point d'entrée unique : le prospect clique sur "Parler à Emma" → /chat
// Emma (agent IA) collecte les infos et déclenche WF1 (n8n)
// ──────────────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-base font-bold">N</span>
          </div>
          <span className="font-semibold text-gray-900 text-lg">NeoTravel</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-500">
          <a href="#comment" className="hover:text-gray-900 transition-colors">Comment ça marche</a>
          <a href="#avantages" className="hover:text-gray-900 transition-colors">Pourquoi NeoTravel</a>
          <Link
            href="/chat"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Obtenir un devis
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Emma est disponible — réponse en quelques secondes
          </div>

          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Transport de groupe,<br />
            <span className="text-blue-600">devis instantané</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            NeoTravel organise vos déplacements de groupe en France depuis 2010.
            Parlez à Emma, notre assistante IA, et recevez votre devis personnalisé par email en moins de 2 minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/chat"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-md shadow-blue-100 inline-flex items-center gap-2 justify-center"
            >
              💬 Parler à Emma
            </Link>
            <a
              href="#comment"
              className="text-gray-600 hover:text-gray-900 font-medium px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors inline-flex items-center gap-2 justify-center"
            >
              Comment ça marche →
            </a>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            Gratuit · Sans engagement · Réponse en 2 minutes
          </p>
        </section>

        {/* ── Chiffres clés ── */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: '2010', label: 'Fondée en' },
              { stat: '+500', label: 'Clients accompagnés' },
              { stat: '8–85', label: 'Passagers par trajet' },
              { stat: '< 2 min', label: 'Délai de réponse' },
            ].map(({ stat, label }) => (
              <div key={stat}>
                <div className="text-3xl font-bold text-blue-600 mb-1">{stat}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Comment ça marche ── */}
        <section id="comment" className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-gray-500 text-center max-w-xl mx-auto mb-14">
            Emma collecte vos informations, calcule votre devis automatiquement et vous l'envoie par email.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                icon: '💬',
                title: 'Décrivez votre besoin',
                desc: 'Emma vous pose quelques questions simples : départ, destination, date, nombre de passagers.',
              },
              {
                num: '02',
                icon: '⚡',
                title: 'Calcul instantané',
                desc: 'Notre moteur de tarification calcule votre devis au centime près, selon vos spécificités.',
              },
              {
                num: '03',
                icon: '📧',
                title: 'Devis par email',
                desc: 'Vous recevez votre proposition détaillée directement dans votre boîte mail.',
              },
            ].map(({ num, icon, title, desc }) => (
              <div key={num} className="relative p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xs font-bold text-blue-400 mb-3">{num}</div>
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/chat"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors inline-flex items-center gap-2"
            >
              💬 Démarrer avec Emma
            </Link>
          </div>
        </section>

        {/* ── Avantages ── */}
        <section id="avantages" className="bg-gray-50 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-14">
              Pourquoi choisir NeoTravel ?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: '🚌',
                  title: 'Spécialiste du groupe',
                  desc: 'De 8 à 85 passagers, nous avons le bon véhicule et le bon partenaire autocariste pour votre trajet.',
                },
                {
                  icon: '💰',
                  title: 'Prix transparents',
                  desc: 'Chaque devis est calculé de façon déterministe : distance, saison, urgence et options. Zéro surprise.',
                },
                {
                  icon: '⏱',
                  title: 'Réactivité garantie',
                  desc: 'Devis automatique en 2 minutes. Pour les demandes complexes, un conseiller vous rappelle sous 24h.',
                },
                {
                  icon: '🤝',
                  title: 'Humain quand il le faut',
                  desc: 'Emma gère les demandes standard. Les cas complexes sont transmis directement à nos commerciaux.',
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto bg-blue-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à organiser votre prochain déplacement ?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Emma est disponible maintenant. Obtenez votre devis en 2 minutes.
            </p>
            <Link
              href="/chat"
              className="bg-white hover:bg-blue-50 text-blue-600 font-semibold px-8 py-4 rounded-xl text-lg transition-colors inline-flex items-center gap-2"
            >
              💬 Parler à Emma →
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-6 px-6 text-center text-sm text-gray-400">
        © 2025 NeoTravel — Transport de groupe en France depuis 2010
      </footer>
    </div>
  );
}
