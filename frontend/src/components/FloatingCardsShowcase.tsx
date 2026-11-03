import React, { useState } from 'react';
import { Wifi } from 'lucide-react';

export const FloatingCardsShowcase: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Subtle interactive 3D parallax tilt
  const tiltX = -mousePos.y * 14;
  const tiltY = mousePos.x * 18;

  return (
    <div
      className="cards-pure-space-viewport"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Infinite Cosmic Atmospheric Ambient Glow */}
      <div className="space-purple-radial-core" />
      <div className="space-purple-radial-wide" />

      {/* Floating Sparkle Stars in Pure Space */}
      <div className="space-star star-pos-1">✦</div>
      <div className="space-star star-pos-2">✦</div>
      <div className="space-star star-pos-3">✦</div>
      <div className="space-star star-pos-4">✦</div>

      {/* 3D Falling & Stacking Stage in Open Space (Zero Box Borders) */}
      <div
        className="cards-space-3d-stage"
        style={{
          transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        }}
      >
        {/* =========================================================
            CARD 3: Deep Royal Cosmic Violet Card (Falls 1st from Sky)
            ========================================================= */}
        <div className="space-card-wrapper card-layer-3 fall-from-sky-3">
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

            {/* ZZZZ-XXXX-YYYY Number (Using X, Y, Z Variables) */}
            <div className="space-card-number text-purple-200">
              <span>ZZZZ</span>
              <span className="num-hyphen">-</span>
              <span>XXXX</span>
              <span className="num-hyphen">-</span>
              <span>YYYY</span>
            </div>

            {/* Expiration ZZ/XX & Written CVV: ZXY */}
            <div className="space-card-footer text-purple-300/90">
              <div>
                <span className="space-meta-label text-purple-400">EXPIRES</span>
                <span className="space-meta-val font-mono">ZZ/XX</span>
              </div>
              <div className="text-right">
                <span className="space-meta-label text-purple-400">CVV</span>
                <span className="space-cvv-pill bg-purple-900/60 border-purple-500/50 text-purple-200">
                  ZXY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            CARD 2: Lustrous Brushed Champagne Gold Companion Card
            ========================================================= */}
        <div className="space-card-wrapper card-layer-2 fall-from-sky-2">
          <div className="space-card-body skin-luxury-gold">
            <div className="card-gloss-shimmer" />

            <div className="space-card-header">
              <span className="space-bank-logo text-amber-950 font-black">Credit Card</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-amber-900 tracking-wider">GOLD</span>
                <Wifi size={18} className="text-amber-900 rotate-90" />
              </div>
            </div>

            {/* Gold EMV Chip */}
            <div className="space-emv-chip chip-gold-variant">
              <div className="chip-inner-h" />
              <div className="chip-inner-v" />
              <div className="chip-inner-box" />
            </div>

            {/* YYYY-ZZZZ-XXXX Number (Using X, Y, Z Variables) */}
            <div className="space-card-number text-amber-950 font-black">
              <span>YYYY</span>
              <span className="num-hyphen">-</span>
              <span>ZZZZ</span>
              <span className="num-hyphen">-</span>
              <span>XXXX</span>
            </div>

            {/* Expiration YY/ZZ & Written CVV: YZX */}
            <div className="space-card-footer text-amber-950">
              <div>
                <span className="space-meta-label text-amber-800">EXPIRES</span>
                <span className="space-meta-val font-mono font-bold text-amber-950">YY/ZZ</span>
              </div>
              <div className="text-right">
                <span className="space-meta-label text-amber-800">CVV</span>
                <span className="space-cvv-pill bg-amber-900/20 border-amber-800/40 text-amber-950 font-bold">
                  YZX
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            CARD 1: Matte Obsidian Black Hero (Falls 3rd from Sky)
            ========================================================= */}
        <div className="space-card-wrapper card-layer-1 fall-from-sky-1">
          <div className="space-card-body skin-matte-black-hero">
            {/* Elegant Gloss Reflection Sheen */}
            <div className="card-gloss-shimmer" />

            <div className="space-card-header">
              <span className="space-bank-logo text-white font-extrabold tracking-tight">FinRisk</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase">ELITE</span>
                <Wifi size={19} className="text-zinc-300 rotate-90" />
              </div>
            </div>

            {/* Authentic Brass EMV Chip */}
            <div className="space-emv-chip chip-brass-hero">
              <div className="chip-inner-h" />
              <div className="chip-inner-v" />
              <div className="chip-inner-box" />
            </div>

            {/* XXXX-YYYY-ZZZZ in Metallic Gold & Green Gradient */}
            <div className="space-card-number number-gradient-gold-green">
              <span>XXXX</span>
              <span className="num-hyphen">-</span>
              <span>YYYY</span>
              <span className="num-hyphen">-</span>
              <span>ZZZZ</span>
            </div>

            {/* Expiry XX/YY & Written CVV: XYZ */}
            <div className="space-card-footer">
              <div>
                <span className="space-meta-label text-zinc-400">EXPIRES</span>
                <span className="space-meta-val font-mono text-zinc-200">XX/YY</span>
              </div>
              <div className="text-right">
                <span className="space-meta-label text-zinc-400">SECURITY CODE</span>
                <div className="space-cvv-pill bg-zinc-900/80 border-purple-500/40 text-amber-400 font-bold">
                  <span className="text-[9px] text-zinc-400 mr-1">CVV</span>
                  <span>XYZ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
