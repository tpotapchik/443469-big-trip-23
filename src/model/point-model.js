import {points} from '../mock/points.js';
import {destinations} from '../mock/destinations.js';
import {offers} from '../mock/offers.js';

export default class PointModel {
  #points = [];
  #destinations = [];
  #offers = [];

  constructor() {
    this.#points = [];
    this.#destinations = [];
    this.#offers = [];
  }

  init() {
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  getOffersByType(type) {
    const allOffers = this.offers;
    return allOffers.find((offer) => offer.type === type);
  }

  getOffersById(type, itemId) {
    const offerType = this.getOffersByType(type);
    return offerType.offers.filter((item) => itemId.find((id) => item.id === id));
  }

  getDestinationsById(id) {
    const allDestination = this.destinations;
    return allDestination.find((item) => item.id === id);
  }
}
