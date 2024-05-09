const SORTING_TYPES = ['Day', 'Event', 'Time', 'Price', 'Offers'];
const FILTER_TYPES = ['Everything', 'Future', 'Present', 'Past'];
const ID_IMAGES = [1, 2, 3, 4, 5];
const EVENT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const DESTINATIONS = ['Amsterdam', 'Geneva', 'Chamonix'];
const OFFERS = [
  {
    type: 'luggage',
    title: 'Add luggage',
    price: 30
  },
  {
    type: 'comfort',
    title: 'Switch to comfort class',
    price: 100
  },
  {
    type: 'meal',
    title: 'Add meal',
    price: 15
  },
  {
    type: 'seats',
    title: 'Choose seats',
    price: 5
  },
  {
    type: 'train',
    title: 'Travel by train',
    price: 40
  }
];

export {SORTING_TYPES, FILTER_TYPES, ID_IMAGES, OFFERS, EVENT_TYPES, DESTINATIONS};
