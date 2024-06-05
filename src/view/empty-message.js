import {FilterMessage} from '../constants.js';
import AbstractView from '../framework/view/abstract-view.js';

const createTripFilterMessageTemplate = (filterType) => {
  const filterMessage = FilterMessage[filterType];

  return `<p class="trip-events__msg">${filterMessage}</p>`;
};

export default class TripFilterMessage extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createTripFilterMessageTemplate(this.#filterType);
  }
}
