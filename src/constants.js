const SortingType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const FilterType = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PRESENT: 'Present',
  PAST: 'Past'
};

const EventsMessage = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now',
  FAILED_LOAD: 'Failed to load latest route information',
  LOADING: 'Loading...'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const EVENT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

export {FilterType, EventsMessage, Mode, EVENT_TYPES, SortingType};
