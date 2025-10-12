import { useState, useEffect, useRef, useMemo } from 'react';
import type { OSINTTool } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tools: OSINTTool[];
  onSelectTool: (tool: OSINTTool) => void;
}

export function CommandPalette({ isOpen, onClose, tools, onSelectTool }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredTools = useMemo(() =>
    tools.filter(tool =>
      tool.navn.toLowerCase().includes(query.toLowerCase()) ||
      tool.beskrivelse.toLowerCase().includes(query.toLowerCase()) ||
      tool.kategori.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8) // Limit to 8 results for better UX
  , [tools, query]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredTools.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          onSelectTool(filteredTools[selectedIndex]);
          onClose();
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="command-palette-header">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Søk etter verktøy..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="command-palette-input"
          />
          <kbd className="kbd">ESC</kbd>
        </div>
        
        <div className="command-palette-results" ref={listRef}>
          {filteredTools.length === 0 ? (
            <div className="no-results">
              {query ? 'Ingen verktøy funnet' : 'Begynn å skrive for å søke'}
            </div>
          ) : (
            filteredTools.map((tool, index) => (
              <div
                key={`${tool.navn}-${index}`}
                className={`command-palette-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => {
                  onSelectTool(tool);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="command-item-content">
                  <span className="command-item-name">{tool.navn}</span>
                  <span className="command-item-category">{tool.kategori}</span>
                </div>
                <span
                  className="material-symbols-outlined command-palette-open-link"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tool.url) {
                      window.open(tool.url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  title="Åpne verktøy i ny fane"
                >
                  arrow_outward
                </span>
              </div>
            ))
          )}
        </div>
        
        <div className="command-palette-footer">
          <div className="keyboard-hints">
            <kbd className="kbd">↑↓</kbd>
            <span>navigér</span>
            <kbd className="kbd">↵</kbd>
            <span>åpne</span>
          </div>
        </div>
      </div>
    </div>
  );
}
