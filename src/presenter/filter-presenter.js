import {render, replace, remove} from '../framework/render.js';
import {filterBy} from '../utils/filter-date.js';
import {FilterType, UpdateType} from '../constants.js';

import Filters from '../view/filters.js';

const filterContainer = document.querySelector('.trip-controls__filters');

export default class FilterPresenter {
  #pointModel = null;
  #filterModel = null;

  #filterComponent = null;

  constructor(pointModel, filterModel) {
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointModel.points;

    return Object.values(FilterType).map((type) => ({type, count: filterBy[type](points).length}));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;
    const currentFilterType = this.#filterModel.filter;
    const onFilterTypeChange = this.#handleFilterTypeChange;

    this.#filterComponent = new Filters(filters, currentFilterType, onFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
