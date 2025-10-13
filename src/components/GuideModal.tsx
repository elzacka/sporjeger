import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  guideContent: string;
}

export function GuideModal({ isOpen, onClose, guideContent }: GuideModalProps) {
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

  if (!isOpen || !guideContent) return null;

  const isUrl = guideContent.startsWith('http://') || guideContent.startsWith('https://');

  return createPortal(
    <div className="guide-modal-overlay" onClick={onClose}>
      <div className="guide-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="guide-modal-close"
          onClick={onClose}
          title="Lukk (Esc)"
        >
          ×
        </button>
        <div className="guide-modal-content">
          {isUrl ? (
            <div className="guide-url-content">
              <a
                href={guideContent}
                target="_blank"
                rel="noopener noreferrer"
                className="guide-external-link"
              >
                {guideContent}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 6.5v3.5H2V2h3.5M6.5 2H10v3.5M10 2L5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          ) : (
            <div className="guide-text-content">
              {guideContent.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
