import {render, RenderPosition} from '../render.js';
import Sorting from '../view/sorting.js';
import Filters from '../view/filters.js';
import TripInfo from '../view/trip-info.js';
import TripPoint from '../view/trip-point.js';
import AddPoint from '../view/add-point.js';
import EditPoint from '../view/edit-point.js';

export default class GeneralPresenter {
  constructor() {
    this.tripInfoElement = document.querySelector('.trip-main');
    this.tripEventsSectionElement = document.querySelector('.trip-events');
    this.filtersSectionElement = document.querySelector('.trip-controls__filters');

    this.tripPointsContainerElement = document.createElement('ul');
    this.tripPointsContainerElement.classList.add('trip-events__list');
    this.tripEventsSectionElement.appendChild(this.tripPointsContainerElement);
  }

  renderTripInfo() {
    render(new TripInfo(), this.tripInfoElement, RenderPosition.AFTERBEGIN);
  }

  renderSorting() {
    render(new Sorting(), this.tripEventsSectionElement, RenderPosition.AFTERBEGIN);
  }

  renderFilters() {
    render(new Filters(), this.filtersSectionElement);
  }

  renderTripPoint() {
    for (let i = 0; i < 3; i++) {
      render(new TripPoint(), this.tripPointsContainerElement);
    }
  }

  renderAddPoint() {
    render(new AddPoint(), this.tripPointsContainerElement, RenderPosition.AFTERBEGIN);
  }

  renderEditPoint() {
    render(new EditPoint(), this.tripPointsContainerElement, RenderPosition.AFTERBEGIN);
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
