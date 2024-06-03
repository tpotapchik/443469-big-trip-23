import AbstractView from '../framework/view/abstract-view.js';
import {EmptyMessage} from '../constants.js';

const createLoaderTemplate = () => `<p class="trip-events__msg">${EmptyMessage.LOADING}</p>`;

export default class LoadingView extends AbstractView {
  get template() {
    return createLoaderTemplate();
  }
}
