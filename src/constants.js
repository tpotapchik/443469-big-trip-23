const SORTING_TYPES = ['Day', 'Event', 'Time', 'Price', 'Offers'];
// const FILTER_TYPES = ['Everything', 'Future', 'Present', 'Past'];

const FilterTypes = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PRESENT: 'Present',
  PAST: 'Past'
};

const EventsMessages = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now',
  FAILED_LOAD: 'Failed to load latest route information',
  LOADING: 'Loading...'
};

const EVENT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

export {SORTING_TYPES, FilterTypes, EventsMessages, EVENT_TYPES};
