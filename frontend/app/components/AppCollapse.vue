<template>
  <div class="app-collapse" :class="{ 'is-open': isOpen }">
    <button type="button" class="collapse-header" @click="isOpen = !isOpen">
      <span class="collapse-title">
        <slot name="title">{{ title }}</slot>
      </span>
      <Icon name="expand" :size="18" class="collapse-icon" />
    </button>

    <div class="collapse-body">
      <div class="collapse-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string;
    modelValue?: boolean;
  }>(),
  {
    title: '',
    modelValue: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const isOpen = ref(props.modelValue);

watch(
  () => props.modelValue,
  val => {
    isOpen.value = val;
  },
);

watch(isOpen, val => {
  emit('update:modelValue', val);
});
</script>

<style scoped lang="scss">
.app-collapse {
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 8px;
  overflow: hidden;
}

.collapse-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: inherit;
  text-align: left;
}

.collapse-icon {
  transition: transform 0.25s ease;
}

.is-open .collapse-icon {
  transform: rotate(180deg);
}

.collapse-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s ease-out;
}

.is-open .collapse-body {
  grid-template-rows: 1fr;
}

.collapse-content {
  overflow: hidden;
  /* Optionnel : padding interne si le composant est ouvert */
  padding: 0 1rem;
  transition: padding 0.25s ease-out;
}

.is-open .collapse-content {
  padding: 0.5rem 1rem 1rem;
}
</style>
