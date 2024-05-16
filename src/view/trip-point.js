import {calculateDuration, displayDate, displayDateMonth, displayDateTime, displayTime} from '../utils/date.js';
import AbstractView from '../framework/view/abstract-view.js';

const createOffersItemTemplate = (title, price) => `
  <li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>
`;

const createPointScheduleTemplate = (from, to) => `
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${displayDateTime(from)}">${displayTime(from)}</time>
      &mdash;
      <time class="event__end-time" datetime="${displayDateTime(to)}">${displayTime(to)}</time>
    </p>
    <p class="event__duration">${calculateDuration(from, to)}</p>
  </div>
`;

const createTripPointTemplate = (point, allOffers, allDestinations) => {
  const {type, isFavorite, basePrice, dateFrom, dateTo} = point;

  return (`
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${displayDate(dateFrom)}">${displayDateMonth(dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${allDestinations.name}</h3>
      ${createPointScheduleTemplate(dateFrom, dateTo)}
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
       ${allOffers.map(({title, price}) => createOffersItemTemplate(title, price)).join('')}
      </ul>
      <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
`);
};

export default class TripPoint extends AbstractView {
  #point = null;
  #allOffers = null;
  #allDestinations = null;
  #handleEditClick = null;

  constructor({point, allOffers, allDestinations, onEditClick}) {
    super();
    this.#point = point;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  get template() {
    return createTripPointTemplate(this.#point, this.#allOffers, this.#allDestinations);
  }
}
