import React, { useState } from 'react';
import { Wifi, Sparkles } from 'lucide-react';

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
  const tiltX = -mousePos.y * 12;
  const tiltY = mousePos.x * 16;

  return (
    <div
      className="hand-cards-stage-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient Atmospheric Lighting & Glowing Halo */}
      <div className="hand-ambient-purple-glow" />
      <div className="hand-ambient-gold-glow" />

      {/* Twinkling Ambient Sparkle Stars */}
      <div className="sparkle-star star-1">✦</div>
      <div className="sparkle-star star-2">✦</div>
      <div className="sparkle-star star-3">✦</div>
      <div className="sparkle-star star-4">✦</div>

      {/* Main 3D Interactive Stage */}
      <div
        className="hand-cards-3d-scene"
        style={{
          transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        }}
      >
        {/* =========================================================
            FLOATING CARDS GROUP (Hovering above the Golden Palm)
            ========================================================= */}
        <div className="floating-cards-cluster">
          {/* Card 2: Champagne Gold Companion Card (Tilted Behind) */}
          <div className="hand-card-item card-gold-back">
            <div className="card-face card-skin-gold">
              {/* Card Top: Bank Name */}
              <div className="hand-card-header">
                <span className="hand-bank-logo text-amber-950 font-bold">FinRisk</span>
                <Wifi size={17} className="text-amber-900/70 rotate-90" />
              </div>

              {/* EMV Chip */}
              <div className="hand-emv-chip chip-gold-theme">
                <div className="emv-line-h" />
                <div className="emv-line-v" />
              </div>

              {/* 12-Digit Number in Metallic Sheen */}
              <div className="hand-card-number text-amber-950/90">
                <span>8391</span>
                <span>5620</span>
                <span>4178</span>
              </div>

              {/* Footer: Expiration & CVV */}
              <div className="hand-card-footer text-amber-950/80">
                <div>
                  <span className="meta-lbl">EXPIRES</span>
                  <span className="meta-val font-mono">11/30</span>
                </div>
                <div>
                  <span className="meta-lbl">CVV</span>
                  <span className="meta-val font-mono font-bold">XXX</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 1: Sleek Matte Black Card with Purple Sides (Hero Foreground) */}
          <div className="hand-card-item card-black-hero">
            <div className="card-face card-skin-black">
              {/* Gloss Reflection Overlay */}
              <div className="card-diagonal-sheen" />

              {/* Card Header: Only "FinRisk" */}
              <div className="hand-card-header">
                <span className="hand-bank-logo text-white font-extrabold tracking-tight">FinRisk</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-neonlime tracking-widest uppercase">PRIME</span>
                  <Wifi size={19} className="text-zinc-300 rotate-90" />
                </div>
              </div>

              {/* Authentic Golden EMV Chip */}
              <div className="hand-emv-chip chip-brass-theme">
                <div className="emv-line-h" />
                <div className="emv-line-v" />
                <div className="emv-core" />
              </div>

              {/* 12-Digit Random Number in Green / Gold / Silver Gradient */}
              <div className="hand-card-number number-gradient-green-gold">
                <span>4829</span>
                <span>7104</span>
                <span>9382</span>
              </div>

              {/* Card Footer: Expiry & Written CVV: XXX */}
              <div className="hand-card-footer">
                <div>
                  <span className="meta-lbl">VALID THRU</span>
                  <span className="meta-val font-mono text-zinc-200">08/29</span>
                </div>
                <div className="text-right">
                  <span className="meta-lbl">SECURITY CODE</span>
                  <div className="cvv-badge-pill">
                    <span className="cvv-tag">CVV</span>
                    <span className="cvv-digits font-mono font-bold text-neonlime">XXX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            SCULPTED METALLIC GOLDEN HAND (Supporting & Holding the Cards)
            ========================================================= */}
        <div className="sculpted-hand-wrapper">
          <svg
            viewBox="0 0 600 380"
            className="sculpted-gold-hand-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Rich Golden Gradients for Realistic Metallic Specular Contours */}
              <linearGradient id="goldPalmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffd875" />
                <stop offset="25%" stopColor="#e5a93c" />
                <stop offset="50%" stopColor="#c58322" />
                <stop offset="75%" stopColor="#9a5e12" />
                <stop offset="100%" stopColor="#5f3506" />
              </linearGradient>

              <linearGradient id="goldFingerGrad1" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#fff3b0" />
                <stop offset="20%" stopColor="#e5aa3f" />
                <stop offset="60%" stopColor="#a76818" />
                <stop offset="100%" stopColor="#553006" />
              </linearGradient>

              <linearGradient id="goldFingerGrad2" x1="10%" y1="10%" x2="90%" y2="90%">
                <stop offset="0%" stopColor="#ffe994" />
                <stop offset="35%" stopColor="#d89b33" />
                <stop offset="70%" stopColor="#8c5310" />
                <stop offset="100%" stopColor="#482403" />
              </linearGradient>

              <linearGradient id="goldWristGrad" x1="0%" y1="40%" x2="100%" y2="60%">
                <stop offset="0%" stopColor="#e5aa3f" />
                <stop offset="40%" stopColor="#c58322" />
                <stop offset="75%" stopColor="#7a440a" />
                <stop offset="100%" stopColor="#3d1e02" />
              </linearGradient>

              <filter id="handGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="-4" dy="12" stdDeviation="16" floodColor="rgba(0,0,0,0.85)" />
                <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="rgba(245,158,11,0.35)" />
              </filter>
            </defs>

            <g filter="url(#handGoldGlow)" className="gold-hand-mesh-group">
              {/* Wrist & Forearm extending from the bottom right */}
              <path
                d="M 600,290 C 530,270 480,260 430,240 C 390,225 350,215 310,210 C 270,205 240,215 210,230 C 230,260 270,290 320,310 C 390,340 480,360 600,380 Z"
                fill="url(#goldWristGrad)"
              />

              {/* Hand Palm Center with Anatomical Metallic Specular Highlights */}
              <path
                d="M 210,230 C 180,240 145,242 120,232 C 95,222 80,202 70,185 C 85,182 110,185 140,192 C 180,202 240,210 290,212 C 320,213 250,225 210,230 Z"
                fill="url(#goldPalmGrad)"
              />

              {/* Pinky Finger (Curved gracefully at the base) */}
              <path
                d="M 85,185 C 60,175 35,165 20,158 C 12,154 8,146 12,140 C 18,132 30,136 48,144 C 70,153 95,168 115,180 Z"
                fill="url(#goldFingerGrad2)"
              />

              {/* Ring Finger */}
              <path
                d="M 115,180 C 85,160 55,142 35,128 C 24,120 22,110 30,104 C 38,98 52,102 75,116 C 105,134 135,158 155,178 Z"
                fill="url(#goldFingerGrad1)"
              />

              {/* Middle Finger (Longest, open upward cradle gesture) */}
              <path
                d="M 155,178 C 120,148 85,120 62,100 C 50,90 48,78 58,70 C 70,62 86,68 112,88 C 145,114 185,146 210,172 Z"
                fill="url(#goldFingerGrad1)"
              />

              {/* Index Finger (Front-most supporting finger) */}
              <path
                d="M 210,172 C 175,140 140,110 115,88 C 102,76 100,64 112,56 C 125,48 142,54 170,76 C 205,104 245,138 275,170 Z"
                fill="url(#goldFingerGrad2)"
              />

              {/* Thumb (Curved naturally along the side) */}
              <path
                d="M 245,215 C 220,185 195,155 185,135 C 178,122 182,112 195,110 C 210,108 225,122 245,145 C 270,175 295,198 310,210 Z"
                fill="url(#goldPalmGrad)"
              />

              {/* Polished Metallic Specular Light Streaks on Knuckles & Fingers */}
              <ellipse cx="140" cy="85" rx="32" ry="4" transform="rotate(-38 140 85)" fill="#ffffff" opacity="0.32" />
              <ellipse cx="90" cy="98" rx="28" ry="3.5" transform="rotate(-38 90 98)" fill="#ffffff" opacity="0.28" />
              <ellipse cx="215" cy="148" rx="24" ry="4" transform="rotate(-34 215 148)" fill="#ffffff" opacity="0.25" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
