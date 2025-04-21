// Modal bus for managing modal state

const modals = ref<{ component: any; name: string; props: any }[]>([]);

export function useModal() {
  return {
    modals,
  };
}
