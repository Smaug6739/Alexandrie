<template>
  <div class="modal-ctn">
    <h2>{{ isEdit ? t('calendar.editEvent') : t('calendar.addEvent') }}</h2>

    <div class="form-group">
      <label for="event-title">{{ t('common.labels.name') }}</label>
      <input
        id="event-title"
        v-model="form.title"
        class="entry"
        type="text"
        required
        :placeholder="t('common.labels.name')"
      />
    </div>

    <div class="form-group">
      <label for="event-desc">{{ t('common.labels.description') }}</label>
      <textarea
        id="event-desc"
        v-model="form.description"
        class="entry text-area"
        rows="3"
        :placeholder="t('common.labels.description')"
      />
    </div>

    <div class="form-row">
      <div class="form-group col">
        <label for="event-start">{{ t('calendar.startDate') }}</label>
        <input
          id="event-start"
          v-model="startDateStr"
          class="entry"
          type="datetime-local"
          required
        />
      </div>
      <div class="form-group col">
        <label for="event-end">{{ t('calendar.endDate') }}</label>
        <input
          id="event-end"
          v-model="endDateStr"
          class="entry"
          type="datetime-local"
          required
        />
      </div>
    </div>





    <div class="form-group">
      <label>{{ t('calendar.recurrence') }}</label>
      <div class="type-picker-row">
        <button
          v-for="pat in ['none', 'daily', 'weekly', 'monthly']"
          :key="pat"
          type="button"
          class="type-picker-btn"
          :class="{ selected: form.recurrence_pattern === pat }"
          @click="form.recurrence_pattern = pat"
        >
          {{ t(`calendar.recurrencePatterns.${pat}`) }}
        </button>
      </div>
    </div>

   



    <div v-if="form.recurrence_pattern && form.recurrence_pattern !== 'none'" class="form-row fade-in">
      <div class="form-group col">
        <label for="recurrence-interval">{{ t('calendar.recurrenceInterval') }}</label>
        <input
          id="recurrence-interval"
          v-model.number="form.recurrence_interval"
          class="entry"
          type="number"
          min="1"
          required
        />
      </div>
      <div class="form-group col">
        <label for="recurrence-end">{{ t('calendar.recurrenceEnd') }}</label>
        <input
          id="recurrence-end"
          v-model="recurrenceEndStr"
          class="entry"
          type="date"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group col">
        <label>{{ t('calendar.type') }}</label>
        <div class="type-picker-row">
          <button
            v-for="tType in ['event', 'homework', 'exam', 'other']"
            :key="tType"
            type="button"
            class="type-picker-btn"
            :class="{ selected: form.type === tType }"
            @click="form.type = tType"
          >
            {{ t(`calendar.types.${tType}`) }}
          </button>
        </div>
      </div>
      
      <div class="form-group col">
        <label>{{ t('common.labels.color') }}</label>
        <div class="color-picker-row">
          <button
            v-for="c in ['blue', 'green', 'red', 'orange', 'pink']"
            :key="c"
            type="button"
            class="color-picker-btn"
            :class="{ selected: form.color === c }"
            :style="{ backgroundColor: `var(--${c})` }"
            @click="form.color = c"
          />
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>{{ t('calendar.linkDocument') }}</label>
      <AppSelect
        v-model="form.node_id"
        class="entry"
        :items="documentOptions"
        nullable
        searchable
        :placeholder="t('calendar.selectDocument')"
      />
    </div>

    <div class="footer">
      <div class="left-actions">
        <AppButton
          v-if="isEdit"
          type="secondary"
          class="btn-danger-outline"
          @click="deleteEvent"
        >
          {{ t('common.actions.delete') }}
        </AppButton>
      </div>
      <div class="right-actions">
        <AppButton type="secondary" @click="emit('close')">
          {{ t('common.actions.cancel') }}
        </AppButton>
        <AppButton
          type="primary"
          :disabled="!form.title.trim()"
          @click="saveEvent"
        >
          {{ t('common.actions.save') }}
        </AppButton>
      </div>
    </div>
  </div>
</template>




<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCalendarStore, type CalendarEvent } from '~/stores/calendar.store';
import { useNodesStore } from '~/stores/nodes.store';

const props = defineProps<{
  event?: CalendarEvent;
  defaultDate?: Date;
}>();

