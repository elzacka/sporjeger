import { useState } from 'react';
import type { OSINTTool } from '../types';
import { GuideModal } from './GuideModal';

interface ToolCardProps {
  tool: OSINTTool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const kostnadLower = tool.kostnad.toLowerCase();
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
    if (isGratisMedKjop) return 'Gratis med kjøp';
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
        <div className="tool-meta-row">
          <span className={`difficulty-badge difficulty-${getDifficultyLevel()}`}>
            {getDifficultyLabel()}
          </span>
        </div>
      )}

      <div className="tool-footer">
        <div className="tool-tags">
          <span className="tool-category">{tool.kategori}</span>
          <span className={`tool-cost-tag ${getCostType()}`}>
            {getCostText()}
          </span>
          {(tool.språk === 'Norsk' || tool.detaljer === '🇳🇴 Norsk') && (
            <span className="norwegian-flag" title="Norsk">🇳🇴</span>
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
              title="Åpne Bellingcat-veiledning"
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
}