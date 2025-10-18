<script setup lang="ts">
import { computed } from 'vue';
import BaseModal from '@/components/ui/BaseModal.vue';

interface Props {
  isOpen: boolean;
  toolName: string;
  guideContent?: string;
}

interface Emits {
  (e: 'close'): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

// Simple markdown to HTML conversion
const formattedContent = computed(() => {
  if (!props.guideContent) {
    return '<p>Ingen veiledning tilgjengelig for dette verktøyet.</p>';
  }

  let html = props.guideContent;

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

  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Convert inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

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
    <div class="guide-content" v-html="formattedContent"></div>
  </BaseModal>
</template>

<style scoped>
.guide-content {
  color: var(--text-secondary);
  line-height: 1.8;
}

.guide-content :deep(h1) {
  font-size: var(--font-size-2xl);
  color: var(--matrix-bright);
  margin-bottom: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.guide-content :deep(h1:first-child) {
  margin-top: 0;
}

.guide-content :deep(h2) {
  font-size: var(--font-size-xl);
  color: var(--matrix-bright);
  margin-bottom: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}

.guide-content :deep(h2:first-child) {
  margin-top: 0;
}

.guide-content :deep(h3) {
  font-size: var(--font-size-lg);
  color: var(--matrix-medium);
  margin-bottom: var(--spacing-sm);
  margin-top: var(--spacing-md);
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
  color: var(--matrix-medium);
  text-decoration: underline;
  transition: color 0.2s ease;
}

.guide-content :deep(a:hover) {
  color: var(--matrix-green-bright);
}

.guide-content :deep(a:focus-visible) {
  outline: none;
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
}
</style>