const emit = defineEmits(['close']);
const { t } = useI18nT();
const calendarStore = useCalendarStore();
const nodesStore = useNodesStore();

const isEdit = computed(() => !!props.event?.id);

const eventData = computed(() => {
  if (props.event?.originalId) {
    const original = calendarStore.events.find(e => e.id === props.event.originalId);
    if (original) return original;
  }
  return props.event;
});

const form = ref<CalendarEvent>({
  id: eventData.value?.id,
  title: eventData.value?.title || '',
  description: eventData.value?.description || '',
  start_date: eventData.value?.start_date || (props.defaultDate ? new Date(props.defaultDate.setHours(9, 0, 0, 0)).getTime() : Date.now()),
  end_date: eventData.value?.end_date || (props.defaultDate ? new Date(props.defaultDate.setHours(18, 0, 0, 0)).getTime() : Date.now() + 3600000),
  color: eventData.value?.color || 'blue',
  type: eventData.value?.type || 'event',
  node_id: eventData.value?.node_id || undefined,
  recurrence_pattern: eventData.value?.recurrence_pattern || 'none',
  recurrence_interval: eventData.value?.recurrence_interval || 1,
  recurrence_end: eventData.value?.recurrence_end || undefined,
});

const startDateStr = computed({
  get: () => {
    if (!form.value.start_date) return '';
    const date = new Date(form.value.start_date);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  },
  set: (val) => {
    if (!val) return;
    form.value.start_date = new Date(val).getTime();
  }
});

const endDateStr = computed({
  get: () => {
    if (!form.value.end_date) return '';
    const date = new Date(form.value.end_date);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  },
  set: (val) => {
    if (!val) return;
    form.value.end_date = new Date(val).getTime();
  }
});

const recurrenceEndStr = computed({
  get: () => {
    if (!form.value.recurrence_end) return '';
    const date = new Date(form.value.recurrence_end);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 10);
  },
  set: (val) => {
    if (!val) {
      form.value.recurrence_end = undefined;
      return;
    }
    const date = new Date(val);
    date.setHours(23, 59, 59, 999);
    form.value.recurrence_end = date.getTime();
  }
});

const documentOptions = computed(() => {
  return nodesStore.documents.map(doc => ({
    id: doc.id,
    label: doc.name,
  }));
});

const saveEvent = async () => {
  if (!form.value.title.trim()) return;

  try {
    if (isEdit.value) {
      await calendarStore.updateEvent(form.value);
    } else {
      await calendarStore.createEvent(form.value);
    }
    emit('close');
  } catch (err) {
    console.error('Failed to save event:', err);
  }
};

const deleteEvent = async () => {
  const deleteId = props.event?.originalId || form.value.id;
  if (!deleteId) return;
  if (!confirm(t('calendar.dialog.deleteConfirm'))) return;

  try {
    await calendarStore.deleteEvent(deleteId);
    emit('close');
  } catch (err) {
    console.error('Failed to delete event:', err);
  }
};
</script>

<style scoped lang="scss">
.modal-ctn {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 340px;
  width: 100%;
}

h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.entry {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: var(--surface-raised);
  color: var(--text-primary);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: var(--primary);
  }
}

.text-area {
  resize: vertical;
  min-height: 80px;
}

.form-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  .col {
    flex: 1;
    min-width: 140px;
  }
}

.type-picker-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.type-picker-btn {
  padding: 6px 12px;
  font-size: 0.85rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background-color: var(--surface-raised);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: var(--surface-overlay);
  }

  &.selected {
    background-color: var(--primary-bg);
    border-color: var(--primary);
    color: var(--primary);
    font-weight: 600;
  }
}

.color-picker-row {
  display: flex;
  gap: 8px;
  align-items: center;
  height: 32px;
}

.color-picker-btn {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.15s ease, outline 0.15s ease;

  &:hover {
    transform: scale(1.15);
  }

  &.selected {
    outline: 2px solid var(--text-primary);
    outline-offset: 2px;
  }
}

.fade-in {
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);

  .right-actions {
    display: flex;
    gap: 8px;
  }
}

.btn-danger-outline {
  border-color: var(--red) !important;
  color: var(--red) !important;
  background: transparent !important;

  &:hover {
    background-color: rgba(239, 68, 68, 0.08) !important;
  }
}
</style>
