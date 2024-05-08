import {render, RenderPosition} from '../render.js';
import SortingView from '../view/sorting.js';
import FiltersView from '../view/filters.js';
import TripInfoView from '../view/trip-info.js';

export default class GeneralPresenter {
  constructor() {
    this.tripInfoElement = document.querySelector('.trip-main');
    this.tripEventsSectionElement = document.querySelector('.trip-events');
    this.filtersSectionElement = document.querySelector('.trip-controls__filters');
  }

  renderTripInfo() {
    render(new TripInfoView(), this.tripInfoElement, RenderPosition.AFTERBEGIN);
  }

  renderSorting() {
    render(new SortingView(), this.tripEventsSectionElement);
  }

  renderFilters() {
    render(new FiltersView(), this.filtersSectionElement);
  }

  init() {
    this.renderTripInfo();
    this.renderSorting();
    this.renderFilters();
  }
}


