import { useState } from 'react';
import type { OSINTTool } from '../types';
import { GuideModal } from './GuideModal';
import { StarIcon } from './StarIcon';
import {
  parseCostInfo,
  extractHostname,
  parseDifficultyInfo,
  extractFirstLanguage
} from '../utils/toolHelpers';

interface ToolCardProps {
  tool: OSINTTool;
}

/**
 * Tool Card Component
 * React 19.2: Business logic extracted to utilities for better testability
 * React Compiler handles memoization automatically
 */
export function ToolCard({ tool }: ToolCardProps) {
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Parse tool data using utility functions
  const costInfo = parseCostInfo(tool.kostnad);
  const hostname = extractHostname(tool.url);
  const difficultyInfo = parseDifficultyInfo(tool.vanskelighetsgrad);
  const firstLanguage = extractFirstLanguage(tool.språk);


  const handleOpenUrl = () => {
    if (tool.url) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenGuide = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setIsGuideModalOpen(true);
  };

  return (
    <div
      className="tool-card"
      onClick={(e) => {
        // Don't open URL if guide button was clicked
        if ((e.target as HTMLElement).closest('.guide-link')) return;
        handleOpenUrl();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        // Don't trigger if guide button has focus
        if ((e.target as HTMLElement).closest('.guide-link')) return;

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

      <div className="tool-footer">
        <div className="tool-tags-wrapper">
          <div className="tool-tags">
            <span className="tool-category">{tool.kategori}</span>
            <span className={`tool-cost-tag ${costInfo.type}`}>
              {costInfo.displayText}
            </span>
            {firstLanguage && (
              <span className="language-tag" title={tool.språk}>
                {firstLanguage}
              </span>
            )}
          </div>
          {difficultyInfo && (
            <div className="difficulty-stars" title={`Vanskelighetsgrad: ${difficultyInfo.label}`}>
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={i < difficultyInfo.level} />
              ))}
            </div>
          )}
        </div>
        <div className="tool-footer-row">
          {hostname && (
            <span className="tool-url">
              {hostname}
            </span>
          )}
          {tool.veiledning && (
            <button
              className="guide-link"
              onClick={handleOpenGuide}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenGuide(e);
                }
              }}
              tabIndex={0}
              aria-label={`Åpne guide for ${tool.navn}`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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