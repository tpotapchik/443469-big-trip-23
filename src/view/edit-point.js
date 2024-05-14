import {EVENT_TYPES} from '../constants.js';
import {displayDateTime, DateFormats} from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';

//todo checked type
const createEventTypeTemplate = (group) => `
  <div class="event__type-item">
    <input id="event-type-${group.toLowerCase()}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${group.toLowerCase()}">
    <label class="event__type-label  event__type-label--${group.toLowerCase()}" for="event-type-${group.toLowerCase()}-1">${group}</label>
  </div>
`;

const createOfferTemplate = (type, title, price, id, isChecked) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden" id="event-offer-${type}-${id}" type="checkbox" name="event-offer-${type}" ${isChecked ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${type}-${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>
`;

const createCheckedOfferTemplates = (allOffers, pointOffers) => allOffers.offers
  .map((offer) => {
    const isChecked = pointOffers.includes(offer.id);
    return createOfferTemplate(allOffers.type, offer.title, offer.price, offer.id, isChecked);
  })
  .join('');

const createImageItemTemplate = (src, description) => `
  <img class="event__photo" src="${src}" alt="${description}">
`;

const createEditPointTemplate = (point, allOffers, allDestinations, pointDestination) => {
  console.log('point', point)
  const {type, basePrice, dateFrom, dateTo} = point;

  return (`
    <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${EVENT_TYPES.map((group) => createEventTypeTemplate(group)).join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
           ${allDestinations.map((item) => `
            <option value="${item.name}"></option>
          `)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${displayDateTime(dateFrom, DateFormats.DATE_TIME)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${displayDateTime(dateTo, DateFormats.DATE_TIME)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
      ${allOffers.offers.length > 0 ? `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${createCheckedOfferTemplates(allOffers, point.offers)}
          </div>
        </section>
      ` : ''}

      ${pointDestination.pictures.length > 0 ? `
       <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${pointDestination?.description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${pointDestination.pictures.map(({src, description}) => createImageItemTemplate(src, description)).join('')}
          </div>
        </div>
      </section>
      ` : ''}
      </section>
    </form>
  </li>
  `);
};

export default class EditPoint extends AbstractView {
  #point = null;
  #allOffers = null;
  #allDestinations = null;
  #pointDestination = null;

  constructor({point, allOffers, allDestinations, pointDestination}) {
    super();
    this.#point = point;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#pointDestination = pointDestination;
  }

  get template() {
    return createEditPointTemplate(this.#point, this.#allOffers, this.#allDestinations, this.#pointDestination);
  }
}
