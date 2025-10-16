import { useState, useEffect } from 'react';

/**
 * iOS 26 Web App Install Prompt
 *
 * iOS 26 allows any website to be added to Home Screen as a web app.
 * This component provides a helpful prompt to guide users through installation.
 */
export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed (running as PWA)
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as Navigator & { standalone?: boolean }).standalone ||
                      document.referrer.includes('android-app://');
    setIsStandalone(standalone);

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('install-prompt-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const daysSinceDismissal = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Show prompt if: iOS device, not standalone, and (never dismissed OR dismissed >7 days ago)
    if (iOS && !standalone && (!dismissed || daysSinceDismissal > 7)) {
      // Show prompt after 30 seconds to avoid being intrusive
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('install-prompt-dismissed', Date.now().toString());
  };

  const handleNeverShow = () => {
    setShowPrompt(false);
    localStorage.setItem('install-prompt-dismissed', '9999999999999'); // Far future
  };

  if (!showPrompt || !isIOS || isStandalone) {
    return null;
  }

  return (
    <div className="install-prompt-overlay" role="dialog" aria-labelledby="install-prompt-title" aria-modal="true">
      <div className="install-prompt-card">
        <button
          className="install-prompt-close"
          onClick={handleDismiss}
          aria-label="Lukk installasjonsveiledning"
        >
          <span className="material-symbols-outlined" aria-hidden="true">close</span>
        </button>

        <div className="install-prompt-icon">
          <svg viewBox="0 0 48 48" xmlns="https://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="24" cy="24" r="20" fill="var(--matrix-green)" fillOpacity="0.2" stroke="var(--matrix-green)" strokeWidth="2"/>
            <path d="M24 14v14M17 21l7-7 7 7" stroke="var(--matrix-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <rect x="16" y="30" width="16" height="4" rx="1" fill="var(--matrix-green)"/>
          </svg>
        </div>

        <h2 id="install-prompt-title" className="install-prompt-title">
          Installer Sporjeger
        </h2>

        <p className="install-prompt-description">
          Legg til Sporjeger på hjemskjermen for rask tilgang og en bedre opplevelse.
        </p>

        <ol className="install-prompt-steps">
          <li>
            <span className="step-number">1</span>
            <span>Trykk på <strong>del-knappen</strong> <span className="material-symbols-outlined inline-icon">ios_share</span> nederst i Safari</span>
          </li>
          <li>
            <span className="step-number">2</span>
            <span>Rull ned og velg <strong>"Legg til på Hjem-skjerm"</strong></span>
          </li>
          <li>
            <span className="step-number">3</span>
            <span>Trykk på <strong>"Legg til"</strong> øverst til høyre</span>
          </li>
        </ol>

        <div className="install-prompt-actions">
          <button
            className="install-prompt-btn-secondary"
            onClick={handleDismiss}
          >
            Kanskje senere
          </button>
          <button
            className="install-prompt-btn-primary"
            onClick={handleNeverShow}
          >
            Ikke vis igjen
          </button>
        </div>

        <p className="install-prompt-benefit">
          <span className="material-symbols-outlined" aria-hidden="true">offline_bolt</span>
          Fungerer offline etter installasjon
        </p>
      </div>
    </div>
  );
}
