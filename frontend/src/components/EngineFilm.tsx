import React, { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

/**
 * Silent looping pipeline film. Tries to autoplay when scrolled into view and
 * falls back to an explicit play button when the browser blocks autoplay.
 */
export const EngineFilm: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    const tryPlay = () => {
      video
        .play()
        .then(() => setBlocked(false))
        .catch(() => setBlocked(true));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) tryPlay();
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    tryPlay();

    return () => observer.disconnect();
  }, []);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video
      .play()
      .then(() => setBlocked(false))
      .catch(() => setBlocked(true));
  };

  return (
    <div className="media-video-shell">
      <video
        ref={videoRef}
        className="media-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/video-poster.jpg"
        aria-label="Animated walkthrough of the underwriting pipeline"
      >
        <source src="/media/underwriting-flow.mp4" type="video/mp4" />
      </video>

      {blocked && (
        <button
          type="button"
          className="media-play-overlay"
          onClick={handlePlay}
          aria-label="Play the pipeline film"
        >
          <span className="media-play-btn">
            <Play size={22} />
          </span>
          <span className="media-play-text">Play the 16-second pipeline film</span>
        </button>
      )}

      <div className="media-video-caption">
        <div>
          <div className="media-video-title">The underwriting pipeline, end to end</div>
          <div className="media-video-sub">
            Profile ingestion, risk scoring, statutory citations, stress testing and the final verdict.
          </div>
        </div>
        <span className="media-live-chip">Silent loop</span>
      </div>
    </div>
  );
};
