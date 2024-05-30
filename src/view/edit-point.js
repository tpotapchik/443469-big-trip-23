import {EVENT_TYPES, DateFormat} from '../constants.js';
import {displayDateTime} from '../utils/date.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const createEventTypeTemplate = (type, pointType, id) => `
  <div class="event__type-item">
    <input id="event-type-${type.toLowerCase()}-${id}" class="event__type-input visually-hidden" type="radio" name="event-type-${id}" value="${type.toLowerCase()}" ${type.toLowerCase() === pointType ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-${id}">${type}</label>
  </div>
`;

const createOfferTemplate = (type, title, price, id, isChecked) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden" id="event-offer-${type}-${id}" data-offer-id="${id}" type="checkbox" name="event-offer-${type}" ${isChecked ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${type}-${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>
`;

const createCheckedOfferTemplates = (typeOffers, pointOffers) => typeOffers.offers
  .map((offer) => {
    const isChecked = pointOffers.includes(offer.id);
    return createOfferTemplate(typeOffers.type, offer.title, offer.price, offer.id, isChecked);
  })
  .join('');

const createImageItemTemplate = (src, description) => `
  <img class="event__photo" src="${src}" alt="${description}">
`;

const createEditPointTemplate = (state, allDestinations) => {
  const {type, basePrice, dateFrom, dateTo, id, offers} = state.point;

  return (`
    <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${EVENT_TYPES.map((group) => createEventTypeTemplate(group, type, id)).join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination--${id}">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination--${id}" type="text" name="event-destination" value="${state.pointDestination.name}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
           ${allDestinations.map((item) => `
            <option value="${item.name}"></option>
          `)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${displayDateTime(dateFrom, DateFormat.DATE_TIME)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${displayDateTime(dateTo, DateFormat.DATE_TIME)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
      ${state.typeOffers.offers?.length > 0 ? `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${createCheckedOfferTemplates(state.typeOffers, offers)}
          </div>
        </section>
      ` : ''}

      ${state.pointDestination.description || state.pointDestination.pictures.length > 0 ? `
       <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${state.pointDestination.description}</p>

        ${state.pointDestination.pictures.length > 0 ? `
         <div class="event__photos-container">
            <div class="event__photos-tape">
             ${state.pointDestination.pictures.map(({src, description}) => createImageItemTemplate(src, description)).join('')}
            </div>
          </div>
        ` : '' }
        </section>
      ` : ''}
      </section>
    </form>
  </li>
  `);
};

export default class EditPoint extends AbstractStatefulView {
  #allDestinations = [];
  #handleEditSubmit = null;
  #handleEditClose = null;
  #allOffers = [];
  #initialPoint = null;
  #dateStartPicker = null;
  #dateEndPicker = null;

  constructor(point, allOffers, typeOffers, allDestinations, pointDestination, onEditSubmit, onEditClose) {
    super();
    this.#initialPoint = point;
    this._setState({
      point: {...point},
      typeOffers: {...typeOffers},
      pointDestination: {...pointDestination}
    });
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleEditSubmit = onEditSubmit;
    this.#handleEditClose = onEditClose;
    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#allDestinations);
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editRollUpHandler);

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#eventTypeHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationTypeHandler);

    this.#setDatePicker();
  }

  removeElement() {
    super.removeElement();

    if (this.#dateStartPicker) {
      this.#dateStartPicker.destroy();
      this.#dateStartPicker = null;
    }

    if (this.#dateEndPicker) {
      this.#dateEndPicker.destroy();
      this.#dateEndPicker = null;
    }
  }

  #setDatePicker = () => {
    const startTime = this.element.querySelector('[name="event-start-time"]');
    const endTime = this.element.querySelector('[name="event-end-time"]');

    const datePickerOptions = {
      enableTime: true,
      'time_24hr': true,
      dateFormat: DateFormat.DATE_PICKER
    };

    this.#dateStartPicker = flatpickr(
      startTime,
      {
        ...datePickerOptions,
        maxDate: this._state.point.dateTo,
        onChange: this.#changeDateHandler('dateFrom')
      }
    );

    this.#dateEndPicker = flatpickr(
      endTime,
      {
        ...datePickerOptions,
        minDate: this._state.point.dateFrom,
        onChange: this.#changeDateHandler('dateTo')
      }
    );
  };

  #changeDateHandler = (date) => ([userDate]) => {
    this._setState({
      [date]: userDate
    });

    if (date === 'dateFrom') {
      this.#dateEndPicker.set('minDate', userDate);
    } else if (date === 'dateTo') {
      this.#dateStartPicker.set('maxDate', userDate);
    }
  };

  #eventTypeHandler = (evt) => {
    evt.preventDefault();
    const newType = evt.target.value;
    const typeOffers = this.#allOffers.find((offer) => offer.type === newType);
    this.updateElement({
      point: {
        ...this._state.point,
        type: newType
      },
      typeOffers: {...typeOffers}
    });
  };

  #destinationTypeHandler = (evt) => {
    evt.preventDefault();
    const newDestination = evt.target.value;
    const typeDestination = this.#allDestinations.find((destination) => destination.name === newDestination);
    if (!typeDestination) {
      return;
    }
    this.updateElement({
      point: {
        ...this._state.point,
        destination: typeDestination.id
      },
      pointDestination: {...typeDestination}
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    if (this.#handleEditSubmit) {
      this.#handleEditSubmit({...this._state});
    }
  };

  #editRollUpHandler = (evt) => {
    evt.preventDefault();
    if (this.#handleEditClose) {
      this.#handleEditClose({...this._state});
    }
  };

  reset() {
    this.updateElement({
      point: {...this.#initialPoint},
      typeOffers: this.#allOffers.find((offer) => offer.type === this.#initialPoint.type),
      pointDestination: this.#allDestinations.find((destination) => destination.id === this.#initialPoint.destination)
    });
  }

  //todo do we need this?
  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    return {...state};
  }
}
