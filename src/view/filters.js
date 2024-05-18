import AbstractView from '../framework/view/abstract-view.js';

//todo checked
const createFilterItemTemplate = (item) => `
  <div class="trip-filters__filter">
    <input id="filter-${item.type.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${item.type.toLowerCase()}" ${item.hasPoints ? '' : 'disabled'} checked >
    <label class="trip-filters__filter-label" for="filter-${item.type.toLowerCase()}">${item.type}</label>
  </div>
`;

const createFiltersTemplate = (filters) => `
  <form class="trip-filters" action="#" method="get">
  ${filters.map((item) => createFilterItemTemplate(item)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;

export default class Filters extends AbstractView {
  #filters = [];

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }
}
