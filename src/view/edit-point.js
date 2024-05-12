import {ID_IMAGES, EVENT_TYPES} from '../constants.js';
import {createElement} from '../render.js';
import {displayTime} from "../utils";
// import {createEventTypeTemplate, createOfferTemplate, createDestinationTemplate} from './event-form-elements.js';

const createEventTypeTemplate = (group) => `
  <div class="event__type-item">
    <input id="event-type-${group.toLowerCase()}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${group.toLowerCase()}">
    <label class="event__type-label  event__type-label--${group.toLowerCase()}" for="event-type-${group.toLowerCase()}-1">${group}</label>
  </div>
`;

const createOfferTemplate = (type, title, price) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden" id="event-offer-${type}-1" type="checkbox" name="event-offer-${type}" checked>
    <label class="event__offer-label" for="event-offer-${type}-1">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>
`;

const createImageItemTemplate = (src, description) => `
  <img class="event__photo" src="${src}" alt="${description}">
`;

const createEditPointTemplate = (point, destinations, offers) => {
  const {type, isFavorite, basePrice, dateFrom, dateTo} = point;
  const typeOffers = offers.find((offer) => offer.type === point.type).offers;
  const currentOffers = typeOffers.filter((typeOffer) => point.offers.includes(typeOffer.id));
  // console.log(currentOffers);
  const currentDestination = destinations.find((destination) => destination.id === point.destination);
  console.log(currentDestination);

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
           ${destinations.map((item) => `
            <option value="${item.name}"></option>
          `)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 ${displayTime(dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 ${displayTime(dateTo)}">
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
        ${currentOffers.length > 0 ? `
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${currentOffers.map(({typeOffer, title, price}) => createOfferTemplate(typeOffer, title, price)).join('')}
            </div>
          </section>
        ` : ''}

         ${currentDestination.pictures.length > 0 ? `
           <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${currentDestination?.description}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${currentDestination.pictures.map(({src, description}) => createImageItemTemplate(src, description)).join('')}
              </div>
            </div>
          </section>
        ` : ''}
      </section>
    </form>
  </li>
  `);
};

export default class EditPoint {
  constructor(point, destinations, offers) {
    this.point = point;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate() {
    return createEditPointTemplate(this.point, this.destinations, this.offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
