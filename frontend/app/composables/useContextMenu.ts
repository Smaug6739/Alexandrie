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
    console.log('Opening context menu', component, event, options);
    // Fermer d’abord si un autre est déjà ouvert
    close();

    // Calcul position (éviter de dépasser l’écran)
    const { clientX: x, clientY: y } = event;
    menu.value = { component, x, y, options };

    // Empêche le clic d’ouvrir un menu par défaut
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
