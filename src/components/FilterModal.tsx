import { useEffect } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: { value: string; label: string; icon?: string }[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

export function FilterModal({
  isOpen,
  onClose,
  title,
  options,
  selectedValues,
  onToggle
}: FilterModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggle = (value: string) => {
    onToggle(value);
  };

  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="filter-modal-header">
          <h3 className="filter-modal-title">{title}</h3>
          <button
            className="filter-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="filter-modal-content">
          {options.map((option) => (
            <button
              key={option.value}
              className={`filter-modal-option ${
                selectedValues.includes(option.value) ? 'selected' : ''
              }`}
              data-value={option.value}
              onClick={() => handleToggle(option.value)}
            >
              {option.icon && (
                <span className="material-symbols-outlined filter-option-icon">
                  {option.icon}
                </span>
              )}
              <span className="filter-option-label">{option.label}</span>
              {selectedValues.includes(option.value) && (
                <span className="material-symbols-outlined filter-option-check">
                  check
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
