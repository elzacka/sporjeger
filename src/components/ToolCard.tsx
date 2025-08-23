import type { OSINTTool } from '../types';

interface ToolCardProps {
  tool: OSINTTool;
  onCopyUrl: (url: string) => void;
}

export function ToolCard({ tool, onCopyUrl }: ToolCardProps) {
  const isGratis = tool.kostnad.toLowerCase().includes('gratis') || 
                  tool.kostnad.toLowerCase().includes('free') ||
                  tool.kostnad === '';

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCopyUrl(tool.url);
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
        <div className="tool-actions">
          <span className={`cost-badge ${isGratis ? 'free' : 'paid'}`}>
            {isGratis ? 'Gratis' : 'Betalt'}
          </span>
          <button
            className="copy-button"
            onClick={handleCopyUrl}
            title="Kopier URL"
            aria-label="Kopier URL til utklippstavle"
          >
            <span className="material-symbols-outlined">content_copy</span>
          </button>
        </div>
      </div>
      
      {tool.beskrivelse && (
        <p className="tool-description">{tool.beskrivelse}</p>
      )}
      
      {tool.detaljer && (
        <p className="tool-details">{tool.detaljer}</p>
      )}
      
      <div className="tool-footer">
        <span className="tool-category">{tool.kategori}</span>
        {tool.url && (
          <span className="tool-url">
            {new URL(tool.url).hostname}
          </span>
        )}
      </div>
    </div>
  );
}