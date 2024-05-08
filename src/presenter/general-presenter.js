import {render, RenderPosition} from '../render.js';
import SortingView from '../view/sorting.js';
import FiltersView from '../view/filters.js';

export default class GeneralPresenter {
  constructor() {
    this.tripEventsSectionElement = document.querySelector('.trip-events');
    this.filtersSectionElement = document.querySelector('.trip-controls__filters');
  }

  renderSorting() {
    render(new SortingView(), this.tripEventsSectionElement);
  }

  renderFilters() {
    render(new FiltersView(), this.filtersSectionElement);
  }

  init() {
    this.renderSorting();
    this.renderFilters();
  }
}


