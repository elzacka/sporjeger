import { useState, memo } from 'react';
import type { OSINTTool } from '../types';
import { GuideModal } from './GuideModal';

interface ToolCardProps {
  tool: OSINTTool;
}

export const ToolCard = memo(function ToolCard({ tool }: ToolCardProps) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const kostnadLower = (tool.kostnad || '').toLowerCase();
  const isGratis = kostnadLower.includes('gratis') ||
                  kostnadLower.includes('free') ||
                  tool.kostnad === '';
  const isGratisMedKjop = kostnadLower.includes('gratis med kjøp');

  const getCostType = () => {
    if (isGratisMedKjop) return 'gratis_med_kjop';
    if (isGratis) return 'free';
    return 'paid';
  };

  const getCostText = () => {
    if (isGratisMedKjop) return 'Gratis m. kjøp';
    if (isGratis) return 'Gratis';
    return 'Betalt';
  };

  const getHostname = (url: string) => {
    if (!url || url.trim() === '') return '';
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const getDifficultyLevel = () => {
    if (!tool.vanskelighetsgrad) return null;
    const level = parseInt(tool.vanskelighetsgrad);
    if (isNaN(level) || level < 1 || level > 5) return null;
    return level;
  };

  const getDifficultyLabel = () => {
    const level = getDifficultyLevel();
    if (!level) return null;
    const labels = ['Veldig enkel', 'Enkel', 'Middels', 'Avansert', 'Ekspert'];
    return labels[level - 1];
  };

  const getDesignQuality = () => {
    if (!tool.designkvalitet) return null;
    const quality = parseInt(tool.designkvalitet);
    if (isNaN(quality) || quality < 1 || quality > 3) return null;
    return quality;
  };

  const getDesignQualityConfig = () => {
    const quality = getDesignQuality();
    if (!quality) return null;

    const configs = {
      1: { icon: 'circle', label: 'Dårlig design', class: 'quality-poor' },
      2: { icon: 'circle', label: 'Middels design', class: 'quality-medium' },
      3: { icon: 'circle', label: 'Godt design', class: 'quality-good' }
    };

    return configs[quality as keyof typeof configs];
  };

  const getRegistrationConfig = () => {
    const requirement = tool.kreverRegistrering || 'Nei';

    const configs = {
      'Ja': { icon: 'account_circle', label: 'Krever brukerkonto', class: 'reg-required' },
      'Delvis': { icon: 'account_circle', label: 'Delvis tilgjengelig uten konto', class: 'reg-partial' },
      'Nei': { icon: 'no_accounts', label: 'Ingen registrering nødvendig', class: 'reg-none' }
    };

    return configs[requirement as keyof typeof configs] || null;
  };

  const handleOpenUrl = () => {
    if (tool.url) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenGuide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGuideModalOpen(true);
  };

  return (
    <div 
      className="tool-card"
      onClick={handleOpenUrl}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpenUrl();
        }
      }}
    >
      <div className="tool-card-header">
        <h3 className="tool-name">{tool.navn}</h3>
      </div>

      {tool.beskrivelse && (
        <p className="tool-description">{tool.beskrivelse}</p>
      )}

      {getDifficultyLevel() && (
        <div className="difficulty-stars" title={`Vanskelighetsgrad: ${getDifficultyLabel()}`}>
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`star ${i < getDifficultyLevel()! ? 'filled' : 'empty'}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1.5l1.545 4.757h5.005l-4.045 2.986 1.545 4.757L8 11.014 3.95 14l1.545-4.757L1.45 6.257h5.005z"
                fill="currentColor"
              />
            </svg>
          ))}
        </div>
      )}

      <div className="tool-footer">
        <div className="tool-tags">
          <span className="tool-category">{tool.kategori}</span>
          <span className={`tool-cost-tag ${getCostType()}`}>
            {getCostText()}
          </span>
          {getRegistrationConfig() && (
            <span
              className={`registration-badge ${getRegistrationConfig()!.class}`}
              title={getRegistrationConfig()!.label}
            >
              <span className="material-symbols-outlined registration-icon">
                {getRegistrationConfig()!.icon}
              </span>
            </span>
          )}
          {getDesignQualityConfig() && (
            <span
              className={`design-quality-badge ${getDesignQualityConfig()!.class}`}
              title={getDesignQualityConfig()!.label}
            >
              <span className="material-symbols-outlined quality-icon">
                {getDesignQualityConfig()!.icon}
              </span>
            </span>
          )}
          {tool.språk && (
            <span className="language-tag" title={tool.språk}>
              {tool.språk.split(' ')[0]}
            </span>
          )}
        </div>
        <div className="tool-footer-row">
          {tool.url && (
            <span className="tool-url">
              {getHostname(tool.url)}
            </span>
          )}
          {tool.veiledning && (
            <button
              className="guide-link"
              onClick={handleOpenGuide}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2h8v8H2V2z" stroke="currentColor" strokeWidth="1"/>
                <path d="M4 5h4M4 7h3" stroke="currentColor" strokeWidth="1"/>
              </svg>
              Guide
            </button>
          )}
        </div>
      </div>

      {tool.veiledning && (
        <GuideModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
          toolName={tool.navn}
          guideContent={tool.veiledning}
        />
      )}
    </div>
  );
});