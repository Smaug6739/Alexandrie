<template>
  <div v-for="(section, i) in options" :key="i" class="section">
    <h3>{{ section.label }}</h3>

    <div v-for="opt in section.options" :key="opt.key" class="form-group">
      <div>
        <label>{{ opt.label }}</label>

        <p class="description">{{ opt.description }}</p>
      </div>
      <!-- Toggle -->
      <AppToggle v-if="opt.type === 'toggle'" v-model="p(opt.key).value" class="entry" @update:model-value="opt.onChange?.(p(opt.key).value)" />

      <!-- Select -->
      <AppSelect
        v-else-if="opt.type === 'select'"
        v-model="p(opt.key).value"
        :items="opt.choices!"
        size="40%"
        class="entry"
        :searchable="false"
        @update:model-value="opt.onChange?.(p(opt.key).value)"
      />

      <!-- Radio -->
      <AppRadio
        v-else-if="opt.type === 'radio'"
        v-model="p(opt.key).value"
        :items="opt.choices!"
        class="entry"
        @update:model-value="opt.onChange?.(p(opt.key).value)"
      />

      <!-- Color -->
      <AppColorPicker v-else-if="opt.type === 'color'" v-model="p(opt.key).value" class="entry" @update:model-value="opt.onChange?.(p(opt.key).value)" />

      <!-- Group Checkbox -->
      <div v-else-if="opt.type === 'groupCheckbox'" class="group-checkbox">
        <div class="checkbox-grid">
          <label v-for="[key, label] of Object.entries(opt.items)" :key="key">
            <AppCheck v-model="p(opt.key).value[key]" @change="opt.onChange?.(p(opt.key).value)">{{ label }}</AppCheck>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const preferencesStore = usePreferences();

// @ts-expect-error unknown type
const p = preferencesStore.get as <K extends PreferenceKey>(key: K) => ReturnType<unknown>;
type InterfaceOption = Option & {
  tag?: string;
};

defineProps<{
  options: Array<{ label: string; options: InterfaceOption[] }>;
}>();
</script>

<style lang="scss" scoped>
.section {
  width: 100%;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1rem;
}

label {
  font-weight: 400;
  flex: 1;
}

.description {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-left: 2px;
  margin-top: 0.25rem;
}

h3 {
  margin: 3rem 0 0.5rem;
  font-weight: 500;
}

.entry {
  max-width: 400px;
  margin-left: auto;
}

.group-checkbox {
  .checkbox-grid {
    display: grid;
    gap: 0.5rem 3rem;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
