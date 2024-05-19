import {SortingTypes} from '../constants.js';
import AbstractView from '../framework/view/abstract-view.js';

const createSortingItemTemplate = (type, currentSortType) => `
  <div class="trip-sort__item trip-sort__item--${type}">
    <input id="sort-${type}" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" data-sort-type="${type}" value="sort-${type}" ${type === currentSortType ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-${type}">${type}</label>
  </div>
`;

const createSortingTemplate = (currentSortType) => `
  <form class="trip-events__trip-sort trip-sort" action="#" method="get">
    ${Object.values(SortingTypes).map((type) => createSortingItemTemplate(type, currentSortType)).join('').toLowerCase()}
  </form>
`;

export default class Sorting extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({activeSortType, onSortTypeChange}) {
    super();
    this.#currentSortType = activeSortType;
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortingTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
