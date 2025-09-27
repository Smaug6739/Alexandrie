// Modal bus for managing modal state

const modals = ref<Modal[]>([]);

function add(modal: Modal) {
  document.body.classList.add('modal-open');
  modals.value.push(modal);
}
function close(modal: Modal) {
  const index = modals.value.indexOf(modal);
  if (index !== -1) {
    modals.value.splice(index, 1);
    modal.options.onClose?.();
  }
  if (modals.value.length === 0) {
    document.body.classList.remove('modal-open');
  }
}

export function useModal() {
  return {
    add,
    close,
    modals,
  };
}

interface ModalOptions {
  onClose?: () => void;
  size?: 'small' | 'medium' | 'large';
  noPadding?: boolean;
  props?: object;
}

export class Modal {
  constructor(
    public component: object,
    public options: ModalOptions = {
      onClose: () => {},
      size: 'medium',
      noPadding: false,
      props: {},
    },
  ) {}
}
