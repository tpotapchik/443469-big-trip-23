import {FilterTypes, EventsMessages} from '../constants.js';
import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (type) => `
  <div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}">
    <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
  </div>
`;

const createFiltersTemplate = () => `
  <form class="trip-filters" action="#" method="get">
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;

export default class Filters extends AbstractView {
  get template() {
    return createFiltersTemplate();
  }
}
