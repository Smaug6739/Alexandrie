// Modal bus for managing modal state

const modals = ref<Modal[]>([]);

function add(modal: Modal) {
  modals.value.push(modal);
}
function close(modal: Modal) {
  const index = modals.value.indexOf(modal);
  if (index !== -1) {
    modals.value.splice(index, 1);
    modal.onClose();
  }
}

export function useModal() {
  return {
    add,
    close,
    modals,
  };
}

export class Modal {
  constructor(public component: object, public props: object = {}, public onClose: () => void = () => {}, public big: boolean = false) {}
}
