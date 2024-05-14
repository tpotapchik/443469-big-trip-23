import { render, RenderPosition } from '../framework/render.js';
import Sorting from '../view/sorting.js';
import Filters from '../view/filters.js';
import TripInfo from '../view/trip-info.js';
import TripPoint from '../view/trip-point.js';
import EditPoint from '../view/edit-point.js';

export default class GeneralPresenter {
  #pointModel = null;
  #primePoints = null;

  constructor({pointModel}) {
    this.tripInfoElement = document.querySelector('.trip-main');
    this.tripEventsSectionElement = document.querySelector('.trip-events');
    this.filtersSectionElement = document.querySelector('.trip-controls__filters');

    this.tripPointsContainerElement = document.createElement('ul');
    this.tripPointsContainerElement.classList.add('trip-events__list');
    this.tripEventsSectionElement.appendChild(this.tripPointsContainerElement);
    this.#pointModel = pointModel;
  }

  #renderPoint(point) {
    const tripPoint = new TripPoint({
      point,
      allOffers: [...this.#pointModel.getOffersById(point.type, point.offers)],
      allDestinations: this.#pointModel.getDestinationsById(point.destination)
    });
    render(tripPoint, this.tripPointsContainerElement);
  }

  #renderEditPoint(point) {
    const renderEditPoint = new EditPoint({
      point,
      allOffers: this.#pointModel.getOffersByType(point.type),
      allDestinations: this.#pointModel.getDestinations(),
      pointDestination: this.#pointModel.getDestinationsById(point.destination)
    });
    render(renderEditPoint, this.tripPointsContainerElement, RenderPosition.AFTERBEGIN);
  }

  // function replacePointToForm() {
  //   replace(pointEditComponent, pointComponent);
  // }
  //
  // function replaceFormToPoint() {
  //   replace(pointComponent, pointEditComponent);
  // }

  init() {
    this.#primePoints = [...this.#pointModel.getPoints()];

    render(new TripInfo(), this.tripInfoElement, RenderPosition.AFTERBEGIN);
    render(new Sorting(), this.tripEventsSectionElement, RenderPosition.AFTERBEGIN);
    render(new Filters(), this.filtersSectionElement);

    this.#renderEditPoint(this.#primePoints[2]);

    for (let i = 0; i < this.#primePoints.length; i++) {
      this.#renderPoint(this.#primePoints[i]);
    }
  }
}
