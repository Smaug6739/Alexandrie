<template>
  <div class="segmented">
    <button v-for="item in items" :key="item.id" :class="{ active: item.id === selected }" @click="selectItem(item.id)">{{ item.label }}</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: Array<{ id: number | string; label: string }>;
  modelValue: number | string | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string | null): void;
}>();

const selected = ref(props.modelValue);

const selectItem = (id: number | string) => {
  selected.value = id;
  emit('update:modelValue', id);
};
</script>

<style scoped lang="scss">
.segmented {
  width: 100%;
  display: flex;
  gap: 0.5rem;

  button {
    flex: 1;
    padding: 0.6rem;
    border: 1px solid var(--border-color);
    background: #f8f8f8;
    border-radius: 0.5rem;
    cursor: pointer;

    &.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }
  }
}
</style>
