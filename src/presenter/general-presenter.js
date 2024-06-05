import {SortingType, UserAction, UpdateType, FilterType, TimeLimit} from '../constants.js';
import {sortPoints} from '../utils/sorting-values.js';
import {filterBy} from '../utils/filter-date.js';
import {remove, render, RenderPosition} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import Sorting from '../view/sorting.js';
import TripInfo from '../view/trip-info.js';
import TripFilterMessage from '../view/empty-message.js';
import ButtonView from '../view/button.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading.js';

export default class GeneralPresenter {
  #pointModel = null;
  #filterModel = null;
  #sorting = null;
  #loadingComponent = null;
  #tripInfo = null;
  #tripFilterMessage = null;
  #newPointPresenter = null;
  #buttonComponent = null;
  #isLoading = true;
  #pointPresenters = new Map();
  #activeSortType = SortingType.DAY;
  #filterType = FilterType.EVERYTHING;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

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
    this.#renderButton();
    this.#renderContent();
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

  #renderLoading() {
    this.#loadingComponent = new LoadingView();
    render(this.#loadingComponent, this.tripEventsSectionElement, RenderPosition.BEFOREEND);
  }

  #createNewPoint = () => {
    this.#activeSortType = SortingType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();

    if (this.#tripFilterMessage) {
      remove(this.#tripFilterMessage);
    }
  };

  #renderTripInfo() {
    this.#tripInfo = new TripInfo();
    render(this.#tripInfo, this.tripInfoElement, RenderPosition.AFTERBEGIN);
  }

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point, this.offers, this.destinations));
  }

  #renderContent() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.points.length === 0) {
      this.#renderEmptyMessage();
    }

    if (this.points.length > 0) {
      this.#renderSort();
      this.#renderTripInfo();
    }

    this.#renderPoints();
  }

  #clearContent({resetSortType = false} = {}) {
    this.#clearPoints();

    if (resetSortType) {
      this.#activeSortType = SortingType.DAY;
    }

    remove(this.#sorting);

    if (this.#tripInfo) {
      remove(this.#tripInfo);
    }

    if (this.#tripFilterMessage) {
      remove(this.#tripFilterMessage);
    }
  }

  #renderButton() {
    this.#buttonComponent = new ButtonView({onClick: this.#handleNewPointButtonClick});
    render(this.#buttonComponent, this.tripInfoElement, RenderPosition.BEFOREEND);
  }

  #renderEmptyMessage() {
    if (this.points.length === 0) {
      this.#tripFilterMessage = new TripFilterMessage({filterType: this.#filterType});
      render(this.#tripFilterMessage, this.tripEventsSectionElement, RenderPosition.BEFOREEND);
    }
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
    this.#newPointPresenter.destroy();
    this.#pointPresenters.clear();
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, updatePoint) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(updatePoint.id).init(updatePoint, this.offers, this.destinations);
        break;
      case UpdateType.MINOR:
        this.#clearContent();
        this.#renderContent();
        break;
      case UpdateType.MAJOR:
        this.#clearContent({resetSortType: true});
        this.#renderContent();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderContent();
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
    this.#renderPoints();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.destroy();
  };

  #handleNewPointFormClose = () => {
    this.#renderEmptyMessage();
    this.#buttonComponent.element.disabled = false;
  };

  #handleNewPointButtonClick = () => {
    this.#createNewPoint();
    this.#buttonComponent.element.disabled = true;
  };
}
