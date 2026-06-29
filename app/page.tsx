'use client';

import Link from 'next/link';

const PHONE = '09 80 40 04 84'; 
export default function Home() {
  return (
    <>
      <style>{`
        html, body { background: #0d1b2e; margin: 0; padding: 0; }
        * { box-sizing: border-box; }
        .page { min-height: 100vh; background: #0d1b2e; color: #fff; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; }
        .header { display: flex; align-items: center; justify-content: space-between; padding: 20px 40px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .logo-row { display: flex; align-items: center; gap: 12px; }
        .logo-img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
        .logo-text { font-size: 15px; font-weight: 700; letter-spacing: 0.12em; color: #fff; }
        .logo-sub { font-size: 11px; color: #a3e635; letter-spacing: 0.04em; margin-top: 1px; }
        .header-right { display: flex; align-items: center; gap: 24px; }
        .header-phone { color: rgba(255,255,255,0.6); font-size: 14px; text-decoration: none; }
        .header-phone:hover { color: #fff; }
        .btn-primary { background: #a3e635; color: #0d1b2e; font-weight: 700; padding: 10px 22px; border-radius: 10px; text-decoration: none; font-size: 14px; transition: opacity .15s; }
        .btn-primary:hover { opacity: 0.88; }
        /* Hero */
        .hero { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 80px 24px 60px; }
        .hero-logo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 32px; box-shadow: 0 0 0 1px rgba(163,230,53,0.2), 0 8px 40px rgba(0,0,0,0.4); }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(163,230,53,0.1); border: 1px solid rgba(163,230,53,0.25); color: #a3e635; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 999px; margin-bottom: 28px; letter-spacing: 0.04em; }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #a3e635; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .hero h1 { font-size: clamp(36px, 6vw, 64px); font-weight: 800; letter-spacing: 0.06em; margin: 0 0 12px; color: #fff; text-transform: uppercase; }
        .hero-tagline { font-size: 16px; color: #a3e635; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 20px; }
        .hero-desc { font-size: 17px; color: rgba(255,255,255,0.55); max-width: 480px; line-height: 1.65; margin-bottom: 40px; }
        .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
        .btn-chat { background: #a3e635; color: #0d1b2e; font-weight: 700; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-size: 16px; display: inline-flex; align-items: center; gap: 8px; transition: opacity .15s; }
        .btn-chat:hover { opacity: 0.88; }
        .btn-phone { background: rgba(255,255,255,0.07); color: #fff; font-weight: 600; padding: 16px 28px; border-radius: 12px; text-decoration: none; font-size: 16px; display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.12); transition: background .15s; }
        .btn-phone:hover { background: rgba(255,255,255,0.12); }
        .hero-hint { margin-top: 16px; font-size: 12px; color: rgba(255,255,255,0.3); }
        /* Stats */
        .stats { display: flex; justify-content: center; gap: 0; border-top: 1px solid rgba(255,255,255,0.07); border-bottom: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03); }
        .stat { flex: 1; max-width: 200px; text-align: center; padding: 28px 16px; border-right: 1px solid rgba(255,255,255,0.07); }
        .stat:last-child { border-right: none; }
        .stat-val { font-size: 28px; font-weight: 800; color: #a3e635; }
        .stat-lbl { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 4px; letter-spacing: 0.04em; }
        /* Steps */
        .steps { padding: 80px 24px; max-width: 900px; margin: 0 auto; width: 100%; }
        .steps h2 { text-align: center; font-size: 28px; font-weight: 700; margin-bottom: 48px; color: #fff; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media(max-width:640px){ .steps-grid{grid-template-columns:1fr} .stats{flex-wrap:wrap} .header{padding:16px 20px} .header-right .header-phone{display:none} }
        .step { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 28px; }
        .step-num { font-size: 11px; font-weight: 700; color: #a3e635; letter-spacing: 0.1em; margin-bottom: 12px; }
        .step-icon { font-size: 28px; margin-bottom: 14px; }
        .step h3 { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 8px; }
        .step p { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.6; }
        /* Footer */
        .footer { border-top: 1px solid rgba(255,255,255,0.07); padding: 24px 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
        .footer-logo { display: flex; align-items: center; gap: 10px; }
        .footer-logo img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
        .footer-name { font-size: 13px; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.6); }
        .footer-copy { font-size: 12px; color: rgba(255,255,255,0.25); }
        .footer-phone { font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; }
        .footer-phone:hover { color: #a3e635; }
      `}</style>

      <div className="page">

        {/* ── Header ── */}
        <header className="header">
          <div className="logo-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/NeoTravelLogoV2.png" alt="NeoTravel" className="logo-img" />
            <div>
              <div className="logo-text">NEOTRAVEL</div>
              <div className="logo-sub">Transport de groupe avec chauffeur</div>
            </div>
          </div>
          <div className="header-right">
            <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="header-phone">
              📞 {PHONE}
            </a>
            <Link href="/chat" className="btn-primary">Obtenir un devis</Link>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/NeoTravelLogoV2.png" alt="NeoTravel" className="hero-logo" />

          <div className="hero-badge">
            <span className="badge-dot" />
            Emma disponible · réponse en 2 minutes
          </div>

          <h1>NeoTravel</h1>
          <p className="hero-tagline">Transport de groupe avec chauffeur</p>
          <p className="hero-desc">
            De 8 à 85 passagers, partout en France depuis 2010.
            Obtenez votre devis instantané ou appelez-nous directement.
          </p>

          <div className="hero-actions">
            <Link href="/chat" className="btn-chat">
              💬 Parler à Emma
            </Link>
            <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="btn-phone">
              📞 {PHONE}
            </a>
          </div>
          <p className="hero-hint">Gratuit · Sans engagement</p>
        </section>

        {/* ── Stats ── */}
        <div className="stats">
          {[
            { val: '2010', lbl: 'Fondée en' },
            { val: '+500', lbl: 'Clients accompagnés' },
            { val: '8–85', lbl: 'Passagers / trajet' },
            { val: '< 2 min', lbl: 'Délai de réponse' },
          ].map(({ val, lbl }) => (
            <div key={val} className="stat">
              <div className="stat-val">{val}</div>
              <div className="stat-lbl">{lbl}</div>
            </div>
          ))}
        </div>

        {/* ── Comment ça marche ── */}
        <section className="steps">
          <h2>Comment ça marche ?</h2>
          <div className="steps-grid">
            {[
              { num: '01', icon: '💬', title: 'Décrivez votre besoin', desc: 'Emma vous pose quelques questions : départ, destination, date, nombre de passagers.' },
              { num: '02', icon: '⚡', title: 'Calcul instantané', desc: 'Notre moteur de tarification calcule votre devis au centime près — zéro approximation.' },
              { num: '03', icon: '📧', title: 'Devis par email', desc: 'Vous recevez votre proposition détaillée directement dans votre boîte mail.' },
            ].map(({ num, icon, title, desc }) => (
              <div key={num} className="step">
                <div className="step-num">{num}</div>
                <div className="step-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="footer">
          <div className="footer-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/NeoTravelLogoV2.png" alt="" />
            <span className="footer-name">NEOTRAVEL</span>
          </div>
          <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="footer-phone">📞 {PHONE}</a>
          <span className="footer-copy">© 2025 NeoTravel — Transport de groupe depuis 2010</span>
        </footer>

      </div>
    </>
  );
}
