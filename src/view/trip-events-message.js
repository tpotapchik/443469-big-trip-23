import {FilterMessage} from '../constants.js';
import AbstractView from '../framework/view/abstract-view.js';

const createTripFilterMessageTemplate = (message, filterType) => {
  const filterMessage = FilterMessage[filterType];

  return `<p class="trip-events__msg">${message || filterMessage}</p>`;
};

export default class TripFilterMessage extends AbstractView {
  #message = null;
  #filterType = null;

  constructor({message, filterType}) {
    super();
    this.#message = message;
    this.#filterType = filterType;
  }

  get template() {
    return createTripFilterMessageTemplate(this.#message, this.#filterType);
  }
}
