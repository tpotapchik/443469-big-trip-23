import {EventsMessage, SortingType, UserAction, UpdateType} from '../constants.js';
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
  #activeSortType = SortingType.DAY;

  constructor(pointModel) {
    this.tripInfoElement = document.querySelector('.trip-main');
    this.tripEventsSectionElement = document.querySelector('.trip-events');
    this.filtersSectionElement = document.querySelector('.trip-controls__filters');

    this.tripPointsContainerElement = document.createElement('ul');
    this.tripPointsContainerElement.classList.add('trip-events__list');
    this.tripEventsSectionElement.appendChild(this.tripPointsContainerElement);
    this.#pointModel = pointModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#clearPoints();
    this.#renderTripInfo();
    this.#renderFilters();
    this.#renderEventsBody();
  }

  get points () {
    return sortPoints(this.#pointModel.points, this.#activeSortType);
  }

  get destinations () {
    return this.#pointModel.destinations;
  }

  get offers () {
    return this.#pointModel.offers;
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
    const filters = generateFilters(this.points);
    this.#filters = new Filters(filters);
    render(this.#filters, this.filtersSectionElement);
  }

  #renderTripInfo() {
    this.#tripInfo = new TripInfo();
    render(this.#tripInfo, this.tripInfoElement, RenderPosition.AFTERBEGIN);
  }

  #renderEventsBody() {
    if (this.points.length === 0) {
      this.#renderEmptyMessage();
      return;
    }
    this.#renderSort();
    this.points.forEach((point) => this.#renderPoint(point, this.offers, this.destinations));
  }

  #renderEmptyMessage() {
    this.#tripEventsMessage = new TripEventsMessage(EventsMessage.EVERYTHING);
    render(this.#tripEventsMessage, this.tripEventsSectionElement, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(
      this.#pointModel,
      this.tripPointsContainerElement,
      this.#handleViewAction,
      this.#handleModeChange
    );
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, updatePoint) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(updatePoint.id).init(updatePoint, this.offers, this.destinations);
        break;
      case UpdateType.MINOR:
        this.#clearPoints();
        this.#renderEventsBody();
        break;
      case UpdateType.MAJOR:
        // this.#clearContent({resetSortType: true}); //todo
        this.#clearPoints();
        this.#renderEventsBody();
        break;
    }
  };

  #handleSortTypeChange = (nextSortType) => {
    if (this.#activeSortType === nextSortType) {
      return;
    }
    this.#activeSortType = nextSortType;
    this.#clearPoints();
    this.#primePoints = sortPoints(this.#pointModel.points, this.#activeSortType); //todo need?
    this.#renderEventsBody();
  };

  // #handlePointChange = (updatedPoint) => { // remove
  //   this.#primePoints = updateItem(this.#primePoints, updatedPoint);
  //   this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  // };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
