import {defaultSortingType, MAX_DESTINATION_COUNT} from '../constants.js';
import AbstractView from '../framework/view/abstract-view.js';
import {displayMonthDay} from '../utils/date.js';
import {sortPoints} from '../utils/sorting-values.js';

const renderTitle = (points, destinations) => {
  const sortedPoints = sortPoints(points, defaultSortingType);
  const destinationNames = sortedPoints.map((point) => destinations.find((destination) => point.destination === destination.id))
    .map((destination) => destination.name);

  if (destinationNames.length > MAX_DESTINATION_COUNT) {
    return `${destinationNames[0]} —...— ${destinationNames[destinationNames.length - 1]}`;
  }

  return destinationNames.join(' — ');
};

const renderDates = (points) => {
  const sortedPoints = sortPoints(points, defaultSortingType);
  const datesStart = sortedPoints.map((point) => point.dateFrom);
  const datesEnd = sortedPoints.map((point) => point.dateTo);
  const tripStart = displayMonthDay(datesStart[0]);
  const tripEnd = displayMonthDay(datesEnd[datesEnd.length - 1]);

  return `${tripStart} — ${tripEnd}`;
};

const renderPrice = (points, offers) => {
  const basePrices = points.map((point) => point.basePrice);
  const sumBasePrice = basePrices.reduce((accumulator, number) => accumulator + number, 0);

  const sumOffersPrice = points.reduce((totalOffersPrice, point) => {
    const pointOffers = point.offers;
    const pointTypeOffers = offers.find((offer) => offer.type === point.type).offers;

    const relevantOffersPrice = pointOffers.reduce((accumulator, offerId) => {
      const offer = pointTypeOffers.find((item) => item.id === offerId);
      return accumulator + (offer ? offer.price : 0);
    }, 0);

    return totalOffersPrice + relevantOffersPrice;
  }, 0);

  return sumBasePrice + sumOffersPrice;
};

const createTripInfoTemplate = (points, offers, destinations) => `

  <section class="trip-main__trip-info trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${renderTitle(points, destinations)}</h1>

      <p class="trip-info__dates">${renderDates(points)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${renderPrice(points, offers)}</span>
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
