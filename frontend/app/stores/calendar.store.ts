import { defineStore } from 'pinia';
import { makeRequest } from './_utils';

export interface CalendarEvent {
  id?: string;
  originalId?: string;
  isOccurrence?: boolean;
  user_id?: string;
  title: string;
  description?: string;
  start_date: number;
  end_date: number;
  color?: string;
  type: string; // "event" or "homework" or  "exam", "other"
  node_id?: string;
  recurrence_pattern?: 'none' | 'daily' | 'weekly' | 'monthly';
  recurrence_interval?: number;
  recurrence_end?: number;
  created_timestamp?: number;
  updated_timestamp?: number;
}

export function generateOccurrencesForPeriod(events: CalendarEvent[], periodStartMs: number, periodEndMs: number): CalendarEvent[] {
  const occurrences: CalendarEvent[] = [];

  for (const event of events) {
    if (!event.recurrence_pattern || event.recurrence_pattern === 'none') {
      if (event.start_date <= periodEndMs && event.end_date >= periodStartMs) {
        occurrences.push({ ...event });
      }
      continue;
    }

    const duration = event.end_date - event.start_date;
    const recurrenceEnd = event.recurrence_end || periodEndMs;
    const endBound = Math.min(recurrenceEnd, periodEndMs);

    const currentStart = new Date(event.start_date);
    let count = 0;

    while (currentStart.getTime() <= endBound && count < 365) {
      const occurrenceStartMs = currentStart.getTime();
      const occurrenceEndMs = occurrenceStartMs + duration;

      if (occurrenceStartMs <= periodEndMs && occurrenceEndMs >= periodStartMs) {
        occurrences.push({
          ...event,
          id: `${event.id}-${occurrenceStartMs}`,
          originalId: event.id,
          start_date: occurrenceStartMs,
          end_date: occurrenceEndMs,
          isOccurrence: true,
        });
      }

      if (event.recurrence_pattern === 'daily') {
        currentStart.setDate(currentStart.getDate() + (event.recurrence_interval || 1));
      } else if (event.recurrence_pattern === 'weekly') {
        currentStart.setDate(currentStart.getDate() + 7 * (event.recurrence_interval || 1));
      } else if (event.recurrence_pattern === 'monthly') {
        currentStart.setMonth(currentStart.getMonth() + (event.recurrence_interval || 1));
      } else {
        break;
      }
      count++;
    }
  }
  return occurrences;
}

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    events: [] as CalendarEvent[],
    isFetching: false,
  }),
  getters: {
    getEventsForDate: state => (date: Date) => {
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999).getTime();
      return generateOccurrencesForPeriod(state.events, startOfDay, endOfDay);
    },
    getEventsForPeriod: state => (startMs: number, endMs: number) => {
      return generateOccurrencesForPeriod(state.events, startMs, endMs);
    },
  },
  actions: {
    async fetchEvents() {
      this.isFetching = true;
      try {
        const response = await makeRequest<CalendarEvent[]>('calendar', 'GET');
        if (response.status === 'success') {
          this.events = response.result || [];
        }
      } catch (err) {
        console.error('Failed to get calendar events:', err);
      } finally {
        this.isFetching = false;
      }
    },
    async createEvent(event: Omit<CalendarEvent, 'id' | 'user_id'>) {
      try {
        const response = await makeRequest<CalendarEvent>('calendar', 'POST', event);
        if (response.status === 'success' && response.result) {
          this.events.push(response.result);
          return response.result;
        }
      } catch (err) {
        console.error('Failed to create calendar event:', err);
        throw err;
      }
    },
    async updateEvent(event: CalendarEvent) {
      const targetId = event.originalId || event.id;
      const cleanEvent = { ...event, id: targetId };
      delete cleanEvent.originalId;
      delete cleanEvent.isOccurrence;

      try {
        const response = await makeRequest<CalendarEvent>(`calendar/${targetId}`, 'PUT', cleanEvent);
        if (response.status === 'success' && response.result) {
          const index = this.events.findIndex(e => e.id === targetId);
          if (index !== -1) {
            this.events[index] = response.result;
          }
          return response.result;
        }
      } catch (err) {
        console.error('failed to update calendar event:', err);
        throw err;
      }
    },
    async deleteEvent(eventId: string) {
      try {
        const response = await makeRequest(`calendar/${eventId}`, 'DELETE');
        if (response.status === 'success') {
          this.events = this.events.filter(e => e.id !== eventId);
        }
      } catch (err) {
        console.error('filed to delete calendar event:', err);
        throw err;
      }
    },
  },
});
