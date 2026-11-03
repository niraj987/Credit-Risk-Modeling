import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

export const FloatingCardsShowcase: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [hasLanded, setHasLanded] = useState(false);

  useEffect(() => {
    // Entrance animation: cards fall gracefully from outer space then stack
    const timer = setTimeout(() => {
      setHasLanded(true);
    }, 120);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll effect: Down-scroll disappears cards one by one; Up-scroll adds them back one by one!
  // Card 3 disappears first (scrollY >= 90)
  // Card 2 disappears second (scrollY >= 200)
  // Card 1 disappears third (scrollY >= 330)
  const isCard3Active = scrollY < 90;
  const isCard2Active = scrollY < 200;
  const isCard1Active = scrollY < 330;

  return (
    <div className="cards-pure-space-viewport">
      {/* Infinite Cosmic Atmospheric Ambient Glow */}
      <div className="space-purple-radial-core" />
      <div className="space-purple-radial-wide" />

      {/* Floating Sparkle Stars in Pure Space */}
      <div className="space-star star-pos-1">✦</div>
      <div className="space-star star-pos-2">✦</div>
      <div className="space-star star-pos-3">✦</div>
      <div className="space-star star-pos-4">✦</div>

      {/* 3D Falling & Stacking Stage in Open Space (Zero Box Borders) */}
      <div className="cards-space-3d-stage">
        {/* =========================================================
            CARD 3: Deep Royal Cosmic Violet Card (Back Layer)
            ========================================================= */}
        <div
          className={`space-card-wrapper card-layer-3 ${
            !hasLanded
              ? 'falling-from-space-3'
              : isCard3Active
              ? 'stacked-floating-3'
              : 'scroll-disappeared-3'
          }`}
        >
          <div className="space-card-body skin-cosmic-violet">
            <div className="space-card-header">
              <span className="space-bank-logo text-purple-200">FinRisk</span>
              <Wifi size={18} className="text-purple-300 rotate-90" />
            </div>

            {/* Brass EMV Chip */}
            <div className="space-emv-chip chip-gold-variant">
              <div className="chip-inner-h" />
              <div className="chip-inner-v" />
            </div>

            {/* XXXX-XXXX-XXXX Number (As Requested) */}
            <div className="space-card-number text-purple-200">
              <span>XXXX</span>
              <span className="num-hyphen">-</span>
              <span>XXXX</span>
              <span className="num-hyphen">-</span>
              <span>XXXX</span>
            </div>

            {/* Expiration XX/XX & Written CVV: XXX */}
            <div className="space-card-footer text-purple-300/90">
              <div>
                <span className="space-meta-label text-purple-400">EXPIRES</span>
                <span className="space-meta-val font-mono">XX/XX</span>
              </div>
              <div className="text-right">
                <span className="space-meta-label text-purple-400">CVV</span>
                <span className="space-cvv-pill bg-purple-900/60 border-purple-500/50 text-purple-200">
                  XXX
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            CARD 2: Translucent Cyber Emerald Glass Card (Middle Layer)
            ========================================================= */}
        <div
          className={`space-card-wrapper card-layer-2 ${
            !hasLanded
              ? 'falling-from-space-2'
              : isCard2Active
              ? 'stacked-floating-2'
              : 'scroll-disappeared-2'
          }`}
        >
          <div className="space-card-body skin-cyber-emerald">
            <div className="space-card-header">
              <span className="space-bank-logo text-emerald-100">FinRisk</span>
              <Wifi size={18} className="text-emerald-300 rotate-90" />
            </div>

            {/* Silver EMV Chip */}
            <div className="space-emv-chip chip-silver-variant">
              <div className="chip-inner-h" />
              <div className="chip-inner-v" />
            </div>

            {/* XXXX-XXXX-XXXX Number */}
            <div className="space-card-number text-emerald-200">
              <span>XXXX</span>
              <span className="num-hyphen">-</span>
              <span>XXXX</span>
              <span className="num-hyphen">-</span>
              <span>XXXX</span>
            </div>

            {/* Expiration XX/XX & Written CVV: XXX */}
            <div className="space-card-footer text-emerald-300/90">
              <div>
                <span className="space-meta-label text-emerald-400">EXPIRES</span>
                <span className="space-meta-val font-mono">XX/XX</span>
              </div>
              <div className="text-right">
                <span className="space-meta-label text-emerald-400">CVV</span>
                <span className="space-cvv-pill bg-emerald-950/70 border-emerald-500/50 text-neonlime">
                  XXX
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            CARD 1: Matte Obsidian Black with Gold & Emerald Text (Front Layer)
            ========================================================= */}
        <div
          className={`space-card-wrapper card-layer-1 ${
            !hasLanded
              ? 'falling-from-space-1'
              : isCard1Active
              ? 'stacked-floating-1'
              : 'scroll-disappeared-1'
          }`}
        >
          <div className="space-card-body skin-matte-black-hero">
            {/* Elegant Gloss Reflection Sheen */}
            <div className="card-gloss-shimmer" />

            <div className="space-card-header">
              <span className="space-bank-logo text-white font-extrabold tracking-tight">FinRisk</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-neonlime tracking-widest uppercase">ELITE</span>
                <Wifi size={19} className="text-zinc-300 rotate-90" />
              </div>
            </div>

            {/* Authentic Brass EMV Chip */}
            <div className="space-emv-chip chip-brass-hero">
              <div className="chip-inner-h" />
              <div className="chip-inner-v" />
              <div className="chip-inner-box" />
            </div>

            {/* XXXX-XXXX-XXXX in Metallic Gold & Green Gradient */}
            <div className="space-card-number number-gradient-gold-green">
              <span>XXXX</span>
              <span className="num-hyphen">-</span>
              <span>XXXX</span>
              <span className="num-hyphen">-</span>
              <span>XXXX</span>
            </div>

            {/* Expiry XX/XX & Written CVV: XXX */}
            <div className="space-card-footer">
              <div>
                <span className="space-meta-label text-zinc-400">EXPIRES</span>
                <span className="space-meta-val font-mono text-zinc-200">XX/XX</span>
              </div>
              <div className="text-right">
                <span className="space-meta-label text-zinc-400">SECURITY CODE</span>
                <div className="space-cvv-pill bg-zinc-900/80 border-purple-500/40 text-neonlime font-bold">
                  <span className="text-[9px] text-zinc-400 mr-1">CVV</span>
                  <span>XXX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
