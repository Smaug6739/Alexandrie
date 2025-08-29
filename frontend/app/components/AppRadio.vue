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
  display: flex;
  width: 100%;
  gap: 0.5rem;

  button {
    padding: 0.6rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background: #f8f8f8;
    cursor: pointer;
    flex: 1;

    &.active {
      border-color: var(--primary);
      color: white;
      background: var(--primary);
    }
  }
}
</style>
