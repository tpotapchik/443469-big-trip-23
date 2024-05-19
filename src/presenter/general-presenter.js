import {EventsMessages} from '../constants.js';
import {updateItem} from '../utils/common.js';
import {render, RenderPosition} from '../framework/render.js';
import {generateFilters} from '../utils/filter-date.js';
import Sorting from '../view/sorting.js';
import Filters from '../view/filters.js';
import TripInfo from '../view/trip-info.js';
import TripEventsMessage from '../view/trip-events-message.js';
import PointPresenter from './point-presenter.js';

export default class GeneralPresenter {
  #pointModel = null;
  #primePoints = [];
  #sorting = null;
  #tripInfo = null;
  #tripEventsMessage = null;
  #pointPresenters = new Map();

  constructor(pointModel) {
    this.tripInfoElement = document.querySelector('.trip-main');
    this.tripEventsSectionElement = document.querySelector('.trip-events');
    this.filtersSectionElement = document.querySelector('.trip-controls__filters');

    this.tripPointsContainerElement = document.createElement('ul');
    this.tripPointsContainerElement.classList.add('trip-events__list');
    this.tripEventsSectionElement.appendChild(this.tripPointsContainerElement);
    this.#pointModel = pointModel;
  }

  init() {
    this.#primePoints = [...this.#pointModel.points];
    this.#sorting = new Sorting();
    this.#tripInfo = new TripInfo();
    this.#tripEventsMessage = new TripEventsMessage(EventsMessages.EVERYTHING);
    render(this.#tripInfo, this.tripInfoElement, RenderPosition.AFTERBEGIN);
    this.#renderFilters();
    this.#renderEventsBody();
  }

  #renderFilters() {
    const filters = generateFilters(this.#primePoints);
    render(new Filters(filters), this.filtersSectionElement);
  }

  #renderEventsBody() {
    if (this.#primePoints.length === 0) {
      render(this.#tripEventsMessage, this.tripEventsSectionElement, RenderPosition.AFTERBEGIN);
      return;
    }

    render(this.#sorting, this.tripEventsSectionElement, RenderPosition.AFTERBEGIN);

    for (let i = 0; i < this.#primePoints.length; i++) {
      this.#renderPoint(this.#primePoints[i]);
    }
  }

  #handlePointChange = (updatedPoint) => {
    this.#primePoints = updateItem(this.#primePoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(
      this.#pointModel,
      this.tripPointsContainerElement,
      this.#handlePointChange,
      this.#handleModeChange
    );
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }
}
