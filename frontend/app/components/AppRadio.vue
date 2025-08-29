<template>
  <div class="segmented">
    <button v-for="item in items" :key="item.id" :class="{ active: item.id === selected }" @click="selectItem(item.id)">{{ item.name }}</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: Array<{ id: number; name: string }>;
  modelValue: number | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
}>();

const selected = ref(props.modelValue);

const selectItem = (id: number) => {
  selected.value = id;
  emit('update:modelValue', id);
};
</script>

<style scoped lang="scss">
.segmented {
  display: flex;
  gap: 0.5rem;

  button {
    flex: 1;
    padding: 0.6rem;
    border: 1px solid #ddd;
    background: #f8f8f8;
    border-radius: 0.5rem;
    cursor: pointer;

    &.active {
      background: #2563eb;
      color: white;
      border-color: #2563eb;
    }
  }
}
</style>
