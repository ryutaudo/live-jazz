import data from '../data/events.json';

export function initializeEvents() {
  return {
    type: 'INITIALIZE_EVENT_DATA',
    data,
  };
}

export function setSelectedEvent(event) {
  return {
    type: 'SET_SELECTED_EVENT',
    event,
  };
}