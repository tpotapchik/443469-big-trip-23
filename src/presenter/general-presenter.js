import {EventsMessages, SortingTypes} from '../constants.js';
import {updateItem} from '../utils/common.js';
import {sortPoints} from '../utils/sorting-values.js';
import {generateFilters} from '../utils/filter-date.js';
import {remove, render, RenderPosition} from '../framework/render.js';
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
  #filters = null;
  #pointPresenters = new Map();
  #activeSortType = SortingTypes.DAY;

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
    this.#clearPoints();
    this.#primePoints = sortPoints(this.#pointModel.points, this.#activeSortType);
    this.#renderTripInfo();
    this.#renderFilters();
    this.#renderEventsBody();
  }

  #renderSort() {
    if (this.#sorting !== null) {
      remove(this.#sorting);
    }

    this.#sorting = new Sorting({
      activeSortType: this.#activeSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sorting, this.tripEventsSectionElement, RenderPosition.AFTERBEGIN);
  }

  #renderFilters() {
    const filters = generateFilters(this.#primePoints);
    this.#filters = new Filters(filters);
    render(this.#filters, this.filtersSectionElement);
  }

  #renderTripInfo() {
    this.#tripInfo = new TripInfo();
    render(this.#tripInfo, this.tripInfoElement, RenderPosition.AFTERBEGIN);
  }

  #renderEventsBody() {
    this.#clearPoints();
    if (this.#primePoints.length === 0) {
      this.#renderEmptyMessage();
      return;
    }
    this.#renderSort();

    for (let i = 0; i < this.#primePoints.length; i++) {
      this.#renderPoint(this.#primePoints[i]);
    }
  }

  #renderEmptyMessage() {
    this.#tripEventsMessage = new TripEventsMessage(EventsMessages.EVERYTHING);
    render(this.#tripEventsMessage, this.tripEventsSectionElement, RenderPosition.AFTERBEGIN);
  }

  #handleSortTypeChange = (nextSortType) => {
    if (this.#activeSortType === nextSortType) {
      return;
    }

    this.#activeSortType = nextSortType;
    this.#primePoints = sortPoints(this.#pointModel.points, this.#activeSortType);
    this.#renderEventsBody();
  };

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

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.tripPointsContainerElement.innerHTML = '';
  }
}
