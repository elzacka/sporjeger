import { createPortal } from 'react-dom';
import { Activity } from './Activity';
import { useModalEscapeKey } from '../hooks/useModalEscapeKey';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { formatMarkdownText } from '../utils/formatText';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  guideContent: string;
}

export function GuideModal({ isOpen, onClose, guideContent }: GuideModalProps) {
  // Accessibility: Escape key + scroll lock
  useModalEscapeKey(isOpen, onClose);

  // Accessibility: Focus trap for keyboard navigation (WCAG 2.4.3)
  const containerRef = useFocusTrap(isOpen);

  if (!guideContent) return null;

  const isUrl = guideContent.startsWith('http://') || guideContent.startsWith('https://');

  // React 19.2: Activity component preserves modal state while hidden
  return createPortal(
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <div className="guide-modal-overlay" onClick={onClose}>
      <div ref={containerRef} className="guide-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="guide-modal-close"
          onClick={onClose}
          aria-label="Lukk modal (ESC)"
          title="Lukk (Esc)"
        >
          <span aria-hidden="true">×</span>
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
      </div>
    </Activity>,
    document.body
  );
}
