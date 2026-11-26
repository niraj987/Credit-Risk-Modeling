import React from 'react';

interface TextMarqueeProps {
  phrases: string[];
  reverse?: boolean;
  className?: string;
}

/**
 * Full-bleed "rail" of oversized type that scrolls continuously.
 * Two identical groups are rendered so the -50% translate loops seamlessly.
 */
export const TextMarquee: React.FC<TextMarqueeProps> = ({
  phrases,
  reverse = false,
  className = '',
}) => (
  <div
    className={`text-marquee ${reverse ? 'reverse' : ''} ${className}`.trim()}
    aria-hidden="true"
  >
    <div className="text-marquee-track">
      {[0, 1].map((pass) => (
        <div className="text-marquee-group" key={pass}>
          {phrases.map((phrase, index) => (
            <React.Fragment key={`${pass}-${index}`}>
              <span
                className={`text-marquee-item ${
                  index % 3 === 0 ? 'solid' : index % 3 === 1 ? 'lime' : ''
                }`.trim()}
              >
                {phrase}
              </span>
              <span className="text-marquee-dot" />
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  </div>
);
