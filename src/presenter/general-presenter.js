import {EventsMessage, SortingType, UserAction, UpdateType, FilterType} from '../constants.js';
import {sortPoints} from '../utils/sorting-values.js';
import {filterBy} from '../utils/filter-date.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import Sorting from '../view/sorting.js';
import TripInfo from '../view/trip-info.js';
import TripEventsMessage from '../view/trip-events-message.js';
import ButtonView from '../view/button.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';

export default class GeneralPresenter {
  #pointModel = null;
  #filterModel = null;
  #sorting = null;
  #tripInfo = null;
  #tripEventsMessage = null;
  #newPointPresenter = null;
  #buttonComponent = null;
  #pointPresenters = new Map();
  #activeSortType = SortingType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor(pointModel, filterModel) {
    this.tripInfoElement = document.querySelector('.trip-main');
    this.tripEventsSectionElement = document.querySelector('.trip-events');

    this.tripPointsContainerElement = document.createElement('ul');
    this.tripPointsContainerElement.classList.add('trip-events__list');
    this.tripEventsSectionElement.appendChild(this.tripPointsContainerElement);
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointModel: this.#pointModel,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointFormClose
    });

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#clearPoints();
    this.#renderTripInfo();
    this.#renderButton();
    this.#renderEventsBody();
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filterBy[this.#filterType](points);
    return sortPoints(filteredPoints, this.#activeSortType);
  }

  get destinations() {
    return this.#pointModel.destinations;
  }

  get offers() {
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

  #createNewPoint = () => {
    this.#removeEmptyMessage();
    this.#activeSortType = SortingType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  };

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

  #renderButton() {
    this.#buttonComponent = new ButtonView({onClick: this.#handleNewPointButtonClick});
    render(this.#buttonComponent, this.tripInfoElement, RenderPosition.BEFOREEND);
  }

  #renderEmptyMessage() {
    this.#tripEventsMessage = new TripEventsMessage(EventsMessage.EVERYTHING);
    render(this.#tripEventsMessage, this.tripEventsSectionElement, RenderPosition.AFTERBEGIN);
  }

  #removeEmptyMessage = () => {
    if (this.#tripEventsMessage) {
      console.log(this.#tripEventsMessage);
      remove(this.#tripEventsMessage); // todo remove
    }
  };

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

  // #renderWithoutContent = () => {
  //   if (this.points.length === 0) {
  //     render(this.#renderEmptyMessage, this.tripEventsSectionElement, RenderPosition.AFTERBEGIN);
  //   }
  // };

  #clearPoints({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#newPointPresenter.destroy();
    this.#pointPresenters.clear();

    if (resetSortType) {
      this.#activeSortType = SortingType.DAY;
    }
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
        this.#clearPoints({resetSortType: true});
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
    sortPoints(this.#pointModel.points, this.#activeSortType);
    this.#renderEventsBody();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.destroy();
  };

  #handleNewPointFormClose = () => {
    this.#buttonComponent.element.disabled = false;
  };

  #handleNewPointButtonClick = () => {
    this.#createNewPoint();
    this.#buttonComponent.element.disabled = true;
  };
}
