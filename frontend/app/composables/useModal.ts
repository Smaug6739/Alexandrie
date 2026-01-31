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

/** Close a modal  */
function close(modal: Modal) {
  const index = modals.value.indexOf(modal);
  if (index !== -1) {
    modals.value.splice(index, 1);
  }
  if (modals.value.length === 0) {
    document.body.classList.remove('modal-open');
  }
}

function closeLast() {
  if (modals.value.length === 0) return;
  const lastModal = modals.value[modals.value.length - 1]!;
  close(lastModal);
}

/** Close all modals in the stack */
function closeAll() {
  modals.value = [];
  document.body.classList.remove('modal-open');
}

export function useModal() {
  return { add, close, closeLast, closeAll, modals };
}

interface ModalOptions {
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
