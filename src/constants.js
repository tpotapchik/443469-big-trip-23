const SortingType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const FilterMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

const EmptyMessage = {
  FAILED_LOAD: 'Failed to load latest route information',
  LOADING: 'Loading...'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const DateFormat = {
  DATE_MONTH: 'MMM D',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATE_TIME_SYSTEM: 'YYYY-MM-DDTHH:mm',
  DATE_TIME: 'DD/MM/YY HH:mm',
  DAY: 'DD[d] HH[h] mm[m]',
  HOURS: 'HH[h] mm[m]',
  MINUTES: 'mm[m]',
  DATE_PICKER: 'd/m/y H:i'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DEFAULT_POINT_TYPE = EVENT_TYPES[5];

const DEFAULT_POINT = {
  basePrice: 0,
  dateFrom: new Date().toISOString(),
  dateTo: new Date(new Date().getTime() + 60 * 1000).toISOString(),
  destination: 0,
  isFavorite: false,
  offers: [],
  type: DEFAULT_POINT_TYPE
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';

const AUTHORIZATION = 'Basic pS2syiwcl1s11j';

export {FilterType, FilterMessage, Mode, EVENT_TYPES, SortingType, DateFormat, UserAction, UpdateType, DEFAULT_POINT, EmptyMessage, Method, END_POINT, AUTHORIZATION};
