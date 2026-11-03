import React, { useState } from 'react';
import { Wifi, ShieldCheck, Sparkles } from 'lucide-react';

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

  // 3D parallax offsets based on mouse position
  const tiltX = -mousePos.y * 18;
  const tiltY = mousePos.x * 22;

  return (
    <div
      className="floating-cards-viewport"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Soft Purple Ambient Backing Glow & Cosmic Halo */}
      <div className="cards-purple-ambient-backdrop" />
      <div className="cards-ambient-ring-1" />
      <div className="cards-ambient-ring-2" />

      {/* Floating 3D Scene Container */}
      <div
        className="cards-3d-scene"
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        }}
      >
        {/* =========================================================
            CARD 3: Royal Obsidian Purple & Platinum (Background Lower)
            ========================================================= */}
        <div className="card-3d-wrapper card-back-lower">
          <div className="credit-card-body card-skin-purple">
            <div className="card-top-row">
              <span className="card-bank-name">FinRisk</span>
              <div className="card-contactless">
                <Wifi size={18} className="text-purple-300 rotate-90" />
              </div>
            </div>

            {/* Microchip */}
            <div className="card-emv-chip chip-gold">
              <div className="chip-line chip-line-h"></div>
              <div className="chip-line chip-line-v"></div>
            </div>

            {/* 12-Digit Card Number (Green & Gold Metallic) */}
            <div className="card-number-row number-gradient-gold-green">
              <span>6104</span>
              <span>9283</span>
              <span>7451</span>
            </div>

            {/* Bottom Meta */}
            <div className="card-bottom-row">
              <div className="card-meta-left">
                <span className="card-meta-label">MEMBER</span>
                <span className="card-meta-val">PLATINUM PASS</span>
              </div>
              <div className="card-meta-center">
                <span className="card-meta-label">EXPIRES</span>
                <span className="card-meta-val font-mono">04/28</span>
              </div>
              <div className="card-meta-right">
                <span className="card-meta-label">CVV</span>
                <span className="card-cvv-badge">XXX</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            CARD 2: Translucent Cyber-Glass Emerald (Background Upper)
            ========================================================= */}
        <div className="card-3d-wrapper card-back-upper">
          <div className="credit-card-body card-skin-glass-emerald">
            <div className="card-top-row">
              <span className="card-bank-name">FinRisk</span>
              <div className="card-contactless">
                <Wifi size={18} className="text-emerald-300 rotate-90" />
              </div>
            </div>

            {/* Microchip */}
            <div className="card-emv-chip chip-silver">
              <div className="chip-line chip-line-h"></div>
              <div className="chip-line chip-line-v"></div>
            </div>

            {/* 12-Digit Card Number */}
            <div className="card-number-row number-gradient-silver-lime">
              <span>8391</span>
              <span>5620</span>
              <span>4178</span>
            </div>

            {/* Bottom Meta */}
            <div className="card-bottom-row">
              <div className="card-meta-left">
                <span className="card-meta-label">TIER</span>
                <span className="card-meta-val">PRIME CREDIT</span>
              </div>
              <div className="card-meta-center">
                <span className="card-meta-label">VALID</span>
                <span className="card-meta-val font-mono">11/30</span>
              </div>
              <div className="card-meta-right">
                <span className="card-meta-label">CVV</span>
                <span className="card-cvv-badge">XXX</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            CARD 1: Matte Carbon Black with Purple Sides (Main Hero Card)
            ========================================================= */}
        <div className="card-3d-wrapper card-foreground-main">
          <div className="credit-card-body card-skin-black-hero">
            {/* Gloss reflection overlay */}
            <div className="card-gloss-sheen" />

            {/* Header: Bank Name: FinRisk only */}
            <div className="card-top-row">
              <div className="flex items-center gap-1.5">
                <span className="card-bank-name hero-bank-logo">FinRisk</span>
              </div>
              <div className="card-contactless">
                <Wifi size={22} className="text-zinc-300 rotate-90" />
              </div>
            </div>

            {/* Authentic EMV Chip with metallic sheen */}
            <div className="card-chip-and-network">
              <div className="card-emv-chip chip-brass">
                <div className="chip-line chip-line-h"></div>
                <div className="chip-line chip-line-v"></div>
                <div className="chip-center-core"></div>
              </div>
              <span className="card-tier-flag">CONFIDENTIAL UNDERWRITING</span>
            </div>

            {/* 12-Digit Random Number in Green/Gold/Silver Gradient */}
            <div className="card-number-row number-hero-green-gold">
              <span>4829</span>
              <span>7104</span>
              <span>9382</span>
            </div>

            {/* Bottom Row: Holder, Validity, and written CVV: XXX */}
            <div className="card-bottom-row">
              <div className="card-meta-left">
                <span className="card-meta-label">BORROWER ACCOUNT</span>
                <span className="card-meta-val text-white font-mono">VALUED MEMBER</span>
              </div>

              <div className="card-meta-center">
                <span className="card-meta-label">EXPIRY</span>
                <span className="card-meta-val font-mono text-zinc-300">08/29</span>
              </div>

              <div className="card-meta-right">
                <span className="card-meta-label">SECURITY CODE</span>
                <div className="cvv-pill-wrap">
                  <span className="card-cvv-code">CVV</span>
                  <span className="card-cvv-val">XXX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Trust Badge underneath the 3D Cards */}
      <div className="cards-floating-caption-pill">
        <ShieldCheck size={14} className="text-neonlime" />
        <span>100% Soft Inquiry Safe • Zero Credit Score Impact</span>
      </div>
    </div>
  );
};
