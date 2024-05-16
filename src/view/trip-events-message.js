import AbstractView from '../framework/view/abstract-view.js';

const createTripEventsMessageTemplate = (message) => `
  <p class="trip-events__msg">${message}</p>
`;

export default class TripEventsMessage extends AbstractView {
  #message = null;

  constructor(message) {
    super();
    this.#message = message;
  }

  get template() {
    return createTripEventsMessageTemplate(this.#message);
  }
}
