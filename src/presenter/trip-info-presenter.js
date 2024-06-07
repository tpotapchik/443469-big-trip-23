import {remove, render, RenderPosition} from '../framework/render.js';
import TripInfo from '../view/trip-info.js';

export default class TripInfoPresenter {
  #tripInfo = null;
  #pointModel = null;

  constructor(pointModel) {
    this.tripInfoElement = document.querySelector('.trip-main');
    this.#pointModel = pointModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
  }

  init() {
    if (this.#tripInfo !== null) {
      remove(this.#tripInfo);
    }

    this.#tripInfo = new TripInfo({
      points: this.#pointModel.points,
      offers: this.#pointModel.offers,
      destinations: this.#pointModel.destinations
    });

    if (this.#pointModel.points.length === 0) {
      remove(this.#tripInfo);
      return;
    }

    render(this.#tripInfo, this.tripInfoElement, RenderPosition.AFTERBEGIN);
  }

  #handleModelEvent = () => {
    this.init();
  };
}
