import Observable from '../framework/observable.js';
import {UpdateType} from '../constants.js';

export default class PointModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #destinations = [];
  #offers = [];

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  async init() {
    try {
      this.#points = await this.#pointsApiService.getPoints();
      this.#offers = await this.#pointsApiService.getOffers();
      this.#destinations = await this.#pointsApiService.getDestinations();
    } catch {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
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
    return allOffers.find((offer) => offer.type === type) || {offers: []};
  }

  getOffersById(type, itemId) {
    const offerType = this.getOffersByType(type);
    if (!offerType.offers) {
      return [];
    }
    return offerType.offers.filter((item) => itemId.find((id) => item.id === id));
  }

  getDestinationsById(id) {
    const allDestination = this.destinations;
    return allDestination.find((item) => item.id === id);
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
