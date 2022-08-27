import { computed, defineComponent, h, onMounted, ref, Transition } from 'vue';

import './styles/vars.css';
import './styles/back-to-top.scss';

export const getScrollTop = (): number =>
  window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

export const scrollToTop = (): void => window.scrollTo({ top: 0, behavior: 'smooth' });

export const BackToTop = defineComponent({
  name: 'BackToTop',

  setup() {
    const scrollTop = ref(0);
    const show = computed(() => scrollTop.value > 300);
    const onScroll = () => {
      scrollTop.value = getScrollTop();
    };

    onMounted(() => {
      scrollTop.value = getScrollTop();

      window.addEventListener('scroll', () => onScroll());
    });

    const backToTopEl = h('div', { class: 'back-to-top', onClick: scrollToTop });

    return () =>
      h(
        Transition,
        {
          name: 'back-to-top',
        },
        () => (show.value ? backToTopEl : null),
      );
  },
});

export default BackToTop;
