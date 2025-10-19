<script setup lang="ts">
import { computed } from 'vue';
import BaseModal from '@/components/ui/BaseModal.vue';

interface Props {
  isOpen: boolean;
  toolName: string;
  guideContent?: string;
  toolUrl?: string;
}

interface Emits {
  (e: 'close'): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

// Check if content contains URLs (links in guide content)
const hasLinksInContent = computed(() => {
  if (!props.guideContent) return false;
  // Check for markdown links or raw URLs
  return /\[([^\]]+)\]\(([^)]+)\)/.test(props.guideContent) ||
         /https?:\/\//.test(props.guideContent);
});

// Simple markdown to HTML conversion
const formattedContent = computed(() => {
  if (!props.guideContent) {
    return '<p>Ingen veiledning tilgjengelig for dette verktøyet.</p>';
  }

  let html = props.guideContent;

  // Convert inline code first (to protect URLs in code blocks from being linkified)
  html = html.replace(/`([^`]+)`/g, '___CODE___$1___ENDCODE___');

  // Convert markdown links [text](url) before raw URLs
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Convert raw URLs to clickable links (simple approach that works everywhere)
  html = html.replace(/(https?:\/\/[^\s<]+)/gi, (url) => {
    // Don't linkify if it's already in an anchor tag's href
    return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + '</a>';
  });

  // Fix double-linkified URLs (from markdown links that had URLs in display text)
  html = html.replace(/<a[^>]*href="([^"]+)"[^>]*><a[^>]*href="[^"]+"[^>]*>([^<]+)<\/a><\/a>/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>');

  // Convert headings (h1-h6)
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Convert bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Restore inline code (after markdown processing)
  html = html.replace(/___CODE___([^_]+)___ENDCODE___/g, '<code>$1</code>');

  // Convert unordered lists
  html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
  html = html.replace(/^- (.+)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Convert ordered lists
  html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');

  // Convert line breaks to paragraphs
  html = html.replace(/\n\n/g, '</p><p>');

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<ol') && !html.startsWith('<p')) {
    html = '<p>' + html + '</p>';
  }

  return html;
});
</script>

<template>
  <BaseModal :is-open="isOpen" :title="`Veiledning: ${toolName}`" @close="$emit('close')">
    <template v-if="hasLinksInContent" #header>
      <h2 class="guide-header">Klikk lenken for å se guide</h2>
    </template>
    <div class="guide-content" v-html="formattedContent"></div>
  </BaseModal>
</template>

<style scoped>
.guide-header {
  color: var(--matrix-bright);
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.guide-content {
  color: var(--text-secondary);
  line-height: 1.8;
  padding-top: 0;
  /* Ensure long URLs and text wrap properly */
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.guide-content :deep(h1) {
  font-size: var(--font-size-2xl);
  color: var(--matrix-bright);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  margin-top: var(--spacing-xl);
  line-height: 1.2;
}

.guide-content :deep(h1:first-child) {
  margin-top: 0;
}

.guide-content :deep(h2) {
  font-size: var(--font-size-xl);
  color: var(--matrix-bright);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  margin-top: var(--spacing-lg);
  line-height: 1.2;
}

.guide-content :deep(h2:first-child) {
  margin-top: 0;
}

.guide-content :deep(h3) {
  font-size: var(--font-size-lg);
  color: var(--matrix-bright);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  margin-top: var(--spacing-lg);
  line-height: 1.2;
}

.guide-content :deep(h3:first-child) {
  margin-top: 0;
}

.guide-content :deep(p) {
  margin-bottom: var(--spacing-md);
}

.guide-content :deep(p:last-child) {
  margin-bottom: 0;
}

.guide-content :deep(ul),
.guide-content :deep(ol) {
  margin-left: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.guide-content :deep(li) {
  margin-bottom: var(--spacing-xs);
  color: var(--text-secondary);
}

.guide-content :deep(a) {
  color: var(--matrix-bright);
  text-decoration: underline;
  transition: color 0.2s ease, text-decoration-color 0.2s ease;
  cursor: pointer;
  /* Break long URLs */
  word-break: break-word;
  overflow-wrap: anywhere;
  text-decoration-color: var(--matrix-medium);
  text-underline-offset: 2px;
}

.guide-content :deep(a:hover) {
  color: var(--matrix-green-bright);
  text-decoration-color: var(--matrix-green-bright);
}

.guide-content :deep(a:focus-visible) {
  outline: 2px solid var(--matrix-bright);
  outline-offset: 2px;
  color: var(--matrix-green-bright);
}

.guide-content :deep(strong) {
  color: var(--matrix-bright);
  font-weight: 700;
}

.guide-content :deep(em) {
  font-style: italic;
  color: var(--matrix-medium);
}

.guide-content :deep(code) {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 2px 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-sm);
  color: var(--matrix-green-bright);
  /* Allow code to wrap on small screens */
  word-break: break-all;
  white-space: pre-wrap;
}

/* Mobile optimizations */
@media (max-width: 390px) {
  .guide-content :deep(h1) {
    font-size: var(--font-size-xl);
  }

  .guide-content :deep(h2) {
    font-size: var(--font-size-lg);
  }

  .guide-content :deep(h3) {
    font-size: var(--font-size-base);
  }

  .guide-content :deep(code) {
    font-size: var(--font-size-xs);
    padding: 1px 4px;
  }
}
</style>
