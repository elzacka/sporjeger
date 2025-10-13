import { createElement } from 'react';
import type { ReactNode } from 'react';

/**
 * Parse and format Markdown-style text into React elements
 * Supports:
 * - **bold** and *italic*
 * - # Headings (h1-h6)
 * - Bullet lists (- or *)
 * - Numbered lists (1. 2. etc)
 * - Paragraphs (blank line separated)
 */

interface ParsedElement {
  type: 'heading' | 'paragraph' | 'bulletList' | 'numberedList' | 'blank';
  level?: number;
  content: string;
  items?: string[];
}

function parseMarkdownLine(line: string): ReactNode {
  // Parse inline formatting: **bold**, *italic*
  const parts: ReactNode[] = [];
  let currentText = line;
  let key = 0;

  while (currentText.length > 0) {
    // Check for **bold**
    const boldMatch = currentText.match(/\*\*([^*]+)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      // Add text before bold
      if (boldMatch.index > 0) {
        parts.push(currentText.slice(0, boldMatch.index));
      }
      // Add bold text
      parts.push(<strong key={`bold-${key++}`}>{boldMatch[1]}</strong>);
      currentText = currentText.slice(boldMatch.index + boldMatch[0].length);
      continue;
    }

    // Check for *italic*
    const italicMatch = currentText.match(/\*([^*]+)\*/);
    if (italicMatch && italicMatch.index !== undefined) {
      // Add text before italic
      if (italicMatch.index > 0) {
        parts.push(currentText.slice(0, italicMatch.index));
      }
      // Add italic text
      parts.push(<em key={`italic-${key++}`}>{italicMatch[1]}</em>);
      currentText = currentText.slice(italicMatch.index + italicMatch[0].length);
      continue;
    }

    // No more formatting found
    parts.push(currentText);
    break;
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

function parseLines(text: string): ParsedElement[] {
  const lines = text.split('\n');
  const elements: ParsedElement[] = [];
  let currentList: { type: 'bulletList' | 'numberedList'; items: string[] } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Blank line
    if (trimmed === '') {
      if (currentList) {
        elements.push({ ...currentList, content: '' });
        currentList = null;
      }
      elements.push({ type: 'blank', content: '' });
      continue;
    }

    // Heading (# H1, ## H2, etc)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (currentList) {
        elements.push({ ...currentList, content: '' });
        currentList = null;
      }
      elements.push({
        type: 'heading',
        level: headingMatch[1].length,
        content: headingMatch[2],
      });
      continue;
    }

    // Bullet list (- or *)
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      if (currentList && currentList.type !== 'bulletList') {
        elements.push({ ...currentList, content: '' });
        currentList = null;
      }
      if (!currentList) {
        currentList = { type: 'bulletList', items: [] };
      }
      currentList.items.push(bulletMatch[1]);
      continue;
    }

    // Numbered list (1. 2. etc)
    const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (numberedMatch) {
      if (currentList && currentList.type !== 'numberedList') {
        elements.push({ ...currentList, content: '' });
        currentList = null;
      }
      if (!currentList) {
        currentList = { type: 'numberedList', items: [] };
      }
      currentList.items.push(numberedMatch[1]);
      continue;
    }

    // Regular paragraph
    if (currentList) {
      elements.push({ ...currentList, content: '' });
      currentList = null;
    }
    elements.push({ type: 'paragraph', content: trimmed });
  }

  // Add any remaining list
  if (currentList) {
    elements.push({ ...currentList, content: '' });
  }

  return elements;
}

export function formatMarkdownText(text: string): ReactNode[] {
  const elements = parseLines(text);
  const result: ReactNode[] = [];

  elements.forEach((element, index) => {
    switch (element.type) {
      case 'heading': {
        const tag = `h${element.level}`;
        result.push(
          createElement(
            tag,
            { key: `heading-${index}` },
            parseMarkdownLine(element.content)
          )
        );
        break;
      }

      case 'paragraph':
        if (element.content) {
          result.push(
            <p key={`p-${index}`}>{parseMarkdownLine(element.content)}</p>
          );
        }
        break;

      case 'bulletList':
        if (element.items && element.items.length > 0) {
          result.push(
            <ul key={`ul-${index}`}>
              {element.items.map((item, i) => (
                <li key={`li-${i}`}>{parseMarkdownLine(item)}</li>
              ))}
            </ul>
          );
        }
        break;

      case 'numberedList':
        if (element.items && element.items.length > 0) {
          result.push(
            <ol key={`ol-${index}`}>
              {element.items.map((item, i) => (
                <li key={`li-${i}`}>{parseMarkdownLine(item)}</li>
              ))}
            </ol>
          );
        }
        break;

      case 'blank':
        // Skip blank lines (spacing handled by CSS)
        break;
    }
  });

  return result;
}
