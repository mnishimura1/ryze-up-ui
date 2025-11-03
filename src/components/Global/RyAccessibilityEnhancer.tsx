import React, { useEffect, useState } from 'react';

interface RyAccessibilityEnhancerProps {
  children: React.ReactNode;
}

export const RyAccessibilityEnhancer: React.FC<RyAccessibilityEnhancerProps> = ({ children }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);
  const [screenReaderActive, setScreenReaderActive] = useState(false);

  useEffect(() => {
    // Detect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const motionListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionListener);

    // Detect prefers-contrast (high contrast mode)
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(contrastQuery.matches);

    const contrastListener = (e: MediaQueryListEvent) => setPrefersHighContrast(e.matches);
    contrastQuery.addEventListener('change', contrastListener);

    // Detect screen reader (ARIA live regions)
    const checkScreenReader = () => {
      // Basic heuristic: check if any ARIA live region attribute exists
      const ariaLiveElement = document.querySelector('[aria-live]');
      setScreenReaderActive(!!ariaLiveElement || navigator.userAgent.includes('Screen Reader'));
    };

    checkScreenReader();
    const observer = new MutationObserver(checkScreenReader);
    observer.observe(document.documentElement, { attributes: true, subtree: true });

    return () => {
      motionQuery.removeEventListener('change', motionListener);
      contrastQuery.removeEventListener('change', contrastListener);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Apply accessibility attributes to root
    document.documentElement.setAttribute('data-reduced-motion', prefersReducedMotion ? 'true' : 'false');
    document.documentElement.setAttribute('data-high-contrast', prefersHighContrast ? 'true' : 'false');

    // Enhance focus management
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }, [prefersReducedMotion, prefersHighContrast]);

  return (
    <div
      role="application"
      aria-label="RYZE-UP Trading Dashboard"
      data-reduced-motion={prefersReducedMotion}
      data-high-contrast={prefersHighContrast}
      className={`${prefersReducedMotion ? 'reduce-motion' : ''} ${prefersHighContrast ? 'high-contrast' : ''}`}
    >
      <style>{`
        ${prefersReducedMotion ? `
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        ` : ''}

        ${prefersHighContrast ? `
          :root {
            --bg: #000 !important;
            --text: #fff !important;
            --panel: #111 !important;
            --border: #fff !important;
          }
          * {
            border-width: 2px !important;
          }
        ` : ''}

        /* Keyboard focus indicators */
        body.keyboard-navigation *:focus {
          outline: 3px solid #ff1493 !important;
          outline-offset: 2px;
        }

        /* Skip link for accessibility */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        .sr-only:focus {
          position: static;
          width: auto;
          height: auto;
          padding: inherit;
          margin: inherit;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }

        /* Touch target sizing for mobile */
        @media (max-width: 640px) {
          button, a, input, select, textarea {
            min-height: 44px;
            min-width: 44px;
          }
        }

        /* Orientation handling */
        @media (orientation: landscape) {
          .portrait-only { display: none; }
        }
        @media (orientation: portrait) {
          .landscape-only { display: none; }
        }
      `}</style>

      {/* Skip to main content link */}
      <a href="#main-content" className="sr-only">
        Skip to main content
      </a>

      {children}
    </div>
  );
};

export default RyAccessibilityEnhancer;
