import { onMounted, onUnmounted } from 'vue';

export interface KeyboardShortcutCallbacks {
  onCmdK?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onEnter?: () => void;
  onQuestionMark?: () => void;
}

export function useKeyboardShortcuts(callbacks: KeyboardShortcutCallbacks) {
  function handleKeydown(event: KeyboardEvent) {
    // Ignore if user is typing in an input field (except for Escape)
    const target = event.target as HTMLElement;
    const isInputField =
      target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    // CMD/Ctrl + K: Open command palette
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      callbacks.onCmdK?.();
      return;
    }

    // ESC: Close modals/menus
    if (event.key === 'Escape') {
      event.preventDefault();
      callbacks.onEscape?.();
      return;
    }

    // Don't trigger other shortcuts when typing
    if (isInputField && event.key !== 'Escape') {
      return;
    }

    // Arrow Up: Navigate up
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      callbacks.onArrowUp?.();
    }

    // Arrow Down: Navigate down
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      callbacks.onArrowDown?.();
    }

    // Enter: Select/activate
    if (event.key === 'Enter') {
      event.preventDefault();
      callbacks.onEnter?.();
    }

    // ?: Show keyboard shortcuts
    if (event.key === '?' && event.shiftKey) {
      event.preventDefault();
      callbacks.onQuestionMark?.();
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
}
