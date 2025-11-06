import { ref } from 'vue';

type ContextMenuOptions = {
  props?: Record<string, unknown>;
};

type ContextMenu = {
  component: object;
  x: number;
  y: number;
  options: ContextMenuOptions;
};

const menu = ref<ContextMenu | null>(null);

export function useContextMenu() {
  function open(component: object, event: MouseEvent, options: ContextMenuOptions = {}) {
    close();
    const { clientX: x, clientY: y } = event;
    menu.value = { component, x, y, options };
    event.preventDefault();
  }

  function close() {
    menu.value = null;
  }

  return {
    menu,
    open,
    close,
  };
}
