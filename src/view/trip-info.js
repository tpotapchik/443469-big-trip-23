import AbstractView from '../framework/view/abstract-view.js';
import {displayMonthDay} from '../utils/date.js';

const renderTitle = (points, destinations) => {
  const destinationNames = points.map((point) => destinations.find((destination) => point.destination === destination.id))
    .map((destination) => destination.name);

  if (destinationNames.length > 3) {
    return `${destinationNames[0]} —...— ${destinationNames[destinationNames.length - 1]}`;
  }

  return destinationNames.join(' — ');
};

const renderDates = (points) => {
  const datesStart = points.map((point) => point.dateFrom);
  const datesEnd = points.map((point) => point.dateTo);
  const tripStart = displayMonthDay(datesStart[0]);
  const tripEnd = displayMonthDay(datesEnd[datesEnd.length - 1]);

  return `${tripStart} — ${tripEnd}`;
};

const createTripInfoTemplate = (points, offers, destinations) => `

  <section class="trip-main__trip-info trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${renderTitle(points, destinations)}</h1>

      <p class="trip-info__dates">${renderDates(points)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>
  </section>
`;

export default class TripInfo extends AbstractView {
  #points = null;
  #offers = null;
  #destinations = null;

  constructor({points, offers, destinations}) {
    super();
    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#offers, this.#destinations);
  }
}
