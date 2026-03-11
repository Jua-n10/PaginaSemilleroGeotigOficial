import { useState, useEffect } from "react";
import { X, ChevronRight, Zap } from "lucide-react";
import carreraPoster from "../assets/carrera5k.png"; // ← pon aquí tu imagen

interface Carrera5KAnuncioProps {
  /** cuántos ms esperar antes de mostrar (default 800) */
  delay?: number;
  /** no volver a mostrar en esta sesión (default true) */
  oncePerSession?: boolean;
}

export function Carrera5KAnuncio({
  delay = 800,
  oncePerSession = true,
}: Carrera5KAnuncioProps) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (oncePerSession) {
      const seen = sessionStorage.getItem("geotig_5k_seen");
      if (seen) return;
    }
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setClosing(true);
    if (oncePerSession) sessionStorage.setItem("geotig_5k_seen", "1");
    setTimeout(() => setVisible(false), 420);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Overlay ── */
        .r5k-overlay {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          background: rgba(2, 8, 22, 0.88);
          backdrop-filter: blur(14px) saturate(1.4);
          animation: r5kOverlayIn 0.35s ease forwards;
        }
        .r5k-overlay.closing {
          animation: r5kOverlayOut 0.38s ease forwards;
        }
        @keyframes r5kOverlayIn  { from{opacity:0} to{opacity:1} }
        @keyframes r5kOverlayOut { from{opacity:1} to{opacity:0} }

        /* ── Card ── */
        .r5k-card {
          font-family: 'DM Sans', sans-serif;
          position: relative;
          width: 100%;
          max-width: 960px;
          border-radius: 24px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: linear-gradient(145deg, #060f22 0%, #0b1e3a 55%, #071a14 100%);
          border: 1px solid rgba(20, 230, 175, 0.18);
          box-shadow:
            0 0 0 1px rgba(20,230,175,0.08),
            0 40px 80px rgba(0,0,0,0.7),
            0 0 120px rgba(20,230,175,0.06);
          animation: r5kCardIn 0.45s cubic-bezier(0.34,1.4,0.64,1) forwards;
        }
        .r5k-card.closing {
          animation: r5kCardOut 0.38s cubic-bezier(0.4,0,0.6,1) forwards;
        }
        @keyframes r5kCardIn  { from{opacity:0;transform:scale(0.88) translateY(24px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes r5kCardOut { from{opacity:1;transform:scale(1) translateY(0)} to{opacity:0;transform:scale(0.92) translateY(16px)} }

        /* Responsive */
        @media(max-width:640px){
          .r5k-card { grid-template-columns:1fr; max-width:420px; }
          .r5k-poster-col { display:none; }
        }

        /* ── Grid texture overlay ── */
        .r5k-card::before {
          content:'';
          position:absolute; inset:0; pointer-events:none; z-index:0;
          background-image:
            linear-gradient(rgba(20,220,170,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20,220,170,0.055) 1px, transparent 1px);
          background-size: 36px 36px;
        }

        /* ── LEFT – Poster ── */
        .r5k-poster-col {
          position: relative; z-index:1;
          overflow: hidden;
          min-height: 480px;
        }
        .r5k-poster-col img {
          width:100%; height:100%; object-fit:cover;
          transform: scale(1.04);
          transition: transform 8s ease;
        }
        .r5k-card:hover .r5k-poster-col img { transform: scale(1.10); }
        /* Edge fade into right panel */
        .r5k-poster-col::after {
          content:'';
          position:absolute; inset:0;
          background: linear-gradient(to right, transparent 60%, #0b1e3a 100%);
        }

        /* ── RIGHT – Content ── */
        .r5k-content {
          position:relative; z-index:1;
          padding: 44px 40px 36px;
          display: flex; flex-direction: column; justify-content: center; gap: 0;
        }

        /* Badge */
        .r5k-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(20,230,175,0.1);
          border: 1px solid rgba(20,230,175,0.25);
          color: rgba(20,230,175,0.9);
          font-family: 'Syne', sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 5px 14px; border-radius: 99px;
          margin-bottom: 22px;
          width: fit-content;
          animation: r5kBadgePulse 2.4s ease-in-out infinite;
        }
        @keyframes r5kBadgePulse {
          0%,100%{ box-shadow: 0 0 0 0 rgba(20,230,175,0.3); }
          50%    { box-shadow: 0 0 0 6px rgba(20,230,175,0); }
        }
        .r5k-badge-dot {
          width:7px; height:7px; border-radius:50%;
          background:#14e6af;
          animation: r5kDotBlink 1.2s ease-in-out infinite;
        }
        @keyframes r5kDotBlink { 0%,100%{opacity:1} 50%{opacity:0.25} }

        /* Headline */
        .r5k-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 5vw, 64px);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.03em;
          color: #fff;
          margin-bottom: 6px;
        }
        .r5k-headline span { color: #14e6af; }

        .r5k-sub {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-bottom: 28px;
        }

        /* Price pill */
        .r5k-price-row {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 28px;
        }
        .r5k-price-pill {
          background: rgba(20,230,175,0.1);
          border: 1px solid rgba(20,230,175,0.3);
          border-radius: 12px;
          padding: 10px 20px;
        }
        .r5k-price-num {
          font-family: 'Syne', sans-serif;
          font-size: 28px; font-weight: 800;
          color: #14e6af; line-height:1;
        }
        .r5k-price-label {
          font-size: 11px; color: rgba(255,255,255,0.4);
          letter-spacing: 0.08em; text-transform: uppercase;
          margin-top: 2px;
        }
        .r5k-price-sep { width:1px; height:44px; background: rgba(255,255,255,0.1); }
        .r5k-org {
          font-size: 13px; color: rgba(255,255,255,0.45);
          line-height: 1.4;
        }
        .r5k-org strong { color: rgba(255,255,255,0.75); font-weight:600; }

        /* CTA */
        .r5k-cta {
          width: 100%;
          padding: 15px 28px;
          border: none; cursor: pointer;
          border-radius: 14px;
          background: linear-gradient(135deg, #0bb894 0%, #1054c8 100%);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600; font-size: 16px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.22s, box-shadow 0.22s, filter 0.2s;
          position: relative; overflow: hidden;
          margin-bottom: 14px;
        }
        .r5k-cta::before {
          content:''; position:absolute; inset:0;
          background: rgba(255,255,255,0.1); opacity:0;
          transition: opacity 0.2s;
        }
        .r5k-cta:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(11,184,148,0.45); filter:brightness(1.06); }
        .r5k-cta:hover::before { opacity:1; }
        .r5k-cta:active { transform:translateY(0); }

        /* Skip */
        .r5k-skip {
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.28);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; text-align:center; width:100%;
          transition: color 0.2s; padding: 4px 0;
        }
        .r5k-skip:hover { color: rgba(255,255,255,0.6); }

        /* Close button */
        .r5k-close {
          position: absolute; top: 14px; right: 14px; z-index: 10;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 7px; cursor: pointer;
          color: rgba(255,255,255,0.35);
          transition: background 0.2s, color 0.2s;
          display: flex;
        }
        .r5k-close:hover { background:rgba(255,255,255,0.12); color:rgba(255,255,255,0.85); }

        /* Decorative corner accent */
        .r5k-corner-tl, .r5k-corner-br {
          position:absolute; width:60px; height:60px; pointer-events:none; z-index:2;
        }
        .r5k-corner-tl { top:0; right:0; border-top:2px solid rgba(20,230,175,0.4); border-right:2px solid rgba(20,230,175,0.4); border-radius:0 24px 0 0; }
        .r5k-corner-br { bottom:0; left:0; border-bottom:2px solid rgba(20,230,175,0.15); border-left:2px solid rgba(20,230,175,0.15); border-radius:0 0 0 24px; }
      `}</style>

      {/* Overlay */}
      <div
        className={`r5k-overlay${closing ? " closing" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {/* Card */}
        <div className={`r5k-card${closing ? " closing" : ""}`}>
          {/* Decorative corners */}
          <div className="r5k-corner-tl" />
          <div className="r5k-corner-br" />

          {/* Close */}
          <button className="r5k-close" onClick={close} aria-label="Cerrar">
            <X size={15} />
          </button>

          {/* LEFT – Poster */}
          <div className="r5k-poster-col">
            <img src={carreraPoster} alt="Carrera 5K GEOTIG" />
          </div>

          {/* RIGHT – Info */}
          <div className="r5k-content">
            {/* Live badge */}
            <div className="r5k-badge">
              <div className="r5k-badge-dot" />
              Inscripciones abiertas
            </div>

            {/* Headline */}
            <div className="r5k-headline">
              CARRERA
              <br />
              <span>5K</span>
            </div>
            <div className="r5k-sub">Pro Semillero GEOTIG · 2025</div>

            {/* Price + org */}
            <div className="r5k-price-row">
              <div className="r5k-price-pill">
                <div className="r5k-price-num">$5.000</div>
                <div className="r5k-price-label">Inscripción</div>
              </div>
              <div className="r5k-price-sep" />
              <div className="r5k-org">
                <strong>Universidad del Cauca</strong>
                <br />
                Popayán, Colombia
              </div>
            </div>

            {/* CTA */}
            <button className="r5k-cta">
              <Zap size={17} />
              ¡Inscribirme ahora!
              <ChevronRight size={17} />
            </button>

            <button className="r5k-skip" onClick={close}>
              No, gracias — seguir navegando
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
