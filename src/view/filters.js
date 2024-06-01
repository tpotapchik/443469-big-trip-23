import {capitalizeLetter} from '../utils/common.js';
import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (item, currentFilterType) => `
  <div class="trip-filters__filter">
    <input id="filter-${item.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${item.type}" ${item.count === 0 ? 'disabled' : ''} ${item.type === currentFilterType ? 'checked' : ''} >
    <label class="trip-filters__filter-label" for="filter-${item.type}">${capitalizeLetter(item.type)}</label>
  </div>
`;

const createFiltersTemplate = (filters, currentFilterType) => `
  <form class="trip-filters" action="#" method="get">
  ${filters.map((item) => createFilterItemTemplate(item, currentFilterType)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;

export default class Filters extends AbstractView {
  #filters = [];
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor(filters, currentFilterType, onFilterTypeChange) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
