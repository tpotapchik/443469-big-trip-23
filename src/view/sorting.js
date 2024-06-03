import {SortingType} from '../constants.js';
import AbstractView from '../framework/view/abstract-view.js';

const TYPE_PREFIX = 'sort-';
const DISABLED_SORT_TYPES = [SortingType.OFFERS, SortingType.EVENT];

const createSortingItemTemplate = (type, currentSortType) => `
  <div class="trip-sort__item trip-sort__item--${type}">
    <input id="sort-${type}" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-${type}"
           ${type === currentSortType ? 'checked' : ''}
           ${DISABLED_SORT_TYPES.includes(type) ? 'disabled' : ''}
     >
    <label class="trip-sort__btn" for="sort-${type}">${type}</label>
  </div>
`;

const createSortingTemplate = (currentSortType) => `
  <form class="trip-events__trip-sort trip-sort" action="#" method="get">
    ${Object.values(SortingType).map((type) => createSortingItemTemplate(type, currentSortType)).join('')}
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
    const selectedSortType = evt.target.id.replace(TYPE_PREFIX, '');
    this.#handleSortTypeChange(selectedSortType);
  };
}
