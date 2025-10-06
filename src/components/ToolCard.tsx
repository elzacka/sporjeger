import type { OSINTTool } from '../types';

interface ToolCardProps {
  tool: OSINTTool;
}

export function ToolCard({ tool }: ToolCardProps) {
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

  const handleOpenUrl = () => {
    if (tool.url) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
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
      
      {tool.detaljer && tool.detaljer !== '🇳🇴 Norsk' && (
        <p className="tool-details">{tool.detaljer}</p>
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
        {tool.url && (
          <span className="tool-url">
            {new URL(tool.url).hostname}
          </span>
        )}
      </div>
    </div>
  );
}