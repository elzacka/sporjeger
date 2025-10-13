import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { formatMarkdownText } from '../utils/formatText';

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
              </a>
            </div>
          ) : (
            <div className="guide-text-content formatted">
              {formatMarkdownText(guideContent)}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
