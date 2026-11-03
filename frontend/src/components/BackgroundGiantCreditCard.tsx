import React from 'react';
import { Wifi } from 'lucide-react';

export const BackgroundGiantCreditCard: React.FC = () => {
  return (
    <div className="giant-bg-card-stage" aria-hidden="true">
      {/* Ambient Cosmic Purple & Gold Atmospheric Halo */}
      <div className="giant-bg-glow-purple" />
      <div className="giant-bg-glow-gold" />

      {/* 3D Floating Giant Credit Card */}
      <div className="giant-bg-card-orbit">
        <div className="giant-bg-credit-card">
          {/* Surface Gloss, Holographic Shimmer & Metallic Gold Sweep */}
          <div className="giant-card-gloss" />
          <div className="giant-card-gold-sweep" />
          <div className="giant-card-circuit-pattern" />

          {/* Top Row: FinRisk Brand in Gold & Contactless Signal */}
          <div className="giant-card-header">
            <div className="giant-brand-group">
              <span className="giant-brand-name">FinRisk</span>
              <span className="giant-brand-edition">ROYAL PURPLE &bull; GOLD &bull; SILVER</span>
            </div>
            <div className="giant-contactless-wrap">
              <Wifi size={38} className="rotate-90 text-amber-300" />
            </div>
          </div>

          {/* Middle Row: Luxury EMV Brass Chip & Holographic Security Seal */}
          <div className="giant-card-mid-row">
            <div className="giant-emv-chip">
              <div className="giant-chip-line chip-h1" />
              <div className="giant-chip-line chip-h2" />
              <div className="giant-chip-line chip-v1" />
              <div className="giant-chip-core" />
            </div>

            <div className="giant-hologram-seal">
              <div className="giant-hologram-inner">
                <span className="hologram-infinity">&infin;</span>
                <span className="hologram-lbl">SECURE</span>
              </div>
            </div>
          </div>

          {/* Prominent Embossed AAAA - AAAA Numbers */}
          <div className="giant-card-number-row">
            <span className="giant-num-cluster">AAAA</span>
            <span className="giant-num-bullet">&bull;</span>
            <span className="giant-num-cluster">AAAA</span>
            <span className="giant-num-bullet">&bull;</span>
            <span className="giant-num-cluster">AAAA</span>
            <span className="giant-num-bullet">&bull;</span>
            <span className="giant-num-cluster">AAAA</span>
          </div>

          {/* Bottom Row: Cardholder, Expiry & CVV */}
          <div className="giant-card-footer">
            <div className="giant-meta-col">
              <span className="giant-meta-label">AUTHORIZED CARDHOLDER</span>
              <span className="giant-meta-value">AAAA AAAA</span>
            </div>

            <div className="giant-meta-col">
              <span className="giant-meta-label">VALID THRU</span>
              <span className="giant-meta-value">AA/AA</span>
            </div>

            <div className="giant-meta-col">
              <span className="giant-meta-label">CVV SECURITY</span>
              <span className="giant-meta-value giant-cvv-badge">AAA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
