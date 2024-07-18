<template>
  <div class="i_toolbar" ref="element">
    <div class="i_toolbar_swatches">
      <button class="swatch blue" @click="emitAction('blue')"></button>
      <button class="swatch green" @click="emitAction('green')"></button>
      <button class="swatch red" @click="emitAction('red')"></button>
      <button class="swatch yellow" @click="emitAction('yellow')"></button>
      <button class="swatch pink" @click="emitAction('pink')"></button>
    </div>
    <div class="i_toolbar_buttons">
      <button @click="emitAction('bold')"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"
          viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
            d="M9 12L9 7.1C9 7.04477 9.04477 7 9.1 7H10.4C11.5 7 14 7.1 14 9.5C14 9.5 14 12 11 12M9 12V16.8C9 16.9105 9.08954 17 9.2 17H12.5C14 17 15 16 15 14.5C15 11.7046 11 12 11 12M9 12H11">
          </path>
        </svg>
      </button>
      <button @click="emitAction('italic')"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"
          viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M13.34 10C12.4223 12.7337 11 17 11 17">
          </path>
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M14.21 7H14.2"></path>
        </svg>
      </button>
      <button @click="emitAction('strike')"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"
          viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M14.5 8.50001C13.5 7 10.935 6.66476 9.75315 7.79706C9.27092 8.25909 9 8.88574 9 9.53915C9 10.1926 9.27092 10.8192 9.75315 11.2812C10.9835 12.46 13.0165 11.5457 14.2468 12.7244C14.7291 13.1865 15 13.8131 15 14.4665C15 15.1199 14.7291 15.7466 14.2468 16.2086C12.8659 17.5317 10 17.5 9 16" />
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12H18" />
        </svg>
      </button>
      <button @click="emitAction('underline')"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
          fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 7.5V11.5C9 12.2956 9.31607 13.0587 9.87868 13.6213C10.4413 14.1839 11.2044 14.5 12 14.5C12.7956 14.5 13.5587 14.1839 14.1213 13.6213C14.6839 13.0587 15 12.2956 15 11.5V7.5" />
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M7.71429 18H16.2857" />
        </svg>
      </button>
      <button @click="emitAction('link')"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"
          viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
            d="M7.69998 12.6L7.67896 12.62C6.53993 13.7048 6.52012 15.5155 7.63516 16.625V16.625C8.72293 17.7073 10.4799 17.7102 11.5712 16.6314L13.0263 15.193C14.0703 14.1609 14.2141 12.525 13.3662 11.3266L13.22 11.12">
          </path>
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
            d="M16.22 11.12L16.3564 10.9805C17.2895 10.0265 17.3478 8.5207 16.4914 7.49733V7.49733C15.5691 6.39509 13.9269 6.25143 12.8271 7.17675L11.3901 8.38588C10.0935 9.47674 9.95706 11.4241 11.0888 12.6852L11.12 12.72">
          </path>
        </svg>
      </button>
      <button @click="emitAction('quote')"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"
          viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
            d="M9.5 8L6.11524 11.8683C6.04926 11.9437 6.04926 12.0563 6.11524 12.1317L9.5 16"></path>
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
            d="M15 8L18.3848 11.8683C18.4507 11.9437 18.4507 12.0563 18.3848 12.1317L15 16"></path>
        </svg>
      </button>
      <button @click="emitAction('code')"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"
          viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 17C7 17 7 15.2536 7 13.5L5.5 12L7 10.5C7 8.74644 7 7 9 7" />
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 17C17 17 17 15.2536 17 13.5L18.5 12L17 10.5C17 8.74644 17 7 15 7" />
        </svg>
      </button>
      <button @click="emitAction('clear')"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"
          viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-width="2"
            d="M11.3536 9.31802L12.7678 7.90381C13.5488 7.12276 14.8151 7.12276 15.5962 7.90381C16.3772 8.68486 16.3772 9.95119 15.5962 10.7322L14.182 12.1464M11.3536 9.31802L7.96729 12.7043C7.40889 13.2627 7.02827 13.9739 6.8734 14.7482L6.69798 15.6253C6.55804 16.325 7.17496 16.942 7.87468 16.802L8.75176 16.6266C9.52612 16.4717 10.2373 16.0911 10.7957 15.5327L14.182 12.1464M11.3536 9.31802L14.182 12.1464">
          </path>
          <line x1="15" x2="19" y1="17" y2="17" stroke="currentColor" stroke-linecap="round" stroke-width="2"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const element = ref<HTMLElement>();
const emit = defineEmits(['execute-action']);
const emitAction = (action: string) => emit('execute-action', action);
defineExpose({ element })

</script>

<style scoped lang="scss">
.i_toolbar {
  display: none;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-contrast);
  position: absolute;
  top: 0;
  left: 0;

  button {
    margin: 0;
    padding: 0;
  }
}

.i_toolbar_swatches {
  display: flex;
  gap: 5px;

  .swatch {
    width: 20px;
    height: 20px;
    border-radius: 50%;

    &:hover {
      outline-offset: 1px;
    }
  }

  .blue {
    background-color: var(--blue);

    &:hover {
      outline: 2px solid var(--blue);
    }
  }

  .green {
    background-color: var(--green);

    &:hover {
      outline: 2px solid var(--green);
    }
  }

  .red {
    background-color: var(--red);

    &:hover {
      outline: 2px solid var(--red);
    }
  }

  .yellow {
    background-color: var(--yellow);

    &:hover {
      outline: 2px solid var(--yellow);
    }
  }

  .pink {
    background-color: var(--red);

    &:hover {
      outline: 2px solid var(--red);
    }
  }
}

.i_toolbar_buttons {
  display: flex;
}
</style>