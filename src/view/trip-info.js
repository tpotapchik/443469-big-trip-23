import AbstractView from '../framework/view/abstract-view.js';

const renderTitle = (points, destinations) => {
  const destinationNames = points.map((point) => destinations.find((destination) => point.destination === destination.id))
    .map((destination) => destination.name);

  if (destinationNames.length > 3) {
    return `${destinationNames[0]} —...— ${destinationNames[destinationNames.length - 1]}`;
  }

  return destinationNames.join(' — ');
};

const createTripInfoTemplate = (points, offers, destinations) => `

  <section class="trip-main__trip-info trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${renderTitle(points, destinations)}</h1>

      <p class="trip-info__dates">18&nbsp;&mdash;&nbsp;20 Mar</p>
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
    // console.log(this.#points);
    // console.log(this.#offers);
    console.log(this.#destinations);
    return createTripInfoTemplate(this.#points, this.#offers, this.#destinations);
  }
}
