import {points} from '../mock/points.js';
import {destinations} from '../mock/destinations.js';
import {offers} from '../mock/offers.js';
import Observable from '../framework/observable.js';

export default class PointModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];

  constructor() {
    super();
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

  updatePoint(updateType, updatePoint) {
    const index = this.#points.findIndex((point) => point.id === updatePoint.id);

    if (index === -1) {
      throw new Error('Can\'t update non-existent point');
    }

    this.#points = [...this.#points.slice(0, index), updatePoint, ...this.#points.slice(index + 1)];
    this._notify(updateType, updatePoint);
  }

  addPoint(updateType, updatePoint) {
    this.#points = [updatePoint, ...this.#points];
    this._notify(updateType, updatePoint);
  }

  deletePoint(updateType, updatePoint) {
    const index = this.#points.findIndex((point) => point.id === updatePoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete non-existent point');
    }

    this.#points = [...this.#points.slice(0, index), ...this.#points.slice(index + 1)];
    this._notify(updateType, updatePoint);
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
