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
            CARD 2: Lustrous Brushed Champagne Gold (Matches Reference Image)
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

        {/* =========================================================
            3D SCULPTED METALLIC GOLDEN HAND CRADLING THE CARDS
            Directly replicates the open-palm luxury aesthetic from reference photo
            ========================================================= */}
        <div className="sculpted-golden-hand-wrapper">
          <svg
            viewBox="0 0 520 320"
            className="golden-hand-svg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Metallic Gold Primary Gradient */}
              <linearGradient id="goldHandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="18%" stopColor="#78350f" />
                <stop offset="38%" stopColor="#b45309" />
                <stop offset="58%" stopColor="#d97706" />
                <stop offset="72%" stopColor="#f59e0b" />
                <stop offset="85%" stopColor="#fde047" />
                <stop offset="92%" stopColor="#ffffff" />
                <stop offset="97%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>

              {/* Specular Ridge Gradient */}
              <linearGradient id="goldRidgeGrad" x1="10%" y1="0%" x2="90%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="30%" stopColor="#fef08a" stopOpacity="0.75" />
                <stop offset="65%" stopColor="#eab308" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
              </linearGradient>

              {/* Palm Shadow Gradient */}
              <radialGradient id="goldPalmHollow" cx="45%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#291203" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#78350f" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
              </radialGradient>

              {/* Golden Ambient Glow & Drop Shadow */}
              <filter id="goldHandDropShadow" x="-15%" y="-15%" width="130%" height="130%">
                <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#000000" floodOpacity="0.75" />
                <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#f59e0b" floodOpacity="0.35" />
              </filter>
            </defs>

            <g filter="url(#goldHandDropShadow)">
              {/* Forearm & Wrist flowing in from bottom right */}
              <path
                d="M 440 320 C 470 290 510 260 520 230 C 490 220 440 240 390 270 C 370 285 365 305 385 320 Z"
                fill="url(#goldHandGrad)"
              />
              <path
                d="M 435 315 C 475 280 505 250 515 235"
                stroke="url(#goldRidgeGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.8"
              />

              {/* Palm Mound & Base (Supporting the floating cards) */}
              <path
                d="M 390 270 C 430 240 470 200 450 170 C 430 145 380 160 340 185 C 300 205 260 220 220 230 C 260 260 320 280 390 270 Z"
                fill="url(#goldHandGrad)"
              />
              <ellipse
                cx="350"
                cy="210"
                rx="65"
                ry="30"
                fill="url(#goldPalmHollow)"
                transform="rotate(-15 350 210)"
              />

              {/* Pinky Finger (Curved gracefully at base) */}
              <path
                d="M 240 245 C 200 250 160 255 140 240 C 125 228 135 215 155 218 C 180 222 220 230 250 235 Z"
                fill="url(#goldHandGrad)"
              />
              <path
                d="M 142 238 C 160 248 200 245 240 240"
                stroke="url(#goldRidgeGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Ring Finger (Extended under lower card edge) */}
              <path
                d="M 230 230 C 180 232 120 235 95 215 C 80 202 92 188 115 192 C 145 198 195 208 235 215 Z"
                fill="url(#goldHandGrad)"
              />
              <path
                d="M 98 212 C 122 225 175 224 225 222"
                stroke="url(#goldRidgeGrad)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Middle Finger (Longest sculpted finger cradling card bottom) */}
              <path
                d="M 235 210 C 170 210 90 210 60 185 C 45 172 58 158 82 162 C 120 170 185 185 240 195 Z"
                fill="url(#goldHandGrad)"
              />
              <path
                d="M 64 182 C 92 198 160 198 230 200"
                stroke="url(#goldRidgeGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Index Finger (Curved gracefully under front card) */}
              <path
                d="M 260 190 C 200 188 120 182 90 155 C 76 142 90 128 115 132 C 150 140 210 160 270 175 Z"
                fill="url(#goldHandGrad)"
              />
              <path
                d="M 94 152 C 122 170 190 175 255 180"
                stroke="url(#goldRidgeGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Sculpted Thumb (Foreground finger, arched along card's right rim) */}
              <path
                d="M 395 215 C 420 180 415 135 375 110 C 355 98 340 108 348 125 C 360 150 370 185 365 210 Z"
                fill="url(#goldHandGrad)"
              />
              <path
                d="M 372 112 C 400 135 408 175 390 210"
                stroke="url(#goldRidgeGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Specular Knuckle & Joint Accents */}
              <ellipse cx="270" cy="180" rx="9" ry="5" fill="#ffffff" opacity="0.65" transform="rotate(-15 270 180)" />
              <ellipse cx="245" cy="200" rx="9" ry="5" fill="#ffffff" opacity="0.6" transform="rotate(-15 245 200)" />
              <ellipse cx="238" cy="220" rx="8" ry="4" fill="#ffffff" opacity="0.55" transform="rotate(-15 238 220)" />
              <ellipse cx="370" cy="120" rx="7" ry="4" fill="#ffffff" opacity="0.8" transform="rotate(35 370 120)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
