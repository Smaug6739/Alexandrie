// Modal bus for managing modal state

const modals = ref<Modal[]>([]);

export function useModal() {
  return {
    modals,
  };
}

export class Modal {
  constructor(public component: any, public name: string, public props: any, public onClose: () => void = () => {}) {}
}
