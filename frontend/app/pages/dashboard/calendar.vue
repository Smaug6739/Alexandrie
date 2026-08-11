<template>
  <div class="calendar-container">
    <Teleport to="#navbar-title"> {{ t('calendar.title') }} </Teleport>
    
    <div class="calendar-toolbar">
      <div class="filters-bar">
        <span class="filter-title">{{ t('calendar.filters.title') }} :</span>
        <div class="filter-options">
          <button
            v-for="tType in ['event', 'homework', 'exam', 'other']"
            :key="tType"
            class="filter-pill"
            :class="[tType, { active: selectedTypes.includes(tType) }]"
            @click="toggleTypeFilter(tType)"
          >
            <span class="dot" :class="tType" />
            {{ t(`calendar.types.${tType}`) }}
          </button>
        </div>
      </div>

      <div class="view-toggle-group">
        <button
          v-for="viewMode in ['month', 'week', 'day']"
          :key="viewMode"
          class="view-toggle-btn"
          :class="{ active: currentView === viewMode }"
          @click="currentView = viewMode"
        >
          {{ t(`calendar.views.${viewMode}`) }}
        </button>
      </div>
    </div>

    <div class="calendar-layout">
      <div class="calendar-main-card">
        <header class="calendar-header">
          <div class="nav-buttons">
            <button class="nav-btn" @click="navigatePeriod(-1)">‹</button>
            <button class="today-btn" @click="goToday">{{ locale === 'fr' ? 'Aujourd\'hui' : 'Today' }}</button>
            <button class="nav-btn" @click="navigatePeriod(1)">›</button>
          </div>
          <h2 class="current-month-year">{{ headerPeriodText }}</h2>
        </header>

        <div v-if="currentView === 'month'" class="view-container">
          <div class="weekdays-grid">
            <div v-for="dayName in weekdayNames" :key="dayName" class="weekday-header">
              {{ dayName }}
            </div>
          </div>
          <div class="days-grid">
            <div
              v-for="(day, idx) in daysInMonth"
              :key="idx"
              class="day-cell"
              :class="{
                'other-month': !day.isCurrentMonth,
                'is-today': day.isToday,
                'selected-day': isSelectedDay(day.date)
              }"
              @click="selectDay(day.date)"
              @dblclick="openAddModal(day.date)"
              @dragover.prevent
              @drop="onDrop($event, day.date)">
              <div class="day-number-row">
                <span class="day-number">{{ day.dayNum }}</span>
                <button class="add-event-plus" @click.stop="openAddModal(day.date)">+</button>
              </div>
              
              <div class="day-events-list">
                <div
                  v-for="event in filterEvents(day.events).slice(0, 3)"
                  :key="event.id"
                  class="event-pill"
                  draggable="true"
                  :style="{ borderLeft: `3px solid var(--${event.color || 'blue'})` }"
                  @dragstart="onDragStart($event, event)"
                  @click.stop="openEditModal(event)"
                >
                  <span v-if="event.recurrence_pattern && event.recurrence_pattern !== 'none'" class="recurrence-indicator">🔁</span>
                  <span class="event-type-dot" :class="event.type" />
                  <span class="event-title">{{ event.title }}</span>
                </div>
                <div v-if="filterEvents(day.events).length > 3" class="more-events-badge">
                  + {{ filterEvents(day.events).length - 3 }} {{ locale === 'fr' ? 'de plus' : 'more' }}
                </div>
              </div>
            </div>
          </div>
        </div>






        <div v-else-if="currentView === 'week'" class="view-container">
          <div class="weekdays-grid">
            <div v-for="dayName in weekdayNames" :key="dayName" class="weekday-header">
              {{ dayName }}
            </div>
          </div>
          <div class="week-columns-grid">
            <div
              v-for="day in daysInWeek"
              :key="day.date.toISOString()"
              class="week-day-column"
              :class="{ 'is-today': day.isToday, 'selected-day': isSelectedDay(day.date) }"
              @click="selectDay(day.date)"
              @dblclick="openAddModal(day.date)"
              @dragover.prevent
              @drop="onDrop($event, day.date)"
            >
              <div class="column-header-row">
                <span class="col-day-num">{{ day.date.getDate() }}</span>
                <button class="add-event-plus" @click.stop="openAddModal(day.date)">+</button>
              </div>

              <div class="column-events-list">
                <div
                  v-for="event in filterEvents(day.events)"
                  :key="event.id"
                  class="week-event-card"
                  draggable="true"
                  :style="{ borderLeft: `4px solid var(--${event.color || 'blue'})` }"
                  @dragstart="onDragStart($event, event)"
                  @click.stop="openEditModal(event)"
                >
                  <div class="card-time">{{ formatTime(event.start_date) }}</div>
                  <h4 class="card-title">{{ event.title }}</h4>
                  <span v-if="event.recurrence_pattern && event.recurrence_pattern !== 'none'" class="recurrence-indicator-small">🔁</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="currentView === 'day'" class="view-container day-timeline-view">
          <div class="day-timeline-layout">
            <div class="timeline-scale">
              <div v-for="h in dayHours" :key="h" class="scale-hour">
                {{ String(h).padStart(2, '0') }}:00
              </div>
            </div>

            <div
              class="timeline-content-area"
              @dblclick="openAddModalFromTimeline"
              @dragover.prevent
              @drop="onDrop($event, selectedDate)"
            >
              <div v-for="h in dayHours" :key="h" class="timeline-grid-row" />
              
              <div
                v-for="event in timelineEvents"
                :key="event.id"
                class="timeline-event-block"
                draggable="true"
                :style="{
                  borderLeft: `4px solid var(--${event.color || 'blue'})`,
                  top: `${getHourPercent(event.start_date)}%`,
                  height: `${Math.max(5, getHourPercent(event.end_date) - getHourPercent(event.start_date))}%`
                }"
                @dragstart="onDragStart($event, event)"
                @click="openEditModal(event)"
              >
                <div class="block-time">
                  {{ formatTime(event.start_date) }} - {{ formatTime(event.end_date) }}
                  <span v-if="event.recurrence_pattern && event.recurrence_pattern !== 'none'" class="recurrence-indicator-small">🔁</span>
                </div>
                <h4 class="block-title">{{ event.title }}</h4>
                <p v-if="event.description" class="block-desc">{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="agenda-sidebar">
        <div class="agenda-header">
          <h3>{{ selectedDayFormatted }}</h3>
          <AppButton type="primary" class="add-btn-sm" @click="openAddModal(selectedDate)">
            + {{ t('calendar.addEvent') }}
          </AppButton>
        </div>

        <div class="agenda-content">
          <div v-if="filterEvents(selectedDayEvents).length === 0" class="no-events-state">
            <p>{{ t('components.noContent.nothingHere') }}</p>
          </div>
          <div v-else class="agenda-events-list">
            <div
              v-for="event in filterEvents(selectedDayEvents)"
              :key="event.id"
              class="agenda-card"
              :style="{ borderLeft: `4px solid var(--${event.color || 'blue'})` }"
            >
              <div class="agenda-card-header">
                <span class="agenda-event-type-badge" :class="event.type">
                  {{ t(`calendar.types.${event.type}`) }}
                </span>
                <span class="agenda-time">
                  {{ formatTimeRange(event.start_date, event.end_date) }}
                </span>
              </div>
              
              <h4 class="agenda-event-title" @click="openEditModal(event)">
                {{ event.title }}
                <span v-if="event.recurrence_pattern && event.recurrence_pattern !== 'none'" class="recurrence-badge">
                  🔁 {{ t(`calendar.recurrencePatterns.${event.recurrence_pattern}`) }}
                  <template v-if="event.recurrence_interval > 1"> (x{{ event.recurrence_interval }})</template>
                </span>
              </h4>
              <p v-if="event.description" class="agenda-event-desc">{{ event.description }}</p>
              
              <div v-if="event.node_id" class="linked-doc-section">
                <span class="linked-label">{{ locale === 'fr' ? 'Lien : ' : 'Link: ' }}</span>
                <NuxtLink :to="`/dashboard/docs/${event.node_id}`" class="linked-doc-link">
                  📄 {{ getDocName(event.node_id) }}
                </NuxtLink>
              </div>

              <div class="agenda-actions">
                <button class="action-btn" @click="openEditModal(event)">
                  {{ t('common.actions.edit') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from 'vue';
import { useCalendarStore, type CalendarEvent } from '~/stores/calendar.store';
import { useNodesStore } from '~/stores/nodes.store';
import EventModal from '~/components/Calendar/EventModal.vue';
import { Modal } from '~/composables/useModal';

definePageMeta({ breadcrumb: { i18n: 'calendar.title' } });

const { t, locale } = useI18nT();
const calendarStore = useCalendarStore();
const nodesStore = useNodesStore();
const modals = useModal();

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());
const selectedDate = ref<Date>(new Date());
const currentView = ref<'month' | 'week' | 'day'>('month');

const selectedTypes = ref<string[]>(['event', 'homework', 'exam', 'other']);

const toggleTypeFilter = (type: string) => {
  if (selectedTypes.value.includes(type)) {
    if (selectedTypes.value.length > 1) {
      selectedTypes.value = selectedTypes.value.filter(t => t !== type);
    }
  } else {
    selectedTypes.value.push(type);
  }
};

const filterEvents = (events: CalendarEvent[]) => {
  return events.filter(e => selectedTypes.value.includes(e.type));
};

const weekdayNames = computed(() => {
  return locale.value === 'fr'
    ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
});

const headerPeriodText = computed(() => {
  if (currentView.value === 'month') {
    const date = new Date(currentYear.value, currentMonth.value, 1);
    return date.toLocaleDateString(locale.value, { month: 'long', year: 'numeric' });
  } else if (currentView.value === 'week') {
    const start = getWeekStart(selectedDate.value);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString(locale.value, { month: 'short', year: 'numeric' })}`;
  } else {
    return selectedDate.value.toLocaleDateString(locale.value, { day: 'numeric', month: 'long', year: 'numeric' });
  }
});

const selectedDayFormatted = computed(() => {
  return selectedDate.value.toLocaleDateString(locale.value, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
});

const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isSelectedDay = (date: Date) => {
  return isSameDay(date, selectedDate.value);
};

const getEventsForDate = (date: Date) => {
  return calendarStore.getEventsForDate(date);
};

const daysInMonth = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const firstDay = new Date(year, month, 1);
  let startDayOfWeek = firstDay.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevTotalDays = new Date(year, month, 0).getDate();



  const days = [];

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevTotalDays - i;
    const d = new Date(year, month - 1, day);
    days.push({
      date: d,
      dayNum: day,
      isCurrentMonth: false,
      isToday: isSameDay(d, new Date()),
      events: getEventsForDate(d),
    });
  }

  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, month, day);
    days.push({
      date: d,
      dayNum: day,
      isCurrentMonth: true,
      isToday: isSameDay(d, new Date()),
      events: getEventsForDate(d),
    });
  }

  const remainingCells = 42 - days.length;
  for (let day = 1; day <= remainingCells; day++) {
    const d = new Date(year, month + 1, day);
    days.push({
      date: d,
      dayNum: day,
      isCurrentMonth: false,
      isToday: isSameDay(d, new Date()),
      events: getEventsForDate(d),
    });
  }

  return days;
});

const getWeekStart = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);   return new Date(d.setDate(diff));
};

const daysInWeek = computed(() => {
  const start = getWeekStart(selectedDate.value);
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      date: d,
      isToday: isSameDay(d, new Date()),
      events: getEventsForDate(d),
    };
  });
});

const dayHours = Array.from({ length: 15 }).map((_, i) => i + 8); // from 8am to 10pm

const timelineEvents = computed(() => {
  const rawEvents = filterEvents(selectedDayEvents.value);
  return rawEvents.filter(e => {
    const start = new Date(e.start_date).getHours();
    return start >= 8 && start < 22;
  });
});

const getHourPercent = (timeMs: number) => {
  const d = new Date(timeMs);
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const relativeHour = hours + minutes / 60 - 8;
  if (relativeHour < 0) return 0;
  if (relativeHour > 14) return 100;
  return (relativeHour / 14) * 100;
};

const selectedDayEvents = computed(() => {
  return getEventsForDate(selectedDate.value);
});




const navigatePeriod = (direction: number) => {
  if (currentView.value === 'month') {
    if (currentMonth.value === 0 && direction === -1) {
      currentMonth.value = 11;
      currentYear.value--;
    } else if (currentMonth.value === 11 && direction === 1) {
      currentMonth.value = 0;
      currentYear.value++;
    } else {
      currentMonth.value += direction;
    }
  } else if (currentView.value === 'week') {
    const d = new Date(selectedDate.value);
    d.setDate(d.getDate() + 7 * direction);
    selectedDate.value = d;
    currentMonth.value = d.getMonth();
    currentYear.value = d.getFullYear();
  } else {
    const d = new Date(selectedDate.value);
    d.setDate(d.getDate() + direction);
    selectedDate.value = d;
    currentMonth.value = d.getMonth();
    currentYear.value = d.getFullYear();
  }
};

const goToday = () => {
  const today = new Date();
  currentMonth.value = today.getMonth();
  currentYear.value = today.getFullYear();
  selectedDate.value = today;
};

const selectDay = (date: Date) => {
  selectedDate.value = date;
};

const onDragStart = (e: DragEvent, eventObj: CalendarEvent) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', JSON.stringify(eventObj));
    e.dataTransfer.effectAllowed = 'move';
  }
};

const onDrop = async (e: DragEvent, dropDate: Date) => {
  const dataStr = e.dataTransfer?.getData('text/plain');
  if (!dataStr) return;

  try {
    const eventObj = JSON.parse(dataStr) as CalendarEvent;
    const duration = eventObj.end_date - eventObj.start_date;

    const originalStart = new Date(eventObj.start_date);
    const targetStart = new Date(dropDate);
    targetStart.setHours(originalStart.getHours(), originalStart.getMinutes(), 0, 0);

    const newStartMs = targetStart.getTime();
    const newEndMs = newStartMs + duration;

    const updatedEvent = {
      ...eventObj,
      start_date: newStartMs,
      end_date: newEndMs,
    };

    await calendarStore.updateEvent(updatedEvent);
  } catch (err) {
    console.error('Failed to reschedule event on drop:', err);
  }
};

const openAddModal = (date: Date) => {
  modals.add(
    new Modal(shallowRef(EventModal), {
      size: 'small',
      props: {
        defaultDate: date,
      },
    })
  );
};

const openAddModalFromTimeline = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const clickYPercent = ((e.clientY - rect.top) / rect.height) * 100;
  
  const totalHours = 14;
  const targetHour = Math.floor(8 + (clickYPercent / 100) * totalHours);
  
  const date = new Date(selectedDate.value);
  date.setHours(targetHour, 0, 0, 0);

  openAddModal(date);
};

const openEditModal = (event: CalendarEvent) => {
  modals.add(
    new Modal(shallowRef(EventModal), {
      size: 'small',
      props: {
        event: event,
      },
    })
  );
};

const formatTime = (timeMs: number) => {
  return new Date(timeMs).toLocaleTimeString(locale.value, { hour: '2-digit', minute: '2-digit' });
};

const formatTimeRange = (startMs: number, endMs: number) => {
  return `${formatTime(startMs)} - ${formatTime(endMs)}`;
};

const getDocName = (nodeId: string) => {
  const doc = nodesStore.getById(nodeId);
  return doc ? doc.name : 'Document';
};

onMounted(async () => {
  await calendarStore.fetchEvents();
});
</script>

<style scoped lang="scss">
.calendar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 1rem;
  gap: 12px;
}

.calendar-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  background-color: var(--surface-base);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 8px 16px;
  box-shadow: var(--shadow-sm);
}

.filters-bar {
  display: flex;
  align-items: center;
  gap: 8px;

  .filter-title {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-secondary);
    letter-spacing: 0.5px;
  }

  .filter-options {
    display: flex;
    gap: 6px;
  }
}

.filter-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background-color: var(--surface-raised);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  &:hover {
    background-color: var(--surface-overlay);
  }

  &.active {
    color: var(--text-primary);
    background-color: var(--surface-base);
    border-color: var(--text-secondary);

    &.event { border-color: var(--blue); .dot { background-color: var(--blue); } }
    &.homework { border-color: var(--green); .dot { background-color: var(--green); } }
    &.exam { border-color: var(--red); .dot { background-color: var(--red); } }
    &.other { border-color: var(--orange); .dot { background-color: var(--orange); } }
  }
}

.view-toggle-group {
  display: flex;
  background-color: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 2px;
}

.view-toggle-btn {
  padding: 6px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  border: none;
  background: none;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: var(--text-primary);
  }

  &.active {
    background-color: var(--surface-base);
    color: var(--primary);
    box-shadow: var(--shadow-sm);
  }
}

.calendar-layout {
  display: flex;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;

  @media screen and (max-width: 900px) {
    flex-direction: column;
    overflow-y: auto;
  }
}

.calendar-main-card {
  flex: 7;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-base);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
  min-height: 580px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;

  .nav-buttons {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nav-btn {
    font-size: 1.5rem;
    font-weight: 600;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--radius-md);
    background-color: var(--surface-raised);
    border: 1px solid var(--border);
    cursor: pointer;
    color: var(--text-primary);
    transition: all 0.15s ease;

    &:hover {
      background-color: var(--surface-overlay);
      border-color: var(--text-secondary);
    }
  }

  .today-btn {
    padding: 0 12px;
    height: 32px;
    font-size: 0.85rem;
    font-weight: 600;
    border-radius: var(--radius-md);
    background-color: var(--surface-raised);
    border: 1px solid var(--border);
    cursor: pointer;
    color: var(--text-primary);
    transition: all 0.15s ease;

    &:hover {
      background-color: var(--surface-overlay);
    }
  }

  .current-month-year {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0;
    color: var(--text-primary);
    text-transform: capitalize;
  }
}

.view-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.weekdays-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid var(--border);
  padding-bottom: 6px;
  margin-bottom: 8px;
}

.weekday-header {
  font-size: 0.8rem;
  font-weight: 700;
  text-align: center;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  flex: 1;
  gap: 4px;
}

.day-cell {
  background-color: var(--surface-raised);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  min-height: 80px;
  transition: all 0.12s ease;

  &:hover {
    border-color: var(--border);
    background-color: var(--surface-overlay);

    .add-event-plus {
      opacity: 1;
    }
  }

  &.other-month {
    opacity: 0.45;
  }

  &.is-today {
    background-color: var(--primary-bg);
    border-color: var(--primary);

    .day-number {
      color: var(--primary);
      font-weight: 700;
    }
  }

  &.selected-day {
    outline: 2px solid var(--text-primary);
    outline-offset: -2px;
  }
}

.day-number-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .day-number {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .add-event-plus {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-secondary);
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s ease, color 0.15s ease;
    padding: 0;
    line-height: 1;

    &:hover {
      color: var(--primary);
    }
  }
}

.day-events-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  overflow: hidden;
}

.event-pill {
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  background-color: var(--surface-base);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: var(--shadow-sm);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  .recurrence-indicator {
    font-size: 0.65rem;
  }

  .event-type-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;

    &.event { background-color: var(--blue); }
    &.homework { background-color: var(--green); }
    &.exam { background-color: var(--red); }
    &.other { background-color: var(--orange); }
  }

  .event-title {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.more-events-badge {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-secondary);
  padding-left: 4px;
}

.week-columns-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  flex: 1;
  gap: 6px;
}

.week-day-column {
  background-color: var(--surface-raised);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 480px;
  cursor: pointer;
  transition: all 0.12s ease;

  &:hover {
    border-color: var(--border);
    background-color: var(--surface-overlay);

    .add-event-plus {
      opacity: 1;
    }
  }

  &.is-today {
    background-color: var(--primary-bg);
    border-color: var(--primary);

    .col-day-num {
      color: var(--primary);
      font-weight: 700;
    }
  }

  &.selected-day {
    outline: 2px solid var(--text-primary);
    outline-offset: -2px;
  }
}

.column-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
  padding-bottom: 4px;

  .col-day-num {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-primary);
  }
}

.column-events-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  overflow-y: auto;
}

.week-event-card {
  padding: 6px 8px;
  border-radius: var(--radius-md);
  background-color: var(--surface-base);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  .card-time {
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--text-secondary);
  }

  .card-title {
    font-size: 0.78rem;
    font-weight: 700;
    margin: 0;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .recurrence-indicator-small {
    font-size: 0.65rem;
    align-self: flex-end;
    margin-top: 2px;
  }
}

.day-timeline-view {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.day-timeline-layout {
  display: flex;
  position: relative;
  min-height: 600px;
}

.timeline-scale {
  width: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 0;
  border-right: 1px solid var(--border);
}

.scale-hour {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-secondary);
  height: 40px;
  display: flex;
  align-items: center;
}

.timeline-content-area {
  flex: 1;
  position: relative;
  padding: 10px 0;
}

.timeline-grid-row {
  height: 40px;
  border-bottom: 1px dashed var(--border);
  box-sizing: border-box;

  &:last-child {
    border-bottom: none;
  }
}

.timeline-event-block {
  position: absolute;
  left: 10px;
  right: 10px;
  background-color: var(--surface-raised);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: grab;
  overflow: hidden;
  transition: box-shadow 0.15s ease;

  &:active {
    cursor: grabbing;
  }

  &:hover {
    box-shadow: var(--shadow-md);
  }

  .block-time {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--text-secondary);
  }

  .block-title {
    font-size: 0.88rem;
    font-weight: 700;
    margin: 0;
    color: var(--text-primary);
  }

  .block-desc {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .recurrence-indicator-small {
    font-size: 0.65rem;
  }
}

.agenda-sidebar {
  flex: 3;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-base);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
  max-height: 100%;
  overflow-y: auto;
}

.agenda-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
  padding-bottom: 12px;
  margin-bottom: 16px;

  h3 {
    font-size: 1.05rem;
    font-weight: 700;
    margin: 0;
    color: var(--text-primary);
    text-transform: capitalize;
  }

  .add-btn-sm {
    padding: 6px 12px;
    font-size: 0.8rem;
    height: auto;
  }
}

.agenda-content {
  flex: 1;
}

.no-events-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.agenda-events-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.agenda-card {
  background-color: var(--surface-raised);
  border-radius: var(--radius-md);
  padding: 12px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.agenda-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.agenda-event-type-badge {
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: white;

  &.event { background-color: var(--blue); }
  &.homework { background-color: var(--green); }
  &.exam { background-color: var(--red); }
  &.other { background-color: var(--orange); }
}

.agenda-time {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.agenda-event-title {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 4px;

  &:hover {
    color: var(--primary);
  }

  .recurrence-badge {
    font-size: 0.68rem;
    font-weight: 500;
    color: var(--text-secondary);
    background-color: var(--surface-base);
    padding: 2px 6px;
    border-radius: var(--radius-xs);
    border: 1px solid var(--border);
  }
}

.agenda-event-desc {
  font-size: 0.82rem;
  color: var(--text-secondary);
  margin: 0;
  white-space: pre-wrap;
}

.linked-doc-section {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: var(--surface-base);
  padding: 4px 8px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border);
  width: fit-content;

  .linked-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-secondary);
  }

  .linked-doc-link {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.agenda-actions {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--border);
  padding-top: 8px;
  margin-top: 4px;

  .action-btn {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--primary);
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
