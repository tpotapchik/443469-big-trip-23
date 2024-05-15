import {render, RenderPosition, replace} from '../framework/render.js';
import Sorting from '../view/sorting.js';
import Filters from '../view/filters.js';
import TripInfo from '../view/trip-info.js';
import TripPoint from '../view/trip-point.js';
import EditPoint from '../view/edit-point.js';

export default class GeneralPresenter {
  #pointModel = null;
  #primePoints = [];
  #sorting = null;
  #filters = null;
  #tripInfo = null;

  constructor(pointModel) {
    this.tripInfoElement = document.querySelector('.trip-main');
    this.tripEventsSectionElement = document.querySelector('.trip-events');
    this.filtersSectionElement = document.querySelector('.trip-controls__filters');

    this.tripPointsContainerElement = document.createElement('ul');
    this.tripPointsContainerElement.classList.add('trip-events__list');
    this.tripEventsSectionElement.appendChild(this.tripPointsContainerElement);
    this.#pointModel = pointModel;
  }

  init() {
    this.#primePoints = [...this.#pointModel.points];
    this.#sorting = new Sorting();
    this.#filters = new Filters();
    this.#tripInfo = new TripInfo();

    render(this.#tripInfo, this.tripInfoElement, RenderPosition.AFTERBEGIN);
    render(this.#sorting, this.tripEventsSectionElement, RenderPosition.AFTERBEGIN);
    render(this.#filters, this.filtersSectionElement);

    for (let i = 0; i < this.#primePoints.length; i++) {
      this.#renderPoint(this.#primePoints[i]);
    }
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const hideEditorPoint = () => {
      replaceEditToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    };

    const showEditorPoint = () => {
      replacePointToEdit();
      document.addEventListener('keydown', escKeyDownHandler);
    };

    const tripPoint = new TripPoint({
      point,
      allOffers: [...this.#pointModel.getOffersById(point.type, point.offers)],
      allDestinations: this.#pointModel.getDestinationsById(point.destination),
      onEditClick: () => showEditorPoint(),
    });

    const editPoint = new EditPoint(
      point,
      this.#pointModel.getOffersByType(point.type),
      this.#pointModel.destinations,
      this.#pointModel.getDestinationsById(point.destination),
      () => hideEditorPoint(),
      () => hideEditorPoint(),
    );

    function replacePointToEdit() {
      replace(editPoint, tripPoint);
    }

    function replaceEditToPoint() {
      replace(tripPoint, editPoint);
    }

    render(tripPoint, this.tripPointsContainerElement);
  }
}
