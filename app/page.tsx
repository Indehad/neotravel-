'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0d1b2e', color: '#ffffff' }}>

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/NeoTravelLogoV2.png" alt="NeoTravel" width={48} height={48} className="rounded-full" />
          <div>
            <div className="font-bold text-white tracking-widest text-sm">NEOTRAVEL</div>
            <div className="text-xs" style={{ color: '#a3e635' }}>Transport de groupe avec chauffeur</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <a href="#comment" className="hover:text-white transition-colors">Comment ça marche</a>
          <a href="#avantages" className="hover:text-white transition-colors">Nos avantages</a>
          <Link
            href="/chat"
            className="font-semibold px-5 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: '#a3e635', color: '#0d1b2e' }}
          >
            Obtenir un devis
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-8"
            style={{ backgroundColor: 'rgba(163,230,53,0.12)', color: '#a3e635', border: '1px solid rgba(163,230,53,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#a3e635' }} />
            Emma est disponible — devis en moins de 2 minutes
          </div>

          {/* Logo centré */}
          <div className="flex justify-center mb-8">
            <Image
              src="/NeoTravelLogoV2.png"
              alt="NeoTravel"
              width={140}
              height={140}
              className="rounded-full"
            />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6 tracking-wide">
            NEOTRAVEL
          </h1>
          <p className="text-xl mb-3 font-medium" style={{ color: '#a3e635' }}>
            Transport de groupe avec chauffeur
          </p>
          <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.6)' }}>
            De 8 à 85 passagers, partout en France depuis 2010.
            Parlez à Emma, notre assistante IA, et recevez votre devis personnalisé par email.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/chat"
              className="font-semibold px-8 py-4 rounded-xl text-lg transition-all inline-flex items-center gap-2 justify-center shadow-lg"
              style={{ backgroundColor: '#a3e635', color: '#0d1b2e' }}
            >
              💬 Parler à Emma
            </Link>
            <a
              href="#comment"
              className="font-medium px-8 py-4 rounded-xl transition-colors inline-flex items-center gap-2 justify-center"
              style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}
            >
              Comment ça marche →
            </a>
          </div>

          <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Gratuit · Sans engagement · Réponse en 2 minutes
          </p>
        </section>

        {/* ── Chiffres clés ── */}
        <section style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="py-12">
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: '2010', label: 'Fondée en' },
              { stat: '+500', label: 'Clients accompagnés' },
              { stat: '8–85', label: 'Passagers par trajet' },
              { stat: '< 2 min', label: 'Délai de réponse' },
            ].map(({ stat, label }) => (
              <div key={stat}>
                <div className="text-3xl font-bold mb-1" style={{ color: '#a3e635' }}>{stat}</div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Comment ça marche ── */}
        <section id="comment" className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-center max-w-xl mx-auto mb-14" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Emma collecte vos informations, calcule votre devis et vous l'envoie par email.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
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
                desc: 'Notre moteur de tarification calcule votre devis au centime près — sans IA qui invente des prix.',
              },
              {
                num: '03',
                icon: '📧',
                title: 'Devis par email',
                desc: 'Vous recevez votre proposition détaillée directement dans votre boîte mail.',
              },
            ].map(({ num, icon, title, desc }) => (
              <div
                key={num}
                className="p-6 rounded-2xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="text-xs font-bold mb-3" style={{ color: '#a3e635' }}>{num}</div>
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/chat"
              className="font-semibold px-8 py-4 rounded-xl text-lg transition-all inline-flex items-center gap-2"
              style={{ backgroundColor: '#a3e635', color: '#0d1b2e' }}
            >
              💬 Démarrer avec Emma
            </Link>
          </div>
        </section>

        {/* ── Avantages ── */}
        <section
          id="avantages"
          className="py-20"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white text-center mb-14">
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
                  desc: 'Devis automatique en 2 minutes. Pour les cas complexes, un conseiller vous rappelle sous 24h.',
                },
                {
                  icon: '🤝',
                  title: 'Humain quand il le faut',
                  desc: 'Emma gère les demandes standard. Les cas complexes sont transmis directement à nos commerciaux.',
                },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 p-6 rounded-2xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="py-20 px-6 text-center">
          <div
            className="max-w-2xl mx-auto rounded-3xl p-12"
            style={{ backgroundColor: 'rgba(163,230,53,0.08)', border: '1px solid rgba(163,230,53,0.2)' }}
          >
            <div className="flex justify-center mb-6">
              <Image
                src="/NeoTravelLogoV2.png"
                alt="NeoTravel"
                width={72}
                height={72}
                className="rounded-full"
              />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à organiser votre prochain déplacement ?
            </h2>
            <p className="mb-8 text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Emma est disponible maintenant. Obtenez votre devis en 2 minutes, sans engagement.
            </p>
            <Link
              href="/chat"
              className="font-semibold px-8 py-4 rounded-xl text-lg transition-all inline-flex items-center gap-2"
              style={{ backgroundColor: '#a3e635', color: '#0d1b2e' }}
            >
              💬 Parler à Emma →
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer
        className="py-6 px-6 text-center text-sm"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}
      >
        © 2025 NeoTravel — Transport de groupe avec chauffeur depuis 2010
      </footer>
    </div>
  );
}
