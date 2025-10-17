import { useState, useRef, useEffect } from 'react';
import { Activity } from './Activity';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MenuProps {
  // Can be extended with additional menu items in the future
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Menu(_props: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close menu on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div className="menu-container">
      <button
        ref={buttonRef}
        className="menu-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Åpne meny"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* React 19.2: Activity component for smooth transitions */}
      <Activity mode={isOpen ? 'visible' : 'hidden'}>
        <div ref={menuRef} className="menu-dropdown">
          <div className="menu-section info-section">
            <h3 className="menu-section-title">
              Om Sporjeger
            </h3>
            <div className="menu-section-content">
              <p>
                Sporjeger er en OSINT*-verktøykasse for å finne materiale i åpne kilder på internett og jobbe med materialet underveis.
              </p>
              <p>
                Jo færre stjerner, jo enklere å bruke. Klikk Guide og lær deg smarte søkemåter. Den gamle avisartikkelen, kildene du trenger til skolearbeidet eller svar på hva som faktisk er de vanligste digitale sårbarhetene i Norge. Men husk: Stopp i tide hvis du er nysgjerrig på sårbarheter. Bruk for å lære, oppfør deg ordentlig.
              </p>
              <p className="info-note">
                *Open Source Intelligence
              </p>
            </div>
          </div>

          <div className="menu-section">
            <h3 className="menu-section-title">
              Datakilder
            </h3>
            <div className="menu-section-content">
              <p>
                Den internasjonale og uavhengige gravegruppa Bellingcat har revolusjonert den undersøkende journalistikken ved å utnytte kraften i åpne kilder og digital etterretning.
              </p>
              <p>
                De fleste verktøyene er hentet fra{' '}
                <a
                  href="https://bellingcat.gitbook.io/toolkit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="menu-link"
                >
                  Bellingcat's Online Open Source Investigation Toolkit
                </a>
                . Andre har jeg funnet og brukt selv.
              </p>
            </div>
          </div>
        </div>
      </Activity>
    </div>
  );
}
