import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface AttributionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AttributionModal({ isOpen, onClose }: AttributionModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="guide-modal-overlay" onClick={onClose}>
      <div className="guide-modal attribution-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="guide-modal-close"
          onClick={onClose}
          title="Lukk (Esc)"
        >
          ×
        </button>
        <div className="guide-modal-content attribution-content">
          {/*
            USER NOTE: You can edit the attribution text below.
            This content is displayed when users click the info icon.
          */}
          <div className="attribution-section">
            <h3>Om Sporjeger</h3>
	    <p>
  Sporjeger er en katalog med OSINT*-verktøy. Katalogen skal gjøre det enklere å finne og velge nyttige verktøy for å søke i åpne kilder på internett. Og for å jobbe med materialet underveis.
	    </p>
	    <p>
  Sporjeger er laget for alle – ikke bare OSINT-folk. Kanskje du liker å se i gamle avisutklipp, trenger å finne kilder til skolearbeid, materiale til presentasjoner eller utforske offentlig tilgjengelig informasjon på nett?
	    </p>
	    <p style={{ fontStyle: 'italic' }}>
  *Open Source Intelligence
	    </p>
          <div className="attribution-section">
            <h3>Datakilder</h3>
            <p>
              Den internasjonale og uavhengige gravegruppa Bellingcat har revolusjonert den undersøkende journalistikken ved å utnytte kraften i åpne kilder og digital etterretning.
            </p>
	    <p>
              De fleste verktøyene er hentet fra <a href="https://bellingcat.gitbook.io/toolkit" target="_blank" rel="noopener noreferrer">
                Bellingcat's Online Open Source Investigation Toolkit
              </a>. Andre har jeg funnet og brukt selv.
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
