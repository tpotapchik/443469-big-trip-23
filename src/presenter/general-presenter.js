import {render, RenderPosition} from '../render.js';
import SortingView from '../view/sorting.js';
import FiltersView from '../view/filters.js';
import TripInfoView from '../view/trip-info.js';
import TripPointView from '../view/trip-point.js';
import AddPointView from '../view/add-point.js';
import EditPointView from '../view/edit-point.js';

export default class GeneralPresenter {
  constructor() {
    this.tripInfoElement = document.querySelector('.trip-main');
    this.tripEventsSectionElement = document.querySelector('.trip-events');
    this.filtersSectionElement = document.querySelector('.trip-controls__filters');

    this.tripPointsContainer = document.createElement('ul');
    this.tripPointsContainer.classList.add('trip-events__list');
    this.tripEventsSectionElement.appendChild(this.tripPointsContainer);
  }

  renderTripInfo() {
    render(new TripInfoView(), this.tripInfoElement, RenderPosition.AFTERBEGIN);
  }

  renderSorting() {
    render(new SortingView(), this.tripEventsSectionElement, RenderPosition.AFTERBEGIN);
  }

  renderFilters() {
    render(new FiltersView(), this.filtersSectionElement);
  }

  renderTripPoint() {
    for (let i = 0; i < 3; i++) {
      render(new TripPointView(), this.tripPointsContainer);
    }
  }

  renderAddPoint() {
    render(new AddPointView(), this.tripPointsContainer, RenderPosition.AFTERBEGIN);
  }

  renderEditPoint() {
    render(new EditPointView(), this.tripPointsContainer, RenderPosition.AFTERBEGIN);
  }

  init() {
    this.renderTripInfo();
    this.renderSorting();
    this.renderFilters();
    this.renderTripPoint();
    this.renderAddPoint();
    this.renderEditPoint();
  }
}
