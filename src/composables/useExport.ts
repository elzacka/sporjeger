import type { OSINTTool } from '@/types';

/**
 * Composable for exporting tools to various formats
 */
export function useExport() {
  /**
   * Export tools to JSON format
   */
  function exportToJSON(tools: OSINTTool[], filename = 'sporjeger-tools.json') {
    const json = JSON.stringify(tools, null, 2);
    downloadFile(json, filename, 'application/json');
  }

  /**
   * Export tools to CSV format
   */
  function exportToCSV(tools: OSINTTool[], filename = 'sporjeger-tools.csv') {
    if (tools.length === 0) {
      return;
    }

    // CSV headers
    const headers = [
      'Kategori',
      'Navn',
      'URL',
      'Beskrivelse',
      'Kostnad',
      'Språk',
      'Krever Registrering',
      'Designkvalitet',
      'Vanskelighetsgrad',
      'Tool Type',
      'Platform',
      'Tags',
    ];

    // Convert tools to CSV rows
    const rows = tools.map((tool) => [
      escapeCsvValue(tool.kategori),
      escapeCsvValue(tool.navn),
      escapeCsvValue(tool.url),
      escapeCsvValue(tool.beskrivelse),
      escapeCsvValue(tool.kostnad),
      escapeCsvValue(tool.språk || ''),
      escapeCsvValue(tool.kreverRegistrering || ''),
      escapeCsvValue(tool.designkvalitet || ''),
      escapeCsvValue(tool.vanskelighetsgrad || ''),
      escapeCsvValue(tool.toolType || ''),
      escapeCsvValue(tool.platform || ''),
      escapeCsvValue(tool.tags?.join(', ') || ''),
    ]);

    // Combine headers and rows
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    downloadFile(csv, filename, 'text/csv');
  }

  /**
   * Export tools to Markdown format
   */
  function exportToMarkdown(tools: OSINTTool[], filename = 'sporjeger-tools.md') {
    if (tools.length === 0) {
      return;
    }

    let markdown = '# Sporjeger OSINT Tools\n\n';
    markdown += `*Eksportert: ${new Date().toLocaleString('no-NO')}*\n\n`;
    markdown += `**Totalt antall verktøy:** ${tools.length}\n\n`;
    markdown += '---\n\n';

    // Group by category
    const byCategory = tools.reduce(
      (acc, tool) => {
        if (!acc[tool.kategori]) {
          acc[tool.kategori] = [];
        }
        acc[tool.kategori].push(tool);
        return acc;
      },
      {} as Record<string, OSINTTool[]>
    );

    // Sort categories
    const sortedCategories = Object.keys(byCategory).sort();

    // Generate markdown for each category
    sortedCategories.forEach((category) => {
      markdown += `## ${category}\n\n`;

      byCategory[category].forEach((tool) => {
        markdown += `### ${tool.navn}\n\n`;
        markdown += `- **URL:** [${tool.url}](${tool.url})\n`;
        markdown += `- **Beskrivelse:** ${tool.beskrivelse}\n`;
        markdown += `- **Kostnad:** ${tool.kostnad}\n`;

        if (tool.vanskelighetsgrad) {
          markdown += `- **Vanskelighetsgrad:** ${'⭐'.repeat(parseInt(tool.vanskelighetsgrad))}\n`;
        }
        if (tool.språk) {
          markdown += `- **Språk:** ${tool.språk}\n`;
        }
        if (tool.kreverRegistrering) {
          markdown += `- **Krever registrering:** ${tool.kreverRegistrering}\n`;
        }
        if (tool.toolType) {
          markdown += `- **Type:** ${tool.toolType}\n`;
        }
        if (tool.platform) {
          markdown += `- **Platform:** ${tool.platform}\n`;
        }
        if (tool.tags && tool.tags.length > 0) {
          markdown += `- **Tags:** ${tool.tags.join(', ')}\n`;
        }

        markdown += '\n';
      });

      markdown += '---\n\n';
    });

    downloadFile(markdown, filename, 'text/markdown');
  }

  /**
   * Helper function to escape CSV values
   */
  function escapeCsvValue(value: string): string {
    if (!value) return '';

    // If value contains comma, quote, or newline, wrap in quotes and escape quotes
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }

    return value;
  }

  /**
   * Helper function to trigger file download
   */
  function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return {
    exportToJSON,
    exportToCSV,
    exportToMarkdown,
  };
}
