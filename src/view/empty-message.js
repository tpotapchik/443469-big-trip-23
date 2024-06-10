import {FilterMessage} from '../constants.js';
import AbstractView from '../framework/view/abstract-view.js';

const createTripMessageTemplate = (message, filterType) => {
  const filterMessage = FilterMessage[filterType];

  return `<p class="trip-events__msg">${message || filterMessage}</p>`;
};

export default class EmptyMessage extends AbstractView {
  #message = null;
  #filterType = null;

  constructor({message, filterType}) {
    super();
    this.#message = message;
    this.#filterType = filterType;
  }

  get template() {
    return createTripMessageTemplate(this.#message, this.#filterType);
  }
}
