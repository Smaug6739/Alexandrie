/**
 * Modal management composable
 * Handles stacked modal state and body scroll locking
 */

const modals = ref<Modal[]>([]);

/** Open a new modal (adds to stack) */
function add(modal: Modal) {
  document.body.classList.add('modal-open');
  modals.value.push(modal);
}

/** Close a modal and trigger its onClose callback */
function close(modal: Modal, reason?: string) {
  const index = modals.value.indexOf(modal);
  if (index !== -1) {
    modals.value.splice(index, 1);
    modal.options.onClose?.(reason);
  }
  if (modals.value.length === 0) {
    document.body.classList.remove('modal-open');
  }
}

function closeLast(reason?: string) {
  if (modals.value.length === 0) return;
  const lastModal = modals.value[modals.value.length - 1]!;
  close(lastModal, reason);
}

export function useModal() {
  return { add, close, closeLast, modals };
}

interface ModalOptions {
  onClose?: (reason?: string) => void;
  size?: 'small' | 'medium' | 'large';
  noPadding?: boolean;
  props?: object;
}

export class Modal {
  constructor(
    public component: object,
    public options: ModalOptions = { size: 'medium' },
  ) {}
}
