import Observable from '../framework/observable.js';
import {UpdateType} from '../constants.js';

export default class PointModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #destinations = [];
  #offers = [];
  #isLoading = true;
  #isLoadingFailed = false;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
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

  get loading() {
    return this.#isLoading;
  }

  get error() {
    return this.#isLoadingFailed;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
      this.#destinations = await this.#pointsApiService.destinations;
      this.#offers = await this.#pointsApiService.offers;
      this.#isLoading = false;
    } catch {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
      this.#isLoading = false;
      this.#isLoadingFailed = true;
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, point) {
    const index = this.#points.findIndex((task) => task.id === point.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(point);
      const updatedTask = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedTask,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedTask);
    } catch (err) {
      throw new Error('Can\'t update task');
    }
  }

  async addPoint(updateType, point) {
    try {
      const response = await this.#pointsApiService.addPoint(point);
      const addEvent = this.#adaptToClient(response);
      this.#points = [
        addEvent,
        ...this.#points,
      ];
      this._notify(updateType, point);
    } catch (err) {
      throw new Error('Can\'t add unexisting event');
    }
  }

  async deletePoint(updateType, point) {
    await this.#pointsApiService.deletePoint(point);
    this.#points = this.#points.filter((item) => item.id !== point.id);
    this._notify(updateType, point);
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
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
