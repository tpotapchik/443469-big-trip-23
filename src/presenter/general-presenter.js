import {render, RenderPosition} from '../render.js';
import SortingView from '../view/sorting.js';

export default class GeneralPresenter {
  constructor() {
    this.tripEventsSectionElement = document.querySelector('.trip-events');
  }

  renderSorting() {
    render(new SortingView(), this.tripEventsSectionElement);
  }


  init() {
    this.renderSorting();
  }
}


