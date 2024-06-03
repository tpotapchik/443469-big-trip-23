import {Method} from '../constants.js';
import ApiService from '../framework/api-service.js';

export default class PointsApiService extends ApiService {
  async getPoints() {
    const response = await this._load({url: 'points'});
    const parsedResponse = await ApiService.parseResponse(response);
    const adaptedPoints = parsedResponse.map(this.#adaptToClient);

    return adaptedPoints;
  }

  async getOffers() {
    const response = await this._load({url: 'offers'});
    const parsedResponse = await ApiService.parseResponse(response);
    const adaptedOffers = parsedResponse.map(this.#adaptToClient);

    return adaptedOffers;
  }

  async getDestinations() {
    const response = await this._load({url: 'destinations'});
    const parsedResponse = await ApiService.parseResponse(response);
    const adaptedDestinations = parsedResponse.map(this.#adaptToClient);

    return adaptedDestinations;
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
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

  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom.toISOString(),
      'date_to': point.dateTo.toISOString(),
      'is_favorite': point.isFavorite
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
